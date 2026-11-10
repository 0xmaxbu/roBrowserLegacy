import { describe, it, expect } from 'vitest';

// schema.js 是零游戏依赖纯函数模块，无需 mock
import {
	migrateSettings,
	slotReady,
	shouldLowHpFlyWing,
	mobInWhitelist,
	decideNoMobAction,
	decideSitRecover,
	matchLootType,
	validateLootedItem,
	isCureStatusActive,
	evaluatePotionSlots,
	decideSpEconomy,
	CURE_WATCH_LISTS,
	SCHEMA_VERSION,
	TOTAL_SLOT_COUNT
} from '../src/Plugins/BotAutoHunt/settings/schema.js';

describe('schema v3 结构迁移 migrateSettings', () => {
	it('空/损坏输入 → v3 默认值（8 空槽 + 0 延迟 + 官方四槽/触发器默认）', () => {
		for (const bad of [null, undefined, 'garbage', 42, []]) {
			const s = migrateSettings(bad);
			expect(s.v).toBe(SCHEMA_VERSION);
			expect(s.skills).toHaveLength(TOTAL_SLOT_COUNT);
			expect(s.skills.every(k => k === null)).toBe(true);
			expect(s.slotDelays).toHaveLength(TOTAL_SLOT_COUNT);
			expect(s.slotDelays.every(d => d === 0)).toBe(true);
			expect(s.aux).toEqual([null, null, null, null, null, null, null, null]); // T9.1: 道具页 8 槽
			expect(s.auxDelays).toEqual([0, 0, 0, 0, 0, 0, 0, 0]); // T9.1: 每格延迟默认 0
			// T9 官方四槽默认（空登记 + 官方阈值 + 启用）
			expect(s.potions.hp).toEqual([
				{ id: 0, threshold: 70, enabled: true },
				{ id: 0, threshold: 70, enabled: true }
			]);
			expect(s.potions.sp).toEqual([
				{ id: 0, threshold: 70, enabled: true },
				{ id: 0, threshold: 70, enabled: true }
			]);
			expect(s.cure).toEqual({ enabled: true, poison: 0, panacea: 0 });
			expect(s.flyNoMobs).toBe(true); // 官方默认勾选
			expect(s.flyOnMvp).toBe(true); // 官方默认勾选
			expect(s.noMobSeconds).toBe(10); // 官方默认 10 秒
		}
	});

	it('v1 旧格式（无 v/delay 字段）→ 规范化：数据保留、延迟补 0、药水链分流四槽', () => {
		const v1 = {
			hp: 60,
			sp: 25,
			skills: [
				{ id: 5, type: 'attack', level: 5, maxLevel: 10, spcost: 20 },
				{ id: 28, type: 'heal', level: 3, maxLevel: 10, spcost: 15 },
				null,
				{ id: 66, type: 'buff', level: 8, maxLevel: 10, spcost: 30 },
				{ id: 6, type: 'attack', level: 7, maxLevel: 10, spcost: 22 }
			],
			aux: [{ id: 501, type: 'potion', subtype: 'hp' }],
			flyNoMobs: true,
			autoPotion: true
		};
		const s = migrateSettings(v1);
		expect(s.v).toBe(SCHEMA_VERSION);
		// 攻击组在前（attack/heal 保序）：5, 28, 6 → 槽 0/1/2
		expect(s.skills[0]).toEqual({ id: 5, type: 'attack', level: 5, maxLevel: 10, spcost: 20 });
		expect(s.skills[1]).toEqual({ id: 28, type: 'heal', level: 3, maxLevel: 10, spcost: 15 });
		expect(s.skills[2]).toEqual({ id: 6, type: 'attack', level: 7, maxLevel: 10, spcost: 22 });
		expect(s.skills[3]).toBeNull();
		// 辅助组在后：buff 66 → 槽 4
		expect(s.skills[4]).toEqual({ id: 66, type: 'buff', level: 8, maxLevel: 10, spcost: 30 });
		// 延迟全部补 0
		expect(s.slotDelays).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
		// T9: v2 药水 potion 项分流到 potions.hp 槽（继承旧阈值/开关），aux 只剩非 potion 项
		expect(s.potions.hp[0]).toEqual({ id: 501, threshold: 60, enabled: true });
		expect(s.potions.hp[1].id).toBe(0);
		expect(s.potions.sp.every(sl => sl.id === 0)).toBe(true);
		expect(s.aux).toEqual([null, null, null, null, null, null, null, null]); // T9.1: 非 buff_item 项不入道具页槽
		expect(s.auxDelays).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
		expect(s.flyNoMobs).toBe(true);
		expect(s.follow).toBe(false);
	});

	it('攻击组超 4 个 → 保留前 4，超出丢弃（4+4 模型不可表示）', () => {
		const v1 = {
			skills: [
				{ id: 1, type: 'attack', level: 1 },
				{ id: 2, type: 'attack', level: 1 },
				{ id: 3, type: 'attack', level: 1 },
				{ id: 4, type: 'attack', level: 1 },
				{ id: 5, type: 'attack', level: 1 },
				{ id: 6, type: 'attack', level: 1 }
			]
		};
		const s = migrateSettings(v1);
		const kept = s.skills.slice(0, 4).filter(Boolean).map(k => k.id);
		expect(kept).toEqual([1, 2, 3, 4]);
		// 辅助组无 buff 项 → 槽 4-7 全空
		expect(s.skills.slice(4).every(k => k === null)).toBe(true);
	});

	it('辅助组超 4 个 → 同样截断', () => {
		const v1 = {
			skills: [
				{ id: 61, type: 'buff', level: 1 },
				{ id: 62, type: 'buff', level: 1 },
				{ id: 63, type: 'buff', level: 1 },
				{ id: 64, type: 'buff', level: 1 },
				{ id: 65, type: 'buff', level: 1 }
			]
		};
		const s = migrateSettings(v1);
		const kept = s.skills.slice(4, 8).filter(Boolean).map(k => k.id);
		expect(kept).toEqual([61, 62, 63, 64]);
	});

	it('v2 已迁移数据 → 幂等透传（重排不改变合法布局，旧共享阈值入槽）', () => {
		const v2 = {
			v: 2,
			hp: 80,
			sp: 40,
			skills: [
				{ id: 5, type: 'attack', level: 5, delay: 800 },
				null,
				null,
				null,
				{ id: 66, type: 'buff', level: 8 },
				null,
				null,
				null
			],
			slotDelays: [800, 0, 0, 0, 500, 0, 0, 0],
			autoPotion: true
		};
		const s = migrateSettings(v2);
		expect(s.v).toBe(SCHEMA_VERSION);
		expect(s.skills[0]).toEqual({ id: 5, type: 'attack', level: 5, delay: 800 });
		expect(s.skills[4]).toEqual({ id: 66, type: 'buff', level: 8 });
		expect(s.slotDelays).toEqual([800, 0, 0, 0, 500, 0, 0, 0]);
		// T9: v2 共享阈值 → 四槽默认阈值（未登记 id 时也保留阈值）
		expect(s.potions.hp.every(sl => sl.threshold === 80 && sl.enabled === true)).toBe(true);
		expect(s.potions.sp.every(sl => sl.threshold === 40 && sl.enabled === true)).toBe(true);
	});

	it('slotDelays 非法值（负数/非数/NaN）→ 归 0', () => {
		const s = migrateSettings({ slotDelays: [-5, 'abc', NaN, 1.9, 0, 0, 0, 0] });
		expect(s.slotDelays[0]).toBe(0);
		expect(s.slotDelays[1]).toBe(0);
		expect(s.slotDelays[2]).toBe(0);
		expect(s.slotDelays[3]).toBe(2); // 四舍五入
	});

	it('normalAttack：缺省/损坏输入 → 默认开启；显式 false 保留；非布尔归一', () => {
		expect(migrateSettings(null).normalAttack).toBe(true);
		expect(migrateSettings({}).normalAttack).toBe(true);
		expect(migrateSettings({ normalAttack: false }).normalAttack).toBe(false);
		expect(migrateSettings({ normalAttack: 'no' }).normalAttack).toBe(true); // 非布尔非 false → 开启
	});

	it('shouldLowHpFlyWing：严格小于 10% 才触发（等于不触发），需开关开启', () => {
		expect(shouldLowHpFlyWing(9.9, true)).toBe(true);
		expect(shouldLowHpFlyWing(10, true)).toBe(false);
		expect(shouldLowHpFlyWing(10.1, true)).toBe(false);
		expect(shouldLowHpFlyWing(0, true)).toBe(true);
		expect(shouldLowHpFlyWing(100, true)).toBe(false);
		expect(shouldLowHpFlyWing(9.9, false)).toBe(false);
		expect(shouldLowHpFlyWing(9.9, undefined)).toBe(false);
		expect(shouldLowHpFlyWing(NaN, true)).toBe(false);
	});

	it('mobInWhitelist：空白单/未配置 = 不过滤；非空只放行名单内', () => {
		const wl = { 'prontera': [1002, 1113] };
		expect(mobInWhitelist(1002, wl, 'prontera')).toBe(true);
		expect(mobInWhitelist(1011, wl, 'prontera')).toBe(false);
		// 空名单/未配置地图/损坏输入 → 不过滤
		expect(mobInWhitelist(1002, { 'prontera': [] }, 'prontera')).toBe(true);
		expect(mobInWhitelist(1002, wl, 'geffen')).toBe(true);
		expect(mobInWhitelist(1002, null, 'prontera')).toBe(true);
		expect(mobInWhitelist(1002, undefined, 'prontera')).toBe(true);
	});

	it('decideNoMobAction：回落链 瞬移→苍蝇→步行，关闭时永远步行', () => {
		expect(decideNoMobAction({ flyNoMobs: true, teleportReady: true })).toBe('teleport');
		expect(decideNoMobAction({ flyNoMobs: true, teleportReady: false })).toBe('flywing');
		expect(decideNoMobAction({ flyNoMobs: false, teleportReady: true })).toBe('walk');
		expect(decideNoMobAction({ flyNoMobs: false })).toBe('walk');
		expect(decideNoMobAction({})).toBe('walk');
	});

	it('noMobSeconds/returnToMap 迁移：秒数钳 1-60 并取整，返回开关缺省开启，缺省 10 秒', () => {
		expect(migrateSettings({ noMobSeconds: 0 }).noMobSeconds).toBe(1);
		expect(migrateSettings({ noMobSeconds: 100 }).noMobSeconds).toBe(60);
		expect(migrateSettings({ noMobSeconds: 7.6 }).noMobSeconds).toBe(8);
		expect(migrateSettings({}).noMobSeconds).toBe(10); // T9: 官方默认 10 秒
		expect(migrateSettings({ noMobSeconds: 'x' }).noMobSeconds).toBe(10);
		expect(migrateSettings({}).returnToMap).toBe(true);
		expect(migrateSettings({ returnToMap: false }).returnToMap).toBe(false);
	});

	it('matchLootType：四类映射（消耗品/武器/防具含影子装备/其他兜底），未勾选不匹配', () => {
		const all = { consumable: true, weapon: true, armor: true, etc: true };
		// 消耗品：HEALING0/USABLE2/DELAYCONSUME11/CASH18
		expect(matchLootType(0, all)).toBe(true);
		expect(matchLootType(2, all)).toBe(true);
		expect(matchLootType(11, all)).toBe(true);
		expect(matchLootType(18, all)).toBe(true);
		// 武器 5 / 防具 4 + 影子 12
		expect(matchLootType(5, all)).toBe(true);
		expect(matchLootType(4, all)).toBe(true);
		expect(matchLootType(12, all)).toBe(true);
		// 其他：ETC3/CARD6/PETEGG7/PETARMOR8/AMMO10/UNKNOWN1
		expect(matchLootType(3, all)).toBe(true);
		expect(matchLootType(6, all)).toBe(true);
		expect(matchLootType(7, all)).toBe(true);
		expect(matchLootType(8, all)).toBe(true);
		expect(matchLootType(10, all)).toBe(true);
		expect(matchLootType(1, all)).toBe(true);
		// 未勾选的类型 → 不匹配
		const onlyWeapon = { consumable: false, weapon: true, armor: false, etc: false };
		expect(matchLootType(5, onlyWeapon)).toBe(true);
		expect(matchLootType(0, onlyWeapon)).toBe(false);
		expect(matchLootType(4, onlyWeapon)).toBe(false);
		expect(matchLootType(3, onlyWeapon)).toBe(false);
	});

	it('validateLootedItem：精炼/卡片下限仅对武器防具生效，消耗品跳过校验', () => {
		const cfg = { refineMin: 5, cardMin: 2 };
		// 武器：精炼 4 < 5 → 丢（refine 优先于 card）
		expect(validateLootedItem({ type: 5, RefiningLevel: 4, slot: {} }, cfg)).toEqual({ keep: false, reason: 'refine' });
		// 武器：精炼达标但卡片 1 < 2 → 丢
		expect(validateLootedItem({ type: 5, RefiningLevel: 5, slot: { card1: 4002 } }, cfg)).toEqual({ keep: false, reason: 'card' });
		// 武器：精炼与卡片达标 → 保留（slot 零项不计卡数）
		expect(validateLootedItem({ type: 5, RefiningLevel: 7, slot: { card1: 4002, card2: 0, card3: 4033, card4: 0 } }, cfg).keep).toBe(true);
		// 防具（含影子装备）同样校验
		expect(validateLootedItem({ type: 4, RefiningLevel: 0, slot: {} }, cfg).keep).toBe(false);
		expect(validateLootedItem({ type: 12, RefiningLevel: 9, slot: { card1: 4002, card2: 4033 } }, cfg).keep).toBe(true);
		expect(validateLootedItem({ type: 12, RefiningLevel: 9, slot: {} }, cfg).keep).toBe(false); // 卡数不足仍会丢
		// 消耗品跳过精炼/卡片校验
		expect(validateLootedItem({ type: 0 }, cfg).keep).toBe(true);
		expect(validateLootedItem({ type: 2, slot: {} }, cfg).keep).toBe(true);
		// 下限 0 = 不校验
		const off = { refineMin: 0, cardMin: 0 };
		expect(validateLootedItem({ type: 5, RefiningLevel: 0, slot: {} }, off).keep).toBe(true);
	});

	it('loot 迁移：缺省开启全类型/0 下限/90 负重；非法值归缺省；布尔保留', () => {
		const def = migrateSettings({}).loot;
		expect(def.enabled).toBe(true);
		expect(def.types).toEqual({ consumable: true, weapon: true, armor: true, etc: true });
		expect(def.refineMin).toBe(0);
		expect(def.cardMin).toBe(0);
		expect(def.weightPausePct).toBe(90);
		const s = migrateSettings({ loot: { enabled: false, types: { consumable: true }, refineMin: 99, cardMin: -3, weightPausePct: 500 } }).loot;
		expect(s.enabled).toBe(false);
		expect(s.types.consumable).toBe(true);
		expect(s.types.weapon).toBe(true); // 未提供的类型归缺省勾选
		expect(s.refineMin).toBe(10);
		expect(s.cardMin).toBe(0);
		expect(s.weightPausePct).toBe(100);
	});

	it('isCureStatusActive：opt2/opt1 位掩码与 efst 图标三通道命中', () => {
		const ch = { efstMap: { 34: true }, bodyState: 0, healthState: 0x0004 };
		// 健康位命中（沉默）
		expect(isCureStatusActive(CURE_WATCH_LISTS.poison, ch)).toBe(true);
		// 图标命中（幻觉）
		const ch2 = { efstMap: { 34: true }, bodyState: 0, healthState: 0 };
		expect(isCureStatusActive(CURE_WATCH_LISTS.poison, ch2)).toBe(true);
		// 全通道未命中
		const ch3 = { efstMap: {}, bodyState: 0, healthState: 0 };
		expect(isCureStatusActive(CURE_WATCH_LISTS.poison, ch3)).toBe(false);
		// 万能药：诅咒位（0x0002）
		const ch4 = { efstMap: {}, bodyState: 0, healthState: 0x0002 };
		expect(isCureStatusActive(CURE_WATCH_LISTS.panacea, ch4)).toBe(true);
		expect(isCureStatusActive(CURE_WATCH_LISTS.poison, ch4)).toBe(false); // 解毒药不覆盖诅咒
	});

	it('cure 迁移：v2 cureItems 分流 + 启用开关缺省开/非法归 0/合法保留', () => {
		expect(migrateSettings({}).cure).toEqual({ enabled: true, poison: 0, panacea: 0 });
		expect(migrateSettings({ cureItems: { poison: 506, panacea: 525 } }).cure).toEqual({ enabled: true, poison: 506, panacea: 525 });
		expect(migrateSettings({ cureItems: { poison: -1, panacea: 'x' } }).cure).toEqual({ enabled: true, poison: 0, panacea: 0 });
		expect(migrateSettings({ cure: { enabled: false, poison: 506 } }).cure).toEqual({ enabled: false, poison: 506, panacea: 0 });
	});

	it('T9 新字段迁移：SP 规则/画面怪数/MVP/移动四槽/返回村庄', () => {
		const s = migrateSettings({});
		expect(s.spNormalAttack).toEqual({ enabled: false, threshold: 10 });
		expect(s.spStopAttackMove).toEqual({ enabled: false, threshold: 5 });
		expect(s.flyOnMobCount).toEqual({ enabled: false, count: 20 });
		expect(s.flyOnMvp).toBe(true);
		expect(s.teleport.item).toEqual({ enabled: true, id: 601 });
		expect(s.teleport.skill).toEqual({ enabled: true, id: 26, level: 1 }); // AL_TELEPORT（2026-11-09 修复：T9 初版误写 28=AL_HEAL）
		expect(s.retreat.item).toEqual({ enabled: true, id: 602 });
		expect(s.retreat.skill).toEqual({ enabled: true, id: 26, level: 2 });
		expect(s.returnVillage).toEqual({ onPotionsEmpty: false, onCureEmpty: false, onBuffEmpty: true }); // 官方无总开关；BUFF 用尽项默认勾选
		// 非法值錯到默认
		const bad = migrateSettings({
			spNormalAttack: { threshold: 999 },
			flyOnMobCount: { count: -5 },
			teleport: { item: { id: 'x' }, skill: { level: 99 } }
		});
		expect(bad.spNormalAttack.threshold).toBe(100);
		expect(bad.flyOnMobCount.count).toBe(1);
		expect(bad.teleport.item.id).toBe(601); // 非法 id → 回默认登记（不丢官方默认）
		expect(bad.teleport.skill.level).toBe(10);
	});

	it('evaluatePotionSlots：同类型自左向右第一个命中（启用+已登记+低于阈值；严格小于）', () => {
		const potions = {
			hp: [
				{ id: 501, threshold: 70, enabled: true },
				{ id: 502, threshold: 50, enabled: true }
			],
			sp: [
				{ id: 503, threshold: 30, enabled: false },
				{ id: 504, threshold: 40, enabled: true }
			]
		};
		expect(evaluatePotionSlots(potions, 69.9, 39.9)).toEqual({ hpSlot: 0, spSlot: 1 });
		expect(evaluatePotionSlots(potions, 69, 40)).toEqual({ hpSlot: 0, spSlot: -1 }); // 等于不触发（40<40 为假）
		const potions2 = {
			hp: [
				{ id: 501, threshold: 40, enabled: true },
				{ id: 502, threshold: 50, enabled: true }
			],
			sp: []
		};
		// 槽1 未命中（45≥40）→ 落槽2（45<50）
		expect(evaluatePotionSlots(potions2, 45, 100)).toEqual({ hpSlot: 1, spSlot: -1 });
		// 全未命中
		expect(evaluatePotionSlots(potions, 80, 100)).toEqual({ hpSlot: -1, spSlot: -1 });
		// 未登记 id 的槽不计入
		expect(evaluatePotionSlots({ hp: [{ id: 0, threshold: 100, enabled: true }], sp: [] }, 1, 1)).toEqual({ hpSlot: -1, spSlot: -1 });
		// 损坏输入
		expect(evaluatePotionSlots(null, 50, 50)).toEqual({ hpSlot: -1, spSlot: -1 });
	});

	it('decideSpEconomy：规则1（仅一般攻击）优先度高，命中即短路；都不命中回 normal', () => {
		const cfg = {
			normalAttack: { enabled: true, threshold: 10 },
			stopAttackMove: { enabled: true, threshold: 5 }
		};
		expect(decideSpEconomy(9.9, cfg)).toBe('normal-attack-only');
		expect(decideSpEconomy(6, cfg)).toBe('normal-attack-only'); // 规则1 优先（其命中域覆盖规则2）
		// 规则1 关闭时规则2 才可达（官方：规则1 优先度高，开启时覆盖规则2）
		const onlyRule2 = { normalAttack: { enabled: false, threshold: 10 }, stopAttackMove: { enabled: true, threshold: 5 } };
		expect(decideSpEconomy(4.9, onlyRule2)).toBe('stop-and-move');
		expect(decideSpEconomy(5, onlyRule2)).toBe('normal'); // 等于不触发
		expect(decideSpEconomy(50, cfg)).toBe('normal');
		// 开关关闭 → 不触发
		expect(decideSpEconomy(1, { normalAttack: { enabled: false, threshold: 10 }, stopAttackMove: { enabled: false, threshold: 5 } })).toBe('normal');
		expect(decideSpEconomy(1, {})).toBe('normal');
		expect(decideSpEconomy(1, null)).toBe('normal');
	});

	it('mobWhitelist 迁移：非法项过滤去重、空数组键丢弃、键截断', () => {
		const s = migrateSettings({
			mobWhitelist: {
				'prontera': [1002, 1002, 'abc', -5, 1113, NaN],
				'empty': [],
				123: [1042]
			}
		});
		expect(s.mobWhitelist['prontera']).toEqual([1002, 1113]); // 去重 + 非法过滤
		expect(s.mobWhitelist['empty']).toBeUndefined(); // 空名单不落盘
		expect(s.mobWhitelist['123']).toEqual([1042]); // 数字键转字符串
		expect(migrateSettings(null).mobWhitelist).toEqual({});
	});

	it('无 id 的垃圾技能项 → 丢弃', () => {
		const s = migrateSettings({ skills: [{ type: 'attack' }, { id: 5, type: 'attack', level: 1 }] });
		expect(s.skills[0]).toEqual({ id: 5, type: 'attack', level: 1 });
	});
});

describe('slotReady 每槽延迟判定', () => {
	it('delay=0 → 永远可施放（引擎默认限速兜底）', () => {
		expect(slotReady(1000, 999, 0)).toBe(true);
		expect(slotReady(1000, 1000, 0)).toBe(true);
	});

	it('delay>0 → 上次施放 + delay 内不可施放', () => {
		expect(slotReady(1500, 1000, 1000)).toBe(false); // 1499 边界前
		expect(slotReady(2000, 1000, 1000)).toBe(true); // 恰好到期
		expect(slotReady(5000, 1000, 1000)).toBe(true);
	});

	it('从未施放（lastCast=0）→ 可施放', () => {
		expect(slotReady(100, 0, 1000)).toBe(true);
	});

	it('负数/非法 delay 视为无延迟 → 可施放', () => {
		expect(slotReady(100, 50, -5)).toBe(true);
	});
});

// =====================================================================
// 2026-11-09 架构审查候选 B 增量用例（事实锚点均人工对照服务端源码核验）：
//   OPT2 位值 server/src/src/map/status.hpp:2986-2995；EFST_ILLUSION=34
//   （status.hpp:1453 起 efst_type 枚举数到 34）；AL_TELEPORT=26 / AL_HEAL=28
//   （src/DB/Skills/SkillConst.js:37-39 与 server/src/db/re/skill_db.yml 一致）
// =====================================================================

describe('CURE_WATCH_LISTS 常量钉死（锚点 status.hpp）', () => {
	it('解毒药/万能药覆盖位集合（含万能药独有的诅咒位）', () => {
		expect(CURE_WATCH_LISTS.poison).toEqual([
			{ opt2: 0x0001 }, // OPT2_POISON 中毒
			{ opt2: 0x0004 }, // OPT2_SILENCE 沉默
			{ opt2: 0x0010 }, // OPT2_BLIND 黑暗
			{ opt2: 0x0008 }, // OPT2_CONFUSION 混乱
			{ efst: 34 }      // EFST_ILLUSION 幻觉（图标通道）
		]);
		expect(CURE_WATCH_LISTS.panacea).toEqual([
			{ opt2: 0x0001 }, // OPT2_POISON
			{ opt2: 0x0002 }, // OPT2_CURSE 诅咒（万能药独有）
			{ opt2: 0x0004 }, // OPT2_SILENCE
			{ opt2: 0x0008 }, // OPT2_CONFUSION
			{ opt2: 0x0010 }, // OPT2_BLIND
			{ efst: 34 }
		]);
	});
});

describe('migrateSettings 默认全形状钉死（防字段无察觉增删）', () => {
	const FULL_DEFAULTS = {
		v: SCHEMA_VERSION,
		skills: [null, null, null, null, null, null, null, null],
		aux: [null, null, null, null, null, null, null, null],
		auxDelays: [0, 0, 0, 0, 0, 0, 0, 0],
		slotDelays: [0, 0, 0, 0, 0, 0, 0, 0],
		follow: false,
		followTarget: '',
		flyNoMobs: true,
		flyLowHp: false,
		normalAttack: true,
		mobWhitelist: {},
		noMobSeconds: 10,
		returnToMap: true,
		loot: {
			enabled: true,
			types: { consumable: true, weapon: true, armor: true, etc: true },
			refineMin: 0, cardMin: 0, weightPausePct: 90
		},
		potions: {
			hp: [{ id: 0, threshold: 70, enabled: true }, { id: 0, threshold: 70, enabled: true }],
			sp: [{ id: 0, threshold: 70, enabled: true }, { id: 0, threshold: 70, enabled: true }]
		},
		cure: { enabled: true, poison: 0, panacea: 0 },
		returnVillage: { onPotionsEmpty: false, onCureEmpty: false, onBuffEmpty: true },
		teleport: { item: { enabled: true, id: 601 }, skill: { enabled: true, id: 26, level: 1 } },
		retreat: { item: { enabled: true, id: 602 }, skill: { enabled: true, id: 26, level: 2 } },
		spNormalAttack: { enabled: false, threshold: 10 },
		spStopAttackMove: { enabled: false, threshold: 5 },
		flyOnMobCount: { enabled: false, count: 20 },
		flyOnMvp: true,
		sitRecover: { enabled: false, hpPct: 50, spPct: 30 } // T9.5
	};

	it('null → 整对象深相等（含修复后的 AL_TELEPORT=26）', () => {
		expect(migrateSettings(null)).toEqual(FULL_DEFAULTS);
	});

	it('字段集完整（新增/删除字段会被发现）', () => {
		const expected = Object.keys(FULL_DEFAULTS).sort();
		expect(Object.keys(migrateSettings(null)).sort()).toEqual(expected);
	});
});

describe('开关两类语义差异钉死（防误改）', () => {
	it('!== false 型（normalAttack/returnToMap）：仅显式 false 才关，0/null 视为开', () => {
		expect(migrateSettings({ normalAttack: 0, returnToMap: null }).normalAttack).toBe(true);
		expect(migrateSettings({ normalAttack: 0, returnToMap: null }).returnToMap).toBe(true);
	});

	it('=== undefined 型（flyNoMobs/flyOnMvp）：undefined 取默认开，其余假值保留为 false', () => {
		expect(migrateSettings({ flyNoMobs: 0, flyOnMvp: null }).flyNoMobs).toBe(false);
		expect(migrateSettings({ flyNoMobs: 0, flyOnMvp: null }).flyOnMvp).toBe(false);
	});
});

describe('v2 aux 分流扩展与旧阈值语义', () => {
	it('both 双槽各占一位、hp 溢出丢弃、autoPotion=false 保留旧意愿、阈值四舍五入', () => {
		const s = migrateSettings({
			hp: 55.4,
			sp: 25,
			autoPotion: false,
			aux: [
				{ type: 'potion', id: 501, subtype: 'hp' },
				{ type: 'potion', id: 502, subtype: 'sp' },
				{ type: 'potion', id: 503, subtype: 'both' },
				{ type: 'potion', id: 504, subtype: 'hp' },
				{ type: 'buff_item', id: 601 }
			]
		});
		expect(s.potions.hp).toEqual([
			{ id: 501, threshold: 55, enabled: false },
			{ id: 503, threshold: 55, enabled: false }
		]);
		expect(s.potions.sp).toEqual([
			{ id: 502, threshold: 25, enabled: false },
			{ id: 503, threshold: 25, enabled: false }
		]);
		// T9.1: buff_item 项归一化到道具页 8 槽（首槽登记 601，其余空）
		expect(s.aux[0]).toEqual({ id: 601, type: 'buff_item' });
		expect(s.aux.slice(1)).toEqual([null, null, null, null, null, null, null]);
		expect(s.auxDelays).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
	});

	it('v3 potions 直读：切片 2、id 四舍五入、阈值夹取、enabled 非法回默认', () => {
		const s = migrateSettings({
			potions: {
				hp: [
					{ id: 501, threshold: 40, enabled: false },
				{ id: 502.7, threshold: 200, enabled: 'x' },
					{ id: 503, threshold: 30, enabled: true }
				],
				sp: []
			}
		});
		expect(s.potions.hp).toEqual([
			{ id: 501, threshold: 40, enabled: false },
			{ id: 503, threshold: 100, enabled: true }
		]);
		expect(s.potions.sp).toEqual([
			{ id: 0, threshold: 70, enabled: true },
			{ id: 0, threshold: 70, enabled: true }
		]);
	});

	it('v3 potions 直读时旧 hp/sp 顶栏阈值仅作空槽默认', () => {
		const s = migrateSettings({ hp: 99, potions: { hp: [{ id: 501, threshold: 40 }], sp: [{ id: 503 }] } });
		expect(s.potions.hp[0].threshold).toBe(40);
		expect(s.potions.sp[0].threshold).toBe(70); // src.sp 缺 → 官方默认 70，非 hp 的 99
	});
});

describe('移动四槽修复钉死（2026-11-09：T9 初版默认值 28=AL_HEAL 误写修复）', () => {
	it('存量坏默认 skill.id=28 归一为 26（AL_TELEPORT）', () => {
		const s = migrateSettings({ teleport: { skill: { id: 28 } }, retreat: { skill: { id: 28, level: 2 } } });
		expect(s.teleport.skill.id).toBe(26);
		expect(s.retreat.skill.id).toBe(26);
	});

	it('自定义 id 保留（999/26 均不归一）；道具槽 id=28 不归一（28 是合法红药水）', () => {
		const s = migrateSettings({ teleport: { skill: { id: 999 }, item: { id: 28 } }, retreat: { skill: { id: 26 } } });
		expect(s.teleport.skill.id).toBe(999);
		expect(s.teleport.item.id).toBe(28);
		expect(s.retreat.skill.id).toBe(26);
	});

	it('等级夹取 0→1、99→10；非数字回各槽默认（teleport 1 / retreat 2）', () => {
		const s = migrateSettings({ teleport: { skill: { level: 0 } }, retreat: { skill: { level: 99 } } });
		expect(s.teleport.skill.level).toBe(1);
		expect(s.retreat.skill.level).toBe(10);
		expect(migrateSettings({ teleport: { skill: { level: 'x' } } }).teleport.skill.level).toBe(1);
		expect(migrateSettings({ retreat: { skill: { level: 'x' } } }).retreat.skill.level).toBe(2);
	});
});

describe('决策函数边界补充', () => {
	it('evaluatePotionSlots：双命中时自左向右（非最接近阈值槽）', () => {
		const potions = { hp: [{ id: 501, threshold: 50, enabled: true }, { id: 502, threshold: 30, enabled: true }], sp: [] };
		// 25 同时低于 50 和 30 → 取左侧第 0 槽（官方自左向右语义）
		expect(evaluatePotionSlots(potions, 25, 100)).toEqual({ hpSlot: 0, spSlot: -1 });
	});

	it('evaluatePotionSlots：禁用槽与空槽被跳过', () => {
		const potions = { hp: [{ id: 501, threshold: 90, enabled: false }, null, { id: 502, threshold: 60, enabled: true }], sp: [] };
		expect(evaluatePotionSlots(potions, 10, 100)).toEqual({ hpSlot: 2, spSlot: -1 });
	});

	it('decideSpEconomy：enabled 但缺 threshold 数字 → 该规则不触发', () => {
		expect(decideSpEconomy(5, { normalAttack: { enabled: true }, stopAttackMove: { enabled: true, threshold: 50 } })).toBe('stop-and-move');
	});

	it('matchLootType：types 未提供 → 一律不匹配', () => {
		expect(matchLootType(0, undefined)).toBe(false);
		expect(matchLootType(5, null)).toBe(false);
	});

	it('validateLootedItem：精炼等于下限保留；非数卡位不计入；null 物品保留', () => {
		expect(validateLootedItem({ type: 5, RefiningLevel: 5 }, { refineMin: 5 }).keep).toBe(true);
		const item = { type: 5, slot: { card1: 4001, card2: 0, card3: 4002, card4: 'x' } }; // 有效卡 2 张
		expect(validateLootedItem(item, { cardMin: 3 })).toEqual({ keep: false, reason: 'card' });
		expect(validateLootedItem(item, { cardMin: 2 }).keep).toBe(true);
		expect(validateLootedItem(null, { refineMin: 10 }).keep).toBe(true);
	});

	it('isCureStatusActive：复合状态值按位命中；空清单不触发', () => {
		expect(isCureStatusActive([{ opt2: 0x0004 }], { healthState: 0x0006 })).toBe(true); // 0x6 含 0x4
		expect(isCureStatusActive([{ opt2: 0x0004 }], { healthState: 0x0002 })).toBe(false);
		expect(isCureStatusActive([], { healthState: 0xffff })).toBe(false);
		expect(isCureStatusActive(undefined, undefined)).toBe(false);
	});

	it('follow/followTarget/flyLowHp 布尔化与字符串守卫', () => {
		const s = migrateSettings({ follow: 'x', followTarget: 'PlayerOne', flyLowHp: 1 });
		expect(s.follow).toBe(true);
		expect(s.followTarget).toBe('PlayerOne');
		expect(s.flyLowHp).toBe(true);
		const bad = migrateSettings({ follow: '', followTarget: 123, flyLowHp: 0 });
		expect(bad.follow).toBe(false);
		expect(bad.followTarget).toBe('');
		expect(bad.flyLowHp).toBe(false);
	});

	it('returnVillage 新形状透传（旧 enabled 字段被忽略丢弃；onBuffEmpty 缺省回官方默认开）', () => {
		const s = migrateSettings({ returnVillage: { enabled: true, onPotionsEmpty: true, onCureEmpty: true } });
		expect(s.returnVillage).toEqual({ onPotionsEmpty: true, onCureEmpty: true, onBuffEmpty: true });
		const s2 = migrateSettings({ returnVillage: { onBuffEmpty: false } });
		expect(s2.returnVillage).toEqual({ onPotionsEmpty: false, onCureEmpty: false, onBuffEmpty: false });
	});

	it('loot.enabled 非布尔回默认 true；白名单地图名截断 64 字符', () => {
		expect(migrateSettings({ loot: { enabled: 'x' } }).loot.enabled).toBe(true);
		const longMap = 'a'.repeat(70);
		const s = migrateSettings({ mobWhitelist: { [longMap]: [1] } });
		expect(Object.keys(s.mobWhitelist)).toEqual(['a'.repeat(64)]);
	});
});

describe('migrateSettings 幂等性（v4 演进的回归地基）', () => {
	it('migrate(migrate(x)) 与 migrate(x) 深相等（含存量 28 归一后的稳定性）', () => {
		const v2Sample = {
			v: 2,
			skills: [
				{ id: 1, type: 'attack' }, { id: 2, type: 'heal' }, { id: 3, type: 'buff' },
				{ id: 4, type: 'attack' }, { id: 5, type: 'buff' }, { id: 6, type: 'attack' }
			],
			slotDelays: [100, -3, 2.6, 'x'],
			aux: [
				{ type: 'potion', id: 501, subtype: 'hp' }, { type: 'potion', id: 502, subtype: 'sp' },
				{ type: 'potion', id: 503, subtype: 'both' }, { type: 'buff_item', id: 601 }
			],
			hp: 55.4, sp: 25, autoPotion: false,
			follow: 'x', followTarget: 'P2',
			flyNoMobs: false, flyLowHp: true, normalAttack: false,
			mobWhitelist: { payon: [100, 100, 'x', 101] },
			noMobSeconds: 100.7,
			returnToMap: false,
			loot: { enabled: false, types: { consumable: false }, refineMin: 11, cardMin: 5, weightPausePct: 150 },
			cureItems: { poison: 500.7 },
			cure: { poison: 'x', enabled: false },
			returnVillage: { enabled: true, onPotionsEmpty: true },
			teleport: { skill: { id: 28, level: 0 } },
			retreat: { item: { id: 28 } },
			spNormalAttack: { enabled: true, threshold: 200 },
			flyOnMobCount: { enabled: true, count: 0 },
			flyOnMvp: false
		};
		const once = migrateSettings(v2Sample);
		expect(migrateSettings(once)).toEqual(once);
		expect(once.teleport.skill.id).toBe(26);   // 存量 28 归一次到位
		expect(once.teleport.skill.level).toBe(1);  // level 0 夹取 1
		expect(once.retreat.item.id).toBe(28);      // 道具槽不归一且幂等
		expect(migrateSettings(migrateSettings(null))).toEqual(migrateSettings(null));
	});
});

describe('T9.5 坐下回复', () => {
	describe('decideSitRecover 决策纯函数', () => {
		const cfg = { enabled: true, hpPct: 50, spPct: 30 };

		it('开关关闭 → 永远 none', () => {
			expect(decideSitRecover(1, 1, false, { enabled: false, hpPct: 50, spPct: 30 }, false)).toBe('none');
			expect(decideSitRecover(1, 1, true, { enabled: false, hpPct: 50, spPct: 30 }, false)).toBe('none');
		});

		it('未坐 + 低于任一阈值 + 无怪 → sit；高于阈值 → none', () => {
			expect(decideSitRecover(40, 100, false, cfg, false)).toBe('sit'); // hp 40<50
			expect(decideSitRecover(100, 20, false, cfg, false)).toBe('sit'); // sp 20<30
			expect(decideSitRecover(80, 60, false, cfg, false)).toBe('none');
		});

		it('未坐 + 有怪 → 不坐（坐下挨打）', () => {
			expect(decideSitRecover(10, 10, false, cfg, true)).toBe('none');
		});

		it('坐中 → 恢复到滞回阈值（触发+30，上限100）起身；否则继续坐', () => {
			expect(decideSitRecover(79, 59, true, cfg, false)).toBe('none');   // 差一线
			expect(decideSitRecover(80, 60, true, cfg, false)).toBe('stand');  // 双双达标
			// 阈值压线场景：hpPct=90 → 滞回上限 100
			expect(decideSitRecover(100, 100, true, { enabled: true, hpPct: 90, spPct: 90 }, false)).toBe('stand');
		});

		it('坐中 + 视野出现怪 → 立即起身接战（即便血蓝未回满）', () => {
			expect(decideSitRecover(10, 10, true, cfg, true)).toBe('stand');
		});
	});

	describe('migrateSettings 坐下回复归一化', () => {
		it('缺省 → 关闭 + hp50/sp30', () => {
			const s = migrateSettings(null);
			expect(s.sitRecover).toEqual({ enabled: false, hpPct: 50, spPct: 30 });
		});

		it('非法值钳制（1-99）与布尔归一（boolOr：非布尔回退默认值）', () => {
			const s = migrateSettings({ sitRecover: { enabled: 1, hpPct: 0, spPct: 500 } });
			expect(s.sitRecover.enabled).toBe(false);  // 非布尔（1）按项目 boolOr 约定回退默认 false
			expect(s.sitRecover.hpPct).toBe(1);        // 0 → 夹到 1
			expect(s.sitRecover.spPct).toBe(99);       // 500 → 夹到 99
		});

		it('合法存档原样保留', () => {
			const s = migrateSettings({ sitRecover: { enabled: true, hpPct: 66, spPct: 22 } });
			expect(s.sitRecover).toEqual({ enabled: true, hpPct: 66, spPct: 22 });
		});
	});
});
