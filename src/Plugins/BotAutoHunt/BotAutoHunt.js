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
import { migrateSettings, SCHEMA_VERSION, TOTAL_SLOT_COUNT } from './settings/schema.js'; // 壳层仅用迁移与常量；决策纯函数已随引擎内迁（engine/HuntEngine.js）
import HuntEngine, {
	SKILL_TYPE_ATTACK, SKILL_TYPE_HEAL, SKILL_TYPE_BUFF,
	AUX_TYPE_POTION, AUX_TYPE_BUFF_ITEM,
	ITEM_FLY_WING, ITEM_BUTTERFLY_WING,
	HEAL_SKILL_IDS, isBuff as _isBuff, getPotionRestoreType as _getPotionRestoreType
} from './engine/HuntEngine.js'; // 候选 A：挂机引擎（四循环/目标/巡逻/冷却），游戏操作经绑定注入
import MAP_MOBS from './data/map-mobs.json'; // T4: 魔物设定页清单数据源（UI 用；引擎内 MVP 名单另引）
import Sprite from 'Loaders/Sprite.js'; // T9: 魔物头像程序化渲染（官方魔物设定页行首图标）
import Action from 'Loaders/Action.js'; // T9: 同上（ACT 动画帧索引）
import MapRenderer from 'Renderer/MapRenderer.js'; // currentMap — 当前地图名（Bug 2 fix: 替代不存在的 Session.Entity.mapname）
import Cursor from 'UI/CursorManager.js'; // T9.2: body 级下拉行的游戏内光标手型（ItemInfo 同款接线）
import SkillListUI from 'UI/Components/SkillList/SkillList.js'; // getUI().getList() 技能下拉数据源（R4-问题6；2026-11-09 恢复——引擎抽取时误删 import，ReferenceError 被 catch 吞成空清单，玩家报「无法选择技能」）
import Altitude from 'Renderer/Map/Altitude.js'; // getCellType + TYPE.WALKABLE — 巡逻可行走验证
import PathFinding from 'Utils/PathFinding.js'; // search() — 巡逻路径验证
import SkillInfo from 'DB/Skills/SkillInfo.js'; // 技能名解析（SkillName/SpAmount 字段；sed 边界误删后回补）
import SK from 'DB/Skills/SkillConst.js'; // AL_TELEPORT 瞬移技能常量（同上回补）


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

/** #12 fix: 城镇地图列表 — 城镇内禁止自动挂机 */
const TOWN_MAPS = new Set([
	'prontera', 'geffen', 'morocc', 'alberta', 'aldebaran', 'payon',
	'izlude', 'lutie', 'comodo', 'umbala', 'amatsu', 'gonryun',
	'ayothaya', 'einbroch', 'einbech', 'lighthalzen', 'hugel',
	'rachel', 'veins', 'brasilis', 'dewata', 'malangdo', 'malaya',
	'moscovia', 'paramk', 'splendide', 'manuk', 'prontera_guild'
]);

/** T9.4: 全界面统一数字输入框样式（验收：左右 2px 内边距 + text-align right，
 *  所有页签的数字/时间输入共用；宽高由调用点按上下文附加） */
const NUM_INPUT_CSS =
	'box-sizing:border-box;height:15px;padding:0 2px;text-align:right;font-size:11px;' +
	'border:1px solid #c7c7c7;border-radius:2px;background:#fff;color:#2e4058;margin:0;';

/** 技能触发类型（开发时预分类，D-03c） */
// BotAutoHunt 主类
// =====================================================================

class BotAutoHunt {
	constructor() {
		// ---------- 挂机状态 ----------
		// active/timerSec 由引擎持有（见下方 getters）；壳层只保留 UI 需要的积分
		this.currentPoints = 0;

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

		// ---------- 药水循环（T9: 随挂机循环启停，官方无独立总开关） ----------
		this.auxList = []; // 道具页 BUFF 道具 8 槽（加载后被 _applySettings 覆盖）
		this.auxDelays = [0, 0, 0, 0, 0, 0, 0, 0]; // 道具页每格延迟秒数（T9.1）

		// ---------- 防重复启停 ----------
		this._lastCmdTime = 0;
		this._cmdCooldownMs = 2000; // 2 秒冷却（拦截连点器/手抖）
		this._pendingCmd = null; // 正在等待回包的指令编号
		this._pendingCmdTime = 0; // pending 锁设置时间（HI-02 fix: 超时恢复）
		this._pendingCmdTimeoutMs = 10000; // 10 秒超时（防丢包永久锁死）

		// ---------- 面板 DOM ----------
		this._dropdown = null; // 当前 dropdown DOM 元素
		this._dropdownClickHandler = null; // dropdown 外部点击关闭处理器（引用以便清理）

		// ---------- 挂机引擎（候选 A：四循环/目标选择/巡逻撤退/冷却全在引擎内） ----------
		// 游戏操作绑定 = 生产 adapter；测试假件见 tests/bot-engine.test.js
		this._createEngine();

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
				this.engine.setBuff(pkt.index, pkt.state);
			}
		});

		// ---------- 后台 tab 恢复 ----------
		// Renderer.tick 由 rAF 驱动，后台 tab 时冻结。setInterval 虽被限流但仍在运行。
		// 当 tab 重新可见时，用 Date.now() 重置巡逻计时器避免误触飞翅。
		document.addEventListener('visibilitychange', () => {
			if (!document.hidden) this.engine.onTabVisible();
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
		this.loot = null; // T6: 捡拾配置（_applySettings 赋值；循环定时器在引擎内）
		// T9: 官方模型字段（默认值；加载后被 _applySettings 覆盖）
		this.cure = { enabled: true, poison: 0, panacea: 0 }; // 状态异常恢复（药水页分页2）
		this.returnVillage = { onPotionsEmpty: false, onCureEmpty: false, onBuffEmpty: true }; // 返回村庄设定（官方无总开关；BUFF 用尽项默认勾选）
		this.teleport = { item: { enabled: true, id: ITEM_FLY_WING }, skill: { enabled: true, id: SK.AL_TELEPORT, level: 1 } }; // 瞬间移动使用设定
		this.retreat = { item: { enabled: true, id: ITEM_BUTTERFLY_WING }, skill: { enabled: true, id: SK.AL_TELEPORT, level: 2 } }; // 返回储存点使用设定（AL_TELEPORT Lv2=回存储点；T9 初版误写 28=AL_HEAL 已修）
		this.spNormalAttack = { enabled: false, threshold: 10 }; // SP经济规则1：仅一般攻击（优先度高）
		this.spStopAttackMove = { enabled: false, threshold: 5 }; // SP经济规则2：停止攻击后自动移动
		this.flyOnMobCount = { enabled: false, count: 20 }; // 画面内魔物超过 X 只时瞬移
		this.flyOnMvp = true; // MVP 首领魔物登场时瞬移（官方默认勾选）
		this._potionPage = 0; // 药水页当前分页（0=页1 四槽，1=页2 解除/回村）
		this._mobPortraits = []; // 魔物头像动画注册表（[{canvas, frames, delay, idx}]）
		this._mobPortraitTimer = null; // 头像动画共享定时器

		// ---------- 加载设置（必须在全部字段默认值就位之后——_applySettings 逐字段覆盖默认值） ----------
		// 构造时 GID 可能为 0（key 固定串），进游戏/过图/开窗会按需重载
		this._loadSettings();

		this._createFloatingButton();
		this._startFloatLifecyclePoll();

		// ---------- 暴露桥接 ----------
		// BasicInfoV4 按钮通过 window.botAutoHunt.toggle() 调用
		window.botAutoHunt = this;
	}

	/** 引擎运行标志（原 this.active 字段；启动/停止只经 engine.start/stop） */
	get active() {
		return this.engine ? this.engine.active : false;
	}

	/** 累计挂机秒数（引擎持有；挂机服务页显示） */
	get timerSec() {
		return this.engine ? this.engine.timerSec : 0;
	}

	/**
	 * 创建挂机引擎 + 生产环境游戏操作绑定（候选 A：引擎零游戏全局依赖，
	 * 本方法就是引擎文件头所定义 bindings 协议的唯一权威生产实现）。
	 * 注：moveTo/pickupItem 不再分支 PACKETVER——本项目 PACKETVER 全局锁定 20191223
	 * （≥20180307，AGENTS.md 禁改），MOVE2/PICKUP2 分支恒为唯一路径。
	 */
	_createEngine() {
		const plugin = this;
		this.engine = new HuntEngine({
			// —— 查询 ——
			self() {
				const e = Session.Entity;
				if (!e) return null;
				const life = e.life || null;
				return {
					gid: e.GID,
					name: (e.display && e.display.name) || '',
					dead: e.isDead(),
					position: e.position,
					// T9.3: 上游 PR #607 已知「action=WALK 但 walk.total=0」的卡死态（walkTo 搜索失败
				// 时不重置 action，EntityWalk.js 留有 STUCK IN WALKING 告警观测）。路由为空不视为
				// 行走中——引擎得以重新发移动指令（服务器回包重建路径）自恢复，否则所有分支
				// 永远等待、角色冻结
				walking: e.action === e.ACTION.WALK && !!(e.walk && e.walk.total > 0),
				walking: (() => {
					const walkStuck = e.action === e.ACTION.WALK && !(e.walk && e.walk.total > 0);
					if (walkStuck) {
						// T9.3 运行时诊断：卡死态出现时给玩家一次性提示（60s 抑制重复）
						if (!plugin._walkStuckNotifiedAt || Date.now() - plugin._walkStuckNotifiedAt > 60000) {
							plugin._walkStuckNotifiedAt = Date.now();
							plugin._showToast('检测到移动状态异常，已自动纠偏（如反复出现请截图反馈）');
						}
					}
					return e.action === e.ACTION.WALK && !walkStuck;
				})(),
					amotionBusy: e.amotionTick > Date.now(),
					life: life ? { hp: life.hp, hpMax: life.hp_max, sp: life.sp, spMax: life.sp_max } : null,
					weightPct: Session.max_weight > 0 ? (Session.weight / Session.max_weight) * 100 : null,
					bodyState: e.bodyState || 0,
					healthState: e.healthState || 0
				};
			},
			mapState() {
				return { name: MapRenderer.currentMap || '', loading: MapRenderer.loading };
			},
			entityTypes: { mob: Entity.TYPE_MOB, item: Entity.TYPE_ITEM, item2: Entity.TYPE_ITEM2 },
			forEachEntity: cb => EntityManager.forEach(cb),
			getEntity: gid => EntityManager.get(gid),
			focusEntity: () => EntityManager.getFocusEntity(),
			setFocusEntity: e => EntityManager.setFocusEntity(e),
			closestMob: () => EntityManager.getClosestEntity(Session.Entity, Entity.TYPE_MOB),
			skillReady: (id, lv) => plugin._isTeleportReady(id, lv),
			itemCount: id => plugin._getItemCount(id),
			itemType: id => {
				const info = DB.getItemInfo(id);
				return info ? info.Type : null;
			},
			isWalkable: (x, y) => !!(Altitude.getCellType(x, y) & Altitude.TYPE.WALKABLE),
			pathSearch: (cx, cy, tx, ty, range, out) => PathFinding.search(cx, cy, tx, ty, range, out),
			pathSearchLong: (cx, cy, tx, ty, range, out) => PathFinding.searchLong(cx, cy, tx, ty, range, out),
			// —— 动作 ——
			useItem: id => plugin._useItemById(id),
			castSkill: (id, lv, gid) => SkillTargetSelection.onUseSkillToId(id, lv, gid),
			castSkillDirect(id, lv, gid) {
				// buff 施法：USE_SKILL2 裸包，绕过 onUseSkill 的 amotion 检查
				const p = new PACKET.CZ.USE_SKILL2();
				p.SKID = id;
				p.selectedLevel = lv;
				p.targetID = gid;
				Network.sendPacket(p);
			},
			moveTo(x, y) {
				const p = new PACKET.CZ.REQUEST_MOVE2();
				p.dest[0] = x;
				p.dest[1] = y;
				Network.sendPacket(p);
			},
			attack(gid) {
				// action=7 普通攻击（原 REQUEST_ACT2 构造）
				const p = new PACKET.CZ.REQUEST_ACT2();
				p.action = 7;
				p.targetGID = gid;
				Network.sendPacket(p);
			},
			pickupItem(gid) {
				const p = new PACKET.CZ.ITEM_PICKUP2();
				p.ITAID = gid;
				Network.sendPacket(p);
			},
			throwItem(index, count) {
				const p = new PACKET.CZ.ITEM_THROW();
				p.Index = index;
				p.count = count;
				Network.sendPacket(p);
			},
			chat: msg => plugin._sendChat(msg)
		}, {
			onDeath: () => {
				plugin._updateFloatBtnState();
				plugin._showError('角色已死亡，挂机已停止');
			},
			onSecond: sec => {
				// 原计时器循环的 UI 副作用：服务页刷新 + 每 60s 查积分
				plugin._updateServiceTab();
				if (sec % 60 === 0) plugin.sendCommand(4);
			},
			onMobSeen: (job, mapName) => plugin._catalogMob({ job }, mapName),
			onError: msg => plugin._showError(msg),
			onInfo: msg => plugin._showInfo(msg),
			onToast: msg => plugin._showToast(msg)
		});
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
				if (bot) bot.engine.setBuff(index, state);
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
			// 下拉关闭时光标还原（防 hover 中关闭残留手型；下一次游戏 mousemove 会重新按悬停对象刷新）
			try { Cursor.setType(Cursor.ACTION.DEFAULT); } catch (_) { /* 光标模块未就绪时忽略 */ }
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
		this._shieldDropdown(dd); // T9.2: 光标手型（点击拦截已由 _bindDropdownEvents 覆盖，重复无害）
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
			this._renderItemTab();
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
			this._renderItemTab();
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
		// T9.3.2: 轮询体提取为方法，测试可直接调用 _floatLifecycleTick()
		this._floatPoll = setInterval(() => this._floatLifecycleTick(), 500);
	}

	/**
	 * 悬浮开关生命周期单次轮询（由 _startFloatLifecyclePoll 每 500ms 调度）。
	 *
	 * T9.3.2 修复：过图误停机。
	 * 现场证据（2026-11-10 玩家复现日志）：踩传送门落地 prt_fild07 后 1s 内被发送
	 * CZ_BOT_COMMAND cmd1 + '@autoloot 0'，引擎停止 → 过图返回逻辑从未执行，
	 * 角色在新地图永久站立。根因：地图加载期（Renderer.stop + EntityManager 清空）
	 * playerInWorld/z0Canvas 必然为 false，冷缓存加载 2~8s 远超 2 次防抖（1s），
	 * 旧逻辑把「过图加载中」误判成「退出游戏」直接停止挂机。
	 * 修复：停止挂机只发生在真正回登录/选角界面时（DOM 标记判定），
	 * 实体/画布信号仅承担按钮可见性；MapRenderer.loading 期间双保险不停止。
	 * 另修正：#WinLoginV2 选择器从未匹配过任何元素（WinLoginV2.html 根节点 id 是 WinLogin）。
	 */
	_floatLifecycleTick() {
		// ① playerInWorld：玩家实体已加入 EntityManager（选角/黑屏早段/过图加载期为 false）
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
		// 登录/选角界面 DOM 标记（真实根节点 id，实测确定）：
		// 登录 WinLogin（旧选择器 #WinLoginV2 不存在于 DOM）；选角按 packetver 命名
		// charselect(V1) / CharSelectV2 / CharSelectV3(本项目 20191223) / CharSelectV4
		const winLoginEl = !!document.querySelector('#WinLogin, #WinLoginV2');
		const charSelectEl = !!document.querySelector('#charselect, #CharSelectV2, #CharSelectV3, #CharSelectV4');
		const inGame = playerInWorld && z0Canvas && !winLoginEl && !charSelectEl;
		// 调试探针（长期保留：显示时序问题可用 _lastSignal 取分量时间线）
		this._lastSignal = {
			inGame: inGame,
			gid: hasEntity ? Session.Entity.GID : 0,
			playerInWorld: playerInWorld,
			z0Canvas: z0Canvas,
			winLogin: winLoginEl,
			charSelect: charSelectEl,
			mapLoading: !!MapRenderer.loading
		};
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
			// 停止挂机仅限真正离开游戏世界（回登录/选角界面）；过图加载期
			// （MapRenderer.loading 或 DOM 无登录/选角标记）绝不停止——T9.3.2 主修复
			const leftWorld = winLoginEl || charSelectEl;
			if (this.active && leftWorld && !MapRenderer.loading) {
				this.stopAutoHunt();
			}
			if (this._settingsComp && leftWorld) {
				this._settingsComp.remove();
			}
		}
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

	/** 错误提示（红色）：旧面板已退役，统一走悬浮开关旁 toast（任何场景可见；2026-11-09 恢复——引擎抽取时随旧面板误删，14 处调用点悬空） */
	_showError(msg) {
		this._showToast(msg);
	}

	/** 信息提示（灰色）：同上 */
	_showInfo(msg) {
		this._showToast(msg);
	}

	/**
	 * T9.2: 下拉点击防穿透 + 游戏内光标手型（全部 body 级下拉统一走本方法）
	 * - MapControl 在 window 级绑 mousedown/mouseup（jQuery .map 命名空间），下拉内点击
	 *   冒泡到 window 会触发点击移动/地面交互——在 dd 层拦截全部鼠标事件冒泡
	 * - 游戏 UI 光标为引擎绘制贴图（CursorManager），CSS cursor 在游戏内无效；
	 *   hover 下拉行时切 CLICK（手型），离开/关闭时还原（ItemInfo 同款接线）
	 */
	_shieldDropdown(dd) {
		['mousedown', 'mouseup', 'click', 'dblclick', 'contextmenu', 'wheel', 'mousemove'].forEach(evt =>
			dd.addEventListener(evt, e => e.stopPropagation(), false)
		);
		dd.addEventListener('mouseover', () => Cursor.setType(Cursor.ACTION.CLICK));
		dd.addEventListener('mouseout', e => {
			if (!dd.contains(e.relatedTarget)) Cursor.setType(Cursor.ACTION.DEFAULT);
		});
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
		this._renderItemTab();
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
			// T9.2: 用真实 button——GUIComponent 游戏内光标白名单（_setupShadowCursorEvents）
			// 只认 button/input 等元素，div 的 CSS cursor 在游戏内无效（悬停手型验收项）
			const switchBox = document.createElement('button');
			switchBox.type = 'button';
			switchBox.style.cssText =
				'padding:0;position:absolute;right:4px;top:4px;display:flex;border:1px solid #9db8d2;border-radius:2px;overflow:hidden;line-height:1;cursor:pointer;background:#ffffff;font-family:inherit;';
			const onBtn = document.createElement('span');
			const offBtn = document.createElement('span');
			onBtn.textContent = 'ON';
			offBtn.textContent = 'OFF';
			let switchOn = true; // 当前态闭包跟踪（点击即翻转移除重绘；初始值由 setOn 校正）
			const paint = on => {
				switchOn = !!on;
				onBtn.style.cssText =
					'font-size:9px;font-weight:bold;padding:2px 4px;' +
					(on ? 'background:#2e5fa3;color:#ffffff;' : 'background:#ffffff;color:#a8b3bd;');
				offBtn.style.cssText =
					'font-size:9px;font-weight:bold;padding:2px 4px;border-left:1px solid #c7d6e3;' +
					(!on ? 'background:#dce8f2;color:#5a7a9c;' : 'background:#ffffff;color:#a8b3bd;');
			};
			switchBox.addEventListener('click', e => {
				e.stopPropagation();
				const next = !switchOn;
				paint(next); // 先重绘再回调：UI 状态不依赖 onToggle 是否写数据
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
		paintPos(); // 初始绘制：构造即按当前值铺底（修复：默认百分比已设但进度条空置 0）

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
		// T9.2: 真实 button——游戏内光标白名单命中（悬停手型）；点击登记下拉（药水/移动/道具页共用）
		const cell = document.createElement('button');
		cell.type = 'button';
		cell.style.cssText =
			'box-sizing:border-box;width:34px;height:34px;border:1px solid #a8b3bd;border-radius:6px;background:#ffffff;' +
			'padding:0;position:relative;display:flex;align-items:center;justify-content:center;cursor:pointer;user-select:none;overflow:hidden;font-family:inherit;';
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
			input.style.cssText = NUM_INPUT_CSS + 'width:34px;margin:0 3px;'; // T9.4 统一样式;
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
			const t = _getPotionRestoreType(it.id) || 'hp'; // 模块级函数（2026-11-09 修复：误写 this. 致点击药水格抛 TypeError、下拉无法打开——玩家验收反馈根因）
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

		this._shieldDropdown(dd); // T9.2: 防穿透 + 光标手型
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

		this._shieldDropdown(dd); // T9.2: 防穿透 + 光标手型
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
	// 道具设定页（T9.1：官方公告 PDF 第 7 页——请设定BUFF类道具 2×4 八格+每格延迟秒数+返回村庄）
	// =================================================================

	/** T9.1: 渲染道具设定页内容（存进 pane[6]） */
	_renderItemTab() {
		if (!this._settingsComp) return;
		const pane = this._settingsComp.getPane(6);
		if (!pane) return;
		pane.innerHTML = '';
		pane.appendChild(this._buildItemTabContent());
	}

	/** T9.1: 构建道具设定页（官方：标题条 + 浅蓝容器 2×4 格（BUFF 道具+延迟输入）+ 返回村庄勾选） */
	_buildItemTabContent() {
		const self = this;
		const wrap = document.createElement('div');
		wrap.style.cssText = 'padding:2px 4px;display:flex;flex-direction:column;gap:5px;text-align:left;';

		wrap.appendChild(this._officialHeaderStrip('请设定BUFF类道具。', '每设定的延迟时间时，使用登录于栏位的BUFF道具。'));

		// 官方浅蓝容器：2 行 × 4 列，每格 = 道具格 + 延迟输入（T9.4：UI 单位分，存储层仍为秒）
		const box = document.createElement('div');
		box.style.cssText = 'background:#eaf2fb;border:1px solid #c7d6e3;border-radius:6px;padding:10px 8px;display:flex;justify-content:center;';
		const grid = document.createElement('div');
		grid.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);gap:8px 10px;';

		for (let i = 0; i < 8; i++) {
			const cell = document.createElement('div');
			cell.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:2px;';
			const slot = (this.auxList && this.auxList[i]) || null;
			const input = document.createElement('input');
			input.type = 'number';
			input.min = '0';
			input.max = '1440'; // 分钟上限（= 86400 秒存储上限）
			const savedSec = (this.auxDelays && this.auxDelays[i]) || 0;
			input.value = String(Math.round(savedSec / 60)); // 显示分钟
			input.dataset.auxIndex = String(i);
			input.style.cssText = NUM_INPUT_CSS + 'width:30px;'; // T9.4 统一样式（同技能页）
			input.addEventListener('mousedown', e => e.stopPropagation());
			input.addEventListener('change', () => {
				const minutes = Math.max(0, Math.min(1440, Math.round(+input.value || 0)));
				input.value = String(minutes);
				while (self.auxList.length < 8) self.auxList.push(null); // 旧档兜底
				self.auxDelays[i] = minutes * 60; // 存储层仍为秒（schema/引擎不变）
				self._saveSettings();
			});
			cell.appendChild(this._officialItemSlot(slot ? slot.id : 0, () => {
				self._openBuffItemDropdown(i, cell.firstChild);
			}));
			const delayRow = document.createElement('div');
			delayRow.style.cssText = 'display:flex;align-items:center;gap:1px;';
			delayRow.appendChild(input);
			delayRow.appendChild(document.createTextNode('分'));
			cell.appendChild(delayRow);
			grid.appendChild(cell);
		}
		box.appendChild(grid);
		wrap.appendChild(box);

		// 官方道具页「返回村庄设定」：BUFF 道具全部用完时自动回村（官方截图默认勾选）
		const rv = document.createElement('div');
		rv.style.cssText = 'background:#f2f5f8;border:1px solid #dfe7ee;border-radius:4px;padding:6px 8px;display:flex;flex-direction:column;gap:2px;';
		const r1 = document.createElement('div');
		r1.style.cssText = 'display:flex;align-items:center;font-size:11px;font-weight:bold;color:#2e4058;';
		r1.appendChild(this._bmpCheckbox(this.returnVillage.onBuffEmpty !== false, v => {
			self.returnVillage.onBuffEmpty = v;
			self._saveSettings();
		}));
		r1.appendChild(document.createTextNode('返回村庄设定'));
		rv.appendChild(r1);
		const n1 = document.createElement('div');
		n1.style.cssText = 'font-size:10px;color:#4a7ab5;padding-left:18px;';
		n1.textContent = '所有装备的BUFF类道具用完时，自动返回村庄。';
		rv.appendChild(n1);
		wrap.appendChild(rv);

		return wrap;
	}

	/**
	 * T9.1: BUFF 道具专用下拉（数据源 = 背包消耗品 ∩ EFST 分类 buff；首项清空）
	 * @param {number} index 槽下标 0-7
	 * @param {HTMLElement} anchorCell 定位锚点
	 */
	_openBuffItemDropdown(index, anchorCell) {
		this._closeDropdown();
		const items = this._getAvailableConsumables().filter(it => _isBuff('items', it.id));
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
		title.textContent = '选择 BUFF 道具';
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
			while (this.auxList.length < 8) this.auxList.push(null);
			this.auxList[index] = null;
			this._saveSettings();
			this._closeDropdown();
			this._renderItemTab();
		});
		if (items.length === 0) {
			const empty = document.createElement('div');
			empty.style.cssText = 'font-size:11px;color:#999;padding:4px 6px;';
			empty.textContent = '背包中无可用 BUFF 道具';
			dd.appendChild(empty);
		} else {
			for (const it of items) {
				row(it.name + (it.count ? ' ×' + it.count : ''), () => {
					while (this.auxList.length < 8) this.auxList.push(null);
					this.auxList[index] = { id: it.id, type: 'buff_item' };
					this._saveSettings();
					this._closeDropdown();
					this._renderItemTab();
				});
			}
		}

		this._shieldDropdown(dd); // T9.2: 防穿透 + 光标手型
		this._positionDropdown(dd, anchorCell);
		document.body.appendChild(dd);
		this._dropdown = dd;
		this._dropdownClickHandler = e => {
			if (!dd.contains(e.target) && !anchorCell.contains(e.target)) this._closeDropdown();
		};
		document.addEventListener('mousedown', this._dropdownClickHandler, true);
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
			self.engine.onItemGained(item);
			return r;
		};
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
			input.style.cssText = NUM_INPUT_CSS + 'width:40px;'; // T9.4 统一样式;
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

		this._shieldDropdown(dd); // T9.2: 防穿透 + 光标手型
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

		this._shieldDropdown(dd); // T9.2: 防穿透 + 光标手型
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
		listBox.style.cssText = 'display:flex;flex-direction:column;gap:3px;padding:1px;'; // 官方单滚动：清单不设内层滚动，整面板随窗格滚动（验收反馈双滚动条修复）

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
			// 药水设定：四槽清空回默认阈值（官方页1 HP/SP 均 70%）、解除药清空、回村两项关（BUFF 用尽项属道具页不动）
			this.potions = {
				hp: [
					{ id: 0, threshold: 70, enabled: true },
					{ id: 0, threshold: 70, enabled: true }
				],
				sp: [
					{ id: 0, threshold: 70, enabled: true },
					{ id: 0, threshold: 70, enabled: true }
				]
			};
			this.cure = { enabled: true, poison: 0, panacea: 0 };
			this.returnVillage = { onPotionsEmpty: false, onCureEmpty: false, onBuffEmpty: this.returnVillage.onBuffEmpty !== false };
			this._saveSettings();
			this._renderPotionTab();
			return;
		}
		if (tabIndex === 6) {
			// 道具设定：BUFF 道具 8 槽清空 + 每格延迟归零 + 回村勾选回官方默认（勾选）
			this.auxList = [null, null, null, null, null, null, null, null];
			this.auxDelays = [0, 0, 0, 0, 0, 0, 0, 0];
			this.returnVillage.onBuffEmpty = true;
			this._saveSettings();
			this._renderItemTab();
			return;
		}
		if (tabIndex === 5) {
			// 移动设定：瞬移/返回四槽回默认（苍蝇翅膀+瞬间移动lv1 / 蝴蝶翅膀+瞬间移动lv2）
			this.teleport = { item: { enabled: true, id: ITEM_FLY_WING }, skill: { enabled: true, id: SK.AL_TELEPORT, level: 1 } };
			this.retreat = { item: { enabled: true, id: ITEM_BUTTERFLY_WING }, skill: { enabled: true, id: SK.AL_TELEPORT, level: 2 } };
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

		const cell = document.createElement('button');
		cell.type = 'button';
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
		input.style.cssText = NUM_INPUT_CSS + 'width:30px;'; // T9.4 统一样式;
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
		// 乐观更新：立即启动引擎循环（huntMap=本次记录，用于过图返回），不等回包
		this.engine.start({ huntMap: mapName || '' });
		this._hookInventoryAdd(); // T6: 拾取结果校验钩子（开设置窗口之外也要生效）
		// 自动开启 @autoloot — 聊天封包格式必须是 "角色名 : 消息"
		this._sendChat('@autoloot');
	}

	stopAutoHunt() {
		// cmd 1: autohunt_stop
		if (!this.sendCommand(1)) return;
		this.engine.stop();
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
			this.engine.stop();
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

	/** 应用规范化后的 v3 设置对象（T9 官方模型字段）—— 同步喂引擎快照 */
	_applySettings(s2) {
		this.skillList = s2.skills;
		this.auxList = s2.aux; // 道具页 BUFF 道具 8 槽（T9.1 归一化）
		this.auxDelays = s2.auxDelays; // 道具页每格延迟秒数（T9.1）
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
		if (this.engine) this.engine.applySettings({
			skills: this.skillList,
			aux: this.auxList,
			auxDelays: this.auxDelays,
			slotDelays: this.slotDelays,
			follow: this.followEnabled,
			followTarget: this.followTarget,
			flyNoMobs: this.flyNoMobs,
			flyLowHp: this.flyLowHp,
			normalAttack: this.normalAttack,
			mobWhitelist: this.mobWhitelist,
			noMobSeconds: this.noMobSeconds,
			returnToMap: this.returnToMap,
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
		});
	}

	_saveSettings() {
		const data = {
			v: SCHEMA_VERSION,
			skills: this.skillList,
			aux: this.auxList,
			auxDelays: this.auxDelays,
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
		};
		localStorage.setItem(this._getStorageKey(), JSON.stringify(data));
		// UI 改动 → 引擎快照同步（引擎自持副本，不共享可变引用）
		if (this.engine) this.engine.applySettings(data);
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
					this.engine.stop();
					this._updateFloatBtnState();
					this._showError('挂机启动失败');
				}
				break;
			case 1:
				if (pkt.status !== 0) {
					// 服务端拒绝 → 回退（不传 huntMap：沿用引擎内已记录的挂机地图，与原行为一致）
					this.engine.start();
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
