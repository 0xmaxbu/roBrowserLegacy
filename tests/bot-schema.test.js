import { describe, it, expect } from 'vitest';

// schema.js 是零游戏依赖纯函数模块，无需 mock
import {
	migrateSettings,
	slotReady,
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
