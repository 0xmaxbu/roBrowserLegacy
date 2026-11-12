import { describe, it, expect, vi } from 'vitest';

// decodeMsgMarkup 是纯函数（仅依赖 DB.getMessage），mock 重依赖后直接测渲染逻辑。
// 2026-11-12：rAthena <MSG> 系统邮件标记客户端渲染（签到邮件 3455/3456）。
vi.mock('DB/DBManager.js', () => ({
	default: {
		getMessage: (id, def) => {
			const table = { 3455: '运营团队', 3456: '第%d日的签到奖励已发放', 7000: '%s 获得 %d 个物品' };
			return table[id] !== undefined ? table[id] : def;
		}
	}
}));
vi.mock('Utils/jquery.js', () => ({
	default: function () {
		return { css: () => {}, on: () => {}, find: () => [] };
	},
	fn: {}
}));
vi.mock('Core/Client.js', () => ({ default: {} }));
vi.mock('Core/Preferences.js', () => ({ default: { get: () => ({}) } }));
vi.mock('Renderer/Renderer.js', () => ({ default: {} }));
vi.mock('Controls/KeyEventHandler.js', () => ({ default: {} }));
vi.mock('UI/Components/ChatBox/ChatBox.js', () => ({
	default: { addText: () => {}, TYPE: {}, FILTER: {} }
}));
vi.mock('UI/UIManager.js', () => ({ default: { addComponent: c => c } }));
vi.mock('UI/UIComponent.js', () => ({ default: class UIComponentStub {} }));

import { decodeMsgMarkup } from 'UI/Components/Rodex/Rodex.js';

describe('Rodex decodeMsgMarkup（<MSG> 系统邮件标记渲染）', () => {
	it('无标记文本原样返回', () => {
		expect(decodeMsgMarkup('普通邮件标题')).toBe('普通邮件标题');
		expect(decodeMsgMarkup('')).toBe('');
		expect(decodeMsgMarkup(null)).toBe(null);
		expect(decodeMsgMarkup(undefined)).toBe(undefined);
	});

	it('纯 ID 标记（发件人 3455）查表渲染', () => {
		expect(decodeMsgMarkup('<MSG>3455</MSG>')).toBe('运营团队');
	});

	it('带参数标记（3456,%d 天数）按序替换格式串', () => {
		expect(decodeMsgMarkup('<MSG>3456,1</MSG>')).toBe('第1日的签到奖励已发放');
		expect(decodeMsgMarkup('<MSG>3456,20</MSG>')).toBe('第20日的签到奖励已发放');
	});

	it('多参数标记按序填 %s/%d', () => {
		expect(decodeMsgMarkup('<MSG>7000,玩家,3</MSG>')).toBe('玩家 获得 3 个物品');
	});

	it('查表未命中保持原样（等价旧行为，零回归）', () => {
		expect(decodeMsgMarkup('<MSG>99999</MSG>')).toBe('<MSG>99999</MSG>');
		expect(decodeMsgMarkup('<MSG>99999,5</MSG>')).toBe('<MSG>99999,5</MSG>');
	});

	it('标记外的正文保留，多个标记各自渲染', () => {
		expect(decodeMsgMarkup('前缀 <MSG>3455</MSG> 后缀')).toBe('前缀 运营团队 后缀');
		expect(decodeMsgMarkup('<MSG>3455</MSG>：<MSG>3456,7</MSG>')).toBe('运营团队：第7日的签到奖励已发放');
	});
});
