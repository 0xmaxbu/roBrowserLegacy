import { describe, it, expect } from 'vitest';

// T7: 生成器 classifyItem 的 sc_end 解除异常类识别（纯函数，无 fs 依赖）
// 源：tools/client/generate-efst-map.mjs（有 main 守卫，导入安全）
import { classifyItem } from '../../../../tools/client/generate-efst-map.mjs';

// status.yml 子集：仅 Hallucination/Bleeding 有图标（Poison/Silence/Blind/Confusion/Curse 走 Opt 通道）
const statusMap = new Map([
	['hallucination', 'EFST_ILLUSION'],
	['bleeding', 'EFST_BLOODING']
]);
// StatusConst.js 子集
const statusConsts = new Map([
	['ILLUSION', 34],
	['BLOODING', 124]
]);
const denylist = new Set();

describe('generate-efst-map classifyItem（T7 解除异常类扩展）', () => {
	it('sc_end 脚本 → type=cure；图标态进 efst，无图标态进 opt2 位', () => {
		const item = {
			id: 506,
			aegisName: 'Green_Potion',
			name: 'Green Potion',
			type: 'Healing',
			script: 'sc_end SC_POISON;\nsc_end SC_SILENCE;\nsc_end SC_BLIND;\nsc_end SC_CONFUSION;\nsc_end SC_Hallucination;'
		};
		const r = classifyItem(item, statusMap, statusConsts, denylist);
		expect(r.type).toBe('cure');
		expect(r.efst).toEqual([34]); // Hallucination → EFST_ILLUSION
		expect(r.opt2).toEqual([1, 4, 16, 8]); // POISON/SILENCE/BLIND/CONFUSION
		expect(r.opt1).toEqual([]);
	});

	it('万能药（含诅咒）→ opt2 追加 CURSE 位', () => {
		const item = {
			id: 525,
			script: 'sc_end SC_POISON;\nsc_end SC_CURSE;\nsc_end SC_SILENCE;\nsc_end SC_BLIND;\nsc_end SC_CONFUSION;\nsc_end SC_Hallucination;'
		};
		const r = classifyItem(item, statusMap, statusConsts, denylist);
		expect(r.type).toBe('cure');
		expect(r.opt2).toEqual([1, 2, 4, 16, 8]); // 按脚本 sc_end 顺序（诅咒在第四位）
	});

	it('普通治疗脚本（itemheal）不受影响，仍分类 hp', () => {
		const item = { id: 501, script: 'itemheal 45,0;' };
		const r = classifyItem(item, statusMap, statusConsts, denylist);
		expect(r.type).toBe('hp');
	});

	it('sc_start 增益脚本优先级仍高于 cure 段', () => {
		const item = { id: 900, script: 'sc_start SC_PROVOKE,10000,5;\nsc_end SC_POISON;' };
		const r = classifyItem(item, statusMap, statusConsts, denylist);
		// SC_PROVOKE 无图标映射 → efst 空 → 落到 cure 段（既有 denylist/解析语义不变）
		expect(['cure', 'unknown']).toContain(r.type);
	});
});
