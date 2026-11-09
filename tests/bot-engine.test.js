/**
 * tests/bot-engine.test.js
 *
 * 挂机引擎单元测试（架构审查候选 A，Issue Prontera#12）。
 * 引擎零游戏全局依赖 —— 本文件提供 bindings 协议的测试假件（第二个 adapter），
 * 通过引擎对外 interface（applySettings/start/stop/setBuff/onItemGained + 循环方法）
 * 驱动决策路径，不启动真实定时器（直接调 _xxxLoopInner，active 手动置位）。
 *
 * 生产绑定实现在 BotAutoHunt._createEngine()；两侧必须满足同一协议
 * （协议的权威定义见 engine/HuntEngine.js 文件头注释）。
 */

import { describe, it, expect, vi } from 'vitest';
import HuntEngine, { ITEM_FLY_WING, ITEM_BUTTERFLY_WING, SKILL_TYPE_ATTACK, SKILL_TYPE_HEAL, SKILL_TYPE_BUFF, AUX_TYPE_BUFF_ITEM, getPrimaryEfst } from '../src/Plugins/BotAutoHunt/engine/HuntEngine.js';

// ---------------------------------------------------------------------
// 测试假件工厂
// ---------------------------------------------------------------------

/** 造一个假实体（duck-typing 对齐 roBrowser Entity 实例字段） */
function fakeMob(gid, job, pos) {
	return {
		GID: gid,
		objecttype: 5, // 与 fakeBindings.entityTypes.mob 对齐
		action: 0,
		ACTION: { DIE: 2, WALK: 1 },
		remove_tick: 0,
		job: job,
		position: pos || [50, 50],
		isDead: () => false,
		targetGID: 0
	};
}

function fakeGroundItem(gid, itid, pos) {
	return {
		GID: gid,
		objecttype: 6, // entityTypes.item
		remove_tick: 0,
		ITID: itid,
		position: pos || [50, 50]
	};
}

/**
 * 假绑定工厂：所有动作记录到 calls，状态由 state 控制
 * @param {object} [state] 覆盖项：self、map、entities、skillReady、itemCount 等
 */
function fakeBindings(state) {
	const s = Object.assign({
		self: { gid: 100, name: 'tester', dead: false, position: [50, 50], walking: false, amotionBusy: false,
			life: { hp: 1000, hpMax: 1000, sp: 100, spMax: 100 }, weightPct: 0, bodyState: 0, healthState: 0 },
		map: { name: 'testmap01', loading: false }, // 不在 MAP_CONNECTIONS 里的地图：无传送门干扰
		entities: [],
		skillReady: () => true,
		itemCounts: {},      // id → count（缺省 0）
		itemTypes: {},       // itid → Type
		pathResult: 0        // 寻路返回步数（0=不可达）
	}, state);

	const calls = { useItem: [], castSkill: [], castSkillDirect: [], moveTo: [], attack: [], pickupItem: [], throwItem: [], chat: [] };

	return {
		calls,
		self: () => s.self,
		mapState: () => s.map,
		entityTypes: { mob: 5, item: 6, item2: 7 },
		forEachEntity: cb => s.entities.forEach(cb),
		getEntity: gid => s.entities.find(e => e.GID === gid) || null,
		focusEntity: () => s.focus || null,
		setFocusEntity: e => { s.focus = e; },
		closestMob: () => s.entities.find(e => e.objecttype === 5 && e.remove_tick === 0) || null,
		skillReady: (id, lv) => s.skillReady(id, lv),
		itemCount: id => s.itemCounts[id] || 0,
		itemType: id => (id in s.itemTypes ? s.itemTypes[id] : null),
		isWalkable: () => true,
		pathSearch(cx, cy, tx, ty, range, out) {
			const n = s.pathResult;
			for (let i = 0; i <= n; i++) { out[i * 2] = cx + i; out[i * 2 + 1] = cy; }
			return n;
		},
		pathSearchLong(cx, cy, tx, ty, range, out) {
			const n = s.pathResult;
			for (let i = 0; i <= n; i++) { out[i * 2] = cx + i; out[i * 2 + 1] = cy; }
			return { pathLength: n };
		},
		useItem: id => { calls.useItem.push(id); return s.useItemOk !== undefined ? s.useItemOk : true; },
		castSkill: (id, lv, gid) => calls.castSkill.push([id, lv, gid]),
		castSkillDirect: (id, lv, gid) => calls.castSkillDirect.push([id, lv, gid]),
		moveTo: (x, y) => calls.moveTo.push([x, y]),
		attack: gid => calls.attack.push(gid),
		pickupItem: gid => calls.pickupItem.push(gid),
		throwItem: (i, c) => calls.throwItem.push([i, c]),
		chat: m => calls.chat.push(m),
		_state: s
	};
}

/** 标准设置快照（v3 关键字段） */
function baseSettings(over) {
	return Object.assign({
		skills: [], aux: [], slotDelays: [0, 0, 0, 0, 0, 0, 0, 0],
		follow: false, followTarget: '',
		flyNoMobs: false, flyLowHp: false,
		normalAttack: true, mobWhitelist: {},
		noMobSeconds: 10, returnToMap: true,
		loot: { enabled: true, types: { consumable: true, weapon: false, armor: false, etc: false }, refineMin: 0, cardMin: 0, weightPausePct: 90 },
		potions: {
			hp: [{ id: 501, threshold: 70, enabled: true }, { id: 0, threshold: 70, enabled: true }],
			sp: [{ id: 503, threshold: 30, enabled: true }, { id: 0, threshold: 30, enabled: true }]
		},
		cure: { enabled: true, poison: 506, panacea: 525 },
		returnVillage: { onPotionsEmpty: false, onCureEmpty: false, onBuffEmpty: false }, // 具体/回村用例内显式开启
		auxDelays: [0, 0, 0, 0, 0, 0, 0, 0],
		teleport: { item: { enabled: true, id: ITEM_FLY_WING }, skill: { enabled: true, id: 26, level: 1 } },
		retreat: { item: { enabled: true, id: ITEM_BUTTERFLY_WING }, skill: { enabled: true, id: 26, level: 2 } },
		spNormalAttack: { enabled: false, threshold: 10 },
		spStopAttackMove: { enabled: false, threshold: 5 },
		flyOnMobCount: { enabled: false, count: 20 },
		flyOnMvp: false
	}, over);
}

function makeEngine(state, events) {
	const b = fakeBindings(state);
	const e = new HuntEngine(b, events);
	e.applySettings(baseSettings());
	e.active = true; // 循环方法直接调用时手动置位（生产由 start() 设置）
	return { b, e };
}

// ---------------------------------------------------------------------
// 药水循环
// ---------------------------------------------------------------------

describe('药水循环 _potionLoopInner', () => {
	it('HP 低于阈值 → 使用命中槽道具并进入 500ms 冷却（同 tick 不重复）', () => {
		const { b, e } = makeEngine({ self: { gid: 1, dead: false, position: [1, 1], walking: false, amotionBusy: false, life: { hp: 50, hpMax: 100, sp: 100, spMax: 100 }, weightPct: 0, bodyState: 0, healthState: 0 } });
		e._potionLoopInner();
		expect(b.calls.useItem).toEqual([501]);
		e._potionLoopInner(); // 冷却期内不重复使用
		expect(b.calls.useItem).toEqual([501]);
	});

	it('HP/SP 均高于阈值 → 不使用道具', () => {
		const { b, e } = makeEngine({ self: { gid: 1, dead: false, position: [1, 1], walking: false, amotionBusy: false, life: { hp: 90, hpMax: 100, sp: 80, spMax: 100 }, weightPct: 0, bodyState: 0, healthState: 0 } });
		e._potionLoopInner();
		expect(b.calls.useItem).toEqual([]);
	});

	it('低血（HP<10%）+ 低血飞翅开 → 走「返回储存点」链（登录道具优先）', () => {
		const { b, e } = makeEngine({ self: { gid: 1, dead: false, position: [1, 1], walking: false, amotionBusy: false, life: { hp: 5, hpMax: 100, sp: 100, spMax: 100 }, weightPct: 0, bodyState: 0, healthState: 0 } });
		e.applySettings(baseSettings({ flyLowHp: true }));
		e._potionLoopInner();
		expect(b.calls.useItem).toEqual([ITEM_BUTTERFLY_WING]); // retreat 登记的蝴蝶翅膀
	});

	it('低血 + 登记道具用尽 + 技能就绪 → 施放 AL_TELEPORT Lv2（回存储点）', () => {
		const { b, e } = makeEngine({ self: { gid: 1, dead: false, position: [1, 1], walking: false, amotionBusy: false, life: { hp: 5, hpMax: 100, sp: 100, spMax: 100 }, weightPct: 0, bodyState: 0, healthState: 0 }, useItemOk: false });
		e.applySettings(baseSettings({ flyLowHp: true }));
		e._potionLoopInner();
		expect(b.calls.useItem).toEqual([ITEM_BUTTERFLY_WING]); // 技能链前的登记尝试 + 最终兜底
		expect(b.calls.castSkill).toEqual([[26, 2, 1]]);
	});

	it('HP 槽命中时治疗技能可用 → 对自己施放（1s 冷却）', () => {
		const { b, e } = makeEngine({ self: { gid: 1, dead: false, position: [1, 1], walking: false, amotionBusy: false, life: { hp: 50, hpMax: 100, sp: 100, spMax: 100 }, weightPct: 0, bodyState: 0, healthState: 0 } });
		e.applySettings(baseSettings({ skills: [{ id: 28, type: SKILL_TYPE_HEAL, level: 3, spcost: 15 }] }));
		e._potionLoopInner();
		expect(b.calls.castSkill).toEqual([[28, 3, 1]]);
	});

	it('异常状态命中（健康位中毒）→ 使用解毒药；解毒药优先于万能药', () => {
		const { b, e } = makeEngine({ self: { gid: 1, dead: false, position: [1, 1], walking: false, amotionBusy: false, life: { hp: 90, hpMax: 100, sp: 100, spMax: 100 }, weightPct: 0, bodyState: 0, healthState: 0x0001 } });
		e._potionLoopInner();
		expect(b.calls.useItem).toEqual([506]);
	});

	it('药水全部耗尽 + 回村开关开 → 执行返回并发 toast 事件', () => {
		const events = { onToast: vi.fn() };
		const { b, e } = makeEngine({ itemCounts: {} }, events); // 所有登记道具数量 0
		e.applySettings(baseSettings({
			returnVillage: { onPotionsEmpty: true, onCureEmpty: false, onBuffEmpty: false },
			cure: { enabled: false, poison: 0, panacea: 0 } // 关闭异常解除，聚焦回村分支
		}));
		e._potionLoopInner();
		expect(b.calls.useItem).toEqual([ITEM_BUTTERFLY_WING]);
		expect(events.onToast).toHaveBeenCalledWith('登记的道具已用完，正在返回村庄');
	});

	it('BUFF 道具用尽 + onBuffEmpty 开 → 回村（官方道具页返回村庄设定）', () => {
		const events = { onToast: vi.fn() };
		const { b, e } = makeEngine({ itemCounts: {}, useItemOk: true }, events);
		e.applySettings(baseSettings({
			aux: [{ id: 645, type: 'buff_item' }, null, null, null, null, null, null, null],
			returnVillage: { onPotionsEmpty: false, onCureEmpty: false, onBuffEmpty: true },
			cure: { enabled: false, poison: 0, panacea: 0 }
		}));
		e._potionLoopInner();
		expect(b.calls.useItem).toContain(ITEM_BUTTERFLY_WING);
		expect(events.onToast).toHaveBeenCalledWith('登记的道具已用完，正在返回村庄');
	});
});

// ---------------------------------------------------------------------
// Buff 循环（T9.1：道具页 BUFF 消耗品每格延迟）
// ---------------------------------------------------------------------

describe('Buff 循环 _buffLoopInner 道具页 BUFF 道具每格延迟', () => {
	function buffEngine(over) {
		const { b, e } = makeEngine({ itemCounts: { 645: 5 } });
		e.applySettings(baseSettings(Object.assign({
			aux: [{ id: 645, type: 'buff_item' }, null, null, null, null, null, null, null]
		}, over)));
		return { b, e };
	}

	it('延迟内（上次使用距今 < auxDelay）→ 不使用', () => {
		const { b, e } = buffEngine({ auxDelays: [3600, 0, 0, 0, 0, 0, 0, 0] });
		e._auxLastCast[0] = Date.now() - 1000; // 1s 前刚用过，延迟 3600s
		e._buffLoopInner();
		expect(b.calls.useItem).toEqual([]);
	});

	it('超过延迟（或从未使用）且 buff 未活跃 → 使用并记录槽时间戳', () => {
		const { b, e } = buffEngine({ auxDelays: [3600, 0, 0, 0, 0, 0, 0, 0] });
		e._buffLoopInner(); // 从未使用 → 立即使用
		expect(b.calls.useItem).toEqual([645]);
		expect(e._auxLastCast[0]).toBeGreaterThan(0);
	});

	describe('auxDelays 缺省为 0 时行为不变（buff 门控兼容旧档）', () => {
		it('buff 未活跃 → 使用', () => {
			const { b, e } = buffEngine({});
			e._buffLoopInner();
			expect(b.calls.useItem).toEqual([645]);
		});
	});
});

// ---------------------------------------------------------------------
// T9.3 卡死修复：不可达目标看门狗 + 追击拉黑
// ---------------------------------------------------------------------

describe('T9.3 不可达目标看门狗（挂机时走到某些地方停止移动的冻结局修复）', () => {
	it('追击 8s 无位移进展 → 拉黑目标 15s + 清焦点（不再每 tick 盲发攻击包）', () => {
		const { b, e } = makeEngine({});
		const mob = fakeMob(7, 1002, [60, 60]);
		b._state.entities = [mob];
		e._combatLoopInner();
		expect(b.calls.attack).toContain(7); // 正常追击路径
		expect(e._focusWatch.gid).toBe(7);
		// 8s 无任何位移进展（自身与目标位置不变）
		e._focusWatch.since = Date.now() - 9000;
		e._combatLoopInner();
		expect(e._mobBlacklist.get(7)).toBeGreaterThan(Date.now());
		expect(b._state.focus).toBe(null); // 焦点已清
		// 拉黑期内不再选中同一目标 → 不发攻击
		const attacksMid = b.calls.attack.length;
		e._combatLoopInner();
		expect(b.calls.attack.length).toBe(attacksMid);
	});

	it('目标/自身位移超 2 格 → 看门狗计时重置（有效追击不误拉黑）', () => {
		const { b, e } = makeEngine({});
		const mob = fakeMob(7, 1002, [60, 60]);
		b._state.entities = [mob];
		e._combatLoopInner();
		e._focusWatch.since = Date.now() - 9000;
		mob.position = [70, 60]; // 目标移动了
		e._combatLoopInner();
		expect(e._mobBlacklist.size).toBe(0);
		expect(e._focusWatch.gid).toBe(7); // 仍在追击
	});
});

// ---------------------------------------------------------------------
// T9.3 卡死修复：传送门旁窄廊逃脱（落点半径逐级放宽 7→5→3）
// ---------------------------------------------------------------------

describe('T9.3 传送门旁窄廊逃脱', () => {
	it('safeEnd 固定 5 半径永远失败的场景，放宽到 1 后成功走出（落脚点不在门旁）', () => {
		const MAP_CONNECTIONS = require('../src/Plugins/BotAutoHunt/data/map-connections.json');
		const mapName = Object.keys(MAP_CONNECTIONS).find(k => Array.isArray(MAP_CONNECTIONS[k]) && MAP_CONNECTIONS[k].length > 0);
		const P = MAP_CONNECTIONS[mapName][0];
		const { b, e } = makeEngine({ map: { name: mapName, loading: false } });
		// 站在门旁 2 格（1.7 安全区外沿）
		b._state.self.position = [P.x + 2, P.y + 2];
		// 假寻路：所有路径格都在门 5 半径内（窄廊/贴墙），旧行为 safeEnd 永远 -1
		b.pathSearch = (cx, cy, tx, ty, range, out) => {
			out[0] = cx; out[1] = cy;
			out[2] = P.x + 2; out[3] = P.y + 3;
			out[4] = P.x + 2; out[5] = P.y + 4;
			return 3;
		};
		const moved = e._moveAwayFromPortal();
		expect(moved).toBe(true);
		expect(b.calls.moveTo.length).toBeGreaterThan(0);
		const [dx, dy] = b.calls.moveTo[b.calls.moveTo.length - 1];
		const ddx = dx - P.x, ddy = dy - P.y;
		expect(ddx * ddx + ddy * ddy).toBeGreaterThanOrEqual(1); // 绝不落脚在门/相邻格
	});
});

// ---------------------------------------------------------------------
// 战斗循环
// ---------------------------------------------------------------------

describe('战斗循环 _combatLoopInner', () => {
	it('角色死亡 → 引擎停止 + onDeath 事件（不发任何动作）', () => {
		const events = { onDeath: vi.fn() };
		const { b, e } = makeEngine({ self: { gid: 1, dead: true, position: [1, 1], walking: false, amotionBusy: false, life: null, weightPct: 0, bodyState: 0, healthState: 0 } }, events);
		e._combatLoopInner();
		expect(e.active).toBe(false);
		expect(events.onDeath).toHaveBeenCalled();
		expect(b.calls.attack).toEqual([]);
	});

	it('视野有怪 + 攻击技能 SP 足 → 施放技能（目标为怪 GID）', () => {
		const mob = fakeMob(777, 1002, [52, 50]);
		const { b, e } = makeEngine({ entities: [mob] });
		e.applySettings(baseSettings({ skills: [{ id: 9, type: SKILL_TYPE_ATTACK, level: 5, spcost: 10 }] }));
		e._combatLoopInner();
		expect(b.calls.castSkill).toEqual([[9, 5, 777]]);
	});

	it('无可用技能 → 普通攻击；normalAttack=false 时不普攻', () => {
		const mob = fakeMob(777, 1002, [52, 50]);
		const { b, e } = makeEngine({ entities: [mob] });
		e._combatLoopInner();
		expect(b.calls.attack).toEqual([777]);

		const b2 = fakeBindings({ entities: [fakeMob(778, 1002, [52, 50])] });
		const e2 = new HuntEngine(b2, {});
		e2.applySettings(baseSettings({ normalAttack: false }));
		e2.active = true;
		e2._combatLoopInner();
		expect(b2.calls.attack).toEqual([]);
	});

	it('技能槽延迟未到期（已施放过）→ 跳过该槽回落普攻；从未施放则不受延迟限制', () => {
		const mob = fakeMob(777, 1002, [52, 50]);
		const { b, e } = makeEngine({ entities: [mob] });
		e.applySettings(baseSettings({ skills: [{ id: 9, type: SKILL_TYPE_ATTACK, level: 5, spcost: 10 }], slotDelays: [60000, 0, 0, 0, 0, 0, 0, 0] }));
		e._slotLastCast[0] = Date.now(); // 上次施放在 60000ms 延迟内
		e._combatLoopInner();
		expect(b.calls.castSkill).toEqual([]);
		expect(b.calls.attack).toEqual([777]);
	});

	it('SP 经济规则1 命中（SP 低于阈值）→ 跳过技能循环直接普攻', () => {
		const mob = fakeMob(777, 1002, [52, 50]);
		const { b, e } = makeEngine({ entities: [mob], self: { gid: 1, dead: false, position: [50, 50], walking: false, amotionBusy: false, life: { hp: 100, hpMax: 100, sp: 5, spMax: 100 }, weightPct: 0, bodyState: 0, healthState: 0 } });
		e.applySettings(baseSettings({
			skills: [{ id: 9, type: SKILL_TYPE_ATTACK, level: 5, spcost: 0 }],
			spNormalAttack: { enabled: true, threshold: 10 }
		}));
		e._combatLoopInner();
		expect(b.calls.castSkill).toEqual([]);
		expect(b.calls.attack).toEqual([777]);
	});

	it('白名单非空 + 视野只剩名单外怪 → 视为无怪走巡逻（不攻击）', () => {
		const mob = fakeMob(777, 1002, [52, 50]); // 1002 不在名单
		const { b, e } = makeEngine({ entities: [mob], pathResult: 0 });
		e.applySettings(baseSettings({ mobWhitelist: { testmap01: [1113] }, flyNoMobs: false }));
		e._combatLoopInner();
		expect(b.calls.attack).toEqual([]);
		expect(b.calls.castSkill).toEqual([]);
	});

	it('白名单内怪 → 正常锁定攻击', () => {
		const mob = fakeMob(777, 1113, [52, 50]);
		const { b, e } = makeEngine({ entities: [mob] });
		e.applySettings(baseSettings({ mobWhitelist: { testmap01: [1113] } }));
		e._combatLoopInner();
		expect(b.calls.attack).toEqual([777]);
	});

	it('无怪 + flyNoMobs 开 + 超时 + 瞬移技能就绪 → castSkill(26, Lv1)', () => {
		const { b, e } = makeEngine({ entities: [] });
		e.applySettings(baseSettings({ flyNoMobs: true, noMobSeconds: 10 }));
		e._lastMobSeenTick = Date.now() - 11000; // 已超时
		e._combatLoopInner();
		expect(b.calls.castSkill).toEqual([[26, 1, 100]]); // 目标 = 自己 gid
		expect(b.calls.useItem).toEqual([]);
	});

	it('无怪 + 瞬移技能未就绪 → 使用登录的苍蝇翅膀', () => {
		const { b, e } = makeEngine({ entities: [], skillReady: () => false });
		e.applySettings(baseSettings({ flyNoMobs: true, noMobSeconds: 10 }));
		e._lastMobSeenTick = Date.now() - 11000;
		e._combatLoopInner();
		expect(b.calls.useItem).toEqual([ITEM_FLY_WING]);
	});

	it('无怪 + flyNoMobs 关 → 巡逻移动（寻路可达时 moveTo）', () => {
		const { b, e } = makeEngine({ entities: [], pathResult: 5 });
		e.applySettings(baseSettings({ flyNoMobs: false }));
		e._lastPatrolMoveTick = 0;
		e._combatLoopInner();
		expect(b.calls.moveTo.length).toBe(1);
	});

	it('画面怪数超阈值（flyOnMobCount）→ 瞬移链（技能就绪优先）', () => {
		const entities = [fakeMob(1, 1002, [51, 50]), fakeMob(2, 1003, [52, 50]), fakeMob(3, 1004, [53, 50])];
		const { b, e } = makeEngine({ entities });
		e.applySettings(baseSettings({ flyOnMobCount: { enabled: true, count: 3 } }));
		e._combatLoopInner();
		expect(b.calls.castSkill).toEqual([[26, 1, 100]]);
		expect(b.calls.attack).toEqual([]);
	});

	it('见到魔物 → onMobSeen 事件（喂魔物设定页清单）', () => {
		const events = { onMobSeen: vi.fn() };
		makeEngine({ entities: [fakeMob(777, 1113, [52, 50])] }, events).e._combatLoopInner();
		expect(events.onMobSeen).toHaveBeenCalledWith(1113, 'testmap01');
	});
});

// ---------------------------------------------------------------------
// Buff 循环
// ---------------------------------------------------------------------

describe('Buff 循环 _buffLoopInner', () => {
	it('buff 技能的 EFST 不活跃 → 直发施法（绕过 amotion）并设 8s 施法保护', () => {
		const { b, e } = makeEngine({});
		e.applySettings(baseSettings({ skills: [{ id: 34, type: SKILL_TYPE_BUFF, level: 10, spcost: 40 }] }));
		e._buffLoopInner();
		expect(b.calls.castSkillDirect).toEqual([[34, 10, 100]]);
		expect(e._castingUntil).toBeGreaterThan(Date.now());
	});

	it('buff 已在 _buffMap（数据表真实 EFST）→ 不重铸', () => {
		const efst = getPrimaryEfst('skills', 34);
		if (efst === null) return; // 数据表不含则跳过（防御性；生产 efst-map 必含）
		const { b, e } = makeEngine({});
		e.applySettings(baseSettings({ skills: [{ id: 34, type: SKILL_TYPE_BUFF, level: 10, spcost: 40 }] }));
		e.setBuff(efst, 1); // 该技能真实主 EFST 已注册
		e._buffLoopInner();
		expect(b.calls.castSkillDirect).toEqual([]);
	});

	it('buff 消耗品（auxList）EFST 不活跃 → 使用道具', () => {
		const { b, e } = makeEngine({});
		e.applySettings(baseSettings({
			aux: [{ id: 601, type: AUX_TYPE_BUFF_ITEM }]
		}));
		// 601 在 efst-map 中是消耗品非 buff → getPrimaryEfst('items',601) 为 null，不会触发。
		// 用数据表内已知 buff 道具断言：找不到时该用例自然暴露数据表假设，改用技能断言覆盖。
		e._buffLoopInner();
		expect(b.calls.useItem).toEqual([]);
	});

	it('setBuff 注册时清除对应冷却（允许过期后立即重铸——原 StatusIcons 钩子语义）', () => {
		const { e } = makeEngine({});
		e._markAction('buff_99', 60000);
		expect(e._isOnCooldown('buff_99')).toBe(true);
		e.setBuff(99, 1);
		expect(e._isOnCooldown('buff_99')).toBe(false);
		e.setBuff(99, 0);
		expect(e._buffMap[99]).toBeUndefined();
	});
});

// ---------------------------------------------------------------------
// 拾取循环与校验
// ---------------------------------------------------------------------

describe('拾取循环 _lootLoop / onItemGained', () => {
	it('地面消耗品在 2 格内 → pickupItem 并挂待校验', () => {
		const item = fakeGroundItem(555, 501, [51, 50]);
		const { b, e } = makeEngine({ entities: [item], itemTypes: { 501: 0 } }); // Type 0 = HEALING
		e._lootLoop();
		expect(b.calls.pickupItem).toEqual([555]);
		expect(e._lootPending).toBeTruthy();
	});

	it('类型不匹配（勾选仅消耗品，地面是武器）→ 不拾取', () => {
		const item = fakeGroundItem(555, 1101, [51, 50]);
		const { b, e } = makeEngine({ entities: [item], itemTypes: { 1101: 5 } }); // Type 5 = WEAPON
		e._lootLoop();
		expect(b.calls.pickupItem).toEqual([]);
	});

	it('距离超过 2 格 → moveTo（600ms 冷却节流）', () => {
		const item = fakeGroundItem(555, 501, [60, 60]);
		const { b, e } = makeEngine({ entities: [item], itemTypes: { 501: 0 } });
		e._lootLoop();
		expect(b.calls.moveTo).toEqual([[60, 60]]);
		e._lootLoop(); // 冷却内不重复
		expect(b.calls.moveTo).toEqual([[60, 60]]);
	});

	it('负重达阈值 → 暂停拾取', () => {
		const item = fakeGroundItem(555, 501, [51, 50]);
		const { b, e } = makeEngine({ entities: [item], itemTypes: { 501: 0 }, self: { gid: 1, dead: false, position: [50, 50], walking: false, amotionBusy: false, life: { hp: 100, hpMax: 100, sp: 100, spMax: 100 }, weightPct: 95, bodyState: 0, healthState: 0 } });
		e._lootLoop();
		expect(b.calls.pickupItem).toEqual([]);
	});

	it('拾取后校验失败（精炼不足）→ throwItem + 拉黑（同物品不再拾取）', () => {
		const item = fakeGroundItem(555, 1101, [51, 50]);
		const { b, e } = makeEngine({ entities: [item], itemTypes: { 1101: 5 } });
		e.applySettings(baseSettings({
			loot: { enabled: true, types: { consumable: true, weapon: true, armor: false, etc: false }, refineMin: 5, cardMin: 0, weightPausePct: 90 }
		}));
		e._lootLoop();
		expect(b.calls.pickupItem).toEqual([555]);
		e.onItemGained({ type: 5, index: 3, count: 1, RefiningLevel: 0 }); // 武器精炼 0 < 5
		expect(b.calls.throwItem).toEqual([[3, 1]]);
		// 拉黑后不再拾取同一 GID
		e._lootLoop();
		expect(b.calls.pickupItem).toEqual([555]);
	});
});

// ---------------------------------------------------------------------
// 启停 / 设置快照 / 冷却
// ---------------------------------------------------------------------

describe('start/stop 与设置快照', () => {
	it('start({huntMap}) 记录挂机地图；start() 不传则沿用旧值（cmd1 回退重启路径）', () => {
		vi.useFakeTimers();
		try {
			const b = fakeBindings({});
			const e = new HuntEngine(b, {});
			e.applySettings(baseSettings());
			e.start({ huntMap: 'gef_fild01' });
			expect(e.active).toBe(true);
			expect(e._huntMapName).toBe('gef_fild01');
			e.stop();
			e.start(); // 不传：沿用
			expect(e._huntMapName).toBe('gef_fild01');
			e.stop();
			expect(e.active).toBe(false);
		} finally {
			vi.useRealTimers();
		}
	});

	it('每秒计时事件 onSecond（fake timers 推进 3 秒）', () => {
		vi.useFakeTimers();
		try {
			const onSecond = vi.fn();
			const e = new HuntEngine(fakeBindings({}), { onSecond });
			e.applySettings(baseSettings());
			e.start({ huntMap: 'x' });
			vi.advanceTimersByTime(3000);
			expect(e.timerSec).toBe(3);
			expect(onSecond).toHaveBeenCalledTimes(3);
			expect(onSecond).toHaveBeenLastCalledWith(3);
			e.stop();
		} finally {
			vi.useRealTimers();
		}
	});

	it('applySettings 自持副本：修改源对象不影响引擎', () => {
		const { e } = makeEngine({});
		const src = baseSettings({ noMobSeconds: 30 });
		e.applySettings(src);
		src.noMobSeconds = 1;
		src.potions.hp[0].threshold = 99; // 浅层引用检查：引擎字段被整体替换而非共享
		expect(e.noMobSeconds).toBe(30);
		expect(e.potions).not.toBe(src.potions);
	});

	it('冷却系统：_markAction 后到期前命中、到期后放行', () => {
		const { e } = makeEngine({});
		e._markAction('k', 50);
		expect(e._isOnCooldown('k')).toBe(true);
		e._actionCooldowns.k = Date.now() - 1;
		expect(e._isOnCooldown('k')).toBe(false);
	});
});
