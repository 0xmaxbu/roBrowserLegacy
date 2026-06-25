/**
 * BotAutoHunt.js — roBrowserLegacy 内挂插件（在线挂机）
 *
 * 功能：
 *   - 在线自动挂机：战斗循环(100ms) + 药水循环(200ms) + buff循环(1000ms)
 *   - 三种技能触发：攻击型 / 治疗型 / Buff型（开发时预分类，D-03c）
 *   - 面板：HP/SP 阈值滑块、6 技能格 + 6 辅助格、跟随/飞翅、积分显示
 *   - 离线挂机：发送 command 2，服务器踢下线后由 NPC 处理结算
 *   - Per-character 设置：localStorage key = 'bot_settings_' + hash(GID)
 *
 * 通信协议（与 Phase 11-01 契约层一致，PACKETVER 20191223）：
 *   CZ_BOT_COMMAND (0x0b6f): [int16 type][int16 len][int16 cmd] = 6 字节固定
 *   ZC_BOT_STATUS  (0x0b70): [int16 type][int16 cmd][uint8 status][int32 data1] = 9 字节固定
 *     - 固定封包无 packetLength 字段（R2-02），rAthena 固定封包惯例
 *
 * 插件注册：Config.local.js 中 window.ROConfigLocal.plugins = { BotAutoHunt: 'BotAutoHunt/BotAutoHunt' }
 *   PluginManager 自动追加 .js 后缀，从 src/Plugins/ 目录动态 import()
 *
 * 文件位置：client/src/src/Plugins/BotAutoHunt/BotAutoHunt.js
 */

// 所有 import 必须带 .js 后缀（roBrowserLegacy Vite alias 强制要求）
import Network from 'Network/NetworkManager.js';
import PACKET from 'Network/PacketStructure.js';
import PacketLength from 'Network/PacketLength.js';
import Session from 'Engine/SessionStorage.js';
import BinaryWriter from 'Utils/BinaryWriter.js';
import Inventory from 'UI/Components/Inventory/Inventory.js';
import SkillTargetSelection from 'UI/Components/SkillTargetSelection/SkillTargetSelection.js';
import StatusIcons from 'UI/Components/StatusIcons/StatusIcons.js';
// Task 2 补充导入 — 三循环 + 面板下拉数据源
import EntityManager from 'Renderer/EntityManager.js'; // forEach/get/getClosestEntity/getFocusEntity/setFocusEntity
import Entity from 'Renderer/Entity/Entity.js'; // TYPE_MOB / ACTION.DIE 常量
import DB from 'DB/DBManager.js'; // getItemInfo() 解析物品名 / INTERFACE_PATH 图标路径
import Client from 'Core/Client.js'; // loadFile() 加载 GRF 中的 BMP 图标
import ItemType from 'DB/Items/ItemType.js'; // HEALING/USABLE/CASH 消耗品过滤
import EFST_MAP from './data/efst-map.json'; // 由 tools/client/generate-efst-map.mjs 生成
import MAP_CONNECTIONS from './data/map-connections.json'; // 由 tools/client/generate-map-connections.mjs 生成
import MapRenderer from 'Renderer/MapRenderer.js'; // currentMap — 当前地图名（Bug 2 fix: 替代不存在的 Session.Entity.mapname）
import Altitude from 'Renderer/Map/Altitude.js'; // getCellType + TYPE.WALKABLE — 巡逻可行走验证
import PathFinding from 'Utils/PathFinding.js'; // search() — 巡逻路径验证

// =====================================================================
// EFST 映射辅助函数（替代硬编码 BUFF_EFST_MAP / POTION_RESTORE_TYPE）
// =====================================================================

function _getEfstEntry(kind, id) {
	return EFST_MAP[kind]?.[id] || null;
}

function _isBuff(kind, id) {
	const entry = _getEfstEntry(kind, id);
	return entry && entry.type === 'buff' && Array.isArray(entry.efst) && entry.efst.length > 0;
}

function _getPrimaryEfst(kind, id) {
	const entry = _getEfstEntry(kind, id);
	return entry?.efst?.[0] ?? null;
}

function _getPotionRestoreType(id) {
	const entry = _getEfstEntry('items', id);
	if (entry && ['hp', 'sp', 'both'].includes(entry.type)) {
		return entry.type;
	}
	return null;
}

import SkillInfo from 'DB/Skills/SkillInfo.js'; // 技能名解析 (SkillName 字段)
import SkillListUI from 'UI/Components/SkillList/SkillList.js'; // getUI().getList() 技能下拉数据源 (R4-问题6)

// =====================================================================
// 封包定义
// =====================================================================

/**
 * CZ_BOT_COMMAND (0x0b6f) — 客户端→服务器
 * 格式: [int16 packetType][int16 packetLength][int16 command] = 6 字节
 * command: 0=start, 1=stop, 2=offline, 3=get_status, 4=get_points
 * 对应服务端 clif_parse_BotCommand (Phase 11-01)
 */
const CZ_BOT_COMMAND = function () {
	this.cmd = 0;
};
CZ_BOT_COMMAND.prototype.build = function () {
	const buf = new BinaryWriter(6);
	buf.writeShort(0x0b6f); // packet ID
	buf.writeShort(6); // packet length（无 payload = 6）
	buf.writeShort(this.cmd); // command enum (0-4)
	return buf;
};

/**
 * ZC_BOT_STATUS (0x0b70) — 服务器→客户端
 * 固定 9 字节（R2-02 fix: 无 packetLength 字段）
 * roBrowserLegacy receive() 对固定封包只消费 packetID(2B)，fp 从 offset+2 开始读
 * 构造函数读 2+1+4=7 字节 payload: command(2) + status(1) + data1(4)
 * Source: BinaryReader.readLong() = getInt32()，读 4 字节
 *
 * @param {BinaryReader} fp - 从 offset+2 开始的 payload reader
 * @param {number} end - 封包结束偏移量
 */
const ZC_BOT_STATUS = function (fp, end) {
	this.command = fp.readShort(); // 回显的命令编号 (0-4)
	this.status = fp.readUChar(); // 0=成功, 1=拒绝, 2=积分不足(cmd2), 3=地图不支持(cmd2), 4=pending(cmd2)
	this.data1 = fp.readLong(); // cmd=4 时为当前积分；其他通常为 0
};
ZC_BOT_STATUS.size = 9; // 总封包大小（含 packetID），框架据此识别固定封包

/**
 * R2-B fix: 注册自定义封包长度到 PacketLength 系统
 * 0x0b70/0x0b6f 不在 packets2019_len_main.js 中，必须 monkey-patch
 * 否则 NetworkManager.receive() 会 fallback 到 fp.length-offset（吞掉后续封包）
 * Source: NetworkManager.js:267-268 packet_len = packet_len ? packet_len : fp.length - offset
 */
const _origGetPacketLength = PacketLength.getPacketLength;
PacketLength.getPacketLength = function (id) {
	if (id === 0x0b70) return 9; // ZC_BOT_STATUS
	if (id === 0x0b6f) return 6; // CZ_BOT_COMMAND
	return _origGetPacketLength.call(this, id);
};

// 注册 ZC 封包并挂接回调（服务器发送的封包需要 register + hook）
Network.registerPacket(0x0b70, ZC_BOT_STATUS);
Network.hookPacket(ZC_BOT_STATUS, function (pkt) {
	if (window.botAutoHunt) {
		window.botAutoHunt._onStatus(pkt);
	}
});

// =====================================================================
// 常量定义
// =====================================================================

/** 飞翅道具 ID — Source: rAthena db/pre-re/item_db.yml */
const ITEM_FLY_WING = 601; // 苍蝇翅膀 — 随机传送
const ITEM_BUTTERFLY_WING = 602; // 蝴蝶翅膀 — 回存储点

/** #12 fix: 城镇地图列表 — 城镇内禁止自动挂机 */
const TOWN_MAPS = new Set([
	'prontera', 'geffen', 'morocc', 'alberta', 'aldebaran', 'payon',
	'izlude', 'lutie', 'comodo', 'umbala', 'amatsu', 'gonryun',
	'ayothaya', 'einbroch', 'einbech', 'lighthalzen', 'hugel',
	'rachel', 'veins', 'brasilis', 'dewata', 'malangdo', 'malaya',
	'moscovia', 'paramk', 'splendide', 'manuk', 'prontera_guild'
]);

/** 技能触发类型（开发时预分类，D-03c） */
const SKILL_TYPE_ATTACK = 'attack'; // 有目标+冷却→释放
const SKILL_TYPE_HEAL = 'heal'; // HP<阈值→释放（双模式：不死系→攻击）
const SKILL_TYPE_BUFF = 'buff'; // buff 消失→释放

/** 辅助列表触发类型 */
const AUX_TYPE_POTION = 'potion'; // HP/SP<阈值→使用
const AUX_TYPE_BUFF_ITEM = 'buff_item'; // buff 消失→使用

/**
 * 治疗技能集合 — 由构建脚本从 rAthena pc.cpp pc_skillheal_bonus() 自动提取。
 * 判定优先级: HEAL_SKILL_IDS → EFST_MAP buff → ATTACK
 * 来源: tools/client/generate-efst-map.mjs → data/efst-map.json.healSkills
 */
const HEAL_SKILL_IDS = new Set(EFST_MAP.healSkills || []);
// =====================================================================
// BotAutoHunt 主类
// =====================================================================

class BotAutoHunt {
	constructor() {
		// ---------- 挂机状态 ----------
		this.active = false;
		this.panelVisible = false;
		this.currentPoints = 0;
		this.timerSec = 0;

		// ---------- 阈值 ----------
		this.hpThreshold = 70; // HP 百分比，低于此值触发药水/治疗
		this.spThreshold = 30; // SP 百分比

		// ---------- 两列表（D2 #8 修订: 6 技能格 + 6 辅助格） ----------
		// skillList: [{id, type, level}, ...]  type: 'attack'|'heal'|'buff'
		// auxList:   [{id, type}, ...]          type: 'potion'|'buff_item'
		this.skillList = [];
		this.auxList = [];

		// ---------- 跟随队友（D2 #11） ----------
		this.followEnabled = false;
		this.followTarget = ''; // 队友 GID（字符串）

		// ---------- 飞翅（D2 #12） ----------
		this.flyNoMobs = false; // 四周无怪→苍蝇翅膀
		this.flyLowHp = false; // HP<10%→苍蝇翅膀

		// ---------- #13 fix: 独立自动药水 ----------
		this.autoPotion = false; // 独立开关，不依赖 active(挂机)
		this._autoPotionTick = null; // 独立药水循环定时器

		// ---------- 防重复启停 ----------
		this._lastCmdTime = 0;
		this._cmdCooldownMs = 2000; // 2 秒冷却（拦截连点器/手抖）
		this._pendingCmd = null; // 正在等待回包的指令编号
		this._pendingCmdTime = 0; // pending 锁设置时间（HI-02 fix: 超时恢复）
		this._pendingCmdTimeoutMs = 10000; // 10 秒超时（防丢包永久锁死）

		// ---------- 巡逻状态 (#3 fix) — 使用 Date.now() 而非 Renderer.tick（后台 tab 时 rAF 冻结） ----------
		this._lastMobSeenTick = 0; // 最后一次看到怪物的时间 (Date.now())
		this._lastPatrolMoveTick = 0; // 最后一次巡逻移动的时间 (Date.now())
		this._needMoveAwayFromPortal = false; // 过图后需远离传送门
		this._portalStableTick = 0; // 过图返回后位置稳定计时

		// ---------- 过图状态追踪 ----------
		// 过图后 EntityManager 清空、Altitude 重载、PathFinding 暂时不可用
		// 需要重置内部状态 + 给予宽限期等怪物刷新
		this._lastMapName = ''; // 上次检测到的地图名
		this._mapChangeTick = 0; // 最近一次过图的时间戳（Date.now()），0=无过图
		this._huntMapName = ''; // 挂机地图名（startAutoHunt 时记录）
		this._returnTriedPortals = new Set(); // 已尝试过的传送门 GID（返回挂机图时用）
		this._returnTargetPortal = null; // 当前正在前往的传送门 entity

		// ---------- 三循环定时器（D-57） ----------
		this.combatTick = null; // ~100ms 战斗循环
		this.potionTick = null; // ~200ms 药水循环
		this.buffTick = null; // ~1000ms buff 循环
		this._timerTick = null; // ~1000ms 计时器/积分

		// ---------- Buff 状态追踪 ----------
		// 通过 StatusIcons.update 钩子维护（见 _installBuffTracker）
		// key=EFST index, value=true（仅追踪本地玩家自己的 buff）
		this._buffMap = {};

		// ---------- 面板 DOM ----------
		this._panel = null; // 面板根 DOM 元素
		this._dropdown = null; // 当前 dropdown DOM 元素
		this._dropdownClickHandler = null; // dropdown 外部点击关闭处理器（引用以便清理）

		// ---------- 动作冷却系统（防止条件未满足时不停刷技能/消耗品） ----------
		// key 格式: 'item_<id>' | 'skill_<id>' | 'buff_<efst>'
		// value: 冷却到期时间戳 (Date.now() + cooldownMs)
		this._actionCooldowns = {};

		// ---------- Buff 施法保护（Bug 3 fix: 防止巡逻移动打断长施法） ----------
		// 值: Date.now() + 预估施法时间；战斗循环在此时间前不发送移动指令
		this._castingUntil = 0;

		// ---------- 加载设置（此时 GID 可能为 0，进游戏后按需重载） ----------
		this._loadSettings();

		// ---------- 安装 buff 追踪 ----------
		this._installBuffTracker();

		// ---------- 协议级 buff 钩子（D-64 契约定义） ----------
		// PACKETVER=20191223 实际收到的状态变更封包为 0x983 (MSG_STATE_CHANGE4)，
		// 字段 { index, AID, state, TotalMS, RemainMS, val[] }（R2-G: 字段名 AID 非 GID）。
		// 此处 hook 基础 MSG_STATE_CHANGE (0x196) 仅对齐 D-64 契约定义 —— 2019 版本下
		// 0x196 不会到达，故此钩子运行期不触发，亦不与游戏 0x983 handler 冲突。
		// buff 追踪的实际生效路径为 _installBuffTracker() 的 StatusIcons.update 钩子。
		Network.hookPacket(PACKET.ZC.MSG_STATE_CHANGE, (pkt) => {
			if (Session.Entity && pkt.AID === Session.Entity.GID) {
				if (pkt.state === 1) {
					this._buffMap[pkt.index] = true;
				} else {
					delete this._buffMap[pkt.index];
				}
			}
		});

		// ---------- 后台 tab 恢复 ----------
		// Renderer.tick 由 rAF 驱动，后台 tab 时冻结。setInterval 虽被限流但仍在运行。
		// 当 tab 重新可见时，用 Date.now() 重置巡逻计时器避免误触飞翅。
		document.addEventListener('visibilitychange', () => {
			if (!document.hidden && this.active) {
				this._lastMobSeenTick = Date.now();
			}
		});

		// ---------- 暴露桥接 ----------
		// BasicInfoV4 按钮通过 window.botAutoHunt.toggle() 调用
		window.botAutoHunt = this;
	}

	// =================================================================
	// Buff 状态追踪（D-64）
	// =================================================================

	/**
	 * 安装 buff 状态追踪器。
	 *
	 * 设计说明（Rule 1 修正，详见 SUMMARY 偏差记录）：
	 *   原计划 R4-问题2-B 方案是 Network.hookPacket(MSG_STATE_CHANGE) 协议级钩子。
	 *   但 hookPacket 采用覆盖语义（Packets.list[id].callback = cb），且本插件在
	 *   Online.js 启动阶段加载（早于 MapEngine/Entity.js 挂接 onEntityStatusChange），
	 *   因此协议级钩子会被游戏自身 handler 覆盖而失效，且若晚挂接反而会破坏游戏
	 *   buff 图标显示。
	 *
	 *   稳定方案：monkey-patch StatusIcons.update。游戏的 onEntityStatusChange 对全部
	 *   5 个 MSG_STATE_CHANGE 变体（含 PACKETVER=20191223 的 0x983 MSG_STATE_CHANGE4）
	 *   统一调用 StatusIcons.update(index, state, life)。StatusIcons 只显示本地玩家
	 *   buff，因此天然限定为自身 buff，无需 AID 过滤，且不破坏游戏（调用原函数）。
	 */
	_installBuffTracker() {
		if (StatusIcons._botPatched) return; // 避免重复 patch
		StatusIcons._botPatched = true;
		const origUpdate = StatusIcons.update;
		StatusIcons.update = function botStatusHook(index, state, life) {
			try {
				const bot = window.botAutoHunt;
				if (bot) {
					if (state === 1) {
						bot._buffMap[index] = true;
						// buff 已注册 → 清除待注册冷却（允许下次过期后立即重铸）
						delete bot._actionCooldowns['buff_' + index];
					} else {
						delete bot._buffMap[index];
					}
				}
			} catch (_) {
				// 追踪失败不应影响游戏 buff 显示
			}
			return origUpdate.call(this, index, state, life);
		};
	}

	// =================================================================
	// 面板显示/隐藏（Task 2 完整实现）
	// =================================================================

	/**
	 * 切换面板显示。由 BasicInfoV4 的 'bot' 按钮 case 调用。
	 */
	toggle() {
		this.panelVisible = !this.panelVisible;
		// 进游戏后 GID 才已知，打开面板时重载一次设置确保 per-character 正确
		this._loadSettings();
		if (this.panelVisible) {
			this._showPanel();
		} else {
			this._hidePanel();
		}
	}

	_showPanel() {
		if (this._panel) {
			// 已存在 → 直接显示并刷新当前状态
			this._panel.style.display = 'block';
			this._refreshPanel();
			this.sendCommand(4); // 立即请求积分更新
			return;
		}

		// 构建根 overlay（D-57 用户审核: 复用 RO 原生配色/边框样式，不引入新主题）
		// R4-问题3-A: 面板用 inline DOM 构建，无独立 .html/.css 文件
		const panel = document.createElement('div');
		panel.id = 'bot-autohunt-panel';
		Object.assign(panel.style, {
			position: 'fixed',
			top: '100px',
			left: '300px',
			zIndex: '200',
			background: 'white',
			border: '1px solid #c1c6c2', // RO 原生边框色 (SkillList.css/NpcMenu.css)
			borderRadius: '5px',
			padding: '0',
			fontFamily: 'Gulim, Dotum, "Malgun Gothic", sans-serif',
			fontSize: '11px',
			color: '#484848',
			boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
			userSelect: 'none',
			minWidth: '260px'
		});

		panel.innerHTML = this._buildPanelHTML();
		document.body.appendChild(panel);
		this._panel = panel;

		// #1 fix: Block mouse events from bubbling to document/window where
		// the game's MouseEventHandler lives. Must use BUBBLE phase (false) so
		// child elements (buttons, cells) still receive events normally.
		const _stop = e => { e.stopPropagation(); };
		panel.addEventListener('mousedown', _stop, false);
		panel.addEventListener('mouseup', _stop, false);
		panel.addEventListener('click', _stop, false);
		panel.addEventListener('mousemove', _stop, false);
		panel.addEventListener('wheel', _stop, false);
		panel.addEventListener('contextmenu', _stop, false);
		panel.addEventListener('dblclick', _stop, false);

		this._bindPanelEvents();
		this._makeDraggable(panel, panel.querySelector('.bot-titlebar'));
		this._refreshPanel();
		this.sendCommand(4); // 面板首次打开时立即请求积分

		// #13 fix: 如果 autoPotion 已启用，启动独立药水循环
		if (this.autoPotion) this._startAutoPotion();
	}

	_hidePanel() {
		if (this._panel) {
			this._panel.style.display = 'none';
		}
		this._closeDropdown();
	}

	/**
	 * 关闭 dropdown 并清理所有关联资源（DOM + document 监听器）
	 * 修复: 旧版 closeHandler 闭包泄漏到 document 上，累积后导致格子点击失效
	 */
	_closeDropdown() {
		if (this._dropdownClickHandler) {
			document.removeEventListener('mousedown', this._dropdownClickHandler, true);
			this._dropdownClickHandler = null;
		}
		if (this._dropdown) {
			this._dropdown.remove();
			this._dropdown = null;
		}
	}

	_updateButtonLabel() {
		if (!this._panel) return;
		const btn = this._panel.querySelector('.bot-toggle-btn');
		if (btn) btn.textContent = this.active ? '停止挂机' : '开始挂机';
	}

	/**
	 * 构建面板内部 HTML（参照 bot-panel-prototype.html 像素级原型）
	 * 复用 Common.css 的 .ui-btn 按钮样式（D1 决策），其他元素用 inline style
	 */
	_buildPanelHTML() {
		return (
			'<div class="bot-titlebar" style="height:17px;background:#fff;border-bottom:1px solid #c1c6c2;' +
			'border-radius:5px 5px 0 0;cursor:move;padding:0 4px;display:flex;' +
			'align-items:center;justify-content:space-between;">' +
			'<span style="font-size:11px;font-weight:bold;text-shadow:1px 1px white;">挂机助手</span>' +
			'<span class="bot-close" style="cursor:pointer;font-size:14px;color:#888;">×</span>' +
			'</div>' +
			'<div style="padding:8px;">' +
			// HP 阈值滑块（D2 用户决策 #1: 0-100）
			'<div style="margin-bottom:6px;display:flex;align-items:center;gap:4px;">' +
			'<label style="width:38px;flex-shrink:0;">HP: <span class="hp-val">' + this.hpThreshold + '%</span></label>' +
			'<input type="range" min="0" max="100" value="' + this.hpThreshold + '" ' +
			'class="bot-hp-slider" style="flex:1;min-width:0;"></div>' +
			// SP 阈值滑块
			'<div style="margin-bottom:8px;display:flex;align-items:center;gap:4px;">' +
			'<label style="width:38px;flex-shrink:0;">SP: <span class="sp-val">' + this.spThreshold + '%</span></label>' +
			'<input type="range" min="0" max="100" value="' + this.spThreshold + '" ' +
			'class="bot-sp-slider" style="flex:1;min-width:0;"></div>' +
			// 技能列表 6 格
			'<div style="font-size:11px;font-weight:bold;margin-bottom:2px;">技能列表</div>' +
			'<div class="bot-skill-grid" style="display:flex;gap:6px;margin-bottom:14px;">' +
			this._buildCellGrid('skill', 6) + '</div>' +
			// 消耗品列表 6 格 (#11 rename)
			'<div style="font-size:11px;font-weight:bold;margin-bottom:2px;">消耗品</div>' +
			'<div class="bot-aux-grid" style="display:flex;gap:6px;margin-bottom:14px;">' +
			this._buildCellGrid('aux', 6) + '</div>' +
			// 跟随 + 飞翅勾选（D2 #11/#12）— checkbox 与文字垂直居中对齐
			'<div style="margin-bottom:8px;display:flex;gap:10px;align-items:center;">' +
			'<label style="display:flex;align-items:center;gap:3px;cursor:pointer;">' +
			'<input type="checkbox" class="bot-follow"' + (this.followEnabled ? ' checked' : '') +
			' style="margin:0;"> 跟随队友</label>' +
			'<label style="display:flex;align-items:center;gap:3px;cursor:pointer;">' +
			'<input type="checkbox" class="bot-fly-nomobs"' + (this.flyNoMobs ? ' checked' : '') +
			' style="margin:0;"> 无怪飞翅</label>' +
			'<label style="display:flex;align-items:center;gap:3px;cursor:pointer;">' +
			'<input type="checkbox" class="bot-fly-lowhp"' + (this.flyLowHp ? ' checked' : '') +
			' style="margin:0;"> 低血飞翅</label></div>' +
			// #13 fix: 独立自动药水（不依赖挂机开关）
			'<div style="margin-bottom:8px;">' +
			'<label style="display:flex;align-items:center;gap:3px;cursor:pointer;">' +
			'<input type="checkbox" class="bot-auto-potion"' + (this.autoPotion ? ' checked' : '') +
			' style="margin:0;"> 自动吃药（独立）</label></div>' +
			// 按钮行：开始/停止 toggle（同一按钮两状态）+ 离线挂机（D2 #1, D-14b）
			// 按钮文字减小 2px（11px → 9px）
			'<div style="display:flex;gap:6px;margin-bottom:6px;">' +
			'<button class="bot-toggle-btn" style="flex:1;font-size:10px;">' +
			(this.active ? '停止挂机' : '开始挂机') + '</button>' +
			'<button class="bot-offline-btn" style="flex:1;font-size:10px;">离线挂机</button></div>' +
			// 状态栏：挂机时长 + 积分（分两行）
			'<div style="min-height:14px;">' +
			'挂机时长: <span class="bot-timer">' + this._formatTime(this.timerSec) + '</span></div>' +
			'<div style="min-height:14px;">' +
			'积分: <span class="bot-points">' + this.currentPoints + '</span></div>' +
			// 消息区（D2 #9: 面板内红色/灰色文字，不阻塞）
			'<div class="bot-msg" style="min-height:12px;font-size:10px;margin-top:2px;"></div>' +
			'</div>'
		);
	}

	/**
	 * 构建格子行 HTML（6 个方形格子，+ 号占位，参照 prototype 像素级样式）
	 * D2 #17: 资源耗尽灰化 — 由 _refreshPanel 根据物品/技能可用性切换 .grayed 类
	 */
	_buildCellGrid(slot, count) {
		let html = '';
		for (let i = 0; i < count; i++) {
			html +=
			'<div class="cell" data-slot="' + slot + '" data-index="' + i + '" ' +
			'style="width:32px;height:32px;border:1px solid #ccc;border-radius:3px;' +
			'background:linear-gradient(to bottom,#f5f5f5,#e8e8e8);cursor:pointer;' +
			'position:relative;display:flex;align-items:center;justify-content:center;' +
			'transition:border-color 0.15s;">' +
			'<span class="plus" style="font-size:18px;color:#bbb;line-height:1;">+</span>' +
			'<div class="icon" style="width:24px;height:24px;display:none;' +
			'border-radius:2px;background-size:contain;background-repeat:no-repeat;' +
			'background-position:center;"></div>' +
			'<span class="cell-level" style="display:none;position:absolute;bottom:-15px;' +
			'left:50%;transform:translateX(-50%);font-size:11px;font-weight:bold;white-space:nowrap;' +
			'color:#3a6;padding:0 2px;z-index:5;">' +
			'</span>' +
			'<span class="cell-name" style="display:none;position:absolute;bottom:-30px;' +
			'left:50%;transform:translateX(-50%);font-size:0.55rem;white-space:nowrap;' +
			'background:rgba(0,0,0,0.7);color:white;padding:1px 3px;border-radius:1px;z-index:10;"></span>' +
			'</div>';
		}
		return html;
	}

	/**
	 * 绑定面板内所有事件（HP/SP 滑块、toggle/offline 按钮、勾选项、格子点击）
	 * R2-07: 所有变更点都触发 _saveSettings 持久化
	 */
	_bindPanelEvents() {
		const p = this._panel;

		// 关闭按钮
		const closeBtn = p.querySelector('.bot-close');
		if (closeBtn) closeBtn.addEventListener('click', () => this._hidePanel());

		// HP 滑块
		const hpSlider = p.querySelector('.bot-hp-slider');
		if (hpSlider) {
			hpSlider.addEventListener('input', () => {
				this.hpThreshold = +hpSlider.value;
				const hpVal = p.querySelector('.hp-val');
				if (hpVal) hpVal.textContent = this.hpThreshold + '%';
				this._saveSettings();
			});
		}

		// SP 滑块
		const spSlider = p.querySelector('.bot-sp-slider');
		if (spSlider) {
			spSlider.addEventListener('input', () => {
				this.spThreshold = +spSlider.value;
				const spVal = p.querySelector('.sp-val');
				if (spVal) spVal.textContent = this.spThreshold + '%';
				this._saveSettings();
			});
		}

		// 开始/停止 toggle（D-14b: 同一按钮两状态）
		const toggleBtn = p.querySelector('.bot-toggle-btn');
		if (toggleBtn) {
			toggleBtn.addEventListener('click', () => this.toggleAutoHunt());
		}

		// 离线挂机按钮
		const offlineBtn = p.querySelector('.bot-offline-btn');
		if (offlineBtn) {
			offlineBtn.addEventListener('click', () => this.startOffline());
		}

		// 跟随/飞翅勾选
		const followCb = p.querySelector('.bot-follow');
		if (followCb) {
			followCb.addEventListener('change', e => {
				this.followEnabled = e.target.checked;
				this._saveSettings();
			});
		}
		const flyNoMobsCb = p.querySelector('.bot-fly-nomobs');
		if (flyNoMobsCb) {
			flyNoMobsCb.addEventListener('change', e => {
				this.flyNoMobs = e.target.checked;
				this._saveSettings();
			});
		}
		const flyLowHpCb = p.querySelector('.bot-fly-lowhp');
		if (flyLowHpCb) {
			flyLowHpCb.addEventListener('change', e => {
				this.flyLowHp = e.target.checked;
				this._saveSettings();
			});
		}
		// #13 fix: 独立自动药水开关
		const autoPotionCb = p.querySelector('.bot-auto-potion');
		if (autoPotionCb) {
			autoPotionCb.addEventListener('change', e => {
				this.autoPotion = e.target.checked;
				this._saveSettings();
				if (this.autoPotion) this._startAutoPotion();
				else this._stopAutoPotion();
			});
		}

		// #10 fix: click slot = open dropdown (to select or change). Clear button is in the dropdown.
		p.querySelectorAll('.cell').forEach(cell => {
			cell.addEventListener('click', () => {
				const slot = cell.dataset.slot;
				const index = +cell.dataset.index;
				this._openDropdown(slot, index, cell);
			});
		});
	}

	// =====================================================================
	// Slot 数据层 — 统一管理 skillList/auxList 的增删改查
	// =====================================================================

	_getSlotList(slot) {
		return slot === 'skill' ? this.skillList : this.auxList;
	}

	_setSlotItem(slot, index, id, info, selectedLevel) {
		const list = this._getSlotList(slot);
		let type;
		let subtype = null;
		if (slot === 'skill') {
			// WR-03 fix: 优先级 HEAL → BUFF → ATTACK
			if (HEAL_SKILL_IDS.has(id)) {
				type = SKILL_TYPE_HEAL;
			} else if (_isBuff('skills', id) || _isBuff('items', id)) {
				type = SKILL_TYPE_BUFF;
			} else {
				type = SKILL_TYPE_ATTACK;
			}
		} else {
			// WR-04 fix: 消耗品区分 HP/SP/buff
			if (_isBuff('skills', id) || _isBuff('items', id)) {
				type = AUX_TYPE_BUFF_ITEM;
			} else {
				type = AUX_TYPE_POTION;
				// 默认 'hp'，未知 ID 也视为 HP（保持与原行为兼容，但用户应在列表中
				// 看到提示；如需 SP 恢复，需使用已知 ID 或扩展 efst-map.json）
				subtype = _getPotionRestoreType(id) || 'hp';
			}
		}
		const maxLevel = info ? info.level || 1 : 1;
		const level = (typeof selectedLevel === 'number' && selectedLevel >= 1 && selectedLevel <= maxLevel)
			? selectedLevel
			: maxLevel;
		list[index] = {
			id: id,
			type: type,
			subtype: subtype,
			level: level,
			maxLevel: maxLevel,
			spcost: info ? info.spcost || 0 : 0
		};
		this._saveSettings();
		this._refreshPanel();
	}

	_clearSlotItem(slot, index) {
		const list = this._getSlotList(slot);
		list[index] = null;
		this._saveSettings();
		this._refreshPanel();
	}

	_getSelectedIds(slot, excludeIndex) {
		const list = this._getSlotList(slot);
		const ids = new Set();
		for (let i = 0; i < list.length; i++) {
			if (i !== excludeIndex && list[i] && list[i].id) {
				ids.add(list[i].id);
			}
		}
		return ids;
	}

	// =====================================================================
	// Dropdown UI 层 — 开启/关闭 dropdown 面板
	// =====================================================================

	/**
	 * 打开技能/消耗品选择 dropdown
	 * @param slot 'skill' | 'aux'
	 * @param index 0-5 格子下标
	 * @param anchorCell 锚定格子 DOM 元素（用于定位）
	 */
	_openDropdown(slot, index, anchorCell) {
		this._closeDropdown();
		this._dropdownSlot = slot;
		this._dropdownIndex = index;

		const items = slot === 'skill' ? this._getAvailableSkills() : this._getAvailableConsumables();
		if (items.length === 0) {
			this._showInfo(slot === 'skill' ? '无可选技能' : '无可选消耗品');
			return;
		}

		const selectedIds = this._getSelectedIds(slot, index);
		const list = this._getSlotList(slot);
		const isFilled = !!(list[index] && list[index].id);
		const currentId = isFilled ? list[index].id : null;
		const currentLevel = isFilled ? (list[index].level || 1) : null;

		const dd = this._buildDropdownDOM(slot, items, selectedIds, isFilled, currentId, currentLevel);
		this._positionDropdown(dd, anchorCell);
		this._bindDropdownEvents(dd, slot, index, items);
		document.body.appendChild(dd);
		this._dropdown = dd;

		// 外部点击关闭 — 存储引用以便 _closeDropdown 清理
		this._dropdownClickHandler = e => {
			if (!dd.contains(e.target) && !anchorCell.contains(e.target)) {
				this._closeDropdown();
			}
		};
		document.addEventListener('mousedown', this._dropdownClickHandler, true);
	}

	_buildDropdownDOM(slot, items, selectedIds, isFilled, currentId, currentLevel) {
		const dd = document.createElement('div');
		Object.assign(dd.style, {
			position: 'fixed',
			zIndex: '300',
			background: 'white',
			border: '1px solid #c1c6c2',
			borderRadius: '5px',
			padding: '11px',
			boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
			fontFamily: 'Gulim, Dotum, "Malgun Gothic", sans-serif'
		});

		const title = slot === 'skill' ? '技能' : '消耗品';
		let html =
			'<div style="display:flex;justify-content:space-between;align-items:center;' +
			'margin-bottom:5px;padding-bottom:3px;border-bottom:1px solid #eee;">' +
			'<span style="font-size:11px;font-weight:bold;color:#484848;">' + title + '</span>' +
			(isFilled
				? '<button class="dd-clear" style="font-size:10px;padding:2px 8px;' +
				  'border:1px solid #ccc;border-radius:3px;background:#f5f5f5;cursor:pointer;color:#c44;">清除</button>'
				: '') +
			'</div>' +
			'<div style="display:grid;grid-template-columns:repeat(' + (slot === 'skill' ? 3 : 4) + ',1fr);gap:3px;' +
			'max-height:340px;overflow-y:auto;">';

		for (const item of items) {
			const name = item.name;
			const isCurrent = item.id === currentId;
			const isOtherSelected = selectedIds.has(item.id) && !isCurrent;
			const itemStyle = isCurrent
				? 'display:flex;align-items:center;gap:3px;padding:3px 4px;border-radius:2px;' +
				  'background:#e8f5e9;border:1px solid #4caf50;cursor:pointer;'
				: isOtherSelected
					? 'display:flex;align-items:center;gap:3px;padding:3px 4px;border-radius:2px;' +
					  'background:#f5f5f5;opacity:0.45;cursor:not-allowed;'
					: 'display:flex;align-items:center;gap:3px;padding:3px 4px;border-radius:2px;' +
					  'background:transparent;cursor:pointer;';
			if (slot === 'skill') {
				const maxLevel = item.level || 1;
				const curLevel = isCurrent ? (currentLevel || maxLevel) : maxLevel;
				html +=
					'<div class="dd-item' + (isCurrent ? ' dd-current' : '') + (isOtherSelected ? ' dd-disabled' : '') + '" ' +
					'data-id="' + item.id + '" data-level="' + curLevel + '" ' +
					'style="' + itemStyle + '">' +
					'<div class="dd-icon" data-icon="' + (item.iconName || '') + '" ' +
					'style="min-width:22px;height:22px;border-radius:2px;' +
					'background-size:contain;background-repeat:no-repeat;background-position:center;"></div>' +
					'<div style="display:flex;flex-direction:column;flex:1;min-width:0;gap:1px;">' +
					'<span class="dd-name" style="font-size:10px;color:#484848;white-space:nowrap;' +
					'overflow:hidden;text-overflow:ellipsis;">' + name + '</span>' +
					'<div class="dd-level" style="display:flex;align-items:center;gap:1px;' +
					'font-size:11px;color:#333;" ' +
					'data-max="' + maxLevel + '" data-cur="' + curLevel + '" ' +
					'onclick="event.stopPropagation();">' +
					'<span class="dd-lvl-down" style="cursor:pointer;color:#48c;font-weight:bold;' +
					'padding:0 3px;user-select:none;">&lt;</span>' +
					'<span class="dd-lvl-val" style="min-width:26px;text-align:center;font-size:11px;' +
					'color:#333;">' + curLevel + '/' + maxLevel + '</span>' +
					'<span class="dd-lvl-up" style="cursor:pointer;color:#48c;font-weight:bold;' +
					'padding:0 3px;user-select:none;">&gt;</span>' +
					'</div>' +
					'</div>' +
					'</div>';
			} else {
				html +=
					'<div class="dd-item' + (isCurrent ? ' dd-current' : '') + (isOtherSelected ? ' dd-disabled' : '') + '" ' +
					'data-id="' + item.id + '" ' +
					'style="' + itemStyle + '">' +
					'<div class="dd-icon" data-icon="' + (item.iconName || '') + '" ' +
					'style="min-width:22px;height:22px;border-radius:2px;' +
					'background-size:contain;background-repeat:no-repeat;background-position:center;"></div>' +
					'<span class="dd-name" style="font-size:10px;color:#484848;white-space:nowrap;' +
					'overflow:hidden;text-overflow:ellipsis;">' + name + '</span>' +
					'</div>';
			}
		}
		html += '</div>';
		dd.innerHTML = html;

		// 异步加载图标
		dd.querySelectorAll('.dd-icon').forEach(iconEl => {
			const iconName = iconEl.dataset.icon;
			if (iconName) this._loadIcon(iconEl, iconName);
		});

		return dd;
	}

	_positionDropdown(dd, anchorCell) {
		const rect = anchorCell.getBoundingClientRect();
		dd.style.left = rect.left + 'px';
		dd.style.top = rect.bottom + 2 + 'px';
	}

	_bindDropdownEvents(dd, slot, index, items) {
		// 阻止事件冒泡到 canvas
		const stop = e => { e.stopPropagation(); };
		['mousedown', 'mouseup', 'click', 'mousemove', 'wheel', 'contextmenu', 'dblclick'].forEach(
			evt => dd.addEventListener(evt, stop, false)
		);

		// 选择项
		dd.querySelectorAll('.dd-item').forEach(itemEl => {
			const isDisabled = itemEl.classList.contains('dd-disabled');
			const isCurrent = itemEl.classList.contains('dd-current');

			itemEl.addEventListener('click', e => {
				e.stopPropagation();
				if (isDisabled) return;
				if (isCurrent) return;
				const id = +itemEl.dataset.id;
				const info = items.find(it => it.id === id);
				const selectedLevel = slot === 'skill' ? +itemEl.dataset.level : null;
				this._setSlotItem(slot, index, id, info, selectedLevel);
				this._closeDropdown();
			});
			itemEl.addEventListener('mousedown', e => { e.stopPropagation(); });

			if (!isDisabled) {
				itemEl.addEventListener('mouseenter', () => {
					itemEl.style.background = isCurrent ? '#d4edd8' : '#eef2f8';
				});
				itemEl.addEventListener('mouseleave', () => {
					itemEl.style.background = isCurrent ? '#e8f5e9' : 'transparent';
				});
			}

			// 技能等级调整（仅技能面板）
			if (slot === 'skill' && !isDisabled) {
				const levelEl = itemEl.querySelector('.dd-level');
				if (!levelEl) return;
				const updateLevel = delta => {
					const max = +levelEl.dataset.max || 1;
					let cur = +levelEl.dataset.cur || max;
					cur = Math.max(1, Math.min(max, cur + delta));
					levelEl.dataset.cur = cur;
					itemEl.dataset.level = cur;
					const valEl = levelEl.querySelector('.dd-lvl-val');
					if (valEl) valEl.textContent = cur + '/' + max;
					if (isCurrent) {
						const list = this._getSlotList(slot);
						if (list[index]) {
							list[index].level = cur;
							this._saveSettings();
							this._refreshPanel();
						}
					}
				};
				const downEl = levelEl.querySelector('.dd-lvl-down');
				const upEl = levelEl.querySelector('.dd-lvl-up');
				if (downEl) {
					downEl.addEventListener('click', e => { e.stopPropagation(); updateLevel(-1); });
					downEl.addEventListener('mouseenter', () => { downEl.style.color = '#26a69a'; });
					downEl.addEventListener('mouseleave', () => { downEl.style.color = '#48c'; });
				}
				if (upEl) {
					upEl.addEventListener('click', e => { e.stopPropagation(); updateLevel(1); });
					upEl.addEventListener('mouseenter', () => { upEl.style.color = '#26a69a'; });
					upEl.addEventListener('mouseleave', () => { upEl.style.color = '#48c'; });
				}
			}
		});

		// 清除按钮
		const clearBtn = dd.querySelector('.dd-clear');
		if (clearBtn) {
			clearBtn.addEventListener('click', e => {
				e.stopPropagation();
				this._clearSlotItem(slot, index);
				this._closeDropdown();
				this._showInfo('已清除');
			});
			clearBtn.addEventListener('mousedown', e => { e.stopPropagation(); });
		}
	}

	/**
	 * 获取角色可用技能列表（dropdown 数据源）
	 * R4-问题6: SkillListUI.getUI() 获取实际组件实例，再调 getList()
	 * 过滤: level > 0 && type > 0 (主动技能，剔除被动/未学习)
	 */
	_getAvailableSkills() {
		try {
			// SkillListUI is the UIVersionManager Controller wrapper.
			// getList() is defined on the component instance, accessible via getUI().
			const ui = SkillListUI.getUI();
			if (!ui || typeof ui.getList !== 'function') return [];
			const skills = ui.getList();
			if (!Array.isArray(skills)) return [];
			// 只展示已学习(level>0)且主动(type>0, spcost>0)的技能，排除被动
			return skills
				.filter(s => s && s.level > 0 && s.type > 0 && s.spcost > 0)
				.map(s => {
					// 技能名从 SkillInfo DB 获取（src/DB/Skills/SkillInfo.js，已 Vite alias）
					let name = 'Skill ' + s.SKID;
					let iconName = '';
					if (SkillInfo && SkillInfo[s.SKID]) {
						if (SkillInfo[s.SKID].SkillName) {
							name = SkillInfo[s.SKID].SkillName;
						}
						// 技能图标资源名（SkillList.js 使用的同一字段）
						if (SkillInfo[s.SKID].Name) {
							iconName = SkillInfo[s.SKID].Name;
						}
					}
				return {
					id: s.SKID,
					name: name,
					iconName: iconName,
					color: '#5a8',
					level: s.level,
					type: s.type,
					spcost: s.spcost || 0
				};
				});
		} catch (_) {
			return [];
		}
	}

	/**
	 * 获取背包消耗品列表（dropdown 数据源）
	 * Source: InventoryV0.list / ItemType.HEALING=0, USABLE=2, CASH=18
	 */
	_getAvailableConsumables() {
		try {
			const inv = Inventory.getUI && Inventory.getUI();
			if (!inv || !inv.list) return [];
			return inv.list
				.filter(
					item =>
						item &&
						(item.type === ItemType.HEALING ||
							item.type === ItemType.USABLE ||
							item.type === ItemType.CASH ||
							item.type === ItemType.DELAYCONSUME)
				)
				.map(item => {
					let name = 'Item ' + item.ITID;
					let iconName = '';
					try {
						const info = DB.getItemInfo(item.ITID);
						if (info && info.identifiedDisplayName) {
							name = info.identifiedDisplayName;
						}
						if (info && info.identifiedResourceName) {
							iconName = info.identifiedResourceName;
						}
					} catch (_) {
						// ignore
					}
					return {
						id: item.ITID,
						name: name,
						iconName: iconName,
						color: '#c44',
						index: item.index,
						count: item.count
					};
				});
		} catch (_) {
			return [];
		}
	}

	/**
	 * 刷新面板格子显示：遍历 skillList/auxList，根据是否有数据 + 资源可用性切换样式
	 * D2 #17: 消耗品 count <= 0 → icon 变灰
	 */
	_refreshPanel() {
		if (!this._panel) return;

		// 切换 toggle 按钮文字
		this._updateButtonLabel();

		// 刷新技能格子
		this._refreshCells('skill', this.skillList);
		// 刷新辅助格子（含数量灰化检查）
		this._refreshCells('aux', this.auxList);
	}

	_refreshCells(slot, list) {
		const cells = this._panel.querySelectorAll('.cell[data-slot="' + slot + '"]');
		// 获取数据源一次（用于图标和数量检查），避免循环内重复调用
		const available = slot === 'skill' ? this._getAvailableSkills() : this._getAvailableConsumables();
		cells.forEach((cell, i) => {
			const item = list[i];
			const plus = cell.querySelector('.plus');
			const icon = cell.querySelector('.icon');
			const nameEl = cell.querySelector('.cell-name');

			if (item && item.id) {
				// 已填格子
				cell.classList.add('filled');
				cell.classList.remove('grayed');
				cell.style.borderColor = '#6a8';
				cell.style.background = 'linear-gradient(to bottom,#f0faf0,#e0f0e0)';
				if (plus) plus.style.display = 'none';
				const info = available.find(x => x.id === item.id);
				if (icon) {
					icon.style.display = 'block';
					if (info && info.iconName) {
						this._loadIcon(icon, info.iconName);
					}
				}
				if (nameEl) nameEl.style.display = 'none';

				// 技能格子显示当前等级 / 最高等级
				if (slot === 'skill') {
					const levelEl = cell.querySelector('.cell-level');
					if (levelEl) {
						const max = (info && info.level) || item.maxLevel || item.level || 1;
						levelEl.textContent = item.level + '/' + max;
						levelEl.style.display = '';
					}
				}

				// D2 #17: 消耗品 count <= 0 → 灰化
				if (slot === 'aux') {
					if (info && info.count <= 0) {
						cell.classList.add('grayed');
						cell.style.opacity = '0.45';
					} else {
						cell.classList.remove('grayed');
						cell.style.opacity = '';
					}
				}
			} else {
				// 空格子
				cell.classList.remove('filled', 'grayed');
				cell.style.borderColor = '#ccc';
				cell.style.background = 'linear-gradient(to bottom,#f5f5f5,#e8e8e8)';
				cell.style.opacity = '';
				if (plus) plus.style.display = '';
				if (icon) icon.style.display = 'none';
				if (nameEl) nameEl.style.display = 'none';
				const levelEl = cell.querySelector('.cell-level');
				if (levelEl) levelEl.style.display = 'none';
			}
		});
	}

	/**
	 * 拖拽功能（面板 titlebar 抓手）
	 * Source: 原生 mousedown/mousemove/mouseup 实现（不依赖 jQuery）
	 * 关键: mousemove/mouseup 必须挂到 window + capture 阶段，
	 * 否则面板根的 stopPropagation(bubble) 会拦截 document 上的 drag handler。
	 */
	_makeDraggable(element, handle) {
		if (!handle) return;
		let startX = 0;
		let startY = 0;
		let origX = 0;
		let origY = 0;
		let dragging = false;
		handle.addEventListener('mousedown', e => {
			// 关闭按钮点击不触发拖拽
			if (e.target.classList && e.target.classList.contains('bot-close')) return;
			dragging = true;
			startX = e.clientX;
			startY = e.clientY;
			origX = element.offsetLeft;
			origY = element.offsetTop;
			e.preventDefault(); // 防止文本选中
		});
		// capture=true: 在面板 stopPropagation 之前截获
		window.addEventListener('mousemove', e => {
			if (!dragging) return;
			element.style.left = origX + e.clientX - startX + 'px';
			element.style.top = origY + e.clientY - startY + 'px';
		}, true);
		window.addEventListener('mouseup', () => {
			dragging = false;
		}, true);
	}

	// =================================================================
	// 指令发送（三层防重复）
	// =================================================================

	/**
	 * 统一指令发送入口 — 三层防护
	 * 防护1: 冷却期 2s（拦截连点器/手抖）
	 * 防护2: 状态一致性（拦截同方向重复点击）
	 * 防护3: pending 锁（拦截回包未到时再发）
	 */
	sendCommand(cmd) {
		const now = Date.now();

		// 防护1: 冷却期
		if (now - this._lastCmdTime < this._cmdCooldownMs) {
			this._showError('操作过于频繁，请稍后再试');
			return false;
		}

		// 防护2: 状态一致性
		if (cmd === 0 && this.active) return false; // 已在挂机
		if (cmd === 1 && !this.active) return false; // 未在挂机
		if (cmd === 2 && this._pendingCmd === 2) return false; // 离线请求未回

		// 防护3: pending 锁 — 带超时恢复（HI-02 fix: 防丢包永久锁死）
		if (this._pendingCmd !== null) {
			if (now - this._pendingCmdTime < this._pendingCmdTimeoutMs) {
				this._showError('请等待当前操作完成');
				return false;
			}
			// 超时 — 清除锁并继续
			this._pendingCmd = null;
		}

		this._lastCmdTime = now;
		this._pendingCmd = cmd;
		this._pendingCmdTime = now;

		// 按钮 disabled 视觉反馈
		if (cmd === 0 || cmd === 1) this._setButtonsDisabled(true);
		if (cmd === 2) this._setOfflineButtonDisabled(true);

		const pkt = new CZ_BOT_COMMAND();
		pkt.cmd = cmd;
		Network.sendPacket(pkt);
		return true;
	}

	/** 面板内开始/停止按钮 — 同一按钮的两个状态切换 */
	toggleAutoHunt() {
		if (this.active) {
			this.stopAutoHunt();
		} else {
			this.startAutoHunt();
		}
		this._updateButtonLabel();
	}

	startAutoHunt() {
		// #12 fix: 城镇地图禁止挂机
		const mapName = this._getCurrentMapName();
		if (mapName && TOWN_MAPS.has(mapName)) {
			this._showError('城镇内禁止自动挂机');
			return;
		}
		// cmd 0: autohunt_start → 服务端写入 autohunt_log（D-52）
		if (!this.sendCommand(0)) return;
		// 乐观更新：立即启动循环，不等回包
		this.active = true;
		// 记录挂机地图名（用于过图后自动返回）
		this._huntMapName = mapName || '';
		this._returnTriedPortals = new Set();
		this._returnTargetPortal = null;
		this.startLoops();
		// 自动开启 @autoloot — 聊天封包格式必须是 "角色名 : 消息"
		this._sendChat('@autoloot');
	}

	stopAutoHunt() {
		// cmd 1: autohunt_stop
		if (!this.sendCommand(1)) return;
		this.active = false;
		this.stopLoops();
		this._sendChat('@autoloot 0');
	}

	startOffline() {
		// #6+#7 fix: RO 风格确认弹窗（替代 alert/confirm）
		const pts = this.currentPoints;
		const ratePerMin = 1;
		const estMin = Math.floor(pts / ratePerMin);
		const estH = Math.floor(estMin / 60);
		const estM = estMin % 60;
		const timeStr = estH > 0 ? estH + ' 小时 ' + estM + ' 分钟' : estM + ' 分钟';
		const msg =
			'确定要开始离线挂机吗？\n\n' +
			'当前积分: ' + pts + '\n' +
			'预估时长: ' + timeStr + '\n\n' +
			'你将被踢下线，挂机收益将通过邮件发送。';
		this._showConfirmDialog(msg, () => {
			// cmd 2: offline_start — 服务器将踢下线
			if (!this.sendCommand(2)) return;
			this.active = false;
			this.stopLoops();
			this._hidePanel();
		});
	}

	/**
	 * RO 风格确认弹窗（模拟游戏内 NPC 对话框样式）
	 * 半透明黑色遮罩 + 居中弹窗 + 确定/取消按钮
	 */
	_showConfirmDialog(message, onConfirm) {
		// 移除已有弹窗
		const existing = document.getElementById('bot-confirm-dialog');
		if (existing) existing.remove();

		const overlay = document.createElement('div');
		overlay.id = 'bot-confirm-dialog';
		Object.assign(overlay.style, {
			position: 'fixed',
			top: '0',
			left: '0',
			width: '100%',
			height: '100%',
			background: 'rgba(0,0,0,0.5)',
			zIndex: '500',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center'
		});

		// 阻止事件冒泡到 canvas
		const _stop = e => { e.stopPropagation(); };
		overlay.addEventListener('mousedown', _stop, false);
		overlay.addEventListener('mouseup', _stop, false);
		overlay.addEventListener('click', _stop, false);

		const box = document.createElement('div');
		Object.assign(box.style, {
			background: 'linear-gradient(to bottom,#2a2a3a,#1a1a28)',
			border: '2px solid #8a7a4a',
			borderRadius: '6px',
			padding: '20px 24px',
			maxWidth: '320px',
			minWidth: '240px',
			fontFamily: 'Gulim, Dotum, "Malgun Gothic", sans-serif',
			color: '#e8e0c8',
			fontSize: '11px',
			textAlign: 'center',
			boxShadow: '0 8px 32px rgba(0,0,0,0.7)'
		});

		// 消息内容（支持 \n 换行）
		const msgEl = document.createElement('div');
		msgEl.style.cssText = 'white-space:pre-line;line-height:1.6;margin-bottom:16px;';
		msgEl.textContent = message;
		box.appendChild(msgEl);

		// 按钮容器
		const btnRow = document.createElement('div');
		btnRow.style.cssText = 'display:flex;gap:10px;justify-content:center;';

		const makeBtn = (text, bg, onClick) => {
			const btn = document.createElement('button');
			btn.textContent = text;
			btn.style.cssText =
				'flex:1;padding:6px 16px;font-size:11px;border:1px solid #8a7a4a;border-radius:3px;' +
				'cursor:pointer;color:#e8e0c8;background:' + bg + ';';
			btn.addEventListener('mouseenter', () => { btn.style.filter = 'brightness(1.2)'; });
			btn.addEventListener('mouseleave', () => { btn.style.filter = ''; });
			btn.addEventListener('click', () => {
				overlay.remove();
				if (onClick) onClick();
			});
			return btn;
		};

		btnRow.appendChild(makeBtn('确定', '#4a6a3a', onConfirm));
		btnRow.appendChild(makeBtn('取消', '#6a3a3a', null));
		box.appendChild(btnRow);

		overlay.appendChild(box);
		document.body.appendChild(overlay);
	}

	// =================================================================
	// 三循环启动/停止
	// =================================================================

	startLoops() {
		this.stopLoops();
		// 初始化巡逻计时器，避免启动瞬间误触飞翅（Date.now() 不依赖 rAF）
		this._lastMobSeenTick = Date.now();
		this._lastPatrolMoveTick = 0;
		// 记录当前地图名，用于过图检测
		this._lastMapName = this._getCurrentMapName() || '';
		this._mapChangeTick = 0;
		this.combatTick = setInterval(() => this._combatLoop(), 100);
		this.potionTick = setInterval(() => this._potionLoop(), 200);
		this.buffTick = setInterval(() => this._buffLoop(), 1000);
		this._timerTick = setInterval(() => this._timerLoop(), 1000);
	}

	stopLoops() {
		if (this.combatTick) clearInterval(this.combatTick);
		if (this.potionTick) clearInterval(this.potionTick);
		if (this.buffTick) clearInterval(this.buffTick);
		if (this._timerTick) clearInterval(this._timerTick);
		this.combatTick = null;
		this.potionTick = null;
		this.buffTick = null;
		this._timerTick = null;
	}

	// #13 fix: 独立自动药水 — 不依赖挂机开关 active
	_startAutoPotion() {
		this._stopAutoPotion();
		this._autoPotionTick = setInterval(() => {
			if (this.active) return; // 挂机中由主药水循环处理
			try {
				this._potionLoopInner();
			} catch (e) {
				console.error('[BotAutoHunt] auto-potion loop error:', e);
			}
		}, 200);
	}

	_stopAutoPotion() {
		if (this._autoPotionTick) clearInterval(this._autoPotionTick);
		this._autoPotionTick = null;
	}

	/** 计时器循环：累计挂机时长，每 60s 请求积分更新 */
	_timerLoop() {
		this.timerSec++;
		this._refreshTimer();
		if (this.timerSec % 60 === 0) {
			this.sendCommand(4); // get_points
		}
	}

	// =================================================================
	// 战斗循环 (~100ms)
	// API 参考已在 11-02 PLAN/RESEARCH 验证（R3）:
	//   - Session.Entity.isDead() — EntityState.js
	//   - EntityManager.getClosestEntity(source, Entity.TYPE_MOB) — EntityManager.js:447
	//   - EntityManager.getFocusEntity() / setFocusEntity() — EntityManager.js:243/251
	//   - SkillTargetSelection.onUseSkillToId(skillId, level, targetGID)
	//   - PACKET.CZ.REQUEST_ACT2 { action:7, targetGID } (0x437)
	//   - PACKET.CZ.REQUEST_MOVE2 { dest:[x,y] } (0x35f)
	//   - Entity.amotionTick vs Renderer.tick (amotion 冷却)
	// =================================================================

	_combatLoop() {
		if (!this.active) return;
		try {
			this._combatLoopInner();
		} catch (e) {
			console.error('[BotAutoHunt] combat loop error:', e);
		}
	}

	_combatLoopInner() {
		if (!this.active) return;

		// 0. 过图检测 — 地图名变化时重置内部状态
		// 过图后 EntityManager 清空、Altitude 重载、PathFinding 暂时不可用
		// 需重置计时器和冷却，并给予 3 秒宽限期等怪物刷新
		const currentMap = this._getCurrentMapName() || '';
		if (currentMap && this._lastMapName && currentMap !== this._lastMapName) {
			console.log('[BotAutoHunt] map change:', this._lastMapName, '->', currentMap);
			this._lastMapName = currentMap;
			this._mapChangeTick = Date.now();
			this._lastMobSeenTick = Date.now();
			this._lastPatrolMoveTick = 0;
			this._actionCooldowns = {};
			// 清除目标锁定（旧目标已不存在）
			EntityManager.setFocusEntity(null);
			// 如果回到挂机地图，清除返回状态
			if (currentMap === this._huntMapName) {
				console.log('[BotAutoHunt] returned to hunt map, resuming');
				this._returnTriedPortals = new Set();
				this._returnTargetPortal = null;
				this._needMoveAwayFromPortal = true; // 过图后远离传送门
				this._portalStableTick = 0; // 重置稳定计时
			}
		} else if (currentMap && !this._lastMapName) {
			this._lastMapName = currentMap;
		}

		// 过图宽限期：地图加载中不行动，加载完成后额外等 1.5 秒让怪物刷新
		if (MapRenderer.loading) return;
		if (this._mapChangeTick && Date.now() - this._mapChangeTick < 1500) {
			return;
		}

		// 1. 死亡检测 (D-31) — 角色 dead 则停止挂机循环
		// 注意：过图期间 Session.Entity 可能为 null 或状态异常，不应当作死亡
		if (!Session.Entity) {
			return; // 实体暂不可用，跳过本轮（不停止挂机）
		}
		if (Session.Entity.isDead()) {
			this.active = false;
			this.stopLoops();
			this._updateButtonLabel();
			this._showError('角色已死亡，挂机已停止');
			return;
		}

		// 1.5. 返回挂机地图 — 不在挂机图上时，寻找传送门回去
		if (this._huntMapName && currentMap !== this._huntMapName) {
			this._returnToHuntMap();
			return; // 返回途中不执行战斗逻辑
		}

		// 1.6. 过图返回后主动远离传送门 — 等地图加载完 + 位置稳定后再计算安全路径
		if (this._needMoveAwayFromPortal) {
			if (MapRenderer.loading) return;
			// 角色仍在走（过图惯性），重置稳定计时
			if (Session.Entity.action === Session.Entity.ACTION.WALK) {
				this._portalStableTick = 0;
				return;
			}
			// 角色刚停止，记录停止时间
			if (!this._portalStableTick) {
				this._portalStableTick = Date.now();
				return;
			}
			// 停止后等待 1 秒确认位置稳定
			if (Date.now() - this._portalStableTick < 1000) return;

			if (this._isOnCooldown('portal_avoid')) return;
			this._markAction('portal_avoid', 1000);
			const moved = this._moveAwayFromPortal();
			if (moved) {
				this._needMoveAwayFromPortal = false;
				this._portalStableTick = 0;
			}
			return;
		}

		// 1.7. 巡逻前安全检查：角色当前坐标在传送门附近时强制远离
		if (this._isNearPortal(Session.Entity.position[0] | 0, Session.Entity.position[1] | 0, 7)) {
			if (Session.Entity.action !== Session.Entity.ACTION.WALK && !this._isOnCooldown('portal_avoid')) {
				this._markAction('portal_avoid', 1000);
				this._moveAwayFromPortal();
			}
			return;
		}

		// 2. 跟随队友模式 (D2 #11)
		if (this.followEnabled && this.followTarget) {
			const teammate = EntityManager.get(+this.followTarget);
			if (teammate && !teammate.isDead()) {
				const dx = teammate.position[0] - Session.Entity.position[0];
				const dy = teammate.position[1] - Session.Entity.position[1];
				const distSq = dx * dx + dy * dy;
				// 距离 > 2 格时移向队友
				if (distSq > 4) {
					const pkt = new PACKET.CZ.REQUEST_MOVE2();
					pkt.dest[0] = teammate.position[0];
					pkt.dest[1] = teammate.position[1];
					Network.sendPacket(pkt);
					return; // 移动中不执行攻击
				}
				// 队友有目标 → 自动选中（辅助职业辅助攻击）
				if (teammate.targetGID && !EntityManager.getFocusEntity()) {
					const target = EntityManager.get(teammate.targetGID);
					if (
						target &&
						target.objecttype === Entity.TYPE_MOB &&
						!target.isDead()
					) {
						EntityManager.setFocusEntity(target);
					}
				}
			}
			// 不同地图: 原地等待，不停止挂机
		}

		// 3. 飞翅检查 + 巡逻 (#3 fix: 5秒无怪才飞翅，否则随机走动)
		// 使用 Date.now() 而非 Renderer.tick，后台 tab rAF 冻结时仍能工作
		{
			let hasMob = false;
			EntityManager.forEach(entity => {
				if (
					entity.objecttype === Entity.TYPE_MOB &&
					entity.action !== entity.ACTION.DIE &&
					entity.remove_tick === 0
				) {
					hasMob = true;
					return false; // break
				}
			});

			if (hasMob) {
				this._lastMobSeenTick = Date.now();
			} else {
				// 无怪状态
				const noMobMs = Date.now() - this._lastMobSeenTick;
				// 5 秒无怪 + 勾选了飞翅 → 使用苍蝇翅膀
				if (this.flyNoMobs && noMobMs > 5000) {
					this._useItemById(ITEM_FLY_WING);
					this._lastMobSeenTick = Date.now(); // 重置计时
					return;
				}
				// 巡逻：角色行走中不重复发指令；停下后立即寻路（短冷却防刷包）
				if (Session.Entity.action === Session.Entity.ACTION.WALK) {
					return; // 正在走，继续等待
				}
				// Bug 3 fix: buff 施法期间不移动，避免打断长施法（如能量外套 5s）
				if (Date.now() < this._castingUntil) return;
				if (Date.now() - this._lastPatrolMoveTick > 1500) {
					this._lastPatrolMoveTick = Date.now();
					const target = this._findPatrolTarget();
					if (!target) return; // 无可行走目标，原地等待
					const pkt = new PACKET.CZ.REQUEST_MOVE2();
					pkt.dest[0] = target[0];
					pkt.dest[1] = target[1];
					Network.sendPacket(pkt);
				}
				return;
			}
		}

		// 4. 获取当前目标，无目标则寻找最近怪物
		let target = EntityManager.getFocusEntity();
		if (!target || target.isDead() || target.objecttype !== Entity.TYPE_MOB) {
			target = EntityManager.getClosestEntity(Session.Entity, Entity.TYPE_MOB);
			if (!target) return; // 地图无怪
			EntityManager.setFocusEntity(target);
		}

		// 5. amotion 冷却检查（使用 Date.now() 而非 Renderer.tick，后台兼容）
		// amotionTick 由游戏引擎设置 = Renderer.tick + amotion（Renderer.tick 在前台等于 Date.now()）
		if (Session.Entity.amotionTick > Date.now()) return;

		// 6. 遍历技能列表 — 攻击型 / 治疗型(对不死系怪物当攻击用，D2 #13)
		for (const skill of this.skillList) {
			if (!skill || !skill.id) continue;
			if (skill.type === SKILL_TYPE_ATTACK || skill.type === SKILL_TYPE_HEAL) {
				// SP 不足 → 跳过此技能（防止技能失败后每 tick 重试刷屏）
				if (skill.spcost && Session.Entity.life && Session.Entity.life.sp < skill.spcost) continue;
				SkillTargetSelection.onUseSkillToId(skill.id, skill.level || 1, target.GID);
				return; // 释放一个技能后等下一 tick
			}
		}

		// 7. 无技能可用 → 普通攻击 (PACKET.CZ.REQUEST_ACT2 action=7)
		const pkt = new PACKET.CZ.REQUEST_ACT2();
		pkt.action = 7;
		pkt.targetGID = target.GID;
		Network.sendPacket(pkt);
	}

	// =================================================================
	// 药水/治疗循环 (~200ms)
	// API 参考已在 11-02 PLAN/RESEARCH 验证（R3）:
	//   - Session.Entity.life.hp / hp_max / sp / sp_max — EntityLife.js
	//   - Inventory.getUI().getItemById(id) / useItem(item)
	//   - SkillTargetSelection.onUseSkillToId(skillId, level, Session.Entity.GID) — 治疗自己
	// =================================================================

	_potionLoop() {
		if (!this.active) return;
		try {
			this._potionLoopInner();
		} catch (e) {
			console.error('[BotAutoHunt] potion loop error:', e);
		}
	}

	_potionLoopInner() {
		if (!Session.Entity || Session.Entity.isDead()) return;

		// 不在挂机地图上时，只保留基础 HP 药水（不用飞翅，不干扰返回逻辑）
		const currentMap = this._getCurrentMapName();
		const onHuntMap = !this._huntMapName || currentMap === this._huntMapName;

		const life = Session.Entity.life;
		if (!life) return;

		const hp = life.hp;
		const hpMax = life.hp_max;
		const sp = life.sp;
		const spMax = life.sp_max;

		// 防御: hpMax/spMax 可能为 -1（未初始化）
		if (hpMax <= 0 || spMax <= 0) return;

		const hpPct = (hp / hpMax) * 100;
		const spPct = (sp / spMax) * 100;

		// 1. 低血飞翅 (D2 #12): HP<10% → 优先苍蝇次选蝴蝶
		// 仅在挂机地图上使用飞翅（错误地图上飞翅会干扰返回逻辑）
		if (onHuntMap && this.flyLowHp && hpPct < 10) {
			if (!this._isOnCooldown('item_flywing')) {
				if (!this._useItemById(ITEM_FLY_WING)) {
					this._useItemById(ITEM_BUTTERFLY_WING);
				}
				this._markAction('item_flywing', 2000);
			}
			return;
		}

		// 2. HP 低于阈值 → 使用药水 + 治疗技能(对自己)
		if (hpPct < this.hpThreshold) {
			// 2a. 辅助列表中的 HP 恢复药水 (WR-04 fix: 过滤 subtype)
			// 500ms 冷却防刷
			for (const aux of this.auxList) {
				if (!aux || aux.type !== AUX_TYPE_POTION) continue;
				// subtype 缺失视作 'hp' (旧数据兼容)
				const sub = aux.subtype || 'hp';
				if (sub !== 'hp' && sub !== 'both') continue;
				const key = 'item_' + aux.id;
				if (this._isOnCooldown(key)) continue;
				if (this._useItemById(aux.id)) {
					this._markAction(key, 500);
					break;
				}
			}
			// 2b. 治疗技能(对自己释放，1s 冷却)
			for (const skill of this.skillList) {
				if (!skill || skill.type !== SKILL_TYPE_HEAL) continue;
				if (skill.spcost && sp < skill.spcost) continue;
				const key = 'skill_' + skill.id;
				if (this._isOnCooldown(key)) continue;
				SkillTargetSelection.onUseSkillToId(skill.id, skill.level || 1, Session.Entity.GID);
				this._markAction(key, 1000);
				break;
			}
		}

		// 3. SP 低于阈值 → 使用 SP 恢复消耗品
		if (spPct < this.spThreshold) {
			for (const aux of this.auxList) {
				if (!aux || aux.type !== AUX_TYPE_POTION) continue;
				// WR-04 fix: SP 分支只接受 'sp' 或 'both'；旧数据 (subtype 缺失) 不匹配
				const sub = aux.subtype || 'hp';
				if (sub !== 'sp' && sub !== 'both') continue;
				const key = 'item_' + aux.id;
				if (this._isOnCooldown(key)) continue;
				if (this._useItemById(aux.id)) {
					this._markAction(key, 500);
					break;
				}
			}
		}
	}

	// =================================================================
	// Buff 循环 (~1000ms)
	// =================================================================

	/**
	 * _buffLoop — buff 消失→释放技能/消耗品
	 * Buff 检测: _buffMap 由 StatusIcons.update 钩子维护（_installBuffTracker）
	 * _buffMap 是本地玩家全局 buff 状态，_buffLoop 通过遍历当前列表决定检测哪些 buff
	 */
	_buffLoop() {
		if (!this.active) return;
		try {
			this._buffLoopInner();
		} catch (e) {
			console.error('[BotAutoHunt] buff loop error:', e);
		}
	}

	_buffLoopInner() {
		if (!this.active) return;
		if (!Session.Entity || Session.Entity.isDead()) return;

		for (const skill of this.skillList) {
			if (!skill) continue;
			if (skill.type !== SKILL_TYPE_BUFF) continue;
			const efst = _getPrimaryEfst('skills', skill.id);
			if (!efst) continue;
			if (this._buffMap[efst]) continue;
			const currentSp = Session.Entity.life ? Session.Entity.life.sp : 0;
			if (skill.spcost && currentSp < skill.spcost) continue;
			const key = 'buff_' + efst;
			if (this._isOnCooldown(key)) continue;
			// buff 已消失 → 释放技能（对自己）
			// 直接发包绕过 onUseSkill 的 amotion 检查（Skill.js:630 在战斗中几乎总是 return）
			const buffPkt = new PACKET.CZ.USE_SKILL2();
			buffPkt.SKID = skill.id;
			buffPkt.selectedLevel = skill.level || 1;
			buffPkt.targetID = Session.Entity.GID;
			Network.sendPacket(buffPkt);
			this._markAction(key, 8000); // 8s: 5s 施法 + 3s 网络/注册缓冲
			this._castingUntil = Date.now() + 8000; // 抑制巡逻移动
			return;
		}

		// 2. 辅助列表中的 buff 消耗品
		for (const aux of this.auxList) {
			if (!aux || aux.type !== AUX_TYPE_BUFF_ITEM) continue;
			const efst = _getPrimaryEfst('items', aux.id);
			if (!efst) continue;
			if (this._buffMap[efst]) continue;
			const key = 'buff_' + efst;
			if (this._isOnCooldown(key)) continue;
			this._useItemById(aux.id);
			this._markAction(key, 5000);
			return;
		}
	}

	// =================================================================
	// 工具方法
	// =================================================================

	/**
	 * 动作冷却系统 — 防止条件未满足时不停刷技能/消耗品
	 */
	_isOnCooldown(key) {
		return (this._actionCooldowns[key] || 0) > Date.now();
	}

	_markAction(key, cooldownMs) {
		this._actionCooldowns[key] = Date.now() + cooldownMs;
	}

	/**
	 * 通过物品 ID 使用物品
	 * 关键: 物品使用使用 inventory slot index，必须先 getItemById(id) 获取 item 对象
	 * Source: InventoryV0.js getItemById(id) + useItem(item)
	 */
	_useItemById(itemId) {
		const inv = Inventory.getUI();
		if (!inv) return false;
		const item = inv.getItemById(itemId);
		if (!item || item.count <= 0) return false;
		inv.useItem(item);
		return true;
	}

	/**
	 * 加载 GRF 中的 BMP 图标到 DOM 元素的 background-image
	 * Source: 与 SkillList/Equipment/Inventory 等组件使用相同的 Client.loadFile + INTERFACE_PATH 模式
	 * @param {HTMLElement} el - icon div 元素
	 * @param {string} iconName - 资源名（identifiedResourceName 或 SkillInfo.Name）
	 */
	_loadIcon(el, iconName) {
		if (!el || !iconName) return;
		try {
			Client.loadFile(
				DB.INTERFACE_PATH + 'item/' + iconName + '.bmp',
				url => { el.style.backgroundImage = 'url(' + url + ')'; },
				() => {} // 加载失败 → 保留 fallback 颜色
			);
		} catch (_) {}
	}

	/** 发送聊天指令（如 @autoloot）— 封包格式: "角色名 : 消息" */
	_sendChat(msg) {
		try {
			if (!Session.Entity || !Session.Entity.display || !Session.Entity.display.name) return;
			const pkt = new PACKET.CZ.REQUEST_CHAT();
			pkt.msg = Session.Entity.display.name + ' : ' + msg;
			Network.sendPacket(pkt);
		} catch (_) {}
	}

	/** #12 fix: 获取当前地图名（小写，不含扩展名） */
	_getCurrentMapName() {
		try {
			return (MapRenderer.currentMap || '').replace(/\.gat$/i, '').toLowerCase();
		} catch (_) {
			return '';
		}
	}

	/**
	 * Bug 1 fix: 使用 PathFinding 验证巡逻目标可行走
	 * 策略1: searchLong 射线 — 沿随机方向走，悬崖/墙壁自动停在最远可达格
	 * 策略2: search A* 兜底 — range=8 接受目标附近可达点
	 * @returns {number[]|null} [x, y] 可行走目标坐标，或 null
	 */
	_findPatrolTarget() {
		const cx = Session.Entity.position[0] | 0;
		const cy = Session.Entity.position[1] | 0;
		const out = [];

		// 策略1: 射线检测 — 沿随机方向直线行走，遇到悬崖/墙壁自动停止
		for (let attempt = 0; attempt < 8; attempt++) {
			const angle = Math.random() * Math.PI * 2;
			const dist = 15 + Math.floor(Math.random() * 10); // 15-24
			const tx = cx + Math.round(Math.cos(angle) * dist);
			const ty = cy + Math.round(Math.sin(angle) * dist);

			try {
				const result = PathFinding.searchLong(cx, cy, tx, ty, 0, out);
				if (result.pathLength >= 3) {
					const lastIdx = result.pathLength * 2;
					const rx = out[lastIdx];
					const ry = out[lastIdx + 1];
					if (rx !== undefined && ry !== undefined) {
						if (this._isNearPortal(rx, ry, 7)) continue;
						if (!this._isPathSafe(out, result.pathLength, 5)) continue;
						return [rx, ry];
					}
				}
			} catch (_) {}
		}

		// 策略2: A* 兜底
		for (let attempt = 0; attempt < 4; attempt++) {
			const angle = Math.random() * Math.PI * 2;
			const dist = 8 + Math.floor(Math.random() * 11);
			const tx = cx + Math.round(Math.cos(angle) * dist);
			const ty = cy + Math.round(Math.sin(angle) * dist);

			const pathLen = PathFinding.search(cx, cy, tx, ty, 8, out);
			if (pathLen > 3) {
				const lastIdx = (pathLen - 1) * 2;
				const rx = out[lastIdx];
				const ry = out[lastIdx + 1];
				if (rx !== undefined && ry !== undefined) {
					if (this._isNearPortal(rx, ry, 7)) continue;
					if (!this._isPathSafe(out, pathLen - 1, 5)) continue;
					return [rx, ry];
				}
			}
		}
		return null;
	}

	/**
	 * 检查坐标是否在当前地图的传送门附近
	 * 防止巡逻时走回传送门导致意外过图
	 */
	_isNearPortal(x, y, radius) {
		if (radius === undefined) radius = 7;
		const map = this._getCurrentMapName();
		const portals = MAP_CONNECTIONS[map];
		if (!portals) return false;
		const r2 = radius * radius;
		for (const p of portals) {
			const dx = p.x - x;
			const dy = p.y - y;
			if (dx * dx + dy * dy < r2) return true;
		}
		return false;
	}

	/**
	 * 检查路径上每个中间格子是否都在传送门安全距离外
	 * 跳过起点（i=1），因为起点安全性由调用方保证
	 * @param {number[]} pathOut - PathFinding 输出的平坦数组 [x0,y0,x1,y1,...]
	 * @param {number} pathLen - 路径步数
	 * @param {number} radius - 安全半径（默认 5）
	 * @returns {boolean} true=路径安全, false=途经传送门
	 */
	_isPathSafe(pathOut, pathLen, radius) {
		if (radius === undefined) radius = 5;
		for (let i = 1; i <= pathLen; i++) {
			const px = pathOut[i * 2];
			const py = pathOut[i * 2 + 1];
			if (px !== undefined && py !== undefined && this._isNearPortal(px, py, radius)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * 过图后主动远离传送门（多传送门排斥 + 方向验证）
	 * 收集 15 格内所有传送门，计算加权排斥方向，尝试多个角度找到安全逃离路径
	 * @returns {boolean} true=已发送移动指令, false=不需要移动或所有方向不安全
	 */
	_moveAwayFromPortal() {
		const cx = Session.Entity.position[0] | 0;
		const cy = Session.Entity.position[1] | 0;
		const map = this._getCurrentMapName();
		const portals = MAP_CONNECTIONS[map];
		if (!portals || !portals.length) return true;

		// 收集 15 格内所有传送门
		const nearby = [];
		for (const p of portals) {
			const dx = p.x - cx;
			const dy = p.y - cy;
			const d2 = dx * dx + dy * dy;
			if (d2 < 15 * 15) nearby.push({ x: p.x, y: p.y, d2 });
		}
		if (!nearby.length) return true;

		// 计算综合排斥方向（距离越近排斥力越大，反比于距离平方）
		let repX = 0, repY = 0;
		for (const p of nearby) {
			const dx = cx - p.x;
			const dy = cy - p.y;
			const dist = Math.sqrt(p.d2) || 1;
			repX += dx / (dist * dist);
			repY += dy / (dist * dist);
		}

		const repLen = Math.sqrt(repX * repX + repY * repY) || 1;
		const baseAngle = Math.atan2(repY / repLen, repX / repLen);

		// 尝试 4 个方向：主方向 + 左右各 45° + 反方向兜底
		const angles = [baseAngle, baseAngle + Math.PI / 4, baseAngle - Math.PI / 4, baseAngle + Math.PI];
		for (const angle of angles) {
			const tx = Math.round(cx + Math.cos(angle) * 20);
			const ty = Math.round(cy + Math.sin(angle) * 20);
			if (this._isNearPortal(tx, ty, 7)) continue;
			const moved = this._sendMoveTo(tx, ty);
			if (moved) return true;
		}

		return false;
	}

	/**
	 * 发送移动封包到目标坐标（使用 PathFinding 寻路 + 路径安全检查）
	 * 如果路径途经传送门区域，截断到安全的最远格子
	 */
	_sendMoveTo(tx, ty) {
		const cx = Session.Entity.position[0] | 0;
		const cy = Session.Entity.position[1] | 0;
		const out = [];
		try {
			const pathLen = PathFinding.search(cx, cy, tx, ty, 8, out);
			if (pathLen > 2) {
				// 从路径末端向前找第一个不在传送门附近的格子
				let safeEnd = -1;
				for (let i = pathLen - 1; i >= 1; i--) {
					const px = out[i * 2];
					const py = out[i * 2 + 1];
					if (px !== undefined && py !== undefined && !this._isNearPortal(px, py, 5)) {
						safeEnd = i;
						break;
					}
				}
				if (safeEnd < 1) return false; // 无安全落脚点

				const destX = out[safeEnd * 2];
				const destY = out[safeEnd * 2 + 1];
				const pkt = new PACKET.CZ.REQUEST_MOVE2();
				pkt.dest[0] = destX;
				pkt.dest[1] = destY;
				Network.sendPacket(pkt);
				return true;
			}
		} catch (_) {}
		return false;
	}

	/**
	 * 返回挂机地图 — BFS 最短路径搜索
	 * naviLinkTable 格式: [srcMap, warpId, warpType, spriteId, name, ?, srcX, srcY, destMap, destX, destY]
	 * 策略：
	 *   1. 构建 map→[warp] 邻接表
	 *   2. BFS 从 currentMap 到 huntMap，记录第一跳传送门坐标
	 *   3. 找到路径 → 走到第一跳传送门
	 *   4. 找不到 → 原地等待（不乱走）
	 */
	_returnToHuntMap() {
		const currentMap = this._getCurrentMapName();
		const huntMap = (this._huntMapName || '').replace(/\.gat$/i, '').toLowerCase();

		if (!currentMap || !huntMap) {
			return;
		}

		// 角色正在行走中，等待到达
		if (Session.Entity && Session.Entity.action === Session.Entity.ACTION.WALK) {
			return;
		}

		// 500ms 冷却防止刷包
		if (this._isOnCooldown('return_portal')) return;
		this._markAction('return_portal', 500);

		let targetX = null;
		let targetY = null;

 		try {
			const adj = MAP_CONNECTIONS;
			const mapKeys = Object.keys(adj);
			if (!mapKeys.length) {
				console.warn('[BotAutoHunt] map-connections empty, cannot return');
				this._showError('地图连接数据为空，无法寻路返回');
				return;
			}

			// BFS — 队列元素: { map, firstX, firstY }
			//    firstX/firstY 记录从 currentMap 出发的第一跳传送门坐标
			const visited = new Set([currentMap]);
			const queue = [{ map: currentMap, firstX: null, firstY: null }];

			while (queue.length > 0) {
				const node = queue.shift();

				if (node.map === huntMap && node.firstX !== null) {
					targetX = node.firstX;
					targetY = node.firstY;
					break;
				}

				const neighbors = adj[node.map];
				if (!neighbors) continue;

				for (const n of neighbors) {
					if (visited.has(n.to)) continue;
					visited.add(n.to);
					queue.push({
						map: n.to,
						firstX: node.firstX !== null ? node.firstX : n.x,
						firstY: node.firstY !== null ? node.firstY : n.y
					});
				}
			}

			// 没找到路径 → 原地等待
			if (targetX === null) {
				console.warn('[BotAutoHunt] BFS no path from ' + currentMap + ' to ' + huntMap +
					', warps from currentMap=' + (adj[currentMap] ? adj[currentMap].length : 'NONE'));
				this._showError('找不到传送门路径: ' + currentMap + ' → ' + huntMap);
				return;
			}
		} catch (e) {
			console.error('[BotAutoHunt] BFS pathfinding error:', e);
			return;
		}

		// 目标点设在传送门对面 — 强制路径穿过传送门坐标触发传送
		const cx = Session.Entity.position[0];
		const cy = Session.Entity.position[1];
		const dx = targetX - cx;
		const dy = targetY - cy;
		const dist = Math.sqrt(dx * dx + dy * dy);
		let destX, destY;
		if (dist < 1) {
			// 已在传送门上 — 向可行走方向走一步触发
			for (const [ox, oy] of [[2, 0], [-2, 0], [0, 2], [0, -2]]) {
				const nx = targetX + ox;
				const ny = targetY + oy;
				if (Altitude.getCellType(nx, ny) & Altitude.TYPE.WALKABLE) {
					destX = nx;
					destY = ny;
					break;
				}
			}
			if (destX === undefined) {
				destX = targetX;
				destY = targetY;
			}
		} else {
			// 延长到传送门对面 5 格
			const extX = targetX + Math.round((dx / dist) * 5);
			const extY = targetY + Math.round((dy / dist) * 5);
			if (Altitude.getCellType(extX, extY) & Altitude.TYPE.WALKABLE) {
				destX = extX;
				destY = extY;
			} else {
				// 延长点不可走 → 直接走到传送门坐标（可能停在旁边，下次重试）
				destX = targetX;
				destY = targetY;
			}
		}

		const pkt = new PACKET.CZ.REQUEST_MOVE2();
		pkt.dest[0] = destX;
		pkt.dest[1] = destY;
		Network.sendPacket(pkt);
	}

	/** 面板内错误消息 — 红色文字，3 秒后消失（D2 #9） */
	_showError(msg) {
		this._showMsg(msg, '#c03030', 3000);
	}

	/** 面板内信息消息 — 灰色文字，2 秒后消失 */
	_showInfo(msg) {
		this._showMsg(msg, '#484848', 2000);
	}

	_showMsg(msg, color, duration) {
		if (!this._panel) return;
		const el = this._panel.querySelector('.bot-msg');
		if (!el) return;
		el.textContent = msg;
		el.style.color = color;
		setTimeout(() => {
			if (el) el.textContent = '';
		}, duration);
	}

	_setButtonsDisabled(disabled) {
		if (!this._panel) return;
		const btn = this._panel.querySelector('.bot-toggle-btn');
		if (btn) btn.disabled = disabled;
	}

	_setOfflineButtonDisabled(disabled) {
		if (!this._panel) return;
		const btn = this._panel.querySelector('.bot-offline-btn');
		if (btn) btn.disabled = disabled;
	}

	_refreshTimer() {
		if (!this._panel) return;
		const el = this._panel.querySelector('.bot-timer');
		if (el) el.textContent = this._formatTime(this.timerSec);
	}

	_updatePoints(points) {
		this.currentPoints = points;
		if (this._panel) {
			const el = this._panel.querySelector('.bot-points');
			if (el) el.textContent = points;
		}
	}

	/** cmd=3 响应：status 始终 0，data1=0（D-51: 客户端本地维护挂机状态） */
	_updateStatus(status, data1) {
		// 客户端本地维护挂机状态/秒数；此方法仅用于面板刷新（如需要）
	}

	_formatTime(sec) {
		const h = String(Math.floor(sec / 3600)).padStart(2, '0');
		const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
		const s = String(sec % 60).padStart(2, '0');
		return h + ':' + m + ':' + s;
	}

	// =================================================================
	// 设置持久化 (localStorage, per-character, D-42 / D2 #16)
	// =================================================================

	/**
	 * 简单字符串哈希（djb2-like），用于 localStorage key 的角色区分
	 * 同一 charId 产生同一 key（确定性），非加密用途
	 */
	_hash(str) {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			const c = str.charCodeAt(i);
			hash = ((hash << 5) - hash) + c;
			hash |= 0; // 转为 32 位整数
		}
		return Math.abs(hash).toString(36);
	}

	/**
	 * 获取角色 ID（canonical: Session.GID）
	 * Rule 1 修正: 实时读取 Session.GID（构造时 GID=0，进游戏后才有效）
	 */
	_getCharId() {
		return Session && Session.GID ? Session.GID : 0;
	}

	/**
	 * per-character storage key
	 * Rule 1 修正: 每次按当前 GID 计算，避免初始化阶段 GID=0 导致不同角色串设置
	 */
	_getStorageKey() {
		return 'bot_settings_' + this._hash(String(this._getCharId()));
	}

	_loadSettings() {
		try {
			const raw = localStorage.getItem(this._getStorageKey());
			if (raw) {
				const s = JSON.parse(raw);
				this.hpThreshold = s.hp ?? 70;
				this.spThreshold = s.sp ?? 30;
				this.skillList = s.skills ?? [];
				this.auxList = s.aux ?? [];
				this.followEnabled = s.follow ?? false;
				this.followTarget = s.followTarget ?? '';

				// WR-03/WR-04 fix: 一次性迁移旧保存数据
				// 旧版本没有 HEAL 分类和 HP/SP subtype，需要重分类/补字段
				let migrated = false;
				for (const skill of this.skillList) {
					if (skill && skill.type === SKILL_TYPE_ATTACK && HEAL_SKILL_IDS.has(skill.id)) {
						skill.type = SKILL_TYPE_HEAL;
						migrated = true;
					}
					// Bug 3 fix: ATTACK → BUFF 迁移（旧版保存时 EFST 分类尚未生效）
					if (skill && skill.type === SKILL_TYPE_ATTACK && _isBuff('skills', skill.id)) {
						skill.type = SKILL_TYPE_BUFF;
						migrated = true;
					}
				}
				for (const aux of this.auxList) {
					if (aux && aux.type === AUX_TYPE_POTION && !aux.subtype) {
						aux.subtype = _getPotionRestoreType(aux.id) || 'hp';
						migrated = true;
					}
					// Bug 3 fix: POTION → BUFF_ITEM 迁移
					if (aux && aux.type === AUX_TYPE_POTION && _isBuff('items', aux.id)) {
						aux.type = AUX_TYPE_BUFF_ITEM;
						migrated = true;
					}
				}
				if (migrated) this._saveSettings();
				this.flyNoMobs = s.flyNoMobs ?? false;
				this.flyLowHp = s.flyLowHp ?? false;
				this.autoPotion = s.autoPotion ?? false;
				return;
			}
		} catch (_) {
			// 损坏 JSON → 回退默认值，不崩溃
		}
		this.hpThreshold = 70;
		this.spThreshold = 30;
		this.skillList = [];
		this.auxList = [];
		this.followEnabled = false;
		this.followTarget = '';
		this.flyNoMobs = false;
		this.flyLowHp = false;
		this.autoPotion = false;
	}

	_saveSettings() {
		localStorage.setItem(
			this._getStorageKey(),
			JSON.stringify({
				hp: this.hpThreshold,
				sp: this.spThreshold,
				skills: this.skillList,
				aux: this.auxList,
				follow: this.followEnabled,
				followTarget: this.followTarget,
				flyNoMobs: this.flyNoMobs,
				flyLowHp: this.flyLowHp,
				autoPotion: this.autoPotion
			})
		);
	}

	// =================================================================
	// 封包响应处理（D-51 对齐）
	// =================================================================

	/**
	 * _onStatus — 服务器 ZC_BOT_STATUS 响应处理
	 * 所有 cmd 回包: 清空 _pendingCmd 锁 + 恢复按钮可用
	 * cmd 0 (start):     status=0→成功(乐观更新已生效); status≠0→回退
	 * cmd 1 (stop):      status=0→成功; status≠0→回退
	 * cmd 2 (offline):   status=4→pending; 1/2/3→错误; 0→兜底成功
	 * cmd 3 (get_status): status=0(始终), data1=0
	 * cmd 4 (get_points): data1=当前积分
	 */
	_onStatus(pkt) {
		// 清空 pending 锁（无论成功失败）
		this._pendingCmd = null;
		this._pendingCmdTime = 0;

		// 恢复按钮可用
		if (pkt.command === 0 || pkt.command === 1) this._setButtonsDisabled(false);
		if (pkt.command === 2) this._setOfflineButtonDisabled(false);

		switch (pkt.command) {
			case 0:
				if (pkt.status !== 0) {
					// 服务端拒绝 → 回退乐观更新
					this.active = false;
					this.stopLoops();
					this._updateButtonLabel();
					this._showError('挂机启动失败');
				}
				break;
			case 1:
				if (pkt.status !== 0) {
					// 服务端拒绝 → 回退
					this.active = true;
					this.startLoops();
					this._updateButtonLabel();
					this._showError('挂机停止失败');
				}
				break;
			case 2:
				if (pkt.status === 4) {
					// N5: status=4 表示 pending（C++ 校验通过，等待 NPC OnTimer 处理）
					this._showInfo('离线挂机启动中，请稍候...');
				} else if (pkt.status !== 0) {
					const msgs = {
						1: '已有离线挂机进行中',
						2: '积分不足',
						3: '当前地图不支持离线挂机'
					};
					this._showError(msgs[pkt.status] || '离线挂机失败');
				}
				// status=0: 服务器将踢下线（仅兜底，正常走 status=4 → dispbottom 通知）
				break;
			case 3:
				this._updateStatus(pkt.status, pkt.data1);
				break;
			case 4:
				this._updatePoints(pkt.data1);
				break;
			default:
				// 未知命令号（含负值/越界）→ 跳过
				break;
		}
	}
}

// =====================================================================
// 插件入口 — PluginManager 调用
// =====================================================================

/**
 * PluginManager.js (line 90-99) 调用流程:
 *   1. import(resolvedPath)
 *   2. module.default || module
 *   3. typeof plugin === 'function' → plugin(params)
 *   4. return true → 成功; return false → 失败
 */
export default function BotAutoHuntInit() {
	new BotAutoHunt();
	return true;
}
