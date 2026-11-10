/**
 * Plugins/BotAutoHunt/engine/HuntEngine.js
 *
 * 挂机引擎 — 自动战斗的决策核心（架构审查候选 A，Issue Prontera#12）。
 * 四循环（战斗/药水/增益/拾取）+ 目标选择 + 巡逻撤退寻路 + 冷却表，全部藏在本 module 后面。
 *
 * 设计约定（见 dev-logs/2026-11-09 与架构审查报告）：
 * - 本文件零游戏全局依赖：所有游戏操作经构造参数 bindings 注入（依赖注入，非 import），
 *   生产实现在 BotAutoHunt.js（薄壳），测试假件见 tests/bot-engine.test.js。
 * - 静态数据例外：EFST_MAP / MAP_CONNECTIONS / MAP_MOBS（构建期生成 JSON，确定性）直接 import。
 * - settings 通过 applySettings 快照喂入，引擎自持副本（UI 修改 → 壳层 _saveSettings → 本方法）。
 * - 行为等价搬运：逻辑与拆分前 BotAutoHunt.js 完全一致（2026-11-09 基线 commit 8905bbb）。
 *
 * 引擎对外的全部 interface（薄壳只依赖这些）：
 *   new HuntEngine(bindings, events)
 *   applySettings(v3Snapshot)   设置快照（migrateSettings 产物或壳层字段聚合）
 *                               （v3.1：aux=8 槽 BUFF 道具 + auxDelays[8] 每格延迟秒数）
 *   start({huntMap}) / stop()   循环启停（内部持有 5 个 setInterval）
 *   setBuff(efst, state)        StatusIcons 钩子喂入的本地玩家 buff 状态
 *   onItemGained(item)          Inventory addItem 钩子喂入的拾取结果
 *   active / timerSec           运行标志 / 累计挂机秒数（只读）
 *
 * bindings 协议（游戏操作绑定，第二 adapter = 测试假件）：
 *   查询：
 *     self() → {gid, name, dead, position:[x,y], walking, amotionBusy,
 *               life:{hp,hpMax,sp,spMax}, weightPct:number|null,
 *               bodyState, healthState} | null   （null=实体不可用）
 *     mapState() → {name, loading}
 *     entityTypes → {mob, item, item2}          （Entity.TYPE_* 数值常量）
 *     forEachEntity(cb) / getEntity(gid) / focusEntity() / setFocusEntity(e) / closestMob()
 *     skillReady(skillId, level) → boolean      （已学该等级且 SP 足够；缺省 id=AL_TELEPORT）
 *     itemCount(id) → number                    （背包数量，无背包=0）
 *     itemType(id) → number|null                （DB.getItemInfo(ITID).Type，未知=null）
 *     isWalkable(x, y) → boolean                （Altitude 地形）
 *     pathSearch(cx,cy,tx,ty,range,out) → pathLen               （PathFinding.search）
 *     pathSearchLong(cx,cy,tx,ty,range,out) → {pathLength}|null （PathFinding.searchLong）
 *   动作：
 *     useItem(id) → boolean
 *     castSkill(id, level, targetGid)           （SkillTargetSelection 路径：攻击/治疗/瞬移）
 *     castSkillDirect(id, level, targetGid)     （USE_SKILL2 裸包：buff 施法，绕过 amotion 检查）
 *     moveTo(x, y) / attack(gid) / pickupItem(gid) / throwItem(index, count) / chat(msg)
 *     （moveTo/pickupItem 内部处理 PACKETVER 封包版本分支，引擎不感知）
 *
 * events 协议（引擎 → 薄壳回调，均可选）：
 *   onDeath()                      角色死亡，引擎已自行 stop（壳层负责悬浮开关复位与提示）
 *   onSecond(sec)                  每秒计时（壳层刷新挂机服务页、每 60s 发 cmd 4 查积分）
 *   onMobSeen(job, mapName)        战斗扫描见到魔物（壳层喂魔物设定页清单，不持久化）
 *   onError(msg) / onInfo(msg) / onToast(msg)
 */

import {
	shouldLowHpFlyWing, decideNoMobAction, decideSpEconomy, evaluatePotionSlots,
	matchLootType, validateLootedItem, isCureStatusActive, mobInWhitelist, slotReady,
	decideSitRecover,
	CURE_WATCH_LISTS
} from '../settings/schema.js';
import EFST_MAP from '../data/efst-map.json';
import MAP_CONNECTIONS from '../data/map-connections.json';
import MAP_MOBS from '../data/map-mobs.json';

// =====================================================================
// 常量与 EFST 数据辅助（原 BotAutoHunt.js 顶部，迁移至此并对壳层导出）
// =====================================================================

/** 飞翅道具 ID — Source: rAthena db/pre-re/item_db.yml */
export const ITEM_FLY_WING = 601; // 苍蝇翅膀 — 随机传送
export const ITEM_BUTTERFLY_WING = 602; // 蝴蝶翅膀 — 回存储点

/** 技能触发类型（开发时预分类，D-03c） */
export const SKILL_TYPE_ATTACK = 'attack'; // 有目标+冷却→释放
export const SKILL_TYPE_HEAL = 'heal'; // HP<阈值→释放（双模式：不死系→攻击）
export const SKILL_TYPE_BUFF = 'buff'; // buff 消失→释放

/** 辅助列表触发类型 */
export const AUX_TYPE_POTION = 'potion'; // HP/SP<阈值→使用
export const AUX_TYPE_BUFF_ITEM = 'buff_item'; // buff 消失→使用

/**
 * 治疗技能集合 — 由构建脚本从 rAthena pc.cpp pc_skillheal_bonus() 自动提取。
 * 判定优先级: HEAL_SKILL_IDS → EFST_MAP buff → ATTACK
 * 来源: tools/client/generate-efst-map.mjs → data/efst-map.json.healSkills
 */
export const HEAL_SKILL_IDS = new Set(EFST_MAP.healSkills || []);

/** T9: MVP 首领魔物种族表（MAP_MOBS.mvp，同生成器产出，读服务端 mob_db.yml Modes.Mvp） */
const MVP_JOBS = Array.isArray(MAP_MOBS.mvp) ? MAP_MOBS.mvp : [];

function _getEfstEntry(kind, id) {
	return EFST_MAP[kind]?.[id] || null;
}

export function isBuff(kind, id) {
	const entry = _getEfstEntry(kind, id);
	return entry && entry.type === 'buff' && Array.isArray(entry.efst) && entry.efst.length > 0;
}

export function getPrimaryEfst(kind, id) {
	const entry = _getEfstEntry(kind, id);
	return entry?.efst?.[0] ?? null;
}

export function getPotionRestoreType(id) {
	const entry = _getEfstEntry('items', id);
	if (entry && ['hp', 'sp', 'both'].includes(entry.type)) {
		return entry.type;
	}
	return null;
}

// =====================================================================
// 挂机引擎
// =====================================================================

class HuntEngine {
	/**
	 * @param {object} bindings 游戏操作绑定（见文件头协议说明）
	 * @param {object} events   引擎事件回调（均可选）
	 */
	constructor(bindings, events) {
		this.bindings = bindings;
		this.events = events || {};

		// ---------- 挂机状态 ----------
		this.active = false;
		this.timerSec = 0;

		// ---------- 设置快照（applySettings 喂入；默认值与 migrateSettings(null) 一致的关键子集） ----------
		this.skillList = [];
		this.auxList = []; // 仅 BUFF 道具（potion 已分流至 potions 四槽）
		this.slotDelays = [0, 0, 0, 0, 0, 0, 0, 0];
		this.followEnabled = false;
		this.followTarget = '';
		this.flyNoMobs = true;
		this.flyLowHp = false;
		this.normalAttack = true;
		this.mobWhitelist = {};
		this.noMobSeconds = 10;
		this.returnToMap = true;
		this.loot = null;
		this.sitRecover = { enabled: false, hpPct: 50, spPct: 30 }; // T9.5: 坐下回复（_applySettings 覆盖）
		this._sitActive = false; // T9.5: 坐下回复进行中（药水循环置位，战斗循环/过图/停机清除）
		this.potions = { hp: [], sp: [] };
		this.cure = { enabled: true, poison: 0, panacea: 0 };
		this.returnVillage = { onPotionsEmpty: false, onCureEmpty: false, onBuffEmpty: true }; // 官方无总开关；BUFF 用尽回村默认勾选（官方道具页截图）
		this.teleport = { item: { enabled: true, id: ITEM_FLY_WING }, skill: { enabled: true, id: 26, level: 1 } };
		this.retreat = { item: { enabled: true, id: ITEM_BUTTERFLY_WING }, skill: { enabled: true, id: 26, level: 2 } };
		this.spNormalAttack = { enabled: false, threshold: 10 };
		this.spStopAttackMove = { enabled: false, threshold: 5 };
		this.flyOnMobCount = { enabled: false, count: 20 };
		this.flyOnMvp = true;

		// ---------- 巡逻状态 (#3 fix: Date.now() 而非 Renderer.tick，后台 tab 时 rAF 冻结) ----------
		this._lastMobSeenTick = 0;
		this._lastPatrolMoveTick = 0;
		this._needMoveAwayFromPortal = false;
		this._portalStableTick = 0;

		// ---------- 过图状态追踪 ----------
		this._lastMapName = '';
		this._mapChangeTick = 0;
		this._huntMapName = '';
		this._returnTriedPortals = new Set();
		this._returnTargetPortal = null;

		// ---------- 循环定时器 ----------
		this.combatTick = null;
		this.potionTick = null;
		this.buffTick = null;
		this._timerTick = null;
		this._lootTick = null;

		// ---------- Buff 状态追踪（StatusIcons 钩子 → setBuff 喂入） ----------
		this._buffMap = {};

		// ---------- 动作冷却系统（key: 'item_<id>'|'skill_<id>'|'buff_<efst>' → 到期时间戳） ----------
		this._actionCooldowns = {};
		this._slotLastCast = [];
		this._auxLastCast = {}; // T9.1: 道具页 BUFF 槽下标 → 上次使用时间戳（每格延迟判定）
		this.auxDelays = [0, 0, 0, 0, 0, 0, 0, 0]; // T9.1: 每格延迟秒数（applySettings 喂入）

		// ---------- T9.3 卡死修复：不可达目标看门狗 + 追击黑名单 ----------
		// 同一目标追击超时无进展（自身/目标均未位移）→ 拉黑 15s 恢复巡逻（悬崖/水面对侧怪）
		this._focusWatch = { gid: 0, since: 0, lastSelfX: 0, lastSelfY: 0, lastTargetX: 0, lastTargetY: 0 };
		this._mobBlacklist = new Map(); // gid → 解禁时间戳
		this._scanTarget = null; // T9.6: 本 tick 扫描出的路径可达最优目标
		this._chaseWalkEnd = null; // T9.6: 追击终点去重（'x,y' 字符串，终点变化时重新校验）

		// ---------- Buff 施法保护（防巡逻移动打断长施法） ----------
		this._castingUntil = 0;

		// ---------- 拾取待校验/黑名单（T6） ----------
		this._lootPending = null;
		this._lootBlacklist = new Set();
	}

	/** 设置快照喂入（壳层 _applySettings / _saveSettings 路径调用；深拷贝自持，不与壳层共享可变引用） */
	applySettings(snap) {
		// 设置对象均为 JSON 安全结构（migrateSettings 产物/壳层字段聚合）；
		// 深拷贝隔离：壳层（UI）改到一半的中间态不会波及正在 tick 的引擎
		const s = typeof structuredClone === 'function'
			? structuredClone(snap)
			: JSON.parse(JSON.stringify(snap));
		this.skillList = s.skillList || s.skills || [];
		this.auxList = s.auxList || s.aux || [];
		this.auxDelays = Array.isArray(s.auxDelays) ? s.auxDelays : [0, 0, 0, 0, 0, 0, 0, 0];
		this.slotDelays = s.slotDelays || [0, 0, 0, 0, 0, 0, 0, 0];
		this.followEnabled = !!(s.followEnabled !== undefined ? s.followEnabled : s.follow);
		this.followTarget = s.followTarget || '';
		this.flyNoMobs = s.flyNoMobs !== undefined ? !!s.flyNoMobs : true;
		this.flyLowHp = !!s.flyLowHp;
		this.normalAttack = s.normalAttack !== false;
		this.mobWhitelist = s.mobWhitelist || {};
		this.noMobSeconds = typeof s.noMobSeconds === 'number' ? s.noMobSeconds : 10;
		this.returnToMap = s.returnToMap !== false;
		this.loot = s.loot || null;
		this.potions = s.potions || { hp: [], sp: [] };
		this.cure = s.cure || { enabled: true, poison: 0, panacea: 0 };
		this.returnVillage = s.returnVillage || { onPotionsEmpty: false, onCureEmpty: false, onBuffEmpty: true };
		this.teleport = s.teleport || this.teleport;
		this.retreat = s.retreat || this.retreat;
		this.spNormalAttack = s.spNormalAttack || { enabled: false, threshold: 10 };
		this.spStopAttackMove = s.spStopAttackMove || { enabled: false, threshold: 5 };
		this.flyOnMobCount = s.flyOnMobCount || { enabled: false, count: 20 };
		this.flyOnMvp = s.flyOnMvp !== undefined ? !!s.flyOnMvp : true;
		this.sitRecover = s.sitRecover || { enabled: false, hpPct: 50, spPct: 30 };
	}

	// =================================================================
	// 循环启动/停止
	// =================================================================

	/**
	 * 启动挂机循环（原 startLoops + startAutoHunt 的状态初始化合并）
	 * @param {{huntMap?: string}} [opts] 传入 huntMap=记录新的挂机地图并清返回状态
	 *   （startAutoHunt 路径）；不传=沿用已记录地图（服务端拒绝 cmd1 时的回退重启路径）
	 */
	start(opts) {
		this.stop();
		const o = opts || {};
		if (o.huntMap !== undefined) {
			// 记录挂机地图名（用于过图后自动返回）
			this._huntMapName = o.huntMap;
			this._returnTriedPortals = new Set();
			this._returnTargetPortal = null;
		}
		// 初始化巡逻计时器，避免启动瞬间误触飞翅（Date.now() 不依赖 rAF）
		this._lastMobSeenTick = Date.now();
		this._lastPatrolMoveTick = 0;
		this._sitActive = false; // T9.5: 重启挂机不起坐状态（服务端重启后已站立）
		this._lastMapName = this.bindings.mapState().name || '';
		this._mapChangeTick = 0;
		// T9.3: 重启挂机时重置追击看门狗（位置已过期）；追击黑名单保留（15s 自动过期，
		// 不可达目标不会因重启而立即恢复攻击）
		this._focusWatch.gid = 0;
		this.active = true;
		this.timerSec = this.timerSec || 0;
		this.combatTick = setInterval(() => this._combatLoop(), 100);
		this.potionTick = setInterval(() => this._potionLoop(), 200);
		this.buffTick = setInterval(() => this._buffLoop(), 1000);
		this._timerTick = setInterval(() => this._timerLoop(), 1000);
		this._lootTick = setInterval(() => this._lootLoop(), 400); // T6: 捡拾循环
	}

	stop() {
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
		this.active = false;
	}

	/** 计时器循环：累计挂机时长，每秒回调壳层（服务页刷新 / 每 60s 查积分由壳层决定） */
	_timerLoop() {
		this.timerSec++;
		if (this.events.onSecond) this.events.onSecond(this.timerSec);
	}

	/** StatusIcons 钩子喂入：本地玩家 buff 增减；注册时同步清除待注册冷却（允许下次过期后立即重铸，原 StatusIcons 钩子语义） */
	setBuff(efst, state) {
		if (state === 1) {
			this._buffMap[efst] = true;
			delete this._actionCooldowns['buff_' + efst];
		} else {
			delete this._buffMap[efst];
		}
	}

	/** 后台 tab 恢复可见：重置无怪计时避免误触飞翅（原 visibilitychange 处理器语义） */
	onTabVisible() {
		if (this.active) this._lastMobSeenTick = Date.now();
	}

	/** #12 fix: 获取当前地图名（小写，不含扩展名） */
	_currentMapName() {
		try {
			return (this.bindings.mapState().name || '').replace(/\.gat$/i, '').toLowerCase();
		} catch (_) {
			return '';
		}
	}

	// =================================================================
	// 战斗循环 (~100ms)
	// 逻辑与拆分前 BotAutoHunt._combatLoopInner 逐行等价（commit 8905bbb）
	// =================================================================

	_combatLoop() {
		if (!this.active) return;
		try {
			this._combatLoopInner();
		} catch (e) {
			console.error('[BotAutoHunt] combat loop error:', e);
		}
		// T9.3 诊断：控制台 `__botDebug = true` 后每秒输出决策上下文（卡死排查用）
		if (typeof window !== 'undefined' && window.__botDebug) {
			const now = Date.now();
			if (!this._dbgAt || now - this._dbgAt >= 1000) {
				this._dbgAt = now;
				const self = this.bindings.self();
				const focus = this.bindings.focusEntity();
				console.log('[BotAutoHunt][dbg]', JSON.stringify({
					pos: self ? self.position : null,
					walking: self ? self.walking : null,
					dead: self ? self.dead : null,
					hp: self && self.life ? self.life.hp : null,
					map: this.bindings.mapState().name,
					focusGid: focus ? focus.GID : null,
					blacklist: Array.from(this._mobBlacklist.entries())
						.filter(([, t]) => t > now)
						.map(([gid, t]) => gid + '@' + Math.round((t - now) / 1000) + 's'),
					noMobMs: now - this._lastMobSeenTick,
					castBlockMs: Math.max(0, this._castingUntil - now),
					portalAvoid: this._needMoveAwayFromPortal
				}));
			}
		}
	}

	_combatLoopInner() {
		if (!this.active) return;

		// 0. 过图检测 — 地图名变化时重置内部状态
		// 过图后实体管理器清空、地形重载、寻路暂时不可用，需重置计时器和冷却并给 3 秒宽限期
		const currentMap = this._currentMapName();
		if (currentMap && this._lastMapName && currentMap !== this._lastMapName) {
			console.log('[BotAutoHunt] map change:', this._lastMapName, '->', currentMap);
			this._lastMapName = currentMap;
			this._mapChangeTick = Date.now();
			this._lastMobSeenTick = Date.now();
			this._lastPatrolMoveTick = 0;
			this._sitActive = false; // T9.5: 过图必然站立，清坐下标志（返回逻辑优先于坐下回复）
			this._actionCooldowns = {};
			// 清除目标锁定（旧目标已不存在）
			this.bindings.setFocusEntity(null);
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
		if (this.bindings.mapState().loading) return;
		if (this._mapChangeTick && Date.now() - this._mapChangeTick < 1500) {
			return;
		}

		// 1. 死亡检测 (D-31) — 角色 dead 则停止挂机循环（过图期实体不可用不当作死亡）
		const self = this.bindings.self();
		if (!self) {
			return; // 实体暂不可用，跳过本轮（不停止挂机）
		}
		if (self.dead) {
			this.stop();
			if (this.events.onDeath) this.events.onDeath();
			return;
		}

		// 1.5. 返回挂机地图 — 不在挂机图上时，寻找传送门回去（T5: 可开关，关闭则就地继续）
		if (this.returnToMap && this._huntMapName && currentMap !== this._huntMapName) {
			this._returnToHuntMap();
			return; // 返回途中不执行战斗逻辑
		}

		// 1.55 坐下回复坐等（T9.5）：坐着等回血回蓝；视野有怪立即起身接战。
		// 过图返回优先级更高（1.5 已提前 return）；药水循环负责坐下/起身决策与恢复判定。
		if (this._sitActive) {
			const stillSitting = this.bindings.isSitting();
			if (!stillSitting || !this.sitRecover || !this.sitRecover.enabled || this._hasVisibleMob()) {
				this._sitActive = false;
				if (stillSitting) this.bindings.standUp();
			} else {
				return; // 坐着等恢复，不执行战斗/巡逻
			}
		}

		// 1.6. 过图返回后主动远离传送门 — 等地图加载完 + 位置稳定后再计算安全路径
		if (this._needMoveAwayFromPortal) {
			if (this.bindings.mapState().loading) return;
			// 角色仍在走（过图惯性），重置稳定计时
			if (self.walking) {
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
		if (this._isNearPortal(self.position[0] | 0, self.position[1] | 0, 7)) {
			if (!self.walking && !this._isOnCooldown('portal_avoid')) {
				this._markAction('portal_avoid', 1000);
				this._moveAwayFromPortal();
			}
			return;
		}

		// T9: 是否在挂机图（官方触发器/回落链均仅挂机图生效）
		const onHuntMap = !this.returnToMap || !this._huntMapName || currentMap === this._huntMapName;

		// 2. 跟随队友模式 (D2 #11)
		if (this.followEnabled && this.followTarget) {
			const teammate = this.bindings.getEntity(+this.followTarget);
			if (teammate && !teammate.isDead()) {
				const dx = teammate.position[0] - self.position[0];
				const dy = teammate.position[1] - self.position[1];
				const distSq = dx * dx + dy * dy;
				// 距离 > 2 格时移向队友
				if (distSq > 4) {
					this.bindings.moveTo(teammate.position[0], teammate.position[1]);
					return; // 移动中不执行攻击
				}
				// 队友有目标 → 自动选中（辅助职业辅助攻击）
				if (teammate.targetGID && !this.bindings.focusEntity()) {
					const target = this.bindings.getEntity(teammate.targetGID);
					if (
						target &&
						target.objecttype === this.bindings.entityTypes.mob &&
						!target.isDead() &&
						this._isMobTargetable(target, currentMap) // T4: 名单外目标不选
					) {
						this.bindings.setFocusEntity(target);
					}
				}
			}
			// 不同地图: 原地等待，不停止挂机
		}

		// 3. 飞翅检查 + 巡逻 (#3 fix: 无怪超时才飞翅，否则随机走动)
		// T9 官方触发器（画面怪数/MVP 登场瞬移）在同一次扫描中判定
		// T9.6 路径感知：扫描阶段即用客户端寻路评估可达性（与服务端同一套可行走数据），
		// 不可达怪（跨崖/障碍对侧）当场剔除——不进入追击，也不阻塞无怪回落链
		{
			let mobCount = 0;
			let mvpSeen = false;
			const candidates = []; // { mob, d } 可战候选（拉黑期怪排除，d=与玩家欧氏距离平方）
			this.bindings.forEachEntity(entity => {
				if (
					entity.objecttype === this.bindings.entityTypes.mob &&
					entity.action !== entity.ACTION.DIE &&
					entity.remove_tick === 0
				) {
					// T9.3: 追击拉黑期（不可达目标）不计入 hasMob——否则怪滞留视野时
					// 无怪回落链（瞬移/飞翅解围）永不触发，角色在盲发期与拉黑期之间永久站立
					if ((this._mobBlacklist.get(entity.GID) || 0) > Date.now()) return;
					mobCount++;
					if (!mvpSeen && MVP_JOBS.indexOf(entity.job) !== -1) mvpSeen = true;
					if (this.events.onMobSeen) this.events.onMobSeen(entity.job, currentMap); // T4: 魔物页清单
					const dx = entity.position[0] - self.position[0];
					const dy = entity.position[1] - self.position[1];
					candidates.push({ mob: entity, d: dx * dx + dy * dy });
				}
			});
			// T4: 白名单非空时，名单外魔物不计入 hasMob（"只剩名单外怪 = 无怪"语义）
			let pool = candidates;
			if (this._hasWhitelist(currentMap)) {
				pool = candidates.filter(c => this._isMobTargetable(c.mob, currentMap));
			}
			// T9.6: 按欧氏距离升序做寻路评估（单 tick 最多 8 只，防最坏情况主线程超载），
			// 首个可达（代价>0）即为目标池最优解；全不可达 → hasMob=false → 无怪回落链接管
			pool.sort((a, b) => a.d - b.d);
			let evalCount = 0;
			let scanTarget = null;
			for (const c of pool) {
				if (evalCount >= 8) break;
				evalCount++;
				if (this.bindings.mobPathCost(c.mob) > 0) {
					scanTarget = c.mob;
					break;
				}
			}
			let hasMob = !!scanTarget;
			this._scanTarget = scanTarget;

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
				this._scanTarget = null; // T9.6: 全不可达，目标池清空
				// 无怪状态
				const noMobMs = Date.now() - this._lastMobSeenTick;
				// T5/T9: 无怪超过设定秒数 → 回落链：登录技能(已学且SP足) → 登录道具 → 随机步行
				if (this.flyNoMobs && noMobMs > this.noMobSeconds * 1000) {
					const tp = this.teleport;
					const action = decideNoMobAction({
						flyNoMobs: this.flyNoMobs,
						teleportReady: tp.skill.enabled && tp.skill.id > 0 && this.bindings.skillReady(tp.skill.id, tp.skill.level)
					});
					if (action === 'teleport') {
						this.bindings.castSkill(tp.skill.id, tp.skill.level || 1, self.gid);
						this._lastMobSeenTick = Date.now(); // 重置计时
						return;
					}
					if (action === 'flywing') {
						if (!(tp.item.enabled && tp.item.id > 0 && this.bindings.useItem(tp.item.id))) {
							this.bindings.useItem(ITEM_FLY_WING); // 未登录道具时兜底苍蝇翅膀
						}
						this._lastMobSeenTick = Date.now(); // 重置计时
						return;
					}
					// walk → 落到下方巡逻分支
				}
				// 巡逻：角色行走中不重复发指令；停下后立即寻路（短冷却防刷包）
				this._patrolStep();
				return;
			}
		}

		// T9 官方 SP 经济规则（基本设定页）：规则1 命中 → 仅普通攻击；规则2 命中 → 停止攻击转移动
		const _life = self.life;
		const spPct = _life && _life.spMax > 0 ? (_life.sp / _life.spMax) * 100 : 100;
		const spRule = decideSpEconomy(spPct, {
			normalAttack: this.spNormalAttack,
			stopAttackMove: this.spStopAttackMove
		});
		if (spRule === 'stop-and-move') {
			// 停止攻击后自动移动（同无怪巡逻：行走中等待；停下后每 1.5s 一步）
			this.bindings.setFocusEntity(null);
			this._patrolStep();
			return;
		}

		// 4. 获取当前目标：优先本 tick 扫描出的路径可达最优解（T9.6 路径感知），
		// 兼容分支保留 closestMob/白名单近邻（T4）
		let target = this.bindings.focusEntity();
		if (!target || target.isDead() || target.objecttype !== this.bindings.entityTypes.mob || !this._isMobTargetable(target, currentMap)) {
			if (this._scanTarget) {
				target = this._scanTarget;
			} else if (this._hasWhitelist(currentMap)) {
				target = this._findClosestTargetableMob(currentMap);
			} else {
				target = this.bindings.closestMob();
			}
			if (!target) { this._focusWatch.gid = 0; return; } // 地图无怪（或只剩名单外怪，走巡逻/飞翅分支）
			// T9.3: 追击拉黑期内不重选同一目标，落到巡逻步走动（等它走动/离开视野/黑名单过期）
			if ((this._mobBlacklist.get(target.GID) || 0) > Date.now()) { this._focusWatch.gid = 0; this._patrolStep(); return; }
			this.bindings.setFocusEntity(target);
		}

		// 4.5 T9.3 不可达目标看门狗：追击无进展（自身与目标均未位移超 2 格）超 8s →
		// 判定不可达（悬崖/障碍/水面对侧），拉黑 15s 并清焦点，恢复巡逻与无怪回落链。
		// 服务端追击到不可达怪的最近可站立点后停走，旧逻辑每 tick 盲发攻击包 → 永久冻结
		{
			const w = this._focusWatch;
			const now = Date.now();
			if (w.gid !== target.GID) {
				w.gid = target.GID;
				w.since = now;
				w.lastSelfX = self.position[0]; w.lastSelfY = self.position[1];
				w.lastTargetX = target.position[0]; w.lastTargetY = target.position[1];
				this._chaseWalkEnd = null; // T9.6: 新目标重置追击终点追踪
			} else {
				const progressed = Math.abs(self.position[0] - w.lastSelfX) + Math.abs(self.position[1] - w.lastSelfY) > 2 ||
					Math.abs(target.position[0] - w.lastTargetX) + Math.abs(target.position[1] - w.lastTargetY) > 2;
				if (progressed) {
					w.since = now;
					w.lastSelfX = self.position[0]; w.lastSelfY = self.position[1];
					w.lastTargetX = target.position[0]; w.lastTargetY = target.position[1];
					this._chaseWalkEnd = null; // 有位移 = 服务端重新寻路/目标位置变化，下段路径重新校验
				} else if (now - w.since > 8000) {
					this._mobBlacklist.set(target.GID, now + 15000);
					this.bindings.setFocusEntity(null);
					w.gid = 0;
					return;
				}

				// T9.6 追击终点校验（数据驱动）：服务端回包路径终点距目标超过 攻击距离+2 →
				// 服务端已判定不可达（走到最近可站立点即停），立即清焦点重选（路径感知选目标
				// 会按可达代价换怪），不盲等 8s 看门狗。终点不变则只判一次（_chaseWalkEnd 去重）。
				const ep = this.bindings.walkEndpoint();
				if (ep) {
					const epKey = ep[0] + ',' + ep[1];
					if (this._chaseWalkEnd !== epKey) {
						this._chaseWalkEnd = epKey;
						const range = self.attackRange > 0 ? self.attackRange : 4; // 未知攻击距离时按近战保守处理
						const endDist = Math.max(Math.abs(ep[0] - target.position[0]), Math.abs(ep[1] - target.position[1]));
						if (endDist > range + 2) {
							this._mobBlacklist.set(target.GID, now + 15000);
							this.bindings.setFocusEntity(null);
							w.gid = 0;
							this._chaseWalkEnd = null;
							return;
						}
					}
				} else {
					this._chaseWalkEnd = null; // 无在途路径（已停走/到达），下段路径重新校验
				}
			}
		}

		// 5. amotion 冷却检查（使用 Date.now() 而非 Renderer.tick，后台兼容）
		if (self.amotionBusy) return;

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
					if (skill.spcost && self.life && self.life.sp < skill.spcost) continue;
					// 每槽延迟：未到期则跳过该槽，尝试下一槽
					if (!slotReady(nowTs, this._slotLastCast[idx] || 0, this.slotDelays[idx] || 0)) continue;
					this.bindings.castSkill(skill.id, skill.level || 1, target.GID);
					this._slotLastCast[idx] = nowTs;
					return; // 释放一个技能后等下一 tick
				}
			}
		}

		// 7. 无技能可用（或 SP 规则1命中）→ 普通攻击
		// T2: 「普通攻击」开关关闭时跳过（法系职业避免接近魔物近身普攻）
		if (this.normalAttack === false) return;
		this.bindings.attack(target.GID);
	}

	/**
	 * 视野内是否存在可作战怪物（T9.5）。
	 * 语义与战斗循环扫描一致：黑名单期怪不计入（不可达目标不阻坐也不触发起身）。
	 */
	_hasVisibleMob() {
		let found = false;
		this.bindings.forEachEntity(entity => {
			if (found || !entity) return;
			if (
				entity.objecttype === this.bindings.entityTypes.mob &&
				entity.action !== entity.ACTION.DIE &&
				entity.remove_tick === 0 &&
				!((this._mobBlacklist.get(entity.GID) || 0) > Date.now())
			) {
				found = true;
			}
		});
		return found;
	}

	// =================================================================
	// 药水/治疗循环 (~200ms)
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
		const self = this.bindings.self();
		if (!self || self.dead) return;

		// 不在挂机地图上时，只保留基础 HP 药水（不用飞翅，不干扰返回逻辑）
		// T5: 返回开关关闭时不存在返回逻辑，视为始终在挂机图
		const currentMap = this._currentMapName();
		const onHuntMap = !this.returnToMap || !this._huntMapName || currentMap === this._huntMapName;

		const life = self.life;
		if (!life) return;

		const hp = life.hp;
		const hpMax = life.hpMax;
		const sp = life.sp;
		const spMax = life.spMax;

		// 防御: hpMax/spMax 可能为 -1（未初始化）
		if (hpMax <= 0 || spMax <= 0) return;

		const hpPct = (hp / hpMax) * 100;
		const spPct = (sp / spMax) * 100;

		// 1-3. T9 官方药水四槽决策（纯函数：低血飞翅阈值 + 槽位自左向右命中）
		const lowHpFly = shouldLowHpFlyWing(hpPct, this.flyLowHp);

		// 1. 低血飞翅 (D2 #12): HP<10% → 移动页「返回储存点」注册（道具→技能→兜底）
		// 仅在挂机地图上使用（错误地图上飞翅会干扰返回逻辑）
		if (onHuntMap && lowHpFly) {
			if (!this._isOnCooldown('retreat_lowhp')) {
				this._executeRetreat('retreat_lowhp');
				this._markAction('retreat_lowhp', 2000);
			}
			return;
		}

		// 1.55: 坐下回复决策（T9.5）：低于阈值且视野无怪 → 坐下；坐中回到滞回阈值 → 起身。
		// 低血飞翅优先（官方功能，已在上方提前 return）；药水槽评估继续执行（坐着也能吃药）。
		if (onHuntMap && this.sitRecover && this.sitRecover.enabled) {
			const sittingNow = this._sitActive || this.bindings.isSitting();
			const sitAction = decideSitRecover(hpPct, spPct, sittingNow, this.sitRecover, this._hasVisibleMob());
			if (sitAction === 'sit' && !sittingNow && !this._isOnCooldown('sit_recover')) {
				this.bindings.sitDown();
				this._sitActive = true;
				this._markAction('sit_recover', 1000);
			} else if (sitAction === 'stand' && this._sitActive && !this._isOnCooldown('sit_recover')) {
				this.bindings.standUp();
				this._sitActive = false;
				this._markAction('sit_recover', 1000);
			}
		}

		// 2. T9 官方四槽：HP/SP 未满阈值 → 使用命中槽道具（同类型自左向右；500ms 冷却防刷）
		const hit = evaluatePotionSlots(this.potions, hpPct, spPct);
		if (hit.hpSlot > -1) {
			const slot = this.potions.hp[hit.hpSlot];
			const key = 'item_' + slot.id;
			if (!this._isOnCooldown(key) && this.bindings.useItem(slot.id)) {
				this._markAction(key, 500);
			}
			// 治疗技能(对自己释放，1s 冷却，另受所在槽延迟约束；服务器私有扩展，官方药水页无此概念)
			for (let idx = 0; idx < this.skillList.length; idx++) {
				const skill = this.skillList[idx];
				if (!skill || skill.type !== SKILL_TYPE_HEAL) continue;
				if (skill.spcost && sp < skill.spcost) continue;
				if (!slotReady(Date.now(), this._slotLastCast[idx] || 0, this.slotDelays[idx] || 0)) continue;
				const skey = 'skill_' + skill.id;
				if (this._isOnCooldown(skey)) continue;
				this.bindings.castSkill(skill.id, skill.level || 1, self.gid);
				this._markAction(skey, 1000);
				this._slotLastCast[idx] = Date.now();
				break;
			}
		}
		if (hit.spSlot > -1) {
			const slot = this.potions.sp[hit.spSlot];
			const key = 'item_' + slot.id;
			if (!this._isOnCooldown(key) && this.bindings.useItem(slot.id)) {
				this._markAction(key, 500);
			}
		}
		// 4. T7/T9: 异常状态自动解除（官方 ON/OFF 开关门控；解毒药优先，其次万能药；1 秒冷却防刷）
		const channels = {
			efstMap: this._buffMap,
			bodyState: self.bodyState || 0,
			healthState: self.healthState || 0
		};
		if (this.cure.enabled) {
			if (this.cure.poison && !this._isOnCooldown('cure_poison') &&
				isCureStatusActive(CURE_WATCH_LISTS.poison, channels)) {
				this._markAction('cure_poison', 1000);
				this.bindings.useItem(this.cure.poison);
				return;
			}
			if (this.cure.panacea && !this._isOnCooldown('cure_panacea') &&
				isCureStatusActive(CURE_WATCH_LISTS.panacea, channels)) {
				this._markAction('cure_panacea', 1000);
				this.bindings.useItem(this.cure.panacea);
				return;
			}
		}
		// 5. T9: 返回村庄设定（药水页分页2 两项 + 道具页 BUFF 用尽项；官方无总开关，各勾选即各触发条件）
		if (onHuntMap && !this._isOnCooldown('return_village')) {
			const potionsExhausted = this.returnVillage.onPotionsEmpty && this._allSlotsExhausted(
				[].concat(this.potions.hp, this.potions.sp)
			);
			const cureExhausted = this.returnVillage.onCureEmpty && this._allSlotsExhausted([
				{ id: this.cure.poison },
				{ id: this.cure.panacea }
			]);
			const buffExhausted = this.returnVillage.onBuffEmpty && this._allSlotsExhausted(
				(Array.isArray(this.auxList) ? this.auxList : []).filter(a => a && a.type === AUX_TYPE_BUFF_ITEM)
			);
			if (potionsExhausted || cureExhausted || buffExhausted) {
				this._markAction('return_village', 10000); // 触发后 10s 冷却防刷
				this._executeRetreat('return_village');
				if (this.events.onToast) this.events.onToast('登记的道具已用完，正在返回村庄');
				return;
			}
		}
	}

	// =================================================================
	// Buff 循环 (~1000ms)
	// =================================================================

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
		const self = this.bindings.self();
		if (!self || self.dead) return;

		for (let idx = 0; idx < this.skillList.length; idx++) {
			const skill = this.skillList[idx];
			if (!skill) continue;
			if (skill.type !== SKILL_TYPE_BUFF) continue;
			const efst = getPrimaryEfst('skills', skill.id);
			if (!efst) continue;
			if (this._buffMap[efst]) continue;
			const currentSp = self.life ? self.life.sp : 0;
			if (skill.spcost && currentSp < skill.spcost) continue;
			const key = 'buff_' + efst;
			if (this._isOnCooldown(key)) continue;
			// T2: 每槽延迟（与 efst 冷却取较大值）
			const slotDelay = this.slotDelays[idx] || 0;
			if (!slotReady(Date.now(), this._slotLastCast[idx] || 0, slotDelay)) continue;
			// buff 已消失 → 释放技能（对自己）
			// 直发包绕过 onUseSkill 的 amotion 检查（原注释：战斗中几乎总是 return）
			this.bindings.castSkillDirect(skill.id, skill.level || 1, self.gid);
			this._markAction(key, Math.max(8000, slotDelay)); // 8s: 5s 施法 + 3s 网络/注册缓冲
			this._slotLastCast[idx] = Date.now();
			this._castingUntil = Date.now() + 8000; // 抑制巡逻移动
			return;
		}

		// 2. 道具页 BUFF 消耗品（T9.1：buff 消失门控 + 每格延迟；delay=0 时与原行为一致）
		for (let idx = 0; idx < this.auxList.length; idx++) {
			const aux = this.auxList[idx];
			if (!aux || aux.type !== AUX_TYPE_BUFF_ITEM) continue;
			const efst = getPrimaryEfst('items', aux.id);
			if (!efst) continue;
			if (this._buffMap[efst]) continue;
			const key = 'buff_' + efst;
			if (this._isOnCooldown(key)) continue;
			const auxDelay = Array.isArray(this.auxDelays) ? (this.auxDelays[idx] || 0) : 0;
			if (!slotReady(Date.now(), this._auxLastCast[idx] || 0, auxDelay)) continue;
			this.bindings.useItem(aux.id);
			this._auxLastCast[idx] = Date.now();
			this._markAction(key, 5000);
			return;
		}
	}

	// =================================================================
	// 捡拾循环（T6）+ 拾取结果校验
	// =================================================================

	/**
	 * Inventory addItem 钩子喂入：新物品进入背包回调（仅在有待校验拾取时处理）
	 * 校验不匹配 → 自动丢弃 + 黑名单该地面 GID（本会话不再拾取，防捡丢循环）
	 */
	onItemGained(item) {
		const pending = this._lootPending;
		if (!pending) return;
		this._lootPending = null;
		if (!item) return;
		const verdict = validateLootedItem(item, this.loot);
		if (verdict.keep) return;
		this._lootBlacklist.add(pending.gid);
		try {
			this.bindings.throwItem(item.index, item.count);
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
		const self = this.bindings.self();
		if (!self || self.dead) return;

		// 负重暂停：达阈值后不再发起新拾取（低于阈值自动恢复）
		if (self.weightPct !== null && self.weightPct !== undefined &&
			self.weightPct >= this.loot.weightPausePct) return;

		// 待校验拾取超时（3s）→ 拉黑该地面物品防无限重试（可能被他人拾走/异常）
		if (this._lootPending) {
			if (Date.now() - this._lootPending.tick > 3000) {
				this._lootBlacklist.add(this._lootPending.gid);
				this._lootPending = null;
			}
			return; // 一次只处理一个
		}

		// 扫描视野内地面物品：类型匹配 + 未拉黑 + 未消失，取最近
		let best = null;
		let bestDistSq = Infinity;
		this.bindings.forEachEntity(entity => {
			if (
				(entity.objecttype !== this.bindings.entityTypes.item &&
				 entity.objecttype !== this.bindings.entityTypes.item2) ||
				entity.remove_tick !== 0 ||
				this._lootBlacklist.has(entity.GID) ||
				!entity.ITID
			) return;
			const type = this.bindings.itemType(entity.ITID);
			if (type === null || type === undefined || !matchLootType(type, this.loot.types)) return;
			const dx = entity.position[0] - self.position[0];
			const dy = entity.position[1] - self.position[1];
			const distSq = dx * dx + dy * dy;
			if (distSq < bestDistSq) {
				bestDistSq = distSq;
				best = entity;
			}
		});
		if (!best) return;

		// 距离 > 2 格 → 移动向物品（节流防刷包）；≤2 格 → 发拾取封包并挂待校验
		const dx = best.position[0] - self.position[0];
		const dy = best.position[1] - self.position[1];
		if (dx * dx + dy * dy > 4) {
			if (this._isOnCooldown('loot_move')) return;
			this._markAction('loot_move', 600);
			this.bindings.moveTo(best.position[0], best.position[1]);
			return;
		}

		this.bindings.pickupItem(best.GID);
		this._lootPending = { gid: best.GID, tick: Date.now() };
	}

	// =================================================================
	// 目标选择（T4 白名单）
	// =================================================================

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
		this.bindings.forEachEntity(entity => {
			if (
				entity.objecttype === this.bindings.entityTypes.mob &&
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

	/** T4: 视野内最近的名单内活怪（欧氏最近；仅白名单非空时调用） */
	_findClosestTargetableMob(mapName) {
		const self = this.bindings.self();
		if (!self) return null;
		let closest = null;
		let closestDistSq = Infinity;
		this.bindings.forEachEntity(entity => {
			if (
				entity.GID === self.gid ||
				entity.objecttype !== this.bindings.entityTypes.mob ||
				entity.action === entity.ACTION.DIE ||
				entity.remove_tick !== 0 ||
				!this._isMobTargetable(entity, mapName)
			) return;
			const dx = entity.position[0] - self.position[0];
			const dy = entity.position[1] - self.position[1];
			const distSq = dx * dx + dy * dy;
			if (distSq < closestDistSq) {
				closestDistSq = distSq;
				closest = entity;
			}
		});
		return closest;
	}

	// =================================================================
	// 工具方法：冷却 / 物品
	// =================================================================

	/** 动作冷却系统 — 防止条件未满足时不停刷技能/消耗品 */
	_isOnCooldown(key) {
		return (this._actionCooldowns[key] || 0) > Date.now();
	}

	_markAction(key, cooldownMs) {
		this._actionCooldowns[key] = Date.now() + cooldownMs;
	}

	/** T9: 登记槽是否全部耗尽（未登记任何槽 = 不触发） */
	_allSlotsExhausted(slots) {
		const registered = (slots || []).filter(s => s && s.id);
		if (!registered.length) return false;
		return registered.every(s => this.bindings.itemCount(s.id) <= 0);
	}

	/** T9: 执行「瞬间移动」——移动页瞬移设定：登录技能（已学且SP足）→ 登录道具 → 兜底苍蝇翅膀 */
	_executeTeleport() {
		const tp = this.teleport;
		if (tp.skill.enabled && tp.skill.id && this.bindings.skillReady(tp.skill.id, tp.skill.level)) {
			this.bindings.castSkill(tp.skill.id, tp.skill.level || 1, this.bindings.self().gid);
			return true;
		}
		if (tp.item.enabled && tp.item.id && this.bindings.useItem(tp.item.id)) return true;
		return this.bindings.useItem(ITEM_FLY_WING); // 兜底（未配置时保持旧行为）
	}

	/**
	 * T9: 执行「返回储存点」——移动页返回设定：登录道具 → 登录技能（瞬间移动 Lv2）
	 * 兜底蝴蝶翅膀；返回是否成功
	 */
	_executeRetreat(cooldownKey) {
		const rt = this.retreat;
		if (rt.item.enabled && rt.item.id && this.bindings.useItem(rt.item.id)) return true;
		if (rt.skill.enabled && rt.skill.id && this.bindings.skillReady(rt.skill.id, rt.skill.level)) {
			this.bindings.castSkill(rt.skill.id, rt.skill.level || 1, this.bindings.self().gid);
			return true;
		}
		return this.bindings.useItem(ITEM_BUTTERFLY_WING); // 兜底（未配置时保持旧行为）
	}

	// =================================================================
	// 巡逻 / 传送门避让 / 返回挂机地图
	// =================================================================

	/**
	 * Bug 1 fix: 使用寻路验证巡逻目标可行走
	 * 策略1: searchLong 射线 — 沿随机方向走，悬崖/墙壁自动停在最远可达格
	 * 策略2: search A* 兜底 — range=8 接受目标附近可达点
	 * @returns {number[]|null} [x, y] 可行走目标坐标，或 null
	 */
	/**
	 * T9.3: 共享巡逻步（无怪分支/停止攻击转移动/追击拉黑期共用）：
	 * 行走中等待 → buff 施法期等待 → 1.5s 节流 → 寻路移动
	 */
	_patrolStep() {
		if (this.bindings.self().walking) return;
		if (Date.now() < this._castingUntil) return;
		if (Date.now() - this._lastPatrolMoveTick <= 1500) return;
		this._lastPatrolMoveTick = Date.now();
		const target = this._findPatrolTarget();
		if (!target) return; // 无可行走目标，原地等待
		this.bindings.moveTo(target[0], target[1]);
	}

	_findPatrolTarget() {
		const self = this.bindings.self();
		const cx = self.position[0] | 0;
		const cy = self.position[1] | 0;
		const out = [];

		// 策略1: 射线检测 — 沿随机方向直线行走，遇到悬崖/墙壁自动停止
		for (let attempt = 0; attempt < 8; attempt++) {
			const angle = Math.random() * Math.PI * 2;
			const dist = 15 + Math.floor(Math.random() * 10); // 15-24
			const tx = cx + Math.round(Math.cos(angle) * dist);
			const ty = cy + Math.round(Math.sin(angle) * dist);

			try {
				const result = this.bindings.pathSearchLong(cx, cy, tx, ty, 0, out);
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

			const pathLen = this.bindings.pathSearch(cx, cy, tx, ty, 8, out);
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
		const map = this._currentMapName();
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
	 * @param {number[]} pathOut - 寻路输出的平坦数组 [x0,y0,x1,y1,...]
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
		const self = this.bindings.self();
		const cx = self.position[0] | 0;
		const cy = self.position[1] | 0;
		const map = this._currentMapName();
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
		// T9.3: 落点半径逐级放宽（7→5→3）——门旁窄廊下固定 7 半径可能全部被拒
		// （目标点在门 7 格内 / safeEnd 无安全落脚点）→ 每秒重试永远失败 → 角色冻结。
		// 逐级放宽让角色先走出窄廊再正常巡逻；safeEnd 最低 1，仍绝不把落脚点放进门及相邻格
		for (const r of [7, 5, 3]) {
			for (const angle of angles) {
				const tx = Math.round(cx + Math.cos(angle) * 20);
				const ty = Math.round(cy + Math.sin(angle) * 20);
				if (this._isNearPortal(tx, ty, r)) continue;
				const moved = this._sendMoveTo(tx, ty, Math.max(1, r - 2));
				if (moved) return true;
			}
		}

		return false;
	}

	/**
	 * 发送移动指令到目标坐标（使用寻路 + 路径安全检查）
	 * 如果路径途经传送门区域，截断到安全的最远格子
	 */
	_sendMoveTo(tx, ty, safeRadius) {
		const self = this.bindings.self();
		const cx = self.position[0] | 0;
		const cy = self.position[1] | 0;
		const out = [];
		if (safeRadius === undefined) safeRadius = 5;
		try {
			const pathLen = this.bindings.pathSearch(cx, cy, tx, ty, 8, out);
			if (pathLen > 2) {
				// 从路径末端向前找第一个不在传送门附近的格子（半径由调用方逐级放宽）
				let safeEnd = -1;
				for (let i = pathLen - 1; i >= 1; i--) {
					const px = out[i * 2];
					const py = out[i * 2 + 1];
					if (px !== undefined && py !== undefined && !this._isNearPortal(px, py, safeRadius)) {
						safeEnd = i;
						break;
					}
				}
				if (safeEnd < 1) return false; // 无安全落脚点

				const destX = out[safeEnd * 2];
				const destY = out[safeEnd * 2 + 1];
				this.bindings.moveTo(destX, destY);
				return true;
			}
		} catch (_) {}
		return false;
	}

	/**
	 * 返回挂机地图 — BFS 最短路径搜索（MAP_CONNECTIONS 邻接表）
	 * 策略：BFS 从 currentMap 到 huntMap 记录第一跳传送门坐标 → 走过去；
	 * 找不到路径 → 原地等待（不乱走）
	 */
	_returnToHuntMap() {
		const self = this.bindings.self();
		const currentMap = this._currentMapName();
		const huntMap = (this._huntMapName || '').replace(/\.gat$/i, '').toLowerCase();

		if (!self || !currentMap || !huntMap) {
			return;
		}

		// 角色正在行走中，等待到达
		if (self.walking) {
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
				if (this.events.onError) this.events.onError('地图连接数据为空，无法寻路返回');
				return;
			}

			// BFS — 队列元素: { map, firstX, firstY }（firstX/firstY = 从 currentMap 出发的第一跳传送门）
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
				if (this.events.onError) this.events.onError('找不到传送门路径: ' + currentMap + ' → ' + huntMap);
				return;
			}
		} catch (e) {
			console.error('[BotAutoHunt] BFS pathfinding error:', e);
			return;
		}

		// 目标点设在传送门对面 — 强制路径穿过传送门坐标触发传送
		const cx = self.position[0];
		const cy = self.position[1];
		const dx = targetX - cx;
		const dy = targetY - cy;
		const dist = Math.sqrt(dx * dx + dy * dy);
		let destX, destY;
		if (dist < 1) {
			// 已在传送门上 — 向可行走方向走一步触发
			for (const [ox, oy] of [[2, 0], [-2, 0], [0, 2], [0, -2]]) {
				const nx = targetX + ox;
				const ny = targetY + oy;
				if (this.bindings.isWalkable(nx, ny)) {
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
			if (this.bindings.isWalkable(extX, extY)) {
				destX = extX;
				destY = extY;
			} else {
				// 延长点不可走 → 直接走到传送门坐标（可能停在旁边，下次重试）
				destX = targetX;
				destY = targetY;
			}
		}

		this.bindings.moveTo(destX, destY);
	}
}

export default HuntEngine;
