/**
 * Plugins/BotAutoHunt/settings/schema.js
 *
 * 自动战斗设置 schema v3 — 结构迁移纯函数（零游戏依赖，可测试）
 *
 * v3 语义（对齐官方《RO乐园》自动战斗公告 PDF 逐页截图）：
 *   - skills 数组固定 8 槽：[0..3] = 攻击组（attack/heal 类型），[4..7] = 辅助组（buff 类型）
 *   - slotDelays 数组 8 项，与 skills 下标对齐
 *   - potions：药水设定页官方四槽模型 hp×2 + sp×2，每槽 {id, threshold, enabled}
 *   - cure：状态异常恢复（解毒药/万能药 + 启用开关）
 *   - returnVillage：返回村庄设定（官方药水页分页2）
 *   - teleport/retreat：移动设定页官方四槽（瞬移/返回 × 道具/技能）
 *   - SP 经济规则/画面怪数瞬移/MVP 瞬移：官方基本设定页行为清单
 *
 * 分类迁移（attack→heal/buff 重分类）依赖游戏数据（HEAL_SKILL_IDS/efst-map），
 * 由 BotAutoHunt._loadSettings 在调用本模块前完成——本模块只做结构迁移。
 *
 * 位于 settings/ 子目录：PluginManager glob 不会误加载（同 SettingsWindow.js）。
 */

export const SCHEMA_VERSION = 3;
export const ATTACK_SLOT_COUNT = 4;
export const SUPPORT_SLOT_COUNT = 4;
export const TOTAL_SLOT_COUNT = ATTACK_SLOT_COUNT + SUPPORT_SLOT_COUNT;

/** 判断技能项是否属于攻击组（attack/heal 双模式） */
function isAttackGroupItem(item) {
	if (!item || !item.id) return false;
	return item.type === 'attack' || item.type === 'heal';
}

/** 判断技能项是否属于辅助组（buff） */
function isSupportGroupItem(item) {
	if (!item || !item.id) return false;
	return item.type === 'buff';
}

/**
 * 用药阈值决策（纯函数，T3）：给定当前 HP/SP 百分比与设置，返回各触发项
 * 判定与 _potionLoopInner 一致：严格小于阈值才触发（等于不触发）；
 * 低血飞翅固定 10% 且需开关开启
 *
 * @param {number} hpPct 当前 HP 百分比（0-100）
 * @param {number} spPct 当前 SP 百分比（0-100）
 * @param {{ hpThreshold?: number, spThreshold?: number, flyLowHp?: boolean }} opts
 * @return {{ lowHpFlyWing: boolean, hpPotion: boolean, spPotion: boolean }}
 */
export function evaluateThresholds(hpPct, spPct, opts) {
	const o = opts || {};
	const hpThreshold = typeof o.hpThreshold === 'number' ? o.hpThreshold : 70;
	const spThreshold = typeof o.spThreshold === 'number' ? o.spThreshold : 30;
	return {
		lowHpFlyWing: !!(o.flyLowHp && hpPct < 10),
		hpPotion: hpPct < hpThreshold,
		spPotion: spPct < spThreshold
	};
}

/**
 * 无怪动作回落链决策（纯函数，T5）：瞬移 → 苍蝇翅膀 → 随机步行
 * 关闭无怪自动移动时永远步行（保持原巡逻行为）
 *
 * @param {{ flyNoMobs?: boolean, teleportReady?: boolean }} opts
 * @return {'teleport'|'flywing'|'walk'} teleport/flywing 由调用方执行后重置计时；walk 落回巡逻分支
 */
export function decideNoMobAction(opts) {
	const o = opts || {};
	if (!o.flyNoMobs) return 'walk';
	if (o.teleportReady) return 'teleport';
	return 'flywing';
}

/**
 * 药水四槽决策（纯函数，T9 官方药水页模型）：给定当前 HP/SP 百分比与四槽配置，
 * 返回该使用的槽位（同类型内自左向右第一个满足「启用+已登记道具+低于阈值」的槽）
 *
 * @param {{hp: Array<{id: number, threshold: number, enabled: boolean}>, sp: Array<同>}} potions
 * @param {number} hpPct 当前 HP 百分比
 * @param {number} spPct 当前 SP 百分比
 * @return {{hpSlot: number, spSlot: number}} 命中槽下标；-1 = 无命中
 */
export function evaluatePotionSlots(potions, hpPct, spPct) {
	const p = potions || {};
	function firstHit(list, pct) {
		const arr = Array.isArray(list) ? list : [];
		for (let i = 0; i < arr.length; i++) {
			const s = arr[i];
			if (!s || !s.enabled || !s.id) continue;
			if (pct < s.threshold) return i;
		}
		return -1;
	}
	return {
		hpSlot: firstHit(p.hp, hpPct),
		spSlot: firstHit(p.sp, spPct)
	};
}

/**
 * SP 经济规则决策（纯函数，T9 官方基本设定页）：
 * 规则1（仅一般攻击，优先度高）命中优先于规则2（停止攻击后自动移动）
 *
 * @param {number} spPct 当前 SP 百分比
 * @param {{normalAttack?: {enabled?: boolean, threshold?: number}, stopAttackMove?: {enabled?: boolean, threshold?: number}}} cfg
 * @return {'normal-attack-only'|'stop-and-move'|'normal'}
 */
export function decideSpEconomy(spPct, cfg) {
	const c = cfg || {};
	const na = c.normalAttack || {};
	const sa = c.stopAttackMove || {};
	if (na.enabled && typeof na.threshold === 'number' && spPct < na.threshold) return 'normal-attack-only';
	if (sa.enabled && typeof sa.threshold === 'number' && spPct < sa.threshold) return 'stop-and-move';
	return 'normal';
}

/**
 * 地面掉落物类型匹配（纯函数，T6）
 * 分类映射：消耗品 = HEALING(0)/USABLE(2)/DELAYCONSUME(11)/CASH(18)；
 * 武器 = WEAPON(5)；防具 = ARMOR(4)/SHADOWGEAR(12)；其他 = 其余全部
 *
 * @param {number} itemType IT_* 类型
 * @param {{consumable?: boolean, weapon?: boolean, armor?: boolean, etc?: boolean}} types 类型勾选
 * @return {boolean}
 */
export function matchLootType(itemType, types) {
	const t = types || {};
	switch (itemType) {
		case 0: case 2: case 11: case 18: return !!t.consumable;
		case 5: return !!t.weapon;
		case 4: case 12: return !!t.armor;
		default: return !!t.etc;
	}
}

/**
 * 拾取后校验（纯函数，T6）：精炼/卡片下限仅对武器/防具生效（消耗品等无此属性）
 * 卡片数 = slot.card1-4 中非零项数
 *
 * @param {{type: number, RefiningLevel?: number, slot?: {card1?: number, card2?: number, card3?: number, card4?: number}}} item 背包物品
 * @param {{refineMin?: number, cardMin?: number}} lootCfg
 * @return {{keep: boolean, reason?: 'refine'|'card'}}
 */
export function validateLootedItem(item, lootCfg) {
	const cfg = lootCfg || {};
	const it = item || {};
	const refineMin = typeof cfg.refineMin === 'number' ? cfg.refineMin : 0;
	const cardMin = typeof cfg.cardMin === 'number' ? cfg.cardMin : 0;
	const isEquip = it.type === 5 || it.type === 4 || it.type === 12;
	if (!isEquip) return { keep: true };
	if (refineMin > 0 && (it.RefiningLevel || 0) < refineMin) return { keep: false, reason: 'refine' };
	if (cardMin > 0) {
		const s = it.slot || {};
		const cards = [s.card1, s.card2, s.card3, s.card4].filter(c => typeof c === 'number' && c > 0).length;
		if (cards < cardMin) return { keep: false, reason: 'card' };
	}
	return { keep: true };
}

/**
 * 异常状态解除判定（纯函数，T7）
 * 三通道任一命中即视为状态活跃：opt1/opt2 位掩码（Opt 通道，无图标状态如中毒）
 * 或 efst（图标通道，_buffMap 由 StatusIcons.update 钩子维护）
 *
 * @param {Array<{efst?: number, opt1?: number, opt2?: number}>} watchList 该解除药覆盖的状态清单
 * @param {{efstMap: object, bodyState: number, healthState: number}} channels 运行时三通道
 * @return {boolean}
 */
export function isCureStatusActive(watchList, channels) {
	const ch = channels || {};
	const map = ch.efstMap || {};
	const body = ch.bodyState || 0;
	const health = ch.healthState || 0;
	const list = Array.isArray(watchList) ? watchList : [];
	for (const s of list) {
		if (!s) continue;
		if (s.opt1 && (body & s.opt1) !== 0) return true;
		if (s.opt2 && (health & s.opt2) !== 0) return true;
		if (s.efst && map[s.efst]) return true;
	}
	return false;
}

/**
 * 魔物白名单判定（纯函数，T4）
 * 名单为空/未配置 → 不过滤（所有魔物可攻击）；非空 → 仅名单内可攻击
 *
 * @param {number} jobId 魔物种族 ID（Entity.job，非 GID）
 * @param {{[map: string]: number[]}|null|undefined} whitelistByMap 按地图记忆的白名单
 * @param {string} mapName 当前地图名
 * @return {boolean} true=可攻击
 */
export function mobInWhitelist(jobId, whitelistByMap, mapName) {
	if (!whitelistByMap || typeof whitelistByMap !== 'object') return true;
	const list = whitelistByMap[mapName];
	if (!Array.isArray(list) || list.length === 0) return true;
	return list.indexOf(jobId) !== -1;
}

/**
 * 结构迁移：任意输入 → 合法的 v2 设置对象
 *
 * @param {*} saved  localStorage 解析结果（可能损坏/缺字段/旧版本）
 * @return {Object}  v2 规范化对象（含 v/skills/slotDelays 及透传字段）
 */
export function migrateSettings(saved) {
	const src = saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};

	// ---- 技能槽：按类型分组重排（攻击组 ≤4，辅助组 ≤4，超出丢弃——新模型不可表示）----
	const attackGroup = [];
	const supportGroup = [];
	const srcSkills = Array.isArray(src.skills) ? src.skills : [];
	for (const item of srcSkills) {
		if (!item || !item.id) continue;
		if (isAttackGroupItem(item) && attackGroup.length < ATTACK_SLOT_COUNT) {
			attackGroup.push(item);
		} else if (isSupportGroupItem(item) && supportGroup.length < SUPPORT_SLOT_COUNT) {
			supportGroup.push(item);
		}
	}

	const skills = [];
	for (let i = 0; i < ATTACK_SLOT_COUNT; i++) {
		skills.push(attackGroup[i] || null);
	}
	for (let i = 0; i < SUPPORT_SLOT_COUNT; i++) {
		skills.push(supportGroup[i] || null);
	}

	// ---- 每槽延迟：8 项，与 skills 下标对齐，非法值归 0 ----
	const srcDelays = Array.isArray(src.slotDelays) ? src.slotDelays : [];
	const slotDelays = [];
	for (let i = 0; i < TOTAL_SLOT_COUNT; i++) {
		const d = typeof srcDelays[i] === 'number' && srcDelays[i] >= 0 && isFinite(srcDelays[i])
			? Math.round(srcDelays[i])
			: 0;
		slotDelays.push(d);
	}

	// ---- T4: 魔物白名单（按地图记忆：{ 地图名: [种族ID...] }，非法项过滤去重） ----
	const mobWhitelist = {};
	if (src.mobWhitelist && typeof src.mobWhitelist === 'object' && !Array.isArray(src.mobWhitelist)) {
		for (const mapKey of Object.keys(src.mobWhitelist)) {
			const arr = Array.isArray(src.mobWhitelist[mapKey])
				? src.mobWhitelist[mapKey].filter(id => typeof id === 'number' && id > 0 && isFinite(id))
				: [];
			if (arr.length) mobWhitelist[String(mapKey).slice(0, 64)] = [...new Set(arr)];
		}
	}

	// ---- T5: 无怪触发秒数（1-60 整数，缺省 10=官方截图默认值） ----
	const rawNoMobSeconds = typeof src.noMobSeconds === 'number' && isFinite(src.noMobSeconds) ? Math.round(src.noMobSeconds) : 10;

	// ---- T6: 捡拾配置（缺省：开启 + 全类型 + 不校验精炼卡片 + 90% 负重暂停） ----
	const srcLoot = src.loot && typeof src.loot === 'object' && !Array.isArray(src.loot) ? src.loot : {};
	const bool_ = v => typeof v === 'boolean' ? v : true;
	const clampInt = (v, lo, hi, def) => {
		const n = typeof v === 'number' && isFinite(v) ? Math.round(v) : def;
		return Math.min(hi, Math.max(lo, n));
	};
	const loot = {
		enabled: srcLoot.enabled !== undefined && typeof srcLoot.enabled === 'boolean' ? srcLoot.enabled : true,
		types: {
			consumable: bool_(srcLoot.types ? srcLoot.types.consumable : undefined),
			weapon: bool_(srcLoot.types ? srcLoot.types.weapon : undefined),
			armor: bool_(srcLoot.types ? srcLoot.types.armor : undefined),
			etc: bool_(srcLoot.types ? srcLoot.types.etc : undefined)
		},
		refineMin: clampInt(srcLoot.refineMin, 0, 10, 0),
		cardMin: clampInt(srcLoot.cardMin, 0, 4, 0),
		weightPausePct: clampInt(srcLoot.weightPausePct, 0, 100, 90)
	};

	// ---- T7: 解除药槽位（{ poison: 物品ID, panacea: 物品ID }，0 = 空） ----
	const srcCure = src.cureItems && typeof src.cureItems === 'object' && !Array.isArray(src.cureItems) ? src.cureItems : {};
	const normCureId = v => (typeof v === 'number' && v > 0 && isFinite(v)) ? Math.round(v) : 0;
	const cureItems = {
		poison: normCureId(srcCure.poison),
		panacea: normCureId(srcCure.panacea)
	};

	// ---- T9: 药水四槽（官方药水页模型：hp×2 + sp×2，每槽 {id, threshold, enabled}） ----
	// v2 迁移：auxList 按 subtype 分流（hp/both→hp 槽，sp/both→sp 槽，按原顺序）;
	// v2 的 hp/sp 顶栏字段 = 旧共享阈值 → 作为各槽默认阈值；autoPotion → 各槽启用开关
	const boolOr = (v, def) => typeof v === 'boolean' ? v : def;
	const slotDef = (raw, defThreshold, defEnabled) => ({
		id: normCureId(raw && raw.id),
		threshold: clampInt(raw && raw.threshold, 0, 100, defThreshold),
		enabled: boolOr(raw && raw.enabled, defEnabled)
	});
	const srcPotions = src.potions && typeof src.potions === 'object' && !Array.isArray(src.potions) ? src.potions : null;
	const legacyHpThreshold = typeof src.hp === 'number' && isFinite(src.hp) ? Math.round(src.hp) : 70;
	const legacySpThreshold = typeof src.sp === 'number' && isFinite(src.sp) ? Math.round(src.sp) : 30;
	// T9: 全新用户（无 v2 autoPotion 字段）→ 官方默认启用；v2 autoPotion=false → 迁移保留旧意愿
	const legacyAutoPotion = src.autoPotion === undefined ? true : !!src.autoPotion;
	let hpSlots = null;
	let spSlots = null;
	if (srcPotions) {
		hpSlots = Array.isArray(srcPotions.hp) ? srcPotions.hp.slice(0, 2) : [];
		spSlots = Array.isArray(srcPotions.sp) ? srcPotions.sp.slice(0, 2) : [];
	} else {
		// v2→v3：auxList 分流（保持原相对顺序）
		hpSlots = [];
		spSlots = [];
		const srcAux = Array.isArray(src.aux) ? src.aux : [];
		for (const a of srcAux) {
			if (!a || a.type !== 'potion' || !a.id) continue;
			const sub = a.subtype || 'hp';
			if (sub === 'hp' && hpSlots.length < 2) hpSlots.push({ id: a.id });
			else if (sub === 'sp' && spSlots.length < 2) spSlots.push({ id: a.id });
			else if (sub === 'both') {
				if (hpSlots.length < 2) hpSlots.push({ id: a.id });
				if (spSlots.length < 2) spSlots.push({ id: a.id });
			}
		}
	}
	const potions = {
		hp: [0, 1].map(i => slotDef(hpSlots[i], legacyHpThreshold, legacyAutoPotion)),
		sp: [0, 1].map(i => slotDef(spSlots[i], legacySpThreshold, legacyAutoPotion))
	};

	// ---- T9: 状态异常恢复开关（官方药水页分页2 ON/OFF；解除药槽沿用 cureItems） ----
	const srcCureCfg = src.cure && typeof src.cure === 'object' && !Array.isArray(src.cure) ? src.cure : {};
	const cure = {
		enabled: boolOr(srcCureCfg.enabled, true),
		poison: normCureId(typeof srcCureCfg.poison === 'number' ? srcCureCfg.poison : cureItems.poison),
		panacea: normCureId(typeof srcCureCfg.panacea === 'number' ? srcCureCfg.panacea : cureItems.panacea)
	};

	// ---- T9: 返回村庄设定（官方药水页分页2：药水用完→用返回道具/技能回村） ----
	const srcRv = src.returnVillage && typeof src.returnVillage === 'object' && !Array.isArray(src.returnVillage) ? src.returnVillage : {};
	const returnVillage = {
		enabled: boolOr(srcRv.enabled, false),
		onPotionsEmpty: boolOr(srcRv.onPotionsEmpty, false),
		onCureEmpty: boolOr(srcRv.onCureEmpty, false)
	};

	// ---- T9: 移动四槽（官方移动设定页：瞬移/返回儲存點 × 道具/技能） ----
	// v2 迁移：瞬移=苍蝇翅膀(601)+瞬间移动lv1、返回=蝴蝶翅肢(602)+瞬间移动lv2（原回落链硬编码）
	const srcTp = src.teleport && typeof src.teleport === 'object' && !Array.isArray(src.teleport) ? src.teleport : {};
	const srcRt = src.retreat && typeof src.retreat === 'object' && !Array.isArray(src.retreat) ? src.retreat : {};
	function normSlotCfg(raw, def) {
		const r = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
		const item = r.item && typeof r.item === 'object' ? r.item : {};
		const skill = r.skill && typeof r.skill === 'object' ? r.skill : {};
		return {
			item: { enabled: boolOr(item.enabled, def.item.enabled), id: normCureId(typeof item.id === 'number' ? item.id : def.item.id) },
			skill: {
				enabled: boolOr(skill.enabled, def.skill.enabled),
				id: normCureId(typeof skill.id === 'number' ? skill.id : def.skill.id),
				level: clampInt(skill.level, 1, 10, def.skill.level)
			}
		};
	}
	const teleport = normSlotCfg(srcTp, { item: { enabled: true, id: 601 }, skill: { enabled: true, id: 28, level: 1 } });
	const retreat = normSlotCfg(srcRt, { item: { enabled: true, id: 602 }, skill: { enabled: true, id: 28, level: 2 } });

	// ---- T9: SP 经济规则（官方基本设定页：规则1 仅一般攻击优先度高；规则2 停止攻击后自动移动） ----
	const srcSpNa = src.spNormalAttack && typeof src.spNormalAttack === 'object' ? src.spNormalAttack : {};
	const srcSpSa = src.spStopAttackMove && typeof src.spStopAttackMove === 'object' ? src.spStopAttackMove : {};
	const spNormalAttack = {
		enabled: boolOr(srcSpNa.enabled, false),
		threshold: clampInt(srcSpNa.threshold, 0, 100, 10)
	};
	const spStopAttackMove = {
		enabled: boolOr(srcSpSa.enabled, false),
		threshold: clampInt(srcSpSa.threshold, 0, 100, 5)
	};

	// ---- T9: 画面怪数瞬移（官方基本设定页：画面内魔物超过 X 只时使用瞬移） ----
	const srcFmc = src.flyOnMobCount && typeof src.flyOnMobCount === 'object' ? src.flyOnMobCount : {};
	const flyOnMobCount = {
		enabled: boolOr(srcFmc.enabled, false),
		count: clampInt(srcFmc.count, 1, 99, 20)
	};

	return {
		v: SCHEMA_VERSION,
		skills: skills,
		aux: (Array.isArray(src.aux) ? src.aux : []).filter(it => it && it.type !== 'potion'), // T9: 仅存 BUFF 道具（potion 类型已分流至 potions 四槽；道具设定页 UI 待官方素材）
		slotDelays: slotDelays,
		follow: !!src.follow,
		followTarget: typeof src.followTarget === 'string' ? src.followTarget : '',
		flyNoMobs: src.flyNoMobs === undefined ? true : !!src.flyNoMobs, // T9: 官方默认勾选（无怪瞬移开启）
		flyLowHp: !!src.flyLowHp,
		normalAttack: src.normalAttack !== false, // T2: 普通攻击开关（默认开启；旧档无字段=开启）
		mobWhitelist: mobWhitelist, // T4: 魔物白名单（按地图记忆）
		noMobSeconds: Math.min(60, Math.max(1, rawNoMobSeconds)), // T5: 无怪触发秒数（1-60）
		returnToMap: src.returnToMap !== false, // T5: 被传送后返回挂机地图（默认开启；旧档无字段=开启）
		loot: loot, // T6: 捡拾配置
		potions: potions, // T9: 药水四槽（官方模型）
		cure: cure, // T9: 状态异常恢复（启用开关+两槽）
		returnVillage: returnVillage, // T9: 返回村庄设定
		teleport: teleport, // T9: 瞬间移动使用设定（道具/技能槽）
		retreat: retreat, // T9: 返回储存点使用设定（道具/技能槽）
		spNormalAttack: spNormalAttack, // T9: SP<阈值 仅一般攻击（优先度高）
		spStopAttackMove: spStopAttackMove, // T9: SP<阈值 停止攻击后自动移动
		flyOnMobCount: flyOnMobCount, // T9: 画面内魔物超过 X 只时瞬移
		flyOnMvp: src.flyOnMvp === undefined ? true : !!src.flyOnMvp // T9: MVP 首领登场时瞬移（官方默认勾选）
	};
}

/**
 * 判断某槽位技能当前是否可施放（每槽延迟判定）
 *
 * @param {number} now      当前时间戳（Date.now()）
 * @param {number} lastCast 该槽上次施放时间戳（0=从未施放）
 * @param {number} delay    该槽延迟（ms，0=不限）
 * @return {boolean} true=可施放
 */
export function slotReady(now, lastCast, delay) {
	if (!delay || delay <= 0) return true;
	if (!lastCast || lastCast <= 0) return true; // 从未施放 → 可施放
	return now >= lastCast + delay;
}

// T7: 解除药覆盖的状态清单（与生成器 efst-map cure 条目同源；opt1/opt2 位见 rAthena status.hpp）
// 解毒药系（绿色药水等）：中毒/沉默/黑暗/混乱/幻觉（幻觉走图标通道 EFST_ILLUSION=34）
// 万能药系：在解毒基础上增加诅咒（opt2 0x0002）
export const CURE_WATCH_LISTS = {
	poison: [
		{ opt2: 0x0001 },
		{ opt2: 0x0004 },
		{ opt2: 0x0010 },
		{ opt2: 0x0008 },
		{ efst: 34 }
	],
	panacea: [
		{ opt2: 0x0001 },
		{ opt2: 0x0002 },
		{ opt2: 0x0004 },
		{ opt2: 0x0008 },
		{ opt2: 0x0010 },
		{ efst: 34 }
	]
};

export default { SCHEMA_VERSION, migrateSettings, slotReady };
