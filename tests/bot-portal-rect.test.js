/**
 * tests/bot-portal-rect.test.js
 *
 * T9.7 传送门矩形触发区回避。
 *
 * 服务端事实（npc.cpp npc_touch_areanpc）：warp 触发区是闭区间矩形
 * [x-xs, x+xs] × [y-ys, y+ys]，xs/ys 由 tools/client/generate-warp-extents.mjs
 * 解析进 map-connections.json 的 w/h 字段。引擎 _isNearPortal 在圆形半径判定外
 * 新增矩形判定（含 1 格缓冲）；_moveAwayFromPortal 的 nearby 收集同步矩形感知。
 *
 * 本文件用 vi.mock 注入受控的带 w/h 假数据（不依赖真实数据内容）；
 * 真实数据完整性断言直接 fs 读原文件（不被 mock 影响）。
 */

import { describe, it, expect, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// ---------------------------------------------------------------------
// 受控假数据：竖带门 + 点语义门
// 竖带门 (16,187) w=3 h=17 → 服务端触发矩形 x∈[13,19], y∈[170,204]
// ---------------------------------------------------------------------
vi.mock('../src/Plugins/BotAutoHunt/data/map-connections.json', () => ({
	default: {
		rectmap01: [
			{ to: 'west_map', x: 16, y: 187, w: 3, h: 17 },
			{ to: 'town_map', x: 100, y: 100 } // 点语义：无 w/h（脚本动态 warp / 单格门）
		]
	}
}));

import HuntEngine from '../src/Plugins/BotAutoHunt/engine/HuntEngine.js';

/** 最小 bindings 假件（协议对齐 tests/bot-engine.test.js，仅本文件所需子集） */
function fakeBindings(state) {
	const s = Object.assign({
		self: { gid: 100, name: 'tester', dead: false, position: [30, 187], walking: false, amotionBusy: false,
			life: { hp: 1000, hpMax: 1000, sp: 100, spMax: 100 }, weightPct: 0, bodyState: 0, healthState: 0 },
		map: { name: 'rectmap01', loading: false }
	}, state);
	const calls = { moveTo: [] };
	return {
		calls,
		self: () => s.self,
		mapState: () => s.map,
		isWalkable: () => true,
		pathSearch(cx, cy, tx, ty, range, out) {
			// 直线假路径：从起点走向目标，10 步
			const steps = 10;
			const dx = Math.sign(tx - cx), dy = Math.sign(ty - cy);
			for (let i = 0; i <= steps; i++) {
				out[i * 2] = cx + dx * i;
				out[i * 2 + 1] = cy + dy * i;
			}
			return steps;
		},
		pathSearchLong(cx, cy, tx, ty, range, out) {
			const n = this.pathSearch(cx, cy, tx, ty, range, out);
			return { pathLength: n };
		},
		moveTo: (x, y) => calls.moveTo.push([x, y]),
		_state: s
	};
}

function makeEngine(state) {
	const b = fakeBindings(state);
	const e = new HuntEngine(b, {});
	return { b, e };
}

/** 点是否在门 (16,187) w3 h17 的触发矩形+1格缓冲内 */
function inBandWithBuffer(x, y) {
	return x >= 12 && x <= 20 && y >= 169 && y <= 205;
}

// ---------------------------------------------------------------------
// _isNearPortal 矩形语义
// ---------------------------------------------------------------------
describe('T9.7 _isNearPortal 矩形触发区', () => {
	it('带内但圆形半径外（(16,198) 距门 11 格）→ true（旧逻辑漏判的回归点）', () => {
		const { e } = makeEngine({});
		expect(e._isNearPortal(16, 198, 7)).toBe(true);
	});

	it('圆形半径内 → true（原有行为不变）', () => {
		const { e } = makeEngine({});
		expect(e._isNearPortal(16, 190, 7)).toBe(true);
	});

	it('矩形边缘 +1 格缓冲内 → true；+2 格 → false（选圆形够不着的 y=200 行，避免圆形判定干扰）', () => {
		const { e } = makeEngine({});
		expect(e._isNearPortal(16, 205, 7)).toBe(true);  // y = 204+1（缓冲）
		expect(e._isNearPortal(16, 206, 7)).toBe(false); // y = 204+2
		expect(e._isNearPortal(20, 200, 7)).toBe(true);  // x = 19+1（缓冲），距门格圆形外
		expect(e._isNearPortal(21, 200, 7)).toBe(false); // x = 19+2
	});

	it('带外且圆形外 → false（北/南远端不受矩形拖累）', () => {
		const { e } = makeEngine({});
		expect(e._isNearPortal(16, 166, 7)).toBe(false); // 带北端外 4 格
		expect(e._isNearPortal(16, 210, 7)).toBe(false); // 带南端外 5 格
	});

	it('点语义门（无 w/h）仍按圆形半径判定', () => {
		const { e } = makeEngine({});
		expect(e._isNearPortal(100, 105, 7)).toBe(true);  // 距 (100,100) 5 格
		expect(e._isNearPortal(100, 110, 7)).toBe(false); // 距 10 格
	});
});

// ---------------------------------------------------------------------
// 巡逻目标不选带内点
// ---------------------------------------------------------------------
describe('T9.7 巡逻目标矩形过滤', () => {
	it('路径"安全"但终点在带内圆形外 → 拒绝（旧逻辑会选中并走进竖带被传走）', () => {
		const { b, e } = makeEngine({});
		b._state.self.position = [30, 198];
		// 假寻路（策略 1/2 同一路径）：沿 y=198 西行，终点 (16,198) 在带内但距门格 11 格（圆 5/7 半径都漏）
		const inBandPath = (cx, cy, tx, ty, range, out) => {
			for (let i = 0; i <= 14; i++) { out[i * 2] = cx - i; out[i * 2 + 1] = 198; }
			return 14;
		};
		b.pathSearchLong = (cx, cy, tx, ty, range, out) => {
			const n = inBandPath(cx, cy, tx, ty, range, out);
			return { pathLength: n };
		};
		b.pathSearch = inBandPath;
		// 8+4 次尝试全部命中同一假路径 → 全部被矩形判定拒绝 → 无巡逻目标
		expect(e._findPatrolTarget()).toBeNull();
	});

	it('终点在带外 → 正常选中', () => {
		const { b, e } = makeEngine({});
		b._state.self.position = [30, 190];
		// 终点 (30+15,190)=(45,190)：带外（x=45>20）且圆形外
		b.pathSearchLong = (cx, cy, tx, ty, range, out) => {
			for (let i = 0; i <= 15; i++) { out[i * 2] = cx + i; out[i * 2 + 1] = 190; }
			return { pathLength: 15 };
		};
		const target = e._findPatrolTarget();
		expect(target).not.toBeNull();
		expect(inBandWithBuffer(target[0], target[1])).toBe(false);
	});
});

// ---------------------------------------------------------------------
// 远离传送门：竖带深处（旧逻辑 nearby 漏收 → 原地不动）
// ---------------------------------------------------------------------
describe('T9.7 远离传送门矩形感知', () => {
	it('玩家在带深处 (16,171) 距门格 16 格 → 仍触发远离且落点在带外', () => {
		const { b, e } = makeEngine({});
		b._state.self.position = [16, 171];
		// d2 = 16² = 256 ≥ 225 → 旧圆形收集漏收，直接 return true 不发移动
		const moved = e._moveAwayFromPortal();
		expect(moved).toBe(true);
		expect(b.calls.moveTo.length).toBeGreaterThan(0);
		const [tx, ty] = b.calls.moveTo[b.calls.moveTo.length - 1];
		expect(inBandWithBuffer(tx, ty)).toBe(false); // 落点必须在矩形+缓冲外
	});

	it('玩家在门旁（15 格内）行为不变：落点在带外', () => {
		const { b, e } = makeEngine({});
		b._state.self.position = [16, 192];
		const moved = e._moveAwayFromPortal();
		expect(moved).toBe(true);
		const [tx, ty] = b.calls.moveTo[b.calls.moveTo.length - 1];
		expect(inBandWithBuffer(tx, ty)).toBe(false);
	});
});

// ---------------------------------------------------------------------
// _sendMoveTo safeEnd 截断
// ---------------------------------------------------------------------
describe('T9.7 移动落点截断', () => {
	it('沿带内行走的目标路径 → 截断到矩形外最后一格', () => {
		const { b, e } = makeEngine({});
		b._state.self.position = [30, 198];
		// 假路径沿 y=198 西行到 (16,198)（带内，圆形半径外）
		b.pathSearch = (cx, cy, tx, ty, range, out) => {
			for (let i = 0; i <= 14; i++) { out[i * 2] = cx - i; out[i * 2 + 1] = 198; }
			return 14;
		};
		const moved = e._sendMoveTo(16, 198, 5);
		expect(moved).toBe(true);
		expect(b.calls.moveTo.length).toBe(1);
		const [tx, ty] = b.calls.moveTo[0];
		expect(inBandWithBuffer(tx, ty)).toBe(false); // 旧逻辑会落进 (16,198) 带内
		expect([tx, ty]).toEqual([21, 198]); // 截断点 = 矩形+缓冲外第一格
	});
});

// ---------------------------------------------------------------------
// 真实数据完整性（fs 直读，绕过 vi.mock）
// ---------------------------------------------------------------------
describe('T9.7 map-connections.json 数据完整性', () => {
	// vitest 运行根 = client/src；import.meta.url 在 vitest 变换后非 file 协议，不能用于 URL
	const realPath = path.join(process.cwd(), 'src/Plugins/BotAutoHunt/data/map-connections.json');
	const real = JSON.parse(fs.readFileSync(realPath, 'utf8'));

	it('prt_fild08 西门 (16,187) w=3 h=17（与服务端 prontera_fild.txt prtf15-1 3,17 一致）', () => {
		const p = real.prt_fild08.find(p => p.x === 16 && p.y === 187);
		expect(p).toBeDefined();
		expect(p.w).toBe(3);
		expect(p.h).toBe(17);
	});

	it('所有 w/h 字段为非负整数且不同时为 0', () => {
		let sized = 0;
		for (const portals of Object.values(real)) {
			for (const p of portals) {
				if (p.w === undefined) continue;
				expect(Number.isInteger(p.w)).toBe(true);
				expect(Number.isInteger(p.h)).toBe(true);
				expect(p.w).toBeGreaterThanOrEqual(0);
				expect(p.h).toBeGreaterThanOrEqual(0);
				expect(p.w === 0 && p.h === 0).toBe(false); // 0/0 保持点语义，不该带字段
				sized++;
			}
		}
		expect(sized).toBeGreaterThan(3000); // 生成器实测 3598 门
	});
});
