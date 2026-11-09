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
import { createSettingsComponent } from './settings/SettingsWindow.js'; // T1: 官方样式设置窗口（GUIComponent，8 页签）
import { migrateSettings, slotReady, evaluateThresholds, mobInWhitelist, decideNoMobAction, matchLootType, validateLootedItem, isCureStatusActive, evaluatePotionSlots, decideSpEconomy, CURE_WATCH_LISTS, SCHEMA_VERSION, TOTAL_SLOT_COUNT } from './settings/schema.js'; // T2-T9: 纯函数
import Sprite from 'Loaders/Sprite.js'; // T9: 魔物头像程序化渲染（官方魔物设定页行首图标）
import Action from 'Loaders/Action.js'; // T9: 同上（ACT 动画帧索引）
import EFST_MAP from './data/efst-map.json'; // 由 tools/client/generate-efst-map.mjs 生成
import MAP_CONNECTIONS from './data/map-connections.json'; // 由 tools/client/generate-map-connections.mjs 生成
import MAP_MOBS from './data/map-mobs.json'; // T4: 地图→魔物种族表（tools/client/generate-map-mobs.mjs 构建期生成）
// T9: MVP 首领魔物种族表（同生成器产出，读服务端 mob_db.yml Modes.Mvp 标记；键 'mvp' 非地图名）
const MVP_JOBS = Array.isArray(MAP_MOBS.mvp) ? MAP_MOBS.mvp : [];
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
import SK from 'DB/Skills/SkillConst.js'; // T5: AL_TELEPORT 瞬移技能常量
import PACKETVER from 'Network/PacketVerManager.js'; // T6: 拾取封包版本判定（≥20180307 用 ITEM_PICKUP2）
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
		this.currentPoints = 0;
		this.timerSec = 0;

		// ---------- 阈值（T9: 官方药水页四槽模型，v2 共享阈值已迁移至 potions 槽位） ----------
		this.potions = {
			hp: [
				{ id: 0, threshold: 70, enabled: true },
				{ id: 0, threshold: 70, enabled: true }
			],
			sp: [
				{ id: 0, threshold: 30, enabled: true },
				{ id: 0, threshold: 30, enabled: true }
			]
		};

		// ---------- 两列表（D2 #8 修订: 6 技能格 + 6 辅助格） ----------
		// skillList: [{id, type, level}, ...]  type: 'attack'|'heal'|'buff'
		// T9: auxList（v2 混排药水链）已由 potions.hp/sp 四槽取代，字段移除
		this.skillList = [];

		// ---------- 跟随队友（D2 #11） ----------
		this.followEnabled = false;
		this.followTarget = ''; // 队友 GID（字符串）

		// ---------- 飞翅（D2 #12 / T9 官方基本设定页） ----------
		this.flyNoMobs = true; // 官方行3：[X秒]内没进行战斗时使用瞬移（默认开启同官方勾选）
		this.flyLowHp = false; // HP<10%→苍蝇翅膀（自定义保留功能，官方无此控件）

		// ---------- #13 fix: 药水循环（T9: 随挂机循环启停，官方无独立总开关） ----------
		this._autoPotionTick = null; // 兼容旧字段名（独立药水循环已退役）
		this.auxList = []; // T9: 仅存 BUFF 道具（buff 循环用；potion 类型已由 potions 四槽取代）

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
		this._dropdown = null; // 当前 dropdown DOM 元素
		this._dropdownClickHandler = null; // dropdown 外部点击关闭处理器（引用以便清理）

		// ---------- 动作冷却系统（防止条件未满足时不停刷技能/消耗品） ----------
		// key 格式: 'item_<id>' | 'skill_<id>' | 'buff_<efst>'
		// value: 冷却到期时间戳 (Date.now() + cooldownMs)
		this._actionCooldowns = {};

		// ---------- Buff 施法保护（Bug 3 fix: 防止巡逻移动打断长施法） ----------
		// 值: Date.now() + 预估施法时间；战斗循环在此时间前不发送移动指令
		this._castingUntil = 0;

		// ---------- 安装 buff 追踪 ----------
		// （T8 修复：加载设置移至构造器末尾——原位置先于字段默认值赋值，
		//   存档加载后被 slotDelays/loot=null 等默认值覆盖，右键直开设置窗口即崩溃）
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

		// ---------- 悬浮开关与设置窗口（T1：官方对齐改造） ----------
		// 术语见仓库根 GLOSSARY.md：用户可见名「自动战斗」，悬浮开关仅进图后显示
		this._floatBtn = null; // 悬浮开关 DOM 元素
		this._floatMoved = false; // 本次按压是否产生位移（区分拖拽与点击）
		this._settingsComp = null; // 设置窗口组件（GUIComponent，懒创建）
		this._floatPoll = null; // 可见性轮询定时器
		this._floatMiss = 0; // 连续离场计数（防过图瞬间闪烁）
		this._floatHit = 0; // 连续在场计数（防选角→地图黑屏瞬时态闪现）
		this._toastTimer = null; // toast 消失定时器
		// ---------- schema v2（T2）：8 槽（攻击组 0-3 / 辅助组 4-7）+ 每槽延迟 ----------
		this.slotDelays = new Array(TOTAL_SLOT_COUNT).fill(0); // 每槽施放延迟 ms，0=仅引擎默认限速
		this.normalAttack = true; // T2: 无技能可用时允许普通攻击（法系职业可关闭，避免近身普攻）
		this.mobWhitelist = {}; // T4: 魔物白名单（按地图记忆 { 地图名: [种族ID...] }，空=不过滤）
		this._seenMobs = {}; // T4: 本会话见过的魔物清单（按地图，运行时内存，不持久化）
		this.noMobSeconds = 10; // T5: 无怪触发秒数（1-60，官方默认 10）
		this.returnToMap = true; // T5: 被传送后返回挂机地图（关闭则就地继续）
		this.loot = null; // T6: 捡拾配置（_applySettings 赋值）
		this._lootTick = null; // T6: 捡拾循环定时器
		this._lootPending = null; // T6: 待校验拾取 { gid, tick }
		this._lootBlacklist = new Set(); // T6: 本会话不再拾取的地面物品 GID（防捡丢循环）
		// T9: 官方模型字段（默认值；加载后被 _applySettings 覆盖）
		this.cure = { enabled: true, poison: 0, panacea: 0 }; // 状态异常恢复（药水页分页2）
		this.returnVillage = { enabled: false, onPotionsEmpty: false, onCureEmpty: false }; // 返回村庄设定
		this.teleport = { item: { enabled: true, id: ITEM_FLY_WING }, skill: { enabled: true, id: 28, level: 1 } }; // 瞬间移动使用设定
		this.retreat = { item: { enabled: true, id: ITEM_BUTTERFLY_WING }, skill: { enabled: true, id: 28, level: 2 } }; // 返回储存点使用设定
		this.spNormalAttack = { enabled: false, threshold: 10 }; // SP经济规则1：仅一般攻击（优先度高）
		this.spStopAttackMove = { enabled: false, threshold: 5 }; // SP经济规则2：停止攻击后自动移动
		this.flyOnMobCount = { enabled: false, count: 20 }; // 画面内魔物超过 X 只时瞬移
		this.flyOnMvp = true; // MVP 首领魔物登场时瞬移（官方默认勾选）
		this._potionPage = 0; // 药水页当前分页（0=页1 四槽，1=页2 解除/回村）
		this._mobPortraits = []; // 魔物头像动画注册表（[{canvas, frames, delay, idx}]）
		this._mobPortraitTimer = null; // 头像动画共享定时器
		this._slotLastCast = {}; // 槽下标 → 上次施放时间戳

		// ---------- 加载设置（必须在全部字段默认值就位之后——_applySettings 逐字段覆盖默认值） ----------
		// 构造时 GID 可能为 0（key 固定串），进游戏/过图/开窗会按需重载
		this._loadSettings();

		this._createFloatingButton();
		this._startFloatLifecyclePoll();

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
	 * 切换设置窗口显示（T8: 旧面板退役后，BasicInfo/ButtonBar 入口按钮 = 打开设置窗口）。
	 * 挂机启停由悬浮开关左键承担。
	 */
	toggle() {
		// 进游戏后 GID 才已知，打开窗口时重载一次设置确保 per-character 正确
		this._loadSettings();
		if (this._settingsComp && this._settingsComp._host && this._settingsComp._host.parentNode) {
			this._settingsComp.remove();
		} else {
			this._openSettings();
			this.sendCommand(4); // 立即请求积分更新
		}
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

	/**
	 * 构建面板内部 HTML（参照 bot-panel-prototype.html 像素级原型）
	 * 复用 Common.css 的 .ui-btn 按钮样式（D1 决策），其他元素用 inline style

	/**
	 * 构建格子行 HTML（6 个方形格子，+ 号占位，参照 prototype 像素级样式）
	 * D2 #17: 资源耗尽灰化 — 由 _refreshPanel 根据物品/技能可用性切换 .grayed 类

	/**
	 * 绑定面板内所有事件（HP/SP 滑块、toggle/offline 按钮、勾选项、格子点击）
	 * R2-07: 所有变更点都触发 _saveSettings 持久化

	// =====================================================================
	// Slot 数据层 — 统一管理 skillList/auxList 的增删改查
	// =====================================================================

	/**
	 * 技能类型判定（WR-03 单一权威源：HEAL → BUFF → ATTACK）
	 * 存槽（_setSlotItem）、旧档迁移、下拉过滤共用；勿在其它处内联同样逻辑
	 */
	_classifySkillType(id) {
		if (HEAL_SKILL_IDS.has(id)) return SKILL_TYPE_HEAL;
		if (_isBuff('skills', id) || _isBuff('items', id)) return SKILL_TYPE_BUFF;
		return SKILL_TYPE_ATTACK;
	}

	_getSlotList(slot) {
		return slot === 'skill' ? this.skillList : this.auxList;
	}

	_setSlotItem(slot, index, id, info, selectedLevel) {
		const list = this._getSlotList(slot);
		let type;
		let subtype = null;
		if (slot === 'skill') {
			// WR-03 fix: 优先级 HEAL → BUFF → ATTACK（_classifySkillType 单一权威源）
			type = this._classifySkillType(id);
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
	_openDropdown(slot, index, anchorCell, skillGroup) {
		this._closeDropdown();
		this._dropdownSlot = slot;
		this._dropdownIndex = index;

		let items = slot === 'skill' ? this._getAvailableSkills() : this._getAvailableConsumables();
		// T2: 技能页签按组过滤（攻击组仅攻击型；辅助组=增益+治疗自施）。
		// 旧面板混排不传 skillGroup，行为不变；引擎三循环本就按类型跨全部槽位判定，不受分组影响
		if (slot === 'skill' && skillGroup) {
			items = items.filter(it => {
				const t = this._classifySkillType(it.id);
				return skillGroup === 'attack' ? t === SKILL_TYPE_ATTACK : (t === SKILL_TYPE_BUFF || t === SKILL_TYPE_HEAL);
			});
		}
		if (items.length === 0) {
			this._showInfo(
				slot === 'skill'
					? (skillGroup === 'attack' ? '无已学习的攻击技能'
						: skillGroup === 'support' ? '无已学习的辅助技能（增益/治疗）'
						: '无可选技能')
					: '无可选消耗品'
			);
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
		// T2/T3: 设置窗口技能页签+基本页同步（不依赖旧面板存在，须在早退之前）
		if (this._settingsComp && this._settingsComp._host && this._settingsComp._host.parentNode) {
			this._renderSkillTab();
			this._renderBasicTab();
			this._renderMobTab();
			this._renderMoveTab();
			this._renderLootTab();
			this._renderPotionTab();
			this._renderServiceTab();
		}
		// 同步悬浮开关高亮态（active 状态变更均会路过此处）
		this._updateFloatBtnState();
		// 同步设置窗口技能页签（T2：新窗口编辑下拉写入后回填 UI）
		if (this._settingsComp && this._settingsComp._host && this._settingsComp._host.parentNode) {
			this._renderSkillTab();
			this._renderBasicTab();
			this._renderMobTab();
			this._renderMoveTab();
			this._renderLootTab();
			this._renderPotionTab();
			this._renderServiceTab();
		}
	}


	/**
	 * 拖拽功能（面板 titlebar 抓手）
	 * Source: 原生 mousedown/mousemove/mouseup 实现（不依赖 jQuery）
	 * 关键: mousemove/mouseup 必须挂到 window + capture 阶段，
	 * 否则面板根的 stopPropagation(bubble) 会拦截 document 上的 drag handler。
	 */

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

	// =================================================================
	// 悬浮开关与设置窗口（T1：官方对齐改造，Issue #2）
	// =================================================================

	/**
	 * 悬浮开关：停靠小地图旁，可拖拽；左键启停自动战斗，右键打开设置窗口。
	 * 位置持久化到 localStorage；拖拽与点击用 5px 位移阈值区分。
	 */
	_createFloatingButton() {
		if (this._floatBtn) return;
		const btn = document.createElement('div');
		btn.id = 'bot-float-btn';
		btn.title = '自动战斗：左键启停，右键打开设置';
		btn.style.cssText =
			'position:fixed;z-index:900;width:36px;height:36px;display:none;' +
			'line-height:32px;text-align:center;font-size:18px;cursor:pointer;' +
			'background:linear-gradient(to bottom,#f7ecd3,#e8d5ae);' +
			'border:2px solid #7a5c2e;border-radius:6px;color:#6d5228;' +
			'box-shadow:0 2px 6px rgba(0,0,0,0.4);user-select:none;';
		btn.textContent = '⚔';

		// 默认停靠小地图下方（MiniMap 位于右上角 16px 内）；已保存位置优先
		const saved = this._loadFloatBtnPos();
		btn.style.left = saved.left + 'px';
		btn.style.top = saved.top + 'px';

		// 事件阻断：防透传到游戏 MouseEventHandler（与面板同一约定）
		['mousedown', 'mouseup', 'click', 'contextmenu', 'dblclick'].forEach(type => {
			btn.addEventListener(type, e => e.stopPropagation(), false);
		});

		// 拖拽（带位移阈值，拖后不触发点击）
		let startX = 0, startY = 0, origX = 0, origY = 0, pressing = false;
		btn.addEventListener('mousedown', e => {
			pressing = true;
			this._floatMoved = false;
			startX = e.clientX;
			startY = e.clientY;
			origX = btn.offsetLeft;
			origY = btn.offsetTop;
			e.preventDefault();
		});
		window.addEventListener('mousemove', e => {
			if (!pressing) return;
			const dx = e.clientX - startX, dy = e.clientY - startY;
			if (!this._floatMoved && Math.abs(dx) + Math.abs(dy) > 5) {
				this._floatMoved = true;
			}
			if (this._floatMoved) {
				btn.style.left = origX + dx + 'px';
				btn.style.top = origY + dy + 'px';
			}
		}, true);
		window.addEventListener('mouseup', () => {
			if (pressing && this._floatMoved) this._saveFloatBtnPos(btn);
			pressing = false;
		}, true);

		btn.addEventListener('click', () => {
			if (this._floatMoved) {
				this._floatMoved = false; // 拖拽结束，吞掉本次 click
				return;
			}
			this.toggleAutoHunt();
		});
		btn.addEventListener('contextmenu', e => {
			e.preventDefault();
			this._openSettings();
		});

		document.body.appendChild(btn);
		this._floatBtn = btn;
		this._updateFloatBtnState();
	}

	/** 读取悬浮开关持久化位置（无记录时默认小地图下方） */
	_loadFloatBtnPos() {
		try {
			const raw = localStorage.getItem('bot_float_btn_pos');
			if (raw) {
				const pos = JSON.parse(raw);
				if (typeof pos.left === 'number' && typeof pos.top === 'number') return pos;
			}
		} catch (_) { /* 损坏数据按默认处理 */ }
		return {
			left: Math.max(0, (window.innerWidth || 1024) - 60),
			top: 200
		};
	}

	_saveFloatBtnPos(btn) {
		try {
			localStorage.setItem(
				'bot_float_btn_pos',
				JSON.stringify({ left: btn.offsetLeft, top: btn.offsetTop })
			);
		} catch (_) { /* 忽略配额/隐私模式错误 */ }
	}

	/** 悬浮开关高亮态：挂机中绿色描边，停止时普通外观 */
	_updateFloatBtnState() {
		if (!this._floatBtn) return;
		this._floatBtn.style.boxShadow = this.active
			? '0 0 6px 2px rgba(80,200,80,0.8)'
			: '0 2px 6px rgba(0,0,0,0.4)';
	}

	/**
	 * 可见性轮询：仅进图后显示悬浮开关；回选角/退回登录自动隐藏并停止挂机。
	 * 不用 hookPacket：RESTART_ACK/ACCEPT_QUIT 已被 MapEngine 占用（覆盖语义），
	 * 且退回登录会 GameEngine.reload() 整页重载，轮询信号在三个场景下均可靠：
	 * 登录画面（WinLogin 在 DOM）、选角画面（CharSelect 在 DOM）、地图内（两者均不在）。
	 * 隐藏带 2 次连续未命中防抖，避免过图瞬间实体重建导致的闪烁。
	 */
	_startFloatLifecyclePoll() {
		this._floatMiss = 0;
		this._floatHit = 0;
		this._floatPoll = setInterval(() => {
			// 双条件信号（第五轮实测确定，控制台可自行验证：
			//   Array.from(document.querySelectorAll('body > canvas')).some(c => c.style.zIndex === '0')）
			// ① playerInWorld：玩家实体已加入 EntityManager（选角/黑屏早段为 false）
			// ② z0 渲染画布已挂载：Renderer.show()（引擎注释 "Display game"）时才发生，
			//    此前玩家实体可能早已入列（实测早 ~11.5s），黑屏期两者不同真。
			const hasEntity = !!(Session.Entity && Session.Entity.GID);
			const playerInWorld = hasEntity && !!EntityManager.get(Session.Entity.GID);
			let z0Canvas = false;
			const canvases = document.querySelectorAll('body > canvas');
			for (let i = 0; i < canvases.length; i++) {
				if (canvases[i].style.zIndex === '0') {
					z0Canvas = true;
					break;
				}
			}
			const inGame = playerInWorld && z0Canvas && !document.querySelector('#WinLoginV2');
			// 调试探针（长期保留：显示时序问题可用 _lastSignal 取分量时间线）
			this._lastSignal = { inGame: inGame, gid: hasEntity ? Session.Entity.GID : 0, playerInWorld: playerInWorld, z0Canvas: z0Canvas, winLogin: !!document.querySelector('#WinLoginV2') };
			const btn = this._floatBtn;
			if (!btn) return;
			const visible = btn.style.display !== 'none';
			if (inGame) {
				this._floatMiss = 0;
				this._floatHit++;
				// 2 次连续命中（约 0.5s）才显示：双条件同时成立的稳定态
				if (!visible && this._floatHit >= 2) btn.style.display = '';
				return;
			}
			this._floatHit = 0;
			this._floatMiss++;
			if (visible && this._floatMiss >= 2) {
				btn.style.display = 'none';
				if (this.active) this.stopAutoHunt();
				if (this._settingsComp) this._settingsComp.remove();
			}
		}, 500);
	}

	/** 悬浮开关旁的独立 toast — 不依赖面板，登录/选角界面也可见 */
	_showToast(msg) {
		let toast = document.getElementById('bot-float-toast');
		if (!toast) {
			toast = document.createElement('div');
			toast.id = 'bot-float-toast';
			toast.style.cssText =
				'position:fixed;z-index:901;padding:6px 10px;background:rgba(0,0,0,0.75);' +
				'color:#fff;font-size:12px;border-radius:4px;pointer-events:none;' +
				'transition:opacity 0.3s;opacity:0;max-width:220px;' +
				'font-family:Gulim,Dotum,"Malgun Gothic",sans-serif;';
			document.body.appendChild(toast);
		}
		if (this._floatBtn) {
			toast.style.left = this._floatBtn.offsetLeft + 'px';
			toast.style.top = this._floatBtn.offsetTop + this._floatBtn.offsetHeight + 6 + 'px';
		} else {
			toast.style.left = '40%';
			toast.style.top = '60%';
		}
		toast.textContent = msg;
		toast.style.opacity = '1';
		clearTimeout(this._toastTimer);
		this._toastTimer = setTimeout(() => {
			toast.style.opacity = '0';
		}, 2500);
	}

	/** 右键打开设置窗口（GUIComponent，懒创建；append 打开 / remove 关闭） */
	_openSettings() {
		if (!this._settingsComp) {
			this._settingsComp = createSettingsComponent({
				placeholder: '本页签建设中，将在后续工单逐步交付（T2-T8）',
				onReset: (tabIndex) => this._handleSettingsReset(tabIndex), // T2: footer 初始化按钮接线
				onTabChange: (tabIndex) => this._onSettingsTabChange(tabIndex) // T9: 分页器随页签显隐
			});
		}
		this._settingsComp.append();
		this._renderSkillTab();
		this._renderBasicTab();
		this._renderMobTab();
		this._renderMoveTab();
		this._renderLootTab();
		this._renderPotionTab();
		this._renderServiceTab();
		this._onSettingsTabChange(this._settingsComp.getActiveIndex ? this._settingsComp.getActiveIndex() : 0);
		this._hookInventoryAdd();
	}

	/** T9: 页签切换 → 分页器显隐（官方：药水页两页，页脚中间 « 1 / 2 »） */
	_onSettingsTabChange(tabIndex) {
		if (!this._settingsComp || !this._settingsComp.setPager) return;
		if (tabIndex === 3) {
			this._settingsComp.setPager(this._potionPage, 2, (delta) => this._switchPotionPage(delta));
		} else {
			this._settingsComp.setPager(0, 0, null);
		}
	}

	// =================================================================
	// 官方 UI 共用组件（T9：《RO乐园》公告 PDF 逐页截图对齐）
	// =================================================================

	/**
	 * 官方窗口级标题条：浅蓝细纹背景 + 两侧 ✦ 装饰 + 居中深蓝粗体标题 + 可选蓝色副行
	 * 对照官方截图（基本设定「请设定自动狩猎功能。」/ 药水「请设定要使用的恢复道具。」）
	 */
	_officialHeaderStrip(title, subtitle) {
		const strip = document.createElement('div');
		strip.style.cssText =
			'position:relative;padding:7px 18px 6px;text-align:center;' +
			'background:repeating-linear-gradient(to bottom,#eaf3fb 0px,#eaf3fb 1px,#dfeaf5 1px,#dfeaf5 3px);' +
			'border:1px solid #b9c9d8;border-radius:3px;border-bottom:1px dotted #9db8d2;';
		const dia = document.createElement('span');
		dia.textContent = '✦';
		dia.style.cssText = 'position:absolute;left:8px;top:50%;transform:translateY(-60%);color:#4a7ab5;font-size:11px;';
		const dia2 = dia.cloneNode(true);
		dia2.style.left = 'auto';
		dia2.style.right = '8px';
		const t = document.createElement('div');
		t.textContent = title;
		t.style.cssText = 'font-size:12px;font-weight:bold;color:#1a3a8c;';
		strip.appendChild(dia);
		strip.appendChild(dia2);
		strip.appendChild(t);
		if (subtitle) {
			const sub = document.createElement('div');
			sub.textContent = subtitle;
			sub.style.cssText = 'font-size:11px;color:#4a7ab5;margin-top:2px;';
			strip.appendChild(sub);
		}
		return strip;
	}

	/**
	 * 官方区块盒：标题条（浅蓝渐变圆角，同技能页标题条测量值）+ 可选 ON/OFF 切换开关 + 白底内容区
	 * 官方截图参照：恢复HP/恢复SP/状态异常恢复/瞬间移动使用设定 等区块
	 *
	 * @param {string} title 区块标题
	 * @param {{toggle?: boolean, onToggle?: function(boolean), contentPadding?: string}} opts
	 * @return {{box: HTMLElement, content: HTMLElement, setOn: function(boolean)}}
	 */
	_officialSection(title, opts) {
		const o = opts || {};
		const box = document.createElement('div');
		box.style.cssText = 'border:1px solid #b9c9d8;border-radius:4px;background:#ffffff;overflow:hidden;';

		const strip = document.createElement('div');
		strip.style.cssText =
			'position:relative;height:24px;line-height:22px;background:linear-gradient(to bottom,#e3f5ff,#fdffff);' +
			'border-bottom:1px solid #c7d6e3;font-size:12px;font-weight:bold;color:#2e4058;text-align:center;';
		strip.textContent = title;
		box.appendChild(strip);

		const content = document.createElement('div');
		content.style.cssText = 'padding:' + (o.contentPadding || '5px 8px') + ';';
		box.appendChild(content);

		let setOn = null;
		if (o.toggle) {
			const switchBox = document.createElement('div');
			switchBox.style.cssText =
				'position:absolute;right:4px;top:4px;display:flex;border:1px solid #9db8d2;border-radius:2px;overflow:hidden;line-height:1;cursor:pointer;background:#ffffff;';
			const onBtn = document.createElement('span');
			const offBtn = document.createElement('span');
			onBtn.textContent = 'ON';
			offBtn.textContent = 'OFF';
			const paint = on => {
				onBtn.style.cssText =
					'font-size:9px;font-weight:bold;padding:2px 4px;' +
					(on ? 'background:#2e5fa3;color:#ffffff;' : 'background:#ffffff;color:#a8b3bd;');
				offBtn.style.cssText =
					'font-size:9px;font-weight:bold;padding:2px 4px;border-left:1px solid #c7d6e3;' +
					(!on ? 'background:#dce8f2;color:#5a7a9c;' : 'background:#ffffff;color:#a8b3bd;');
			};
			switchBox.addEventListener('click', e => {
				e.stopPropagation();
				const next = offBtn.style.backgroundColor !== 'rgb(220, 232, 242)'; // OFF 当前高亮 → 切为开
				if (typeof o.onToggle === 'function') o.onToggle(next);
			});
			setOn = on => paint(on);
			paint(true);
			switchBox.appendChild(onBtn);
			switchBox.appendChild(offBtn);
			strip.appendChild(switchBox);
		}

		return { box: box, content: content, setOn: setOn };
	}

	/**
	 * 任务面板同款位图勾选框（checkbox_0/1.bmp，EquipmentV4/Quest 同一素材与接线方式）
	 *
	 * @param {boolean} checked 初始勾选态
	 * @param {function(boolean)} [onChange] 勾选变更回调
	 * @return {HTMLButtonElement}
	 */
	_bmpCheckbox(checked, onChange) {
		const btn = document.createElement('button');
		btn.className = 'bot-checkbox';
		btn.style.cssText =
			'width:10px;height:12px;border:none;background-color:transparent;background-repeat:no-repeat;' +
			'vertical-align:middle;cursor:pointer;padding:0;margin:0 4px 0 0;flex:0 0 auto;';
		let state = !!checked;
		const paint = () => {
			Client.loadFile(DB.INTERFACE_PATH + 'checkbox_' + (state ? '1' : '0') + '.bmp', data => {
				btn.style.backgroundImage = 'url(' + data + ')';
			});
		};
		btn.addEventListener('click', e => {
			e.stopPropagation();
			state = !state;
			paint();
			if (typeof onChange === 'function') onChange(state);
		});
		paint();
		btn.isChecked = () => state;
		btn.setChecked = v => {
			if (!!v !== state) {
				state = !!v;
				paint();
			}
		};
		return btn;
	}

	/**
	 * 官方阈值滑杆：◀ 圆角轨道（填充色随 HP蓝/SP绿）圆钮 ▶ + 0/50/100 刻度
	 * 官方截图参照：恢复HP/恢复SP/重量设定 滑杆
	 *
	 * @param {{value: number, color: string, onInput: function(number)}} opts
	 * @return {{el: HTMLElement, setValue: function(number)}}
	 */
	_officialSlider(opts) {
		const o = opts || {};
		const color = o.color || '#7ba7d7';
		const wrap = document.createElement('div');
		wrap.style.cssText = 'display:flex;flex-direction:column;gap:0;';

		const row = document.createElement('div');
		row.style.cssText = 'display:flex;align-items:center;gap:3px;';
		const trackWrap = document.createElement('div');
		trackWrap.style.cssText = 'position:relative;flex:1;height:14px;';
		const fill = document.createElement('div');
		fill.style.cssText =
			'position:absolute;left:0;top:3px;height:8px;border-radius:4px 0 0 4px;background:' + color + ';' +
			'border:1px solid rgba(0,0,0,0.25);border-right:none;box-sizing:border-box;';
		const rest = document.createElement('div');
		rest.style.cssText =
			'position:absolute;right:0;top:3px;height:8px;border-radius:0 4px 4px 0;background:#eef3f8;' +
			'border:1px solid #b9c9d8;border-left:none;box-sizing:border-box;';
		const thumb = document.createElement('div');
		thumb.style.cssText =
			'position:absolute;top:2px;width:10px;height:10px;border-radius:50%;background:linear-gradient(to bottom,#ffffff,#c9d8e6);' +
			'border:1px solid #6f8aa5;box-sizing:border-box;transform:translateX(-50%);pointer-events:none;';
		const range = document.createElement('input');
		range.type = 'range';
		range.min = '0';
		range.max = '100';
		range.value = String(o.value != null ? o.value : 0);
		range.style.cssText = 'position:absolute;inset:0;width:100%;height:14px;margin:0;opacity:0;cursor:pointer;';
		const paintPos = () => {
			const v = +range.value;
			fill.style.width = 'calc(' + v + '% - 1px)';
			fill.style.left = v >= 100 ? '-1px' : '0';
			rest.style.width = 'calc(' + (100 - v) + '% - 1px)';
			thumb.style.left = 'calc(' + v + '% + ' + (5 - (v * 10) / 100) + 'px)';
		};
		range.addEventListener('input', () => {
			paintPos();
			if (typeof o.onInput === 'function') o.onInput(+range.value);
		});
		range.addEventListener('mousedown', e => e.stopPropagation());
		trackWrap.appendChild(fill);
		trackWrap.appendChild(rest);
		trackWrap.appendChild(thumb);
		trackWrap.appendChild(range);

		function arrow(dir) {
			const b = document.createElement('button');
			b.textContent = dir < 0 ? '◀' : '▶';
			b.style.cssText =
				'border:none;background:transparent;color:#4a7ab5;font-size:13px;cursor:pointer;padding:0;line-height:1;';
			b.addEventListener('click', e => {
				e.stopPropagation();
				range.value = String(Math.min(100, Math.max(0, +range.value + dir)));
				paintPos();
				if (typeof o.onInput === 'function') o.onInput(+range.value);
			});
			return b;
		}
		row.appendChild(arrow(-1));
		row.appendChild(trackWrap);
		row.appendChild(arrow(1));
		wrap.appendChild(row);

		const scale = document.createElement('div');
		scale.style.cssText = 'display:flex;justify-content:space-between;font-size:10px;color:#5a7a9c;padding:0 14px;margin-top:-2px;';
		scale.innerHTML = '<span>0</span><span>50</span><span>100</span>';
		wrap.appendChild(scale);

		return {
			el: wrap,
			setValue: v => {
				range.value = String(Math.min(100, Math.max(0, Math.round(v))));
				paintPos();
			}
		};
	}

	/**
	 * 官方空道具格：白底圆角方格 + 底部浅蓝椭圆投影（官方药水/道具格空态）
	 * 已登记时显示道具图标（kRO 惯例 item/<Name>.bmp，同技能格接线）
	 *
	 * @param {number} itemId 已登记道具 ID（0 = 空）
	 * @param {function} [onClick] 点击回调（弹下拉）
	 * @return {HTMLElement}
	 */
	_officialItemSlot(itemId, onClick) {
		const cell = document.createElement('div');
		cell.style.cssText =
			'box-sizing:border-box;width:34px;height:34px;border:1px solid #a8b3bd;border-radius:6px;background:#ffffff;' +
			'position:relative;display:flex;align-items:center;justify-content:center;cursor:pointer;user-select:none;overflow:hidden;';
		const shadow = document.createElement('div');
		shadow.style.cssText =
			'position:absolute;left:50%;bottom:5px;width:20px;height:7px;margin-left:-10px;border-radius:50%;' +
			'background:radial-gradient(ellipse at center,rgba(140,170,200,0.45) 0%,rgba(255,255,255,0) 70%);pointer-events:none;';
		cell.appendChild(shadow);
		if (itemId) {
			const info = DB.getItemInfo(itemId);
			const img = document.createElement('img');
			img.width = 28;
			img.height = 28;
			img.draggable = false;
			img.style.cssText = 'position:relative;z-index:1;';
			img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
			if (info && info.identifiedResourceName) {
				Client.loadFile(DB.INTERFACE_PATH + 'item/' + info.identifiedResourceName + '.bmp', data => {
					img.src = data;
				});
			}
			cell.appendChild(img);
			cell.title = (info && info.identifiedDisplayName) || 'Item ' + itemId;
		} else {
			cell.title = '点击登记道具';
		}
		if (typeof onClick === 'function') {
			cell.addEventListener('click', e => {
				e.stopPropagation();
				onClick(cell);
			});
		}
		return cell;
	}

	// =================================================================
	// 魔物头像程序化渲染（T9：官方魔物设定页行首图标）
	// 客户端无魔物头像素材——用已有怪物 sprite（data/sprite/몬스터/<name>.spr/.act）
	// 离屏渲染待机动画帧序列，共享定时器逐帧播放（玩家确认方案）
	// =================================================================

	/**
	 * 为行盒生成魔物头像 canvas（异步加载 sprite 后自动开始播放待机动画）
	 * @param {number} job 魔物种族 ID
	 */
	_mountMonsterPortrait(container, job) {
		const path = DB.getBodyPath(job, 0); // data/sprite/몬스터/<sprite>
		if (!path) return;
		Client.loadFile(path + '.act', actBuf => {
			Client.loadFile(path + '.spr', sprBuf => {
				if (!actBuf || !sprBuf) return;
				let action, sprite;
				try {
					action = new Action(actBuf);
					sprite = new Sprite(sprBuf);
				} catch (e) {
					return; // 损坏 sprite 静默跳过（行盒仍保留斜纹格）
				}
				const anim = action.actions[0]; // 待机朝南（action*8+direction → 0）
				if (!anim || !anim.animations || !anim.animations.length) return;

				// 预渲染每帧（含图层偏移合成），统一包围盒避免播放抖动
				const frames = [];
				let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
				const raw = [];
				for (const af of anim.animations) {
					const parts = [];
					for (const layer of af.layers) {
						if (layer.sprindex == null || layer.sprindex < 0) continue;
						const fc = sprite.getCanvasFromFrame(layer.sprindex);
						if (!fc || fc.width <= 0) continue;
						parts.push({ c: fc, x: layer.x, y: layer.y });
						minX = Math.min(minX, layer.x - fc.width / 2);
						maxX = Math.max(maxX, layer.x + fc.width / 2);
						minY = Math.min(minY, -layer.y - fc.height / 2);
						maxY = Math.max(maxY, -layer.y + fc.height / 2);
					}
					raw.push(parts);
				}
				if (!raw.length || minX === Infinity) return;
				const bw = Math.ceil(maxX - minX);
				const bh = Math.ceil(maxY - minY);
				const box = 28; // 行盒图标格内容尺寸
				const scale = Math.min(1, box / Math.max(bw, bh));
				for (const parts of raw) {
					const c = document.createElement('canvas');
					c.width = Math.max(1, Math.round(bw * scale));
					c.height = Math.max(1, Math.round(bh * scale));
					const ctx = c.getContext('2d');
					ctx.scale(scale, scale);
					for (const p of parts) {
						ctx.drawImage(p.c, p.x - p.c.width / 2 - minX, -p.y - p.c.height / 2 - minY);
					}
					frames.push(c);
				}
				if (!frames.length) return;

				const view = document.createElement('canvas');
				view.width = frames[0].width;
				view.height = frames[0].height;
				view.style.cssText = 'position:relative;z-index:1;image-rendering:pixelated;';
				container.appendChild(view);
				const reg = {
					canvas: view,
					frames: frames,
					delay: anim.delay || 150,
					idx: 0,
					last: 0
				};
				this._mobPortraits.push(reg);
				this._ensureMobPortraitTimer();
			});
		});
	}

	/** 头像动画共享定时器（150ms 步进；pane 重建后自动清理已脱离 DOM 的注册项） */
	_ensureMobPortraitTimer() {
		if (this._mobPortraitTimer) return;
		this._mobPortraitTimer = setInterval(() => {
			const now = Date.now();
			this._mobPortraits = this._mobPortraits.filter(r => r.canvas.isConnected);
			if (!this._mobPortraits.length) {
				clearInterval(this._mobPortraitTimer);
				this._mobPortraitTimer = null;
				return;
			}
			for (const r of this._mobPortraits) {
				if (now - r.last < r.delay) continue;
				r.last = now;
				r.idx = (r.idx + 1) % r.frames.length;
				const ctx = r.canvas.getContext('2d');
				ctx.clearRect(0, 0, r.canvas.width, r.canvas.height);
				ctx.drawImage(r.frames[r.idx], 0, 0);
			}
		}, 60);
	}

	// =================================================================
	// 基本设定页（T9 官方对齐：请设定自动狩猎功能 + 复选框行为清单）
	// =================================================================

	/** 渲染基本设定页内容（存进 pane[0]；输入进行中不重建） */
	_renderBasicTab() {
		if (!this._settingsComp) return;
		const pane = this._settingsComp.getPane(0);
		if (!pane) return;
		// 滑杆拖动/输入进行中不重建（重建会打断拖拽），值已实时写入 this.*，无一致性问题
		if (pane.contains(document.activeElement)) return;
		pane.innerHTML = '';
		pane.appendChild(this._buildBasicTabContent());
	}

	/** 构建基本设定页（官方逐行复刻：复选框行为清单 + 自定义功能补充区） */
	_buildBasicTabContent() {
		const self = this;
		const wrap = document.createElement('div');
		wrap.style.cssText = 'padding:2px 4px;display:flex;flex-direction:column;gap:4px;text-align:left;';

		wrap.appendChild(this._officialHeaderStrip('请设定自动狩猎功能。'));

		// 官方灰色提示块（双行居中，「移动设定」为蓝字链接色）
		const tip = document.createElement('div');
		tip.style.cssText = 'background:#f2f5f8;border:1px solid #dfe7ee;border-radius:3px;padding:5px 6px;text-align:center;font-size:11px;color:#2e4058;line-height:1.6;';
		tip.innerHTML =
			'瞬间移动于<span style="color:#2e5fa3;font-weight:bold;">「移动设定」</span>页签设定。<br/>' +
			'各角色分别储存自动狩猎设定。';
		wrap.appendChild(tip);

		// 官方复选框行工厂：文字含 [输入框] 内嵌
		function rowLine() {
			const row = document.createElement('div');
			row.style.cssText = 'display:flex;align-items:center;gap:0;font-size:11px;color:#2e4058;padding:1px 2px;flex-wrap:wrap;';
			return row;
		}
		function numInput(cls, value, onChange) {
			const input = document.createElement('input');
			input.type = 'number';
			input.className = cls;
			input.value = String(value);
			input.style.cssText = 'width:34px;height:15px;margin:0 3px;padding:0 2px;font-size:11px;border:1px solid #c7c7c7;border-radius:2px;background:#fffdf5;text-align:center;';
			input.addEventListener('mousedown', e => e.stopPropagation());
			input.addEventListener('keydown', function (e) {
				if (e.key.length === 1 && !/^[0-9]$/.test(e.key)) e.preventDefault();
			});
			input.addEventListener('change', function () {
				input.value = String(Math.max(0, Math.round(+input.value || 0)));
				onChange(+input.value);
			});
			return input;
		}
		function subNote(text) {
			const note = document.createElement('div');
			note.style.cssText = 'font-size:10px;color:#4a7ab5;padding-left:18px;line-height:1.3;';
			note.textContent = text;
			return note;
		}

		// —— 官方行1：角色SP为[X]%以下时，仅使用一般攻击。(优先度高) ——
		const row1 = rowLine();
		const cb1 = this._bmpCheckbox(this.spNormalAttack.enabled, v => {
			self.spNormalAttack.enabled = v;
			self._saveSettings();
		});
		row1.appendChild(cb1);
		row1.appendChild(document.createTextNode('角色SP为'));
		row1.appendChild(numInput('basictab-sp-na', this.spNormalAttack.threshold, v => {
			self.spNormalAttack.threshold = Math.min(100, v);
			self._saveSettings();
		}));
		row1.appendChild(document.createTextNode('%以下时，仅使用一般攻击。(优先度高)'));
		wrap.appendChild(row1);
		wrap.appendChild(subNote('需勾选技能设定的「普通攻击」才可使用一般攻击。'));

		// —— 官方行2：角色SP为[X]%以下时，停止攻击后自动移动。——
		const row2 = rowLine();
		row2.appendChild(this._bmpCheckbox(this.spStopAttackMove.enabled, v => {
			self.spStopAttackMove.enabled = v;
			self._saveSettings();
		}));
		row2.appendChild(document.createTextNode('角色SP为'));
		row2.appendChild(numInput('basictab-sp-sa', this.spStopAttackMove.threshold, v => {
			self.spStopAttackMove.threshold = Math.min(100, v);
			self._saveSettings();
		}));
		row2.appendChild(document.createTextNode('%以下时，停止攻击后自动移动。'));
		wrap.appendChild(row2);

		// —— 官方行3：[X]秒内没进行战斗时，使用瞬间移动。——
		const row3 = rowLine();
		row3.appendChild(this._bmpCheckbox(this.flyNoMobs, v => {
			self.flyNoMobs = v;
			self._saveSettings();
		}));
		row3.appendChild(numInput('basictab-nomob-sec', this.noMobSeconds, v => {
			self.noMobSeconds = Math.min(60, Math.max(1, v || 10));
			self._saveSettings();
		}));
		row3.appendChild(document.createTextNode('秒内没进行战斗时，使用瞬间移动。'));
		wrap.appendChild(row3);

		// —— 官方行4：画面内魔物超过[X]只时，使用瞬间移动。——
		const row4 = rowLine();
		row4.appendChild(this._bmpCheckbox(this.flyOnMobCount.enabled, v => {
			self.flyOnMobCount.enabled = v;
			self._saveSettings();
		}));
		row4.appendChild(document.createTextNode('画面内魔物超过'));
		row4.appendChild(numInput('basictab-mob-count', this.flyOnMobCount.count, v => {
			self.flyOnMobCount.count = Math.min(99, Math.max(1, v || 20));
			self._saveSettings();
		}));
		row4.appendChild(document.createTextNode('只时，使用瞬间移动。'));
		wrap.appendChild(row4);

		// —— 官方行5：MVP首领魔物登场时使用瞬间移动 ——
		const row5 = rowLine();
		row5.appendChild(this._bmpCheckbox(this.flyOnMvp, v => {
			self.flyOnMvp = v;
			self._saveSettings();
		}));
		row5.appendChild(document.createTextNode('MVP首领魔物登场时使用瞬间移动'));
		wrap.appendChild(row5);

		// —— 自定义功能补充区（玩家决定保留；官方无此控件，按官方视觉语言排底部） ——
		const customHead = document.createElement('div');
		customHead.style.cssText = 'font-size:10px;color:#8aa5c0;border-bottom:1px dotted #b9c6d2;padding:3px 0 1px;margin-top:2px;';
		customHead.textContent = '— 扩展设定（服务器私有功能）—';
		wrap.appendChild(customHead);

		const rowC1 = rowLine();
		rowC1.appendChild(this._bmpCheckbox(this.flyLowHp, v => {
			self.flyLowHp = v;
			self._saveSettings();
		}));
		rowC1.appendChild(document.createTextNode('低血保命飞翅（HP<10%：优先苍蝇，次选蝴蝶）'));
		wrap.appendChild(rowC1);

		const rowC2 = rowLine();
		rowC2.appendChild(this._bmpCheckbox(this.returnToMap, v => {
			self.returnToMap = v;
			self._saveSettings();
		}));
		rowC2.appendChild(document.createTextNode('被传送后返回挂机地图（关闭则就地继续挂机）'));
		wrap.appendChild(rowC2);

		return wrap;
	}

	// =================================================================
	// 药水设定页（T7：异常状态解除——解毒药/万能药槽位）
	// =================================================================

	/** T9: 渲染药水设定页内容（官方两分页：页1 HP/SP 四槽；页2 状态异常恢复+返回村庄） */
	_renderPotionTab() {
		if (!this._settingsComp) return;
		const pane = this._settingsComp.getPane(3);
		if (!pane) return;
		if (pane.contains(document.activeElement)) return;
		pane.innerHTML = '';
		pane.appendChild(this._buildPotionTabContent(this._potionPage));
	}

	/** T9: 分页器翻页（delta=±1，循环切换） */
	_switchPotionPage(delta) {
		this._potionPage = (this._potionPage + delta + 2) % 2;
		const pane = this._settingsComp && this._settingsComp.getPane(3);
		if (pane) {
			pane.innerHTML = '';
			pane.appendChild(this._buildPotionTabContent(this._potionPage));
		}
		if (this._settingsComp && this._settingsComp.setPager) {
			this._settingsComp.setPager(this._potionPage, 2, d => this._switchPotionPage(d));
		}
	}

	/**
	 * T9: 药水四槽专用下拉（官方槽位语义：HP 槽列 HP 恢复品、SP 槽列 SP 恢复品；首项清空）
	 * @param {{id: number}} slotObj potions.hp/sp 槽位对象（直接改写）
	 * @param {'hp'|'sp'} kind 槽位类型（过滤恢复类型）
	 * @param {HTMLElement} anchorCell 定位锚点
	 */
	_openPotionSlotDropdown(slotObj, kind, anchorCell) {
		this._closeDropdown();
		const all = this._getAvailableConsumables();
		const items = all.filter(it => {
			const t = this._getPotionRestoreType(it.id) || 'hp';
			return t === kind || t === 'both';
		});
		const dd = document.createElement('div');
		Object.assign(dd.style, {
			position: 'fixed',
			zIndex: '300',
			background: 'white',
			border: '1px solid #c1c6c2',
			borderRadius: '5px',
			padding: '11px',
			boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
			fontFamily: 'Gulim, Dotum, "Malgun Gothic", sans-serif',
			maxWidth: '240px',
			maxHeight: '260px',
			overflowY: 'auto'
		});
		const title = document.createElement('div');
		title.style.cssText = 'font-size:11px;font-weight:bold;color:#484848;margin-bottom:5px;padding-bottom:3px;border-bottom:1px solid #eee;';
		title.textContent = kind === 'hp' ? '选择 HP 恢复道具' : '选择 SP 恢复道具';
		dd.appendChild(title);

		function row(label, onClick) {
			const el = document.createElement('div');
			el.style.cssText = 'font-size:11px;color:#333;padding:4px 6px;cursor:pointer;border-radius:2px;';
			el.textContent = label;
			el.addEventListener('mouseover', () => { el.style.background = '#e8f0f7'; });
			el.addEventListener('mouseout', () => { el.style.background = ''; });
			el.addEventListener('click', onClick);
			dd.appendChild(el);
		}

		row('（清空登记）', () => {
			slotObj.id = 0;
			this._saveSettings();
			this._closeDropdown();
			this._renderPotionTab();
		});
		if (items.length === 0) {
			const empty = document.createElement('div');
			empty.style.cssText = 'font-size:11px;color:#999;padding:4px 6px;';
			empty.textContent = '背包中无可用恢复道具';
			dd.appendChild(empty);
		} else {
			for (const it of items) {
				row(it.name + (it.count ? ' ×' + it.count : ''), () => {
					slotObj.id = it.id;
					this._saveSettings();
					this._closeDropdown();
					this._renderPotionTab();
				});
			}
		}

		this._positionDropdown(dd, anchorCell);
		document.body.appendChild(dd);
		this._dropdown = dd;
		this._dropdownClickHandler = e => {
			if (!dd.contains(e.target) && !anchorCell.contains(e.target)) this._closeDropdown();
		};
		document.addEventListener('mousedown', this._dropdownClickHandler, true);
	}

	/** T9: 刷新药水页（下拉/开关变更后重绘当前页） */
	_syncPotionTab() {
		this._renderPotionTab();
	}

	/** T9: 解除药槽位显示文本 */
	_getCureSlotLabel(key) {
		const id = this.cure[key];
		if (!id) return '＋ 点击登记';
		const info = DB.getItemInfo(id);
		return (info && info.identifiedDisplayName) || ('Item ' + id);
	}

	/**
	 * T7: 解除药专用下拉（无需等级选择；首项为清空）
	 * 复用 _openDropdown 的定位/外点关闭模式，数据源 = 背包消耗品
	 */
	_openCureDropdown(key, anchorCell) {
		this._closeDropdown();
		const items = this._getAvailableConsumables();
		const dd = document.createElement('div');
		Object.assign(dd.style, {
			position: 'fixed',
			zIndex: '300',
			background: 'white',
			border: '1px solid #c1c6c2',
			borderRadius: '5px',
			padding: '11px',
			boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
			fontFamily: 'Gulim, Dotum, "Malgun Gothic", sans-serif',
			maxWidth: '240px',
			maxHeight: '260px',
			overflowY: 'auto'
		});
		const title = document.createElement('div');
		title.style.cssText = 'font-size:11px;font-weight:bold;color:#484848;margin-bottom:5px;padding-bottom:3px;border-bottom:1px solid #eee;';
		title.textContent = key === 'poison' ? '选择解毒药' : '选择万能药';
		dd.appendChild(title);

		function row(label, onClick) {
			const el = document.createElement('div');
			el.style.cssText = 'font-size:11px;color:#333;padding:4px 6px;cursor:pointer;border-radius:2px;';
			el.textContent = label;
			el.addEventListener('mouseover', () => { el.style.background = '#e8f0f7'; });
			el.addEventListener('mouseout', () => { el.style.background = ''; });
			el.addEventListener('click', onClick);
			dd.appendChild(el);
		}

		row('（清空登记）', () => {
			this.cure[key] = 0;
			this._saveSettings();
			this._closeDropdown();
			this._syncPotionTab();
		});
		if (items.length === 0) {
			const empty = document.createElement('div');
			empty.style.cssText = 'font-size:11px;color:#999;padding:4px 6px;';
			empty.textContent = '背包中无可用消耗品';
			dd.appendChild(empty);
		} else {
			for (const it of items) {
				row(it.name + (it.count ? ' ×' + it.count : ''), () => {
					this.cure[key] = it.id;
					this._saveSettings();
					this._closeDropdown();
					this._syncPotionTab();
				});
			}
		}

		this._positionDropdown(dd, anchorCell);
		document.body.appendChild(dd);
		this._dropdown = dd;
		this._dropdownClickHandler = e => {
			if (!dd.contains(e.target) && !anchorCell.contains(e.target)) this._closeDropdown();
		};
		document.addEventListener('mousedown', this._dropdownClickHandler, true);
	}

	/** T9: 构建药水设定页（官方两分页：页1 四槽区块盒；页2 状态异常恢复+返回村庄） */
	_buildPotionTabContent(page) {
		const self = this;
		const wrap = document.createElement('div');
		wrap.style.cssText = 'padding:2px 4px;display:flex;flex-direction:column;gap:4px;text-align:left;';

		if (page === 0) {
			// —— 页1：官方「请设定要使用的恢复道具。」四槽 2×2 ——
			wrap.appendChild(this._officialHeaderStrip('请设定要使用的恢复道具。', '若登录的栏位恢复比例相同，自左侧开始使用。'));

			const grid = document.createElement('div');
			grid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:4px;';

			const defs = [
				{ kind: 'hp', idx: 0, title: '恢复HP', color: '#7ba7d7', stat: 'HP' },
				{ kind: 'hp', idx: 1, title: '恢复HP', color: '#7ba7d7', stat: 'HP' },
				{ kind: 'sp', idx: 0, title: '恢复SP', color: '#7fbf7f', stat: 'SP' },
				{ kind: 'sp', idx: 1, title: '恢复SP', color: '#7fbf7f', stat: 'SP' }
			];
			for (const d of defs) {
				const slot = this.potions[d.kind][d.idx];
				const sec = this._officialSection(d.title, {
					toggle: true,
					onToggle: v => {
						slot.enabled = v;
						self._saveSettings();
					}
				});
				if (sec.setOn) sec.setOn(slot.enabled);
				sec.content.style.cssText += 'display:flex;flex-direction:column;gap:4px;';

				const line = document.createElement('div');
				line.style.cssText = 'font-size:11px;color:#2e4058;';
				line.innerHTML = d.stat + '未满<span style="color:#d43c3c;font-weight:bold;">' + slot.threshold + '%</span>时自动恢复';
				sec.content.appendChild(line);

				const body = document.createElement('div');
				body.style.cssText = 'display:flex;align-items:center;gap:6px;';
				const slider = this._officialSlider({
					value: slot.threshold,
					color: d.color,
					onInput: v => {
						slot.threshold = v;
						self._saveSettings();
						line.innerHTML = d.stat + '未满<span style="color:#d43c3c;font-weight:bold;">' + v + '%</span>时自动恢复';
					}
				});
				slider.el.style.cssText += 'flex:1;min-width:0;';
				body.appendChild(slider.el);
				body.appendChild(this._officialItemSlot(slot.id, () => {
					self._openPotionSlotDropdown(slot, d.kind, body.lastChild);
				}));
				sec.content.appendChild(body);
				grid.appendChild(sec.box);
			}
			wrap.appendChild(grid);
		} else {
			// —— 页2：官方「状态异常恢复」+「返回村庄设定」 ——
			wrap.appendChild(this._officialHeaderStrip('请设定要使用的恢复道具。', '若登录的栏位恢复比例相同，自左侧开始使用。'));

			const sec = this._officialSection('状态异常恢复', {
				toggle: true,
				onToggle: v => {
					self.cure.enabled = v;
					self._saveSettings();
				}
			});
			if (sec.setOn) sec.setOn(this.cure.enabled);
			sec.content.style.cssText += 'display:flex;gap:8px;';

			const textCol = document.createElement('div');
			textCol.style.cssText = 'flex:1;font-size:11px;color:#2e4058;line-height:1.6;';
			textCol.innerHTML =
				'<span style="color:#2e5fa3;font-weight:bold;">依照登记的药水区分可恢复的状态</span><br/>' +
				'<span style="color:#3f8f3f;">绿色药水</span>：中毒 / 沉默 / 黑暗 / 混乱 / 幻觉<br/>' +
				'<span style="color:#3f8f3f;">万能药</span>：中毒 / 沉默 / 黑暗 / 混乱 / 幻觉 / 诅咒<br/>' +
				'自动狩猎中若中了状态异常效果自动使用。';
			sec.content.appendChild(textCol);

			const cureCol = document.createElement('div');
			cureCol.style.cssText = 'display:flex;flex-direction:column;gap:2px;align-items:center;';
			const slotDefs = [
				['poison', '解毒药'],
				['panacea', '万能药']
			];
			for (const sd of slotDefs) {
				cureCol.appendChild(this._officialItemSlot(this.cure[sd[0]], () => {
					self._openCureDropdown(sd[0], cureCol.lastChild);
				}));
				const lb = document.createElement('div');
				lb.style.cssText = 'font-size:9px;color:#5a7a9c;';
				lb.textContent = sd[1];
				cureCol.appendChild(lb);
			}
			sec.content.appendChild(cureCol);
			wrap.appendChild(sec.box);

			// —— 官方灰色返回村庄设定盒 ——
			const rv = document.createElement('div');
			rv.style.cssText = 'background:#f2f5f8;border:1px solid #dfe7ee;border-radius:4px;padding:6px 8px;display:flex;flex-direction:column;gap:2px;';
			function rvRow(cbText, note, get, set) {
				const r1 = document.createElement('div');
				r1.style.cssText = 'display:flex;align-items:center;font-size:11px;font-weight:bold;color:#2e4058;';
				r1.appendChild(self._bmpCheckbox(get(), v => {
					set(v);
					self._saveSettings();
				}));
				r1.appendChild(document.createTextNode(cbText));
				rv.appendChild(r1);
				const n = document.createElement('div');
				n.style.cssText = 'font-size:10px;color:#4a7ab5;padding-left:18px;';
				n.textContent = note;
				rv.appendChild(n);
			}
			rvRow('返回村庄设定', '所有登记的药水道具用完时，自动返回村庄。',
				() => self.returnVillage.onPotionsEmpty, v => (self.returnVillage.onPotionsEmpty = v));
			rvRow('用完所有状态异常恢复道具时，返回村庄', '若不勾选，仅于用完HP、SP恢复道具后返回。',
				() => self.returnVillage.onCureEmpty, v => (self.returnVillage.onCureEmpty = v));
			wrap.appendChild(rv);
		}

		return wrap;
	}

	// =================================================================
	// 挂机服务页（T8：离线挂机/积分/时长展示；旧面板退役后唯一入口）
	// =================================================================

	/** T8: 渲染挂机服务页内容（存进 pane[7]） */
	_renderServiceTab() {
		if (!this._settingsComp) return;
		const pane = this._settingsComp.getPane(7);
		if (!pane) return;
		pane.innerHTML = '';
		pane.appendChild(this._buildServiceTabContent());
	}

	/** T8: 就地刷新服务页时长/积分显示（每秒计时与积分回包时调用，不重建） */
	_updateServiceTab() {
		if (!this._settingsComp) return;
		const pane = this._settingsComp.getPane(7);
		if (!pane) return;
		const t = pane.querySelector('.servicetab-timer');
		if (t) t.textContent = this._formatTime(this.timerSec);
		const p = pane.querySelector('.servicetab-points');
		if (p) p.textContent = String(this.currentPoints);
	}

	/** T8: 构建挂机服务页（时长/积分/离线挂机按钮） */
	_buildServiceTabContent() {
		const self = this;
		const wrap = document.createElement('div');
		wrap.style.cssText = 'padding:2px 4px;display:flex;flex-direction:column;gap:3px;text-align:left;';

		const timerRow = document.createElement('div');
		timerRow.style.cssText = 'font-size:11px;color:#2e4058;';
		timerRow.innerHTML = '本次挂机时长：<span class="servicetab-timer">' + this._formatTime(this.timerSec) + '</span>';
		wrap.appendChild(timerRow);

		const pointsRow = document.createElement('div');
		pointsRow.style.cssText = 'font-size:11px;color:#2e4058;';
		pointsRow.innerHTML = '积分余额：<span class="servicetab-points">' + this.currentPoints + '</span>（每 60 秒自动刷新）';
		wrap.appendChild(pointsRow);

		const btnRow = document.createElement('div');
		btnRow.style.cssText = 'display:flex;gap:6px;margin-top:2px;';
		const btn = document.createElement('button');
		btn.className = 'servicetab-offline-btn';
		btn.textContent = '离线挂机';
		btn.style.cssText = 'flex:1;font-size:11px;padding:3px 0;border:1px solid #9db8d2;border-radius:3px;background:linear-gradient(to bottom,#ffffff,#d5e2ee);cursor:pointer;color:#1a3a5c;';
		btn.addEventListener('click', function () {
			self.startOffline();
		});
		btnRow.appendChild(btn);
		wrap.appendChild(btnRow);

		const info = document.createElement('div');
		info.style.cssText = 'border-top:1px dotted #b9c6d2;padding-top:3px;font-size:10px;color:#4a7ab5;line-height:1.4;';
		info.innerHTML =
			'离线挂机将踢下线，收益通过邮件发送（消耗积分）。<br/>' +
			'挂机启停请使用悬浮开关（左键）。';
		wrap.appendChild(info);

		return wrap;
	}

	// =================================================================
	// 捡拾循环（T6：类型预筛 → 拾取 → 背包校验 → 自动丢弃 → 黑名单防循环；负重暂停）
	// =================================================================

	/** T6: 启动时对 Inventory 挂一次 addItem 钩子（拾取结果关联：新物品到达即校验） */
	_hookInventoryAdd() {
		const inv = Inventory.getUI ? Inventory.getUI() : null;
		if (!inv || inv.__botLootHooked) return;
		inv.__botLootHooked = true;
		const self = this;
		const origAdd = inv.addItem;
		inv.addItem = function (item) {
			const r = origAdd.apply(this, arguments);
			self._onItemGained(item);
			return r;
		};
	}

	/**
	 * T6: 新物品进入背包回调（仅在有待校验拾取时处理）
	 * 校验不匹配 → 自动丢弃（ITEM_THROW）+ 黑名单该地面 GID（本会话不再拾取，防捡丢循环）
	 */
	_onItemGained(item) {
		const pending = this._lootPending;
		if (!pending) return;
		this._lootPending = null;
		if (!item) return;
		const verdict = validateLootedItem(item, this.loot);
		if (verdict.keep) return;
		this._lootBlacklist.add(pending.gid);
		try {
			const pkt = new PACKET.CZ.ITEM_THROW();
			pkt.Index = item.index;
			pkt.count = item.count;
			Network.sendPacket(pkt);
		} catch (_) {
			// 封包异常时已拉黑，不影响主流程
		}
	}

	/**
	 * T6: 捡拾循环（400ms，随挂机启停）
	 * 负重达阈值暂停；一次只处理一个待校验拾取（3s 超时拉黑防无限重试）
	 */
	_lootLoop() {
		if (!this.active || !this.loot || !this.loot.enabled) return;
		if (!Session.Entity || Session.Entity.isDead()) return;

		// 负重暂停：达阈值后不再发起新拾取（低于阈值自动恢复）
		const maxW = Session.max_weight;
		if (maxW > 0 && (Session.weight / maxW) * 100 >= this.loot.weightPausePct) return;

		// 待校验拾取超时（3s）→ 拉黑该地面物品防无限重试（可能被他人拾走/异常）
		if (this._lootPending) {
			if (Date.now() - this._lootPending.tick > 3000) {
				this._lootBlacklist.add(this._lootPending.gid);
				this._lootPending = null;
			}
			return; // 一次只处理一个
		}

		// 扫描视野内地面物品：类型匹配 + 未拉黑 + 未消失，取最近
		const src = Session.Entity;
		let best = null;
		let bestDistSq = Infinity;
		EntityManager.forEach(entity => {
			if (
				(entity.objecttype !== Entity.TYPE_ITEM && entity.objecttype !== Entity.TYPE_ITEM2) ||
				entity.remove_tick !== 0 ||
				this._lootBlacklist.has(entity.GID) ||
				!entity.ITID
			) return;
			const info = DB.getItemInfo(entity.ITID);
			if (!info || !matchLootType(info.Type, this.loot.types)) return;
			const dx = entity.position[0] - src.position[0];
			const dy = entity.position[1] - src.position[1];
			const distSq = dx * dx + dy * dy;
			if (distSq < bestDistSq) {
				bestDistSq = distSq;
				best = entity;
			}
		});
		if (!best) return;

		// 距离 > 2 格 → 移动向物品（节流防刷包）；≤2 格 → 发拾取封包并挂待校验
		const dx = best.position[0] - src.position[0];
		const dy = best.position[1] - src.position[1];
		if (dx * dx + dy * dy > 4) {
			if (this._isOnCooldown('loot_move')) return;
			this._markAction('loot_move', 600);
			let move;
			if (PACKETVER.value >= 20180307) {
				move = new PACKET.CZ.REQUEST_MOVE2();
			} else {
				move = new PACKET.CZ.REQUEST_MOVE();
			}
			move.dest[0] = best.position[0];
			move.dest[1] = best.position[1];
			Network.sendPacket(move);
			return;
		}

		let pkt;
		if (PACKETVER.value >= 20180307) {
			pkt = new PACKET.CZ.ITEM_PICKUP2();
		} else {
			pkt = new PACKET.CZ.ITEM_PICKUP();
		}
		pkt.ITAID = best.GID;
		Network.sendPacket(pkt);
		this._lootPending = { gid: best.GID, tick: Date.now() };
	}

	/** T6: 捡拾配置 → 就地同步捡拾设定页控件（本功能旧面板无对应控件） */
	_syncLootTab() {
		if (!this._settingsComp) return;
		const pane = this._settingsComp.getPane(4);
		if (!pane) return;
		if (!this.loot) return;
		const set = (sel, prop) => {
			const el = pane.querySelector(sel);
			if (!el) return;
			if (el.type === 'checkbox') {
				if (el.checked !== prop) el.checked = prop;
			} else if (+el.value !== prop) {
				el.value = String(prop);
			}
		};
		set('.loottab-enabled', this.loot.enabled);
		set('.loottab-type-consumable', this.loot.types.consumable);
		set('.loottab-type-weapon', this.loot.types.weapon);
		set('.loottab-type-armor', this.loot.types.armor);
		set('.loottab-type-etc', this.loot.types.etc);
		set('.loottab-refine-min', this.loot.refineMin);
		set('.loottab-card-min', this.loot.cardMin);
		set('.loottab-weight-pause', this.loot.weightPausePct);
	}

	/** 渲染捡拾设定页内容（存进 pane[4]） */
	_renderLootTab() {
		if (!this._settingsComp) return;
		const pane = this._settingsComp.getPane(4);
		if (!pane) return;
		if (pane.contains(document.activeElement)) return; // 输入进行中不重建
		pane.innerHTML = '';
		pane.appendChild(this._buildLootTabContent());
	}

	/** 构建捡拾设定页（总开关 + 类型勾选 + 精炼/卡片下限 + 负重暂停阈值 + 语义说明） */
	_buildLootTabContent() {
		const self = this;
		const cfg = this.loot;
		const wrap = document.createElement('div');
		wrap.style.cssText = 'padding:2px 4px;display:flex;flex-direction:column;gap:3px;text-align:left;';

		// —— 总开关 ——
		const enRow = document.createElement('label');
		enRow.style.cssText = 'display:flex;align-items:center;gap:5px;font-size:11px;font-weight:bold;color:#2e4058;cursor:pointer;';
		const enCb = document.createElement('input');
		enCb.type = 'checkbox';
		enCb.className = 'loottab-enabled';
		enCb.checked = !!cfg.enabled;
		enCb.addEventListener('change', function () {
			self.loot.enabled = enCb.checked;
			self._saveSettings();
		});
		enRow.appendChild(enCb);
		enRow.appendChild(document.createTextNode('自动拾取（挂机中拾取地面掉落物）'));
		wrap.appendChild(enRow);

		// —— 类型勾选 ——
		const typeHead = document.createElement('div');
		typeHead.style.cssText = 'border-top:1px dotted #b9c6d2;padding-top:3px;font-size:11px;color:#2e4058;';
		typeHead.textContent = '拾取类型：';
		wrap.appendChild(typeHead);

		const typeRow = document.createElement('div');
		typeRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:4px 10px;font-size:11px;color:#2e4058;';
		const typeDefs = [
			['consumable', 'loottab-type-consumable', '消耗品'],
			['weapon', 'loottab-type-weapon', '武器'],
			['armor', 'loottab-type-armor', '防具'],
			['etc', 'loottab-type-etc', '其他']
		];
		typeDefs.forEach(function (td) {
			const lab = document.createElement('label');
			lab.style.cssText = 'display:flex;align-items:center;gap:3px;cursor:pointer;';
			const cb = document.createElement('input');
			cb.type = 'checkbox';
			cb.className = td[1];
			cb.checked = !!cfg.types[td[0]];
			cb.addEventListener('change', function () {
				self.loot.types[td[0]] = cb.checked;
				self._saveSettings();
			});
			lab.appendChild(cb);
			lab.appendChild(document.createTextNode(td[2]));
			typeRow.appendChild(lab);
		});
		wrap.appendChild(typeRow);

		// —— 精炼/卡片下限（仅武器/防具校验） ——
		function numRow(labelText, cls, value, min, max) {
			const row = document.createElement('div');
			row.style.cssText = 'display:flex;align-items:center;gap:6px;font-size:11px;color:#2e4058;';
			row.appendChild(document.createTextNode(labelText));
			const input = document.createElement('input');
			input.type = 'number';
			input.className = cls;
			input.min = String(min);
			input.max = String(max);
			input.value = String(value);
			input.style.cssText = 'width:40px;height:14px;padding:0 1px;font-size:11px;border:1px solid #c7c7c7;border-radius:2px;background:#fff;';
			input.addEventListener('mousedown', e => e.stopPropagation());
			input.addEventListener('click', e => e.stopPropagation());
			input.addEventListener('keydown', function (e) {
				if (e.key.length === 1 && !/^[0-9]$/.test(e.key)) e.preventDefault();
			});
			input.addEventListener('change', function () {
				const v = Math.min(max, Math.max(min, Math.round(+input.value || min)));
				input.value = String(v);
				self._saveSettings();
			});
			row.appendChild(input);
			return { row: row, input: input };
		}

		const refine = numRow('精炼等级下限（0=不校验）：', 'loottab-refine-min', cfg.refineMin, 0, 10);
		refine.input.addEventListener('change', function () {
			self.loot.refineMin = Math.round(+refine.input.value) || 0;
			self._saveSettings();
		});
		wrap.appendChild(refine.row);

		const card = numRow('卡片数下限（0=不校验）：', 'loottab-card-min', cfg.cardMin, 0, 4);
		card.input.addEventListener('change', function () {
			self.loot.cardMin = Math.round(+card.input.value) || 0;
			self._saveSettings();
		});
		wrap.appendChild(card.row);

		const weight = numRow('负重暂停阈值（%）：', 'loottab-weight-pause', cfg.weightPausePct, 0, 100);
		weight.input.addEventListener('change', function () {
			self.loot.weightPausePct = Math.round(+weight.input.value) || 0;
			self._saveSettings();
		});
		wrap.appendChild(weight.row);

		// —— 语义说明 ——
		const info = document.createElement('div');
		info.style.cssText = 'border-top:1px dotted #b9c6d2;padding-top:3px;font-size:10px;color:#4a7ab5;line-height:1.4;';
		info.innerHTML =
			'拾取后按背包详情校验精炼/卡片（仅武器与防具），不匹配自动丢弃。<br/>' +
			'被丢弃的掉落物本会话内不再拾取（防捡丢循环）。<br/>' +
			'负重达到暂停阈值后暂停拾取，降回阈值下自动恢复。';
		wrap.appendChild(info);

		return wrap;
	}

	// =================================================================
	// 移动设定页（T5：无怪回落链/触发秒数/低血保命/返回挂机图开关）
	// =================================================================

	/** 渲染移动设定页内容（存进 pane[5]；flyNoMobs/flyLowHp 与旧面板双向同步） */
	_renderMoveTab() {
		if (!this._settingsComp) return;
		const pane = this._settingsComp.getPane(5);
		if (!pane) return;
		if (pane.contains(document.activeElement)) return; // 输入进行中不重建
		pane.innerHTML = '';
		pane.appendChild(this._buildMoveTabContent());
	}

	/** T5/T9: 技能是否就绪（指定 SKID 已学指定等级且当前 SP ≥ 对应等级消耗；缺省 AL_TELEPORT Lv1） */
	_isTeleportReady(skillId, skillLevel) {
		const id = typeof skillId === 'number' && skillId > 0 ? skillId : SK.AL_TELEPORT;
		const lv = Math.max(1, skillLevel || 1);
		try {
			const ui = SkillListUI.getUI();
			if (!ui || typeof ui.getList !== 'function') return false;
			const skills = ui.getList();
			if (!Array.isArray(skills)) return false;
			for (const s of skills) {
				if (s && s.SKID === id && s.level >= lv) {
					const cost = (SkillInfo[id] && SkillInfo[id].SpAmount[lv - 1]) || 10;
					const sp = Session.Entity && Session.Entity.life ? Session.Entity.life.sp : 0;
					return sp >= cost;
				}
			}
			return false;
		} catch (_) {
			return false; // 技能列表未就绪时视作不可用
		}
	}

	/** T9: 构建移动设定页（官方逐行复刻：瞬间移动/返回储存点两区块 + 扩展说明） */
	_buildMoveTabContent() {
		const self = this;
		const wrap = document.createElement('div');
		wrap.style.cssText = 'padding:2px 4px;display:flex;flex-direction:column;gap:4px;text-align:left;';

		wrap.appendChild(this._officialHeaderStrip('请设定移动道具', '可以设定瞬间移动与返回储存点方式。'));

		// 官方区块：使用☑[格子] 登录道具 / 使用☑[格子] 登录技能 两列
		function slotGroup(cfg, kind) {
			const col = document.createElement('div');
			col.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:2px;';
			const useRow = document.createElement('div');
			useRow.style.cssText = 'display:flex;align-items:flex-start;gap:4px;';
			const useCol = document.createElement('div');
			useCol.style.cssText = 'display:flex;flex-direction:column;align-items:center;font-size:10px;color:#3f8f3f;';
			useCol.appendChild(document.createTextNode('使用'));
			const cb = self._bmpCheckbox(cfg.enabled, v => {
				cfg.enabled = v;
				self._saveSettings();
			});
			useCol.appendChild(cb);
			useRow.appendChild(useCol);
			if (kind === 'item') {
				useRow.appendChild(self._officialItemSlot(cfg.id, anchor => {
					self._openMoveItemDropdown(cfg, anchor);
				}));
			} else {
				// 技能格：官方移动技能实际可用项 = AL_TELEPORT（Lv1 随机瞬移 / Lv2 返回储存点）
				const skCell = document.createElement('div');
				skCell.style.cssText =
					'box-sizing:border-box;width:34px;height:34px;border:1px solid #a8b3bd;border-radius:6px;background:#ffffff;' +
					'position:relative;display:flex;align-items:center;justify-content:center;cursor:pointer;user-select:none;';
				const info = SkillInfo[cfg.skill.id || SK.AL_TELEPORT];
				const img = document.createElement('img');
				img.width = 28;
				img.height = 28;
				img.draggable = false;
				img.style.cssText = 'position:relative;z-index:1;';
				if (info && info.Name) {
					Client.loadFile(DB.INTERFACE_PATH + 'item/' + info.Name + '.bmp', data => {
						img.src = data;
					});
				}
				skCell.appendChild(img);
				const lvBadge = document.createElement('div');
				lvBadge.textContent = 'Lv' + (cfg.skill.level || 1);
				lvBadge.style.cssText =
					'position:absolute;right:1px;bottom:0px;font-size:9px;font-weight:bold;color:#ffffff;' +
					'text-shadow:-1px 0 0 #000,1px 0 0 #000,0 -1px 0 #000,0 1px 0 #000;pointer-events:none;';
				skCell.appendChild(lvBadge);
				skCell.title = ((info && info.SkillName) || '瞬间移动') + ' Lv' + (cfg.skill.level || 1);
				skCell.addEventListener('click', e => {
					e.stopPropagation();
					self._openTeleportSkillDropdown(cfg, skCell);
				});
				useRow.appendChild(skCell);
			}
			col.appendChild(useRow);
			const cap = document.createElement('div');
			cap.style.cssText = 'font-size:11px;color:#2e4058;';
			cap.textContent = kind === 'item' ? '登录道具' : '登录技能';
			col.appendChild(cap);
			return col;
		}

		// —— 官方区块1：瞬间移动使用设定 ——
		const secTp = this._officialSection('瞬间移动使用设定');
		const tpRow = document.createElement('div');
		tpRow.style.cssText = 'display:flex;justify-content:center;gap:46px;padding:2px 0;';
		tpRow.appendChild(slotGroup(this.teleport, 'item'));
		tpRow.appendChild(slotGroup(this.teleport, 'skill'));
		secTp.content.appendChild(tpRow);
		wrap.appendChild(secTp.box);

		// —— 官方区块2：返回储存点使用设定 ——
		const secRt = this._officialSection('返回储存点使用设定');
		const rtRow = document.createElement('div');
		rtRow.style.cssText = 'display:flex;justify-content:center;gap:46px;padding:2px 0;';
		rtRow.appendChild(slotGroup(this.retreat, 'item'));
		rtRow.appendChild(slotGroup(this.retreat, 'skill'));
		secRt.content.appendChild(rtRow);
		const rtNote = document.createElement('div');
		rtNote.style.cssText = 'font-size:10px;color:#4a7ab5;text-align:center;line-height:1.5;padding-bottom:2px;';
		rtNote.innerHTML = '职业消耗品不足无法使用一般攻击，<br/>或超过捡拾设定输入的重量时，使用返回设定。';
		secRt.content.appendChild(rtNote);
		wrap.appendChild(secRt.box);

		// —— 扩展说明（自定义保留项：低血飞翅/返回挂机图在基本设定页；回落链顺序） ——
		const info = document.createElement('div');
		info.style.cssText = 'font-size:10px;color:#4a7ab5;line-height:1.4;border-top:1px dotted #b9c6d2;padding-top:3px;';
		info.innerHTML =
			'无怪动作回落链：登录技能 → 登录道具 → 随机步行（触发条件在基本设定页）。<br/>' +
			'低血保命飞翅、被传送后返回挂机地图等扩展设定在基本设定页底部。';
		wrap.appendChild(info);

		return wrap;
	}

	/** T9: 移动道具下拉（消耗品清单，首项清空；不限恢复类型） */
	_openMoveItemDropdown(cfg, anchorCell) {
		this._closeDropdown();
		const items = this._getAvailableConsumables();
		const dd = document.createElement('div');
		Object.assign(dd.style, {
			position: 'fixed',
			zIndex: '300',
			background: 'white',
			border: '1px solid #c1c6c2',
			borderRadius: '5px',
			padding: '11px',
			boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
			fontFamily: 'Gulim, Dotum, "Malgun Gothic", sans-serif',
			maxWidth: '240px',
			maxHeight: '260px',
			overflowY: 'auto'
		});
		const title = document.createElement('div');
		title.style.cssText = 'font-size:11px;font-weight:bold;color:#484848;margin-bottom:5px;padding-bottom:3px;border-bottom:1px solid #eee;';
		title.textContent = '选择移动道具';
		dd.appendChild(title);

		function row(label, onClick) {
			const el = document.createElement('div');
			el.style.cssText = 'font-size:11px;color:#333;padding:4px 6px;cursor:pointer;border-radius:2px;';
			el.textContent = label;
			el.addEventListener('mouseover', () => { el.style.background = '#e8f0f7'; });
			el.addEventListener('mouseout', () => { el.style.background = ''; });
			el.addEventListener('click', onClick);
			dd.appendChild(el);
		}

		row('（清空登记）', () => {
			cfg.item.id = 0;
			this._saveSettings();
			this._closeDropdown();
			this._renderMoveTab();
		});
		if (items.length === 0) {
			const empty = document.createElement('div');
			empty.style.cssText = 'font-size:11px;color:#999;padding:4px 6px;';
			empty.textContent = '背包中无可用消耗品';
			dd.appendChild(empty);
		} else {
			for (const it of items) {
				row(it.name + (it.count ? ' ×' + it.count : ''), () => {
					cfg.item.id = it.id;
					this._saveSettings();
					this._closeDropdown();
					this._renderMoveTab();
				});
			}
		}

		this._positionDropdown(dd, anchorCell);
		document.body.appendChild(dd);
		this._dropdown = dd;
		this._dropdownClickHandler = e => {
			if (!dd.contains(e.target) && !anchorCell.contains(e.target)) this._closeDropdown();
		};
		document.addEventListener('mousedown', this._dropdownClickHandler, true);
	}

	/** T9: 瞬移技能下拉（仅 AL_TELEPORT 已学等级可选；Lv1 随机 / Lv2 返回储存点） */
	_openTeleportSkillDropdown(cfg, anchorCell) {
		this._closeDropdown();
		let learned = 0;
		try {
			const ui = SkillListUI.getUI();
			const list = ui && typeof ui.getList === 'function' ? ui.getList() : [];
			for (const s of list) {
				if (s && s.SKID === SK.AL_TELEPORT && s.level > 0) learned = Math.max(learned, s.level);
			}
		} catch (_) {
			learned = 0;
		}
		const dd = document.createElement('div');
		Object.assign(dd.style, {
			position: 'fixed',
			zIndex: '300',
			background: 'white',
			border: '1px solid #c1c6c2',
			borderRadius: '5px',
			padding: '11px',
			boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
			fontFamily: 'Gulim, Dotum, "Malgun Gothic", sans-serif',
			minWidth: '160px'
		});
		const title = document.createElement('div');
		title.style.cssText = 'font-size:11px;font-weight:bold;color:#484848;margin-bottom:5px;padding-bottom:3px;border-bottom:1px solid #eee;';
		title.textContent = '选择移动技能';
		dd.appendChild(title);

		function row(label, onClick) {
			const el = document.createElement('div');
			el.style.cssText = 'font-size:11px;color:#333;padding:4px 6px;cursor:pointer;border-radius:2px;';
			el.textContent = label;
			el.addEventListener('mouseover', () => { el.style.background = '#e8f0f7'; });
			el.addEventListener('mouseout', () => { el.style.background = ''; });
			el.addEventListener('click', onClick);
			dd.appendChild(el);
		}

		row('（清空登记）', () => {
			cfg.skill.id = 0;
			this._saveSettings();
			this._closeDropdown();
			this._renderMoveTab();
		});
		if (learned >= 1) {
			row('瞬间移动 Lv1（随机传送）', () => {
				cfg.skill.id = SK.AL_TELEPORT;
				cfg.skill.level = 1;
				this._saveSettings();
				this._closeDropdown();
				this._renderMoveTab();
			});
		}
		if (learned >= 2) {
			row('瞬间移动 Lv2（返回储存点）', () => {
				cfg.skill.id = SK.AL_TELEPORT;
				cfg.skill.level = 2;
				this._saveSettings();
				this._closeDropdown();
				this._renderMoveTab();
			});
		}
		if (learned < 1) {
			const empty = document.createElement('div');
			empty.style.cssText = 'font-size:11px;color:#999;padding:4px 6px;';
			empty.textContent = '尚未学习瞬间移动技能';
			dd.appendChild(empty);
		}

		this._positionDropdown(dd, anchorCell);
		document.body.appendChild(dd);
		this._dropdown = dd;
		this._dropdownClickHandler = e => {
			if (!dd.contains(e.target) && !anchorCell.contains(e.target)) this._closeDropdown();
		};
		document.addEventListener('mousedown', this._dropdownClickHandler, true);
	}

	// =================================================================
	// 魔物设定页（T4：白名单勾选/全选清空/按图记忆）
	// =================================================================

	/** T4: 当前地图是否配置了非空白名单（true = 需要过滤） */
	_hasWhitelist(mapName) {
		const list = this.mobWhitelist[mapName];
		return Array.isArray(list) && list.length > 0;
	}

	/** T4: 魔物是否可攻击（委托纯函数 mobInWhitelist；名单空/未配置 = 可攻击） */
	_isMobTargetable(entity, mapName) {
		return mobInWhitelist(entity && entity.job, this.mobWhitelist, mapName);
	}

	/** T4: 视野内是否存在名单内活怪（无怪扫描用；"只剩名单外怪 = 无怪"） */
	_hasTargetableMob(mapName) {
		let found = false;
		EntityManager.forEach(entity => {
			if (
				entity.objecttype === Entity.TYPE_MOB &&
				entity.action !== entity.ACTION.DIE &&
				entity.remove_tick === 0 &&
				this._isMobTargetable(entity, mapName)
			) {
				found = true;
				return false; // break
			}
		});
		return found;
	}

	/** T4: 视野内最近的名单内活怪（欧氏最近；仅白名单非空时调用，空名单走原 getClosestEntity 路径） */
	_findClosestTargetableMob(mapName) {
		const src = Session.Entity;
		if (!src) return null;
		let closest = null;
		let closestDistSq = Infinity;
		EntityManager.forEach(entity => {
			if (
				entity.GID === src.GID ||
				entity.objecttype !== Entity.TYPE_MOB ||
				entity.action === entity.ACTION.DIE ||
				entity.remove_tick !== 0 ||
				!this._isMobTargetable(entity, mapName)
			) return;
			const dx = entity.position[0] - src.position[0];
			const dy = entity.position[1] - src.position[1];
			const distSq = dx * dx + dy * dy;
			if (distSq < closestDistSq) {
				closestDistSq = distSq;
				closest = entity;
			}
		});
		return closest;
	}

	/** T4: 累计本会话见过的魔物（按地图内存记录；魔物设定页清单数据源，不持久化） */
	_catalogMob(entity, mapName) {
		if (!entity || !entity.job || !mapName) return;
		const seen = this._seenMobs[mapName] || (this._seenMobs[mapName] = {});
		seen[entity.job] = (seen[entity.job] || 0) + 1;
	}



	/** 渲染魔物设定页内容（存进 pane[1]；清单 = 本会话见过的魔物，勾选按地图持久化） */
	_renderMobTab() {
		if (!this._settingsComp) return;
		const pane = this._settingsComp.getPane(1);
		if (!pane) return;
		if (pane.contains(document.activeElement)) return; // 勾选/拖动进行中不重建
		const currentMap = this._getCurrentMapName() || '';
		// 现场扫描合并（窗口开着但未挂机时也能看到当前视野的怪）
		EntityManager.forEach(entity => {
			if (entity.objecttype === Entity.TYPE_MOB && entity.action !== entity.ACTION.DIE && entity.remove_tick === 0) {
				this._catalogMob(entity, currentMap);
			}
		});
		pane.innerHTML = '';
		pane.appendChild(this._buildMobTabContent(currentMap));
	}

	/** 构建魔物设定页（T9 官方逐行复刻：请选择魔物标题条 + 所有魔物主开关 + 行盒清单） */
	_buildMobTabContent(currentMap) {
		const self = this;
		const wrap = document.createElement('div');
		wrap.style.cssText = 'padding:2px 4px;display:flex;flex-direction:column;gap:4px;text-align:left;';

		if (!currentMap) {
			const unknown = document.createElement('div');
			unknown.style.cssText = 'font-size:10px;color:#4a7ab5;';
			unknown.textContent = '无法识别当前地图，暂不能配置魔物名单。';
			wrap.appendChild(unknown);
			return wrap;
		}

		wrap.appendChild(this._officialHeaderStrip('请选择魔物'));

		// 清单 = 服务端刷怪表全量物种（构建期生成 map-mobs.json）∪ 本会话所见
		const seen = this._seenMobs[currentMap] || {};
		const spawnJobs = Array.isArray(MAP_MOBS[currentMap]) ? MAP_MOBS[currentMap] : [];
		const seenJobs = Object.keys(seen).map(Number).filter(j => j > 0);
		const jobs = [...new Set(spawnJobs.concat(seenJobs))].sort((a, b) =>
			DB.getMonsterName(a).localeCompare(DB.getMonsterName(b), 'zh')
		);
		const wl = this.mobWhitelist[currentMap] || [];

		// 官方行盒工厂：斜纹图标格（内嵌魔物待机动画）+ 粗体名 + 右侧勾选框
		function mobRow(name, checked, onToggle, job) {
			const row = document.createElement('div');
			row.style.cssText =
				'display:flex;align-items:center;gap:6px;border:1px solid #b9c9d8;border-radius:4px;background:#ffffff;padding:3px 6px 3px 3px;cursor:pointer;user-select:none;';
			row.addEventListener('click', function () {
				rowCb.setChecked(!rowCb.isChecked());
			});
			const icon = document.createElement('div');
			icon.style.cssText =
				'width:32px;height:32px;flex:0 0 auto;display:flex;align-items:center;justify-content:center;' +
				'border:1px solid #dfe7ee;border-radius:3px;overflow:hidden;' +
				'background:repeating-linear-gradient(45deg,#f6fafd 0px,#f6fafd 3px,#eef4f9 3px,#eef4f9 6px);';
			row.appendChild(icon);
			const nameEl = document.createElement('div');
			nameEl.style.cssText = 'flex:1;font-size:12px;font-weight:bold;color:#2e4058;text-align:center;';
			nameEl.textContent = name;
			row.appendChild(nameEl);
			let rowCb = self._bmpCheckbox(checked, onToggle);
			row.appendChild(rowCb);
			if (job) {
				self._mountMonsterPortrait(icon, job);
			}
			return { row: row, cb: rowCb };
		}

		// 官方首行「所有魔物」（勾选 = 白名单空 = 不过滤全打；白名单模型下不支持「全不打」，
		// 名单非空时该行显示未勾选，点击 = 清空名单回到全打）
		const allRow = mobRow(
			'所有魔物',
			!this._hasWhitelist(currentMap),
			v => {
				if (!v) return; // 空名单下不可取消（保持全打语义）
				delete self.mobWhitelist[currentMap];
				self._saveSettings();
				self._renderMobTab();
			}
		);
		wrap.appendChild(allRow.row);

		// —— 官方怪物行清单（勾选 = 只攻击勾选物种，按地图记忆；与官方交互一致） ——
		const listBox = document.createElement('div');
		listBox.style.cssText = 'display:flex;flex-direction:column;gap:3px;max-height:210px;overflow-y:auto;padding:1px;';

		if (jobs.length === 0) {
			const empty = document.createElement('div');
			empty.style.cssText = 'font-size:10px;color:#4a7ab5;padding:2px 0;';
			empty.textContent = '本地图无刷怪数据。';
			listBox.appendChild(empty);
		} else {
			jobs.forEach(function (job) {
				listBox.appendChild(
					mobRow(
						DB.getMonsterName(job),
						wl.indexOf(job) !== -1,
						v => {
							const arr = self.mobWhitelist[currentMap] || (self.mobWhitelist[currentMap] = []);
							const idx = arr.indexOf(job);
							if (v && idx === -1) arr.push(job);
							if (!v && idx !== -1) arr.splice(idx, 1);
							if (arr.length === 0) delete self.mobWhitelist[currentMap]; // 空名单不落盘
							self._saveSettings();
						},
						job
					).row
				);
			});
		}
		wrap.appendChild(listBox);

		// —— 语义说明（白名单模型与官方交互差异点，验收时需告知玩家） ——
		const info = document.createElement('div');
		info.style.cssText = 'font-size:10px;color:#4a7ab5;line-height:1.4;border-top:1px dotted #b9c6d2;padding-top:3px;';
		info.innerHTML =
			'勾选物种 = 只攻击勾选对象（按地图记忆）；「所有魔物」勾选 = 不限制全打。';
		wrap.appendChild(info);

		return wrap;
	}

	// =================================================================
	// 设置窗口技能页签（T2：4+4 槽 + 每槽延迟）
	// =================================================================

	/** 渲染技能页签内容（存进新窗口 pane[2]） */
	_renderSkillTab() {
		if (!this._settingsComp) return;
		const pane = this._settingsComp.getPane(2);
		if (!pane) return;
		pane.innerHTML = '';
		pane.appendChild(this._buildSkillTabContent());
	}

	/** 设置窗口初始化按钮回调（官方窗口 footer 左下：按当前页签重置；T9 四页签 + 技能页签） */
	_handleSettingsReset(tabIndex) {
		if (tabIndex === 2) {
			this._resetSkillTab();
			return;
		}
		if (tabIndex === 0) {
			// 基本设定：官方行为清单回默认（SP 规则关/无怪秒 10/怪数 20/MVP 开）+ 扩展区回默认
			this.spNormalAttack = { enabled: false, threshold: 10 };
			this.spStopAttackMove = { enabled: false, threshold: 5 };
			this.flyNoMobs = true;
			this.noMobSeconds = 10;
			this.flyOnMobCount = { enabled: false, count: 20 };
			this.flyOnMvp = true;
			this.flyLowHp = false;
			this.returnToMap = true;
			this._saveSettings();
			this._renderBasicTab();
			return;
		}
		if (tabIndex === 1) {
			// 魔物设定：清空当前地图名单（回「所有魔物」全打态）
			const mapName = this._getCurrentMapName();
			if (mapName) delete this.mobWhitelist[mapName];
			this._saveSettings();
			this._renderMobTab();
			return;
		}
		if (tabIndex === 3) {
			// 药水设定：四槽清空回默认阈值、解除药清空、回村关
			this.potions = {
				hp: [
					{ id: 0, threshold: 70, enabled: true },
					{ id: 0, threshold: 70, enabled: true }
				],
				sp: [
					{ id: 0, threshold: 30, enabled: true },
					{ id: 0, threshold: 30, enabled: true }
				]
			};
			this.cure = { enabled: true, poison: 0, panacea: 0 };
			this.returnVillage = { enabled: false, onPotionsEmpty: false, onCureEmpty: false };
			this._saveSettings();
			this._renderPotionTab();
			return;
		}
		if (tabIndex === 5) {
			// 移动设定：瞬移/返回四槽回默认（苍蝇翅肢+瞬间移动1 / 蝴蝶翅肢+瞬间移动2）
			this.teleport = { item: { enabled: true, id: ITEM_FLY_WING }, skill: { enabled: true, id: 28, level: 1 } };
			this.retreat = { item: { enabled: true, id: ITEM_BUTTERFLY_WING }, skill: { enabled: true, id: 28, level: 2 } };
			this._saveSettings();
			this._renderMoveTab();
			return;
		}
	}

	/** 初始化技能页签：清空 8 槽技能与每槽延迟，双端刷新（新页签 + 旧面板过渡期同步） */
	_resetSkillTab() {
		for (let i = 0; i < TOTAL_SLOT_COUNT; i++) {
			this.skillList[i] = null;
			this.slotDelays[i] = 0;
		}
		this._saveSettings();
		this._renderSkillTab();
		this._refreshPanel();
	}

	/** 构建 4+4 技能槽编辑器（严格对齐官方：提示 12/11px、标题条 24px 浅蓝渐变、格子 34×34 等距分布） */
	_buildSkillTabContent() {
		const self = this;
		const wrap = document.createElement('div');
		wrap.style.cssText = 'padding:0 4px;display:flex;flex-direction:column;gap:2px;text-align:left;';

		// 官方文案与字号（对照 docs/assets/official-auto-battle/1d95a0f6 逐像素测量）
		const hint = document.createElement('div');
		hint.style.cssText = 'font-size:12px;font-weight:bold;color:#2e4058;text-align:center;';
		hint.textContent = '请设定攻击/辅助技能。';
		wrap.appendChild(hint);

		const hintSub = document.createElement('div');
		hintSub.style.cssText = 'font-size:11px;color:#4a7ab5;text-align:center;border-bottom:1px dotted #b9c6d2;padding-bottom:3px;';
		hintSub.textContent = '每个设定的延迟时间将左到右顺序使用。';
		wrap.appendChild(hintSub);

		const groups = [
			{ label: '攻击技能设定', offset: 0 },
			{ label: '辅助技能设定', offset: 4 }
		];

		groups.forEach(function (g) {
			// 官方区块标题条：24px 高浅蓝渐变圆角条（独立条，无外包围盒）
			const label = document.createElement('div');
			label.style.cssText = 'height:24px;line-height:22px;background:linear-gradient(to bottom,#e3f5ff,#fdffff);border:1px solid #b9c9d8;border-radius:4px;font-size:12px;font-weight:bold;color:#2e4058;text-align:center;';
			label.textContent = g.label;
			wrap.appendChild(label);

			// 官方格子行：4 格 34×34 等距分布（1fr），条下留白约 16px
			const cells = document.createElement('div');
			cells.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);justify-items:center;padding:4px 6px 2px;';
			for (let gi = 0; gi < 4; gi++) {
				cells.appendChild(self._buildSkillSlotCell(g.offset + gi));
			}
			wrap.appendChild(cells);
		});

		// T2: 普通攻击开关（官方技能页底部勾选框位置；法系职业建议关闭）
		const naRow = document.createElement('div');
		naRow.style.cssText = 'display:flex;flex-direction:column;gap:1px;border-top:1px dotted #b9c6d2;padding-top:3px;';
		const naLine = document.createElement('label');
		naLine.style.cssText = 'display:flex;align-items:center;gap:5px;font-size:11px;font-weight:bold;line-height:1.2;color:#2e4058;cursor:pointer;';
		const naCb = document.createElement('input');
		naCb.type = 'checkbox';
		naCb.checked = self.normalAttack !== false;
		naCb.addEventListener('change', function () {
			self.normalAttack = naCb.checked;
			self._saveSettings();
		});
		naLine.appendChild(naCb);
		naLine.appendChild(document.createTextNode('普通攻击'));
		const naHint = document.createElement('div');
		naHint.style.cssText = 'font-size:10px;color:#4a7ab5;padding-left:18px;line-height:1.2;';
		naHint.textContent = '无技能可用时不接近魔物普攻（法系职业建议关闭）';
		naRow.appendChild(naLine);
		naRow.appendChild(naHint);
		wrap.appendChild(naRow);

		return wrap;
	}

	/** 单个技能槽编辑单元（严格对齐官方：34×34 格 + 22px 图标 + 右下角等级数字 + 28px 延迟秒输入） */
	_buildSkillSlotCell(flatIdx) {
		const self = this;
		const skill = this.skillList[flatIdx];
		const delayMs = this.slotDelays[flatIdx] || 0;

		const unit = document.createElement('div');
		unit.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:2px;';

		const cell = document.createElement('div');
		cell.className = 'skilltab-cell';
		// 官方格子：双层边框圆角（外框 #a8b3bd + 白圈 + 内线 #dce8f2），34×34（含边框，border-box）
		cell.style.cssText =
			'box-sizing:border-box;border:1px solid #a8b3bd;border-radius:7px;background:linear-gradient(to bottom,#fdfeff,#f6fafd);padding:0;width:34px;height:34px;' +
			'cursor:pointer;display:flex;align-items:center;justify-content:center;user-select:none;position:relative;' +
			'box-shadow:inset 0 0 0 2px #ffffff, inset 0 0 0 3px #dce8f2;';

		if (skill && skill.id) {
			const info = SkillInfo[skill.id];
			const available = this._getAvailableSkills().find(x => x.id === skill.id);
			cell.title = ((available && available.name) || (info && info.SkillName) || ('技能 ' + skill.id)) +
				' Lv ' + (skill.level || 1);
			// 官方格子显示技能图标（kRO 惯例：图标存于 user interface 的 item/ 目录，SkillList 同款）；
			// 图标 28×28 尽量充满格子内部（玩家反馈 22 偏小）
			const img = document.createElement('img');
			img.width = 28;
			img.height = 28;
			img.draggable = false;
			img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
			if (info && info.Name) {
				Client.loadFile(DB.INTERFACE_PATH + 'item/' + info.Name + '.bmp', function (data) {
					img.src = data;
				});
			} else {
				img.alt = '?';
				img.style.cssText = 'font-size:12px;color:#8aa0b4;display:flex;align-items:center;justify-content:center;';
			}
			cell.appendChild(img);

			// 官方：可选等级 > 1 时在图标右下角显示白色描边等级数字，无可选等级则不显示
			// （可选上限 = 已学等级，与下拉选择器同一数据源；单级技能不显示）
			const selectMax = (available && available.level) || 1;
			if (selectMax > 1) {
				const lvlBadge = document.createElement('div');
				lvlBadge.textContent = String(skill.level || 1);
				lvlBadge.style.cssText =
					'position:absolute;right:2px;bottom:0px;font-size:10px;font-weight:bold;line-height:1;color:#ffffff;' +
					'text-shadow:-1px 0 0 #000,1px 0 0 #000,0 -1px 0 #000,0 1px 0 #000;pointer-events:none;';
				cell.appendChild(lvlBadge);
			}
		} else {
			cell.title = '点击设置技能';
			// 官方空格占位：中央白色粗圆角十字 + 蓝灰径向光晕（对照官方截图，非纯字符占位）
			const glow = document.createElement('div');
			glow.style.cssText = 'position:absolute;left:50%;top:50%;width:26px;height:26px;margin:-13px 0 0 -13px;border-radius:50%;background:radial-gradient(circle, rgba(176,190,206,0.5) 0%, rgba(216,230,243,0.28) 55%, rgba(255,255,255,0) 75%);pointer-events:none;';
			const plusH = document.createElement('div');
			plusH.style.cssText = 'position:absolute;left:50%;top:50%;width:15px;height:5px;margin:-2.5px 0 0 -7.5px;border-radius:2.5px;background:#ffffff;box-shadow:0 0 1px 1px rgba(150,168,190,0.55);pointer-events:none;';
			const plusV = document.createElement('div');
			plusV.style.cssText = 'position:absolute;left:50%;top:50%;width:5px;height:15px;margin:-7.5px 0 0 -2.5px;border-radius:2.5px;background:#ffffff;box-shadow:0 0 1px 1px rgba(150,168,190,0.55);pointer-events:none;';
			cell.appendChild(glow);
			cell.appendChild(plusH);
			cell.appendChild(plusV);
		}

		// 延迟输入行：格子下方独立一行（官方 28×12px 居中），UI 秒 → 存储毫秒换算
		const delayRow = document.createElement('div');
		delayRow.style.cssText = 'display:flex;align-items:center;gap:2px;font-size:11px;color:#2e4058;';
		const input = document.createElement('input');
		input.type = 'number';
		input.min = '0';
		input.step = '1';
		input.value = String(delayMs / 1000);
		input.style.cssText = 'width:30px;height:14px;padding:0 1px;font-size:11px;border:1px solid #c7c7c7;border-radius:2px;background:#fff;';
		input.addEventListener('mousedown', e => e.stopPropagation());
		input.addEventListener('click', e => e.stopPropagation());
		// 只允许数字输入：禁小数点/符号/字母等非数字字符（保持 type=number 整数秒语义）
		input.addEventListener('keydown', function (e) {
			if (e.key.length === 1 && !/^[0-9]$/.test(e.key)) e.preventDefault();
		});
		input.addEventListener('change', function () {
			const v = Math.max(0, Math.round((+input.value || 0) * 1000));
			self.slotDelays[flatIdx] = v;
			self._saveSettings();
		});
		delayRow.appendChild(input);
		delayRow.appendChild(document.createTextNode('秒'));

		unit.appendChild(cell);
		unit.appendChild(delayRow);

		cell.addEventListener('click', function () {
			// T2: 技能页签按组过滤（前 4 格攻击组，后 4 格辅助组）
			self._openDropdown('skill', flatIdx, cell, flatIdx < 4 ? 'attack' : 'support');
		});

		return unit;
	}

	/** 面板内开始/停止按钮 — 同一按钮的两个状态切换 */
	toggleAutoHunt() {
		if (this.active) {
			this.stopAutoHunt();
		} else {
			this.startAutoHunt();
		}
	}

	startAutoHunt() {
		// T1 fix: 未进游戏（登录/选角界面）禁止启动，避免乐观置位后无反馈的假死
		if (!Session.Entity || !Session.Entity.GID) {
			this._showError('请进入游戏后再开启自动战斗');
			return;
		}
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
		this._lootTick = setInterval(() => this._lootLoop(), 400); // T6: 捡拾循环
		this._hookInventoryAdd(); // T6: 拾取结果校验钩子（开设置窗口之外也要生效）
	}

	stopLoops() {
		if (this.combatTick) clearInterval(this.combatTick);
		if (this.potionTick) clearInterval(this.potionTick);
		if (this.buffTick) clearInterval(this.buffTick);
		if (this._timerTick) clearInterval(this._timerTick);
		if (this._lootTick) clearInterval(this._lootTick);
		this.combatTick = null;
		this.potionTick = null;
		this.buffTick = null;
		this._timerTick = null;
		this._lootTick = null;
	}

	// #13 fix: 独立自动药水 — 已退役（T9 官方模型：药水随挂机循环启停）
	_startAutoPotion() {}

	_stopAutoPotion() {
		if (this._autoPotionTick) clearInterval(this._autoPotionTick);
		this._autoPotionTick = null;
	}

	/** 计时器循环：累计挂机时长，每 60s 请求积分更新 */
	_timerLoop() {
		this.timerSec++;
		this._refreshTimer();
		this._updateServiceTab(); // T8: 服务页时长/积分就地刷新
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
			this._updateFloatBtnState();
			this._showError('角色已死亡，挂机已停止');
			return;
		}

		// 1.5. 返回挂机地图 — 不在挂机图上时，寻找传送门回去（T5: 可开关，关闭则就地继续）
		if (this.returnToMap && this._huntMapName && currentMap !== this._huntMapName) {
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

		// T9: 是否在挂机图（官方触发器/回落链均仅挂机图生效）
		const onHuntMap = !this.returnToMap || !this._huntMapName || currentMap === this._huntMapName;

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
						!target.isDead() &&
						this._isMobTargetable(target, currentMap) // T4: 名单外目标不选
					) {
						EntityManager.setFocusEntity(target);
					}
				}
			}
			// 不同地图: 原地等待，不停止挂机
		}

		// 3. 飞翅检查 + 巡逻 (#3 fix: 5秒无怪才飞翅，否则随机走动)
		// 使用 Date.now() 而非 Renderer.tick，后台 tab rAF 冻结时仍能工作
		// T9 官方触发器（画面怪数/MVP 登场瞬移）在同一次扫描中判定
		{
			let hasMob = false;
			let mobCount = 0;
			let mvpSeen = false;
			EntityManager.forEach(entity => {
				if (
					entity.objecttype === Entity.TYPE_MOB &&
					entity.action !== entity.ACTION.DIE &&
					entity.remove_tick === 0
				) {
					hasMob = true;
					mobCount++;
					if (!mvpSeen && MVP_JOBS.indexOf(entity.job) !== -1) mvpSeen = true;
					this._catalogMob(entity, currentMap); // T4: 累计本会话见过的魔物（魔物设定页清单）
				}
			});
			// T4: 白名单非空时，名单外魔物不计入 hasMob（"只剩名单外怪 = 无怪"语义）
			if (hasMob && this._hasWhitelist(currentMap)) {
				hasMob = this._hasTargetableMob(currentMap);
			}

			// T9 官方基本设定页触发器：画面内魔物超过 X 只 / MVP 首领登场 → 瞬移（仅挂机图）
			if (onHuntMap && !this._isOnCooldown('fly_trigger') &&
				((this.flyOnMobCount.enabled && mobCount >= this.flyOnMobCount.count) ||
				 (this.flyOnMvp && mvpSeen))) {
				this._markAction('fly_trigger', 5000);
				this._executeTeleport();
				return;
			}

			if (hasMob) {
				this._lastMobSeenTick = Date.now();
			} else {
				// 无怪状态
				const noMobMs = Date.now() - this._lastMobSeenTick;
				// T5/T9: 无怪超过设定秒数 → 回落链：登录技能(已学且SP足) → 登录道具 → 随机步行
				if (this.flyNoMobs && noMobMs > this.noMobSeconds * 1000) {
					const tp = this.teleport;
					const action = decideNoMobAction({
						flyNoMobs: this.flyNoMobs,
						teleportReady: tp.skill.enabled && tp.skill.id > 0 && this._isTeleportReady(tp.skill.id, tp.skill.level)
					});
					if (action === 'teleport') {
						SkillTargetSelection.onUseSkillToId(tp.skill.id, tp.skill.level || 1, Session.Entity.GID);
						this._lastMobSeenTick = Date.now(); // 重置计时
						return;
					}
					if (action === 'flywing') {
						if (!(tp.item.enabled && tp.item.id > 0 && this._useItemById(tp.item.id))) {
							this._useItemById(ITEM_FLY_WING); // 未登录道具时兜底苍蝇翅膀
						}
						this._lastMobSeenTick = Date.now(); // 重置计时
						return;
					}
					// walk → 落到下方巡逻分支
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

		// T9 官方 SP 经济规则（基本设定页）：规则1 命中 → 仅普通攻击；规则2 命中 → 停止攻击转移动
		const _life = Session.Entity.life;
		const spPct = _life && _life.sp_max > 0 ? (_life.sp / _life.sp_max) * 100 : 100;
		const spRule = decideSpEconomy(spPct, {
			normalAttack: this.spNormalAttack,
			stopAttackMove: this.spStopAttackMove
		});
		if (spRule === 'stop-and-move') {
			// 停止攻击后自动移动（同无怪巡逻：行走中等待；停下后每 1.5s 一步）
			EntityManager.setFocusEntity(null);
			if (Session.Entity.action === Session.Entity.ACTION.WALK) return;
			if (Date.now() < this._castingUntil) return;
			if (Date.now() - this._lastPatrolMoveTick > 1500) {
				this._lastPatrolMoveTick = Date.now();
				const ptarget = this._findPatrolTarget();
				if (ptarget) {
					const ppkt = new PACKET.CZ.REQUEST_MOVE2();
					ppkt.dest[0] = ptarget[0];
					ppkt.dest[1] = ptarget[1];
					Network.sendPacket(ppkt);
				}
			}
			return;
		}

		// 4. 获取当前目标，无目标则寻找最近怪物（T4: 白名单非空时只锁名单内魔物）
		let target = EntityManager.getFocusEntity();
		if (!target || target.isDead() || target.objecttype !== Entity.TYPE_MOB || !this._isMobTargetable(target, currentMap)) {
			if (this._hasWhitelist(currentMap)) {
				target = this._findClosestTargetableMob(currentMap);
			} else {
				target = EntityManager.getClosestEntity(Session.Entity, Entity.TYPE_MOB);
			}
			if (!target) return; // 地图无怪（或只剩名单外怪，走巡逻/飞翅分支）
			EntityManager.setFocusEntity(target);
		}

		// 5. amotion 冷却检查（使用 Date.now() 而非 Renderer.tick，后台兼容）
		// amotionTick 由游戏引擎设置 = Renderer.tick + amotion（Renderer.tick 在前台等于 Date.now()）
		if (Session.Entity.amotionTick > Date.now()) return;

		// 6. 遍历技能列表 — 攻击型 / 治疗型(对不死系怪物当攻击用，D2 #13)
		// T2: 每槽延迟（skillDelays[idx] ms，0=仅 amotion 引擎限速）
		// T9: SP 规则1（仅一般攻击，优先度高）命中时跳过技能循环（官方语义：需技能页「普通攻击」开启）
		if (spRule !== 'normal-attack-only') {
			const nowTs = Date.now();
			for (let idx = 0; idx < this.skillList.length; idx++) {
				const skill = this.skillList[idx];
				if (!skill || !skill.id) continue;
				if (skill.type === SKILL_TYPE_ATTACK || skill.type === SKILL_TYPE_HEAL) {
					// SP 不足 → 跳过此技能（防止技能失败后每 tick 重试刷屏）
					if (skill.spcost && Session.Entity.life && Session.Entity.life.sp < skill.spcost) continue;
					// 每槽延迟：未到期则跳过该槽，尝试下一槽
					if (!slotReady(nowTs, this._slotLastCast[idx] || 0, this.slotDelays[idx] || 0)) continue;
					SkillTargetSelection.onUseSkillToId(skill.id, skill.level || 1, target.GID);
					this._slotLastCast[idx] = nowTs;
					return; // 释放一个技能后等下一 tick
				}
			}
		}

		// 7. 无技能可用（或 SP 规则1命中）→ 普通攻击 (PACKET.CZ.REQUEST_ACT2 action=7)
		// T2: 「普通攻击」开关关闭时跳过（法系职业避免接近魔物近身普攻）
		if (this.normalAttack === false) return;
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
		// T5: 返回开关关闭时不存在返回逻辑，视为始终在挂机图
		const currentMap = this._getCurrentMapName();
		const onHuntMap = !this.returnToMap || !this._huntMapName || currentMap === this._huntMapName;

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

		// 1-3. T9 官方药水四槽决策（纯函数：低血飞翅阈值 + 槽位自左向右命中）
		const need = evaluateThresholds(hpPct, spPct, {
			flyLowHp: this.flyLowHp
		});

		// 1. 低血飞翅 (D2 #12): HP<10% → 移动页「返回储存点」注册（道具→技能→兔底）
		// 仅在挂机地图上使用（错误地图上飞翅会干扰返回逻辑）
		if (onHuntMap && need.lowHpFlyWing) {
			if (!this._isOnCooldown('retreat_lowhp')) {
				this._executeRetreat('retreat_lowhp');
				this._markAction('retreat_lowhp', 2000);
			}
			return;
		}

		// 2. T9 官方四槽：HP/SP 未满阈值 → 使用命中槽道具（同类型自左向右；500ms 冷却防刷）
		const hit = evaluatePotionSlots(this.potions, hpPct, spPct);
		if (hit.hpSlot > -1) {
			const slot = this.potions.hp[hit.hpSlot];
			const key = 'item_' + slot.id;
			if (!this._isOnCooldown(key) && this._useItemById(slot.id)) {
				this._markAction(key, 500);
			}
			// 治疗技能(对自己释放，1s 冷却，另受所在槽延迟约束；服务器私有扩展，官方药水页无此概念)
			for (let idx = 0; idx < this.skillList.length; idx++) {
				const skill = this.skillList[idx];
				if (!skill || skill.type !== SKILL_TYPE_HEAL) continue;
				if (skill.spcost && sp < skill.spcost) continue;
				if (!slotReady(Date.now(), this._slotLastCast[idx] || 0, this.slotDelays[idx] || 0)) continue;
				const key = 'skill_' + skill.id;
				if (this._isOnCooldown(key)) continue;
				SkillTargetSelection.onUseSkillToId(skill.id, skill.level || 1, Session.Entity.GID);
				this._markAction(key, 1000);
				this._slotLastCast[idx] = Date.now();
				break;
			}
		}
		if (hit.spSlot > -1) {
			const slot = this.potions.sp[hit.spSlot];
			const key = 'item_' + slot.id;
			if (!this._isOnCooldown(key) && this._useItemById(slot.id)) {
				this._markAction(key, 500);
			}
		}
		// 4. T7/T9: 异常状态自动解除（官方 ON/OFF 开关门控；解毒药优先，其次万能药；1 秒冷却防刷）
		const channels = {
			efstMap: this._buffMap,
			bodyState: Session.Entity.bodyState || 0,
			healthState: Session.Entity.healthState || 0
		};
		if (this.cure.enabled) {
			if (this.cure.poison && !this._isOnCooldown('cure_poison') &&
				isCureStatusActive(CURE_WATCH_LISTS.poison, channels)) {
				this._markAction('cure_poison', 1000);
				this._useItemById(this.cure.poison);
				return;
			}
			if (this.cure.panacea && !this._isOnCooldown('cure_panacea') &&
				isCureStatusActive(CURE_WATCH_LISTS.panacea, channels)) {
				this._markAction('cure_panacea', 1000);
				this._useItemById(this.cure.panacea);
				return;
			}
		}
		// 5. T9: 返回村庄设定（官方药水页分页2）——登记的药水/解除药全部用完 → 使用返回设定回村
		if (onHuntMap && this.returnVillage.enabled && !this._isOnCooldown('return_village')) {
			const potionsExhausted = this.returnVillage.onPotionsEmpty && this._allSlotsExhausted(
				[].concat(this.potions.hp, this.potions.sp)
			);
			const cureExhausted = this.returnVillage.onCureEmpty && this._allSlotsExhausted([
				{ id: this.cure.poison },
				{ id: this.cure.panacea }
			]);
			if (potionsExhausted || cureExhausted) {
				this._markAction('return_village', 10000); // 触发后 10s 冷却防刷
				this._executeRetreat('return_village');
				this._showToast && this._showToast('登记的药水已用完，正在返回村庄');
				return;
			}
		}
	}

	/**
	 * T9: 槽位集合是否「全部用完」——至少登记一槽且所有已登记槽对应道具背包数量均为 0
	 * @param {Array<{id: number}>} slots
	 */
	_allSlotsExhausted(slots) {
		const registered = (slots || []).filter(s => s && s.id);
		if (!registered.length) return false; // 未登记任何槽 = 不触发
		return registered.every(s => this._getItemCount(s.id) <= 0);
	}

	/** T9: 背包内指定道具数量（无背包/无道具返回 0） */
	_getItemCount(id) {
		try {
			const it = Inventory.getUI().getItemById(id);
			return it && it.count ? it.count : 0;
		} catch (_) {
			return 0;
		}
	}

	/**
	 * T9: 执行「返回储存点」——移动页返回设定：登录道具 → 登录技能（瞬间移动 Lv2）
	 * 兜底蝴蝶翅膀；返回是否成功
	 */
	_executeRetreat(cooldownKey) {
		const rt = this.retreat;
		if (rt.item.enabled && rt.item.id && this._useItemById(rt.item.id)) return true;
		if (rt.skill.enabled && rt.skill.id && this._isTeleportReady(rt.skill.id, rt.skill.level)) {
			SkillTargetSelection.onUseSkillToId(rt.skill.id, rt.skill.level || 1, Session.Entity.GID);
			return true;
		}
		return this._useItemById(ITEM_BUTTERFLY_WING); // 兜底（未配置时保持旧行为）
	}

	/**
	 * T9: 执行「瞬间移动」——移动页瞬移设定：登录技能（已学且SP足）→ 登录道具 → 兜底苍蝇翅膀
	 * 返回是否成功
	 */
	_executeTeleport() {
		const tp = this.teleport;
		if (tp.skill.enabled && tp.skill.id && this._isTeleportReady(tp.skill.id, tp.skill.level)) {
			SkillTargetSelection.onUseSkillToId(tp.skill.id, tp.skill.level || 1, Session.Entity.GID);
			return true;
		}
		if (tp.item.enabled && tp.item.id && this._useItemById(tp.item.id)) return true;
		return this._useItemById(ITEM_FLY_WING); // 兜底（未配置时保持旧行为）
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

		for (let idx = 0; idx < this.skillList.length; idx++) {
			const skill = this.skillList[idx];
			if (!skill) continue;
			if (skill.type !== SKILL_TYPE_BUFF) continue;
			const efst = _getPrimaryEfst('skills', skill.id);
			if (!efst) continue;
			if (this._buffMap[efst]) continue;
			const currentSp = Session.Entity.life ? Session.Entity.life.sp : 0;
			if (skill.spcost && currentSp < skill.spcost) continue;
			const key = 'buff_' + efst;
			if (this._isOnCooldown(key)) continue;
			// T2: 每槽延迟（与 efst 冷却取较大值）
			const slotDelay = this.slotDelays[idx] || 0;
			if (!slotReady(Date.now(), this._slotLastCast[idx] || 0, slotDelay)) continue;
			// buff 已消失 → 释放技能（对自己）
			// 直接发包绕过 onUseSkill 的 amotion 检查（Skill.js:630 在战斗中几乎总是 return）
			const buffPkt = new PACKET.CZ.USE_SKILL2();
			buffPkt.SKID = skill.id;
			buffPkt.selectedLevel = skill.level || 1;
			buffPkt.targetID = Session.Entity.GID;
			Network.sendPacket(buffPkt);
			this._markAction(key, Math.max(8000, slotDelay)); // 8s: 5s 施法 + 3s 网络/注册缓冲
			this._slotLastCast[idx] = Date.now();
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



	_setButtonsDisabled(disabled) {
		// T8: 挂机启停由悬浮开关承担，无需禁用按钮（保留空实现兼容 _onStatus 调用点）
	}

	_setOfflineButtonDisabled(disabled) {
		// T8: 离线挂机按钮在挂机服务页（pane[7]）
		const pane = this._settingsComp && this._settingsComp.getPane ? this._settingsComp.getPane(7) : null;
		if (!pane) return;
		const btn = pane.querySelector('.servicetab-offline-btn');
		if (btn) btn.disabled = disabled;
	}

	_refreshTimer() {
		// T8: 时长显示在挂机服务页（_updateServiceTab 就地刷新）
		this._updateServiceTab();
	}

	_updatePoints(points) {
		this.currentPoints = points;
		this._updateServiceTab(); // T8: 服务页积分就地刷新
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
		let s = null;
		try {
			const raw = localStorage.getItem(this._getStorageKey());
			if (raw) s = JSON.parse(raw);
		} catch (_) {
			s = null; // 损坏 JSON → 回退默认值，不崩溃
		}

		if (s && typeof s === 'object') {
			const skills = Array.isArray(s.skills) ? s.skills : [];
			const aux = Array.isArray(s.aux) ? s.aux : [];

			// WR-03/WR-04 fix: 分类迁移（依赖游戏数据 HEAL_SKILL_IDS/efst-map，
			// 必须在结构迁移前完成——schema.js 是零游戏依赖纯模块）
			let migrated = false;
			for (const skill of skills) {
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
			for (const a of aux) {
				if (a && a.type === AUX_TYPE_POTION && !a.subtype) {
					a.subtype = _getPotionRestoreType(a.id) || 'hp';
					migrated = true;
				}
				// Bug 3 fix: POTION → BUFF_ITEM 迁移
				if (a && a.type === AUX_TYPE_POTION && _isBuff('items', a.id)) {
					a.type = AUX_TYPE_BUFF_ITEM;
					migrated = true;
				}
			}

			// T2: schema v2 结构迁移（纯函数：重排 4+4 + 每槽延迟 + 版本号）
			// T8 修复：字段透传改为全量（历史 bug——硬编码旧字段清单导致 T2 后新增字段
			// （normalAttack/mobWhitelist/noMobSeconds/returnToMap/loot/cureItems）加载即被
			// 重置为默认值，白名单/捡拾配置等在任何一次保存后丢失。skills/aux 因需先行
			// 分类迁移，以处理后数组覆盖透传值。）
			const s2 = migrateSettings(Object.assign({}, s, {
				skills: skills,
				aux: aux
			}));
			this._applySettings(s2);
			if (migrated || s.v !== SCHEMA_VERSION) this._saveSettings();
			return;
		}

		this._applySettings(migrateSettings(null));
	}

	/** 应用规范化后的 v3 设置对象（T9 官方模型字段） */
	_applySettings(s2) {
		this.skillList = s2.skills;
		this.auxList = s2.aux; // 仅 BUFF 道具（potion 类型已分流至 potions）
		this.slotDelays = s2.slotDelays;
		this.followEnabled = s2.follow;
		this.followTarget = s2.followTarget;
		this.flyNoMobs = s2.flyNoMobs;
		this.flyLowHp = s2.flyLowHp;
		this.normalAttack = s2.normalAttack !== false;
		this.mobWhitelist = s2.mobWhitelist;
		this.noMobSeconds = s2.noMobSeconds;
		this.returnToMap = s2.returnToMap;
		this.loot = s2.loot;
		this.potions = s2.potions;
		this.cure = s2.cure;
		this.returnVillage = s2.returnVillage;
		this.teleport = s2.teleport;
		this.retreat = s2.retreat;
		this.spNormalAttack = s2.spNormalAttack;
		this.spStopAttackMove = s2.spStopAttackMove;
		this.flyOnMobCount = s2.flyOnMobCount;
		this.flyOnMvp = s2.flyOnMvp;
	}

	_saveSettings() {
		localStorage.setItem(
			this._getStorageKey(),
			JSON.stringify({
				v: SCHEMA_VERSION,
				skills: this.skillList,
				aux: this.auxList,
				slotDelays: this.slotDelays,
				follow: this.followEnabled,
				followTarget: this.followTarget,
				flyNoMobs: this.flyNoMobs,
				flyLowHp: this.flyLowHp,
				normalAttack: this.normalAttack !== false,
				mobWhitelist: this.mobWhitelist,
				noMobSeconds: this.noMobSeconds,
				returnToMap: this.returnToMap !== false,
				loot: this.loot,
				potions: this.potions,
				cure: this.cure,
				returnVillage: this.returnVillage,
				teleport: this.teleport,
				retreat: this.retreat,
				spNormalAttack: this.spNormalAttack,
				spStopAttackMove: this.spStopAttackMove,
				flyOnMobCount: this.flyOnMobCount,
				flyOnMvp: this.flyOnMvp
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
					this._updateFloatBtnState();
					this._showError('挂机启动失败');
				}
				break;
			case 1:
				if (pkt.status !== 0) {
					// 服务端拒绝 → 回退
					this.active = true;
					this.startLoops();
					this._updateFloatBtnState();
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
