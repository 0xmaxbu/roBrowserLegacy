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
ZC_BOT_STATUS.name = 'ZC_BOT_STATUS';

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

/** 技能触发类型（开发时预分类，D-03c） */
const SKILL_TYPE_ATTACK = 'attack'; // 有目标+冷却→释放
const SKILL_TYPE_HEAL = 'heal'; // HP<阈值→释放（双模式：不死系→攻击）
const SKILL_TYPE_BUFF = 'buff'; // buff 消失→释放

/** 辅助列表触发类型 */
const AUX_TYPE_POTION = 'potion'; // HP/SP<阈值→使用
const AUX_TYPE_BUFF_ITEM = 'buff_item'; // buff 消失→使用

/**
 * skillId/itemId → EFST 映射表（从 rAthena YAML 静态提取，开发时硬编码）
 * 映射链: skill_db.yml(Status字段) → status.yml(Icon字段) → EFST枚举值
 * EFST 编号: rAthena EFST_BLESSING=10 == roBrowserLegacy StatusConst.BLESSING=10（同一编号）
 * TODO: 开发时按需补充完整映射
 */
const BUFF_EFST_MAP = {
	// 技能 buff — skillId: efstType
	34: 10, // AL_BLESSING → EFST_BLESSING
	29: 9, // AL_INCAGI → EFST_INCREASEAGI
	66: 155, // PR_IMPOSITIO → EFST_IMPOSITIO

	// 消耗品 buff — itemId: efstType
	12028: 20, // 觉醒药水 → EFST_ATTHASTE_POTION1
	12029: 20 // 觉醒药水(集中) → EFST_ATTHASTE_POTION1
};

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

		// ---------- 防重复启停 ----------
		this._lastCmdTime = 0;
		this._cmdCooldownMs = 2000; // 2 秒冷却（拦截连点器/手抖）
		this._pendingCmd = null; // 正在等待回包的指令编号

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
		this._dropdown = null; // 当前显示的 dropdown 面板

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
		// Task 2 实现：创建/显示面板 DOM overlay
	}

	_hidePanel() {
		// Task 2 实现：隐藏面板 DOM
		if (this._panel) {
			this._panel.style.display = 'none';
		}
		this._hideDropdown();
	}

	_hideDropdown() {
		if (this._dropdown) {
			this._dropdown.remove();
			this._dropdown = null;
		}
	}

	_updateButtonLabel() {
		// Task 2 实现：刷新开始/停止按钮文字
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

		// 防护3: pending 锁
		if (this._pendingCmd !== null) {
			this._showError('请等待当前操作完成');
			return false;
		}

		this._lastCmdTime = now;
		this._pendingCmd = cmd;

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
		// cmd 0: autohunt_start → 服务端写入 autohunt_log（D-52）
		if (!this.sendCommand(0)) return;
		// 乐观更新：立即启动循环，不等回包
		this.active = true;
		this.startLoops();
	}

	stopAutoHunt() {
		// cmd 1: autohunt_stop
		if (!this.sendCommand(1)) return;
		this.active = false;
		this.stopLoops();
	}

	startOffline() {
		// cmd 2: offline_start — 服务器将踢下线
		if (!this.sendCommand(2)) return;
		// 正常路径会先收到 status=4 (pending)
	}

	// =================================================================
	// 三循环启动/停止
	// =================================================================

	startLoops() {
		this.stopLoops();
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

	/** 计时器循环：累计挂机时长，每 60s 请求积分更新 */
	_timerLoop() {
		this.timerSec++;
		this._refreshTimer();
		if (this.timerSec % 60 === 0) {
			this.sendCommand(4); // get_points
		}
	}

	// =================================================================
	// 战斗循环 (~100ms) — Task 2 完整实现
	// =================================================================

	_combatLoop() {
		if (!this.active) return;
		// Task 2 实现：死亡检测 / 跟随队友 / 飞翅 / 寻怪 / 攻击型技能 / 普攻
	}

	// =================================================================
	// 药水/治疗循环 (~200ms) — Task 2 完整实现
	// =================================================================

	_potionLoop() {
		if (!this.active) return;
		// Task 2 实现：HP/SP 阈值触发药水 + 治疗技能 + 低血飞翅
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
		if (!Session.Entity || Session.Entity.isDead()) return;

		// 1. 技能列表中的 buff 技能
		for (const skill of this.skillList) {
			if (!skill || skill.type !== SKILL_TYPE_BUFF) continue;
			const efst = BUFF_EFST_MAP[skill.id];
			if (!efst) continue; // 该技能未配置 EFST 映射 → 跳过
			if (this._buffMap[efst]) continue; // buff 仍存在 → 跳过
			// buff 已消失 → 释放技能（对自己）
			SkillTargetSelection.onUseSkillToId(skill.id, skill.level || 1, Session.Entity.GID);
			return; // 每次只释放一个 buff
		}

		// 2. 辅助列表中的 buff 消耗品
		for (const aux of this.auxList) {
			if (!aux || aux.type !== AUX_TYPE_BUFF_ITEM) continue;
			const efst = BUFF_EFST_MAP[aux.id];
			if (!efst) continue;
			if (this._buffMap[efst]) continue;
			// buff 已消失 → 使用物品
			this._useItemById(aux.id);
			return;
		}
	}

	// =================================================================
	// 工具方法
	// =================================================================

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
				this.flyNoMobs = s.flyNoMobs ?? false;
				this.flyLowHp = s.flyLowHp ?? false;
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
				flyLowHp: this.flyLowHp
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
