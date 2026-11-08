import { describe, it, expect } from 'vitest';

// schema.js 是零游戏依赖纯函数模块，无需 mock
import {
	migrateSettings,
	slotReady,
	evaluateThresholds,
	mobInWhitelist,
	decideNoMobAction,
	matchLootType,
	validateLootedItem,
	SCHEMA_VERSION,
	TOTAL_SLOT_COUNT
} from '../src/Plugins/BotAutoHunt/settings/schema.js';

describe('schema v2 结构迁移 migrateSettings', () => {
	it('空/损坏输入 → v2 默认值（8 空槽 + 0 延迟）', () => {
		for (const bad of [null, undefined, 'garbage', 42, []]) {
			const s = migrateSettings(bad);
			expect(s.v).toBe(SCHEMA_VERSION);
			expect(s.skills).toHaveLength(TOTAL_SLOT_COUNT);
			expect(s.skills.every(k => k === null)).toBe(true);
			expect(s.slotDelays).toHaveLength(TOTAL_SLOT_COUNT);
			expect(s.slotDelays.every(d => d === 0)).toBe(true);
			expect(s.hp).toBe(70);
			expect(s.sp).toBe(30);
			expect(s.aux).toEqual([]);
		}
	});

	it('v1 旧格式（无 v/delay 字段）→ 规范化：数据保留、延迟补 0、版本置 2', () => {
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
		expect(s.v).toBe(2);
		// 攻击组在前（attack/heal 保序）：5, 28, 6 → 槽 0/1/2
		expect(s.skills[0]).toEqual({ id: 5, type: 'attack', level: 5, maxLevel: 10, spcost: 20 });
		expect(s.skills[1]).toEqual({ id: 28, type: 'heal', level: 3, maxLevel: 10, spcost: 15 });
		expect(s.skills[2]).toEqual({ id: 6, type: 'attack', level: 7, maxLevel: 10, spcost: 22 });
		expect(s.skills[3]).toBeNull();
		// 辅助组在后：buff 66 → 槽 4
		expect(s.skills[4]).toEqual({ id: 66, type: 'buff', level: 8, maxLevel: 10, spcost: 30 });
		// 延迟全部补 0
		expect(s.slotDelays).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
		// 透传字段保留
		expect(s.hp).toBe(60);
		expect(s.sp).toBe(25);
		expect(s.aux).toEqual(v1.aux);
		expect(s.flyNoMobs).toBe(true);
		expect(s.autoPotion).toBe(true);
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

	it('v2 已迁移数据 → 幂等透传（重排不改变合法布局）', () => {
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
		expect(s.v).toBe(2);
		expect(s.skills[0]).toEqual({ id: 5, type: 'attack', level: 5, delay: 800 });
		expect(s.skills[4]).toEqual({ id: 66, type: 'buff', level: 8 });
		expect(s.slotDelays).toEqual([800, 0, 0, 0, 500, 0, 0, 0]);
		expect(s.hp).toBe(80);
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

	it('evaluateThresholds：低于阈值触发，等于不触发（严格小于）', () => {
		const r = evaluateThresholds(69.9, 29.9, { hpThreshold: 70, spThreshold: 30 });
		expect(r.hpPotion).toBe(true);
		expect(r.spPotion).toBe(true);
		const r2 = evaluateThresholds(70, 30, { hpThreshold: 70, spThreshold: 30 });
		expect(r2.hpPotion).toBe(false);
		expect(r2.spPotion).toBe(false);
	});

	it('evaluateThresholds：低血飞翅固定 10% 且需开关开启；缺省阈值 70/30', () => {
		expect(evaluateThresholds(9.9, 100, { flyLowHp: true }).lowHpFlyWing).toBe(true);
		expect(evaluateThresholds(9.9, 100, { flyLowHp: false }).lowHpFlyWing).toBe(false);
		expect(evaluateThresholds(10, 100, { flyLowHp: true }).lowHpFlyWing).toBe(false);
		const d = evaluateThresholds(69, 29, {});
		expect(d.hpPotion).toBe(true);
		expect(d.spPotion).toBe(true);
		const d2 = evaluateThresholds(70.1, 30.1, {});
		expect(d2.hpPotion).toBe(false);
		expect(d2.spPotion).toBe(false);
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

	it('noMobSeconds/returnToMap 迁移：秒数钳 1-60 并取整，返回开关缺省开启', () => {
		expect(migrateSettings({ noMobSeconds: 0 }).noMobSeconds).toBe(1);
		expect(migrateSettings({ noMobSeconds: 100 }).noMobSeconds).toBe(60);
		expect(migrateSettings({ noMobSeconds: 7.6 }).noMobSeconds).toBe(8);
		expect(migrateSettings({}).noMobSeconds).toBe(5);
		expect(migrateSettings({ noMobSeconds: 'x' }).noMobSeconds).toBe(5);
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
});
