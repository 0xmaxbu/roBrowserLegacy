import { describe, it, expect, vi } from 'vitest';

// SettingsWindow 的窗口骨架依赖 GUIComponent（游戏重型依赖）——mock 掉，
// 页签构建/切换/关闭逻辑在 buildSettingsHTML + bindSettingsBehavior 纯函数上测试
vi.mock('UI/GUIComponent.js', () => ({
	default: class GuiComponentStub {
		constructor(name, css) {
			this.name = name;
			this.cssText = css;
			this._shadow = document.createElement('div');
			this._host = document.createElement('div');
		}
		draggable() {}
		append() {}
		remove() {}
	}
}));

import {
	buildSettingsHTML,
	bindSettingsBehavior,
	createSettingsComponent,
	SETTINGS_TABS
} from '../../src/Plugins/BotAutoHunt/settings/SettingsWindow.js';

function buildRoot(placeholder) {
	const root = document.createElement('div');
	root.innerHTML = buildSettingsHTML(SETTINGS_TABS, placeholder);
	bindSettingsBehavior(root);
	return root;
}

describe('SettingsWindow', () => {
	it('定义 8 个页签且标题正确', () => {
		expect(SETTINGS_TABS).toHaveLength(8);
		expect(SETTINGS_TABS.map(t => t.label)).toEqual([
			'基本设定', '魔物设定', '技能设定', '药水设定',
			'捡拾设定', '移动设定', '道具设定', '挂机服务'
		]);
	});

	it('构建 8 个页签按钮，标题与定义一致', () => {
		const root = buildRoot();
		const tabs = root.querySelectorAll('.botsw-tab');
		expect(tabs).toHaveLength(8);
		expect(Array.from(tabs).map(t => t.textContent)).toEqual(SETTINGS_TABS.map(t => t.label));
	});

	it('默认激活第一个页签，其余未激活', () => {
		const root = buildRoot();
		const tabs = root.querySelectorAll('.botsw-tab');
		expect(tabs[0].classList.contains('active')).toBe(true);
		expect(tabs[1].classList.contains('active')).toBe(false);
	});

	it('点击页签切换激活态与对应内容面板', () => {
		const root = buildRoot();
		const tabs = root.querySelectorAll('.botsw-tab');
		tabs[3].click(); // 药水设定
		expect(tabs[3].classList.contains('active')).toBe(true);
		expect(tabs[0].classList.contains('active')).toBe(false);
		const panes = root.querySelectorAll('.botsw-pane');
		expect(panes[3].style.display).not.toBe('none');
		expect(panes[0].style.display).toBe('none');
	});

	it('每个页签都有占位内容面板', () => {
		const root = buildRoot('本页签建设中');
		const panes = root.querySelectorAll('.botsw-pane');
		expect(panes).toHaveLength(8);
		panes.forEach(p => expect(p.textContent).toBe('本页签建设中'));
	});

	it('顶部控制点条存在（官方窗口控制点样式）', () => {
		const root = buildRoot();
		const dots = root.querySelectorAll('.botsw-top .dot');
		expect(dots.length).toBe(4);
	});

	it('页签使用游戏标准三态位图（achievement_re/tab_*.bmp）', () => {
		const root = buildRoot();
		const tab = root.querySelector('.botsw-tab');
		expect(tab.getAttribute('data-background')).toBe('achievement_re/tab_out.bmp');
		expect(tab.getAttribute('data-hover')).toBe('achievement_re/tab_over.bmp');
		expect(tab.getAttribute('data-down')).toBe('achievement_re/tab_press.bmp');
		expect(tab.getAttribute('data-active')).toBe('achievement_re/tab_press.bmp');
	});

	it('白色内容面板存在且无额外标题条（官方窗口页签下直接是内容）', () => {
		const root = buildRoot();
		expect(root.querySelector('.botsw-panel')).toBeTruthy();
		expect(root.querySelector('.botsw-header')).toBeNull(); // 官方窗口无标题条，第五轮移除
	});

	it('点击底部关闭按钮触发 onClose 回调', () => {
		let closed = false;
		const root = document.createElement('div');
		root.innerHTML = buildSettingsHTML(SETTINGS_TABS);
		bindSettingsBehavior(root, () => {
			closed = true;
		});
		root.querySelector('.botsw-close').click();
		expect(closed).toBe(true);
	});

	it('footer 含初始化按钮（官方窗口结构）', () => {
		const root = buildRoot();
		expect(root.querySelector('.botsw-reset')).toBeTruthy();
		expect(root.querySelector('.botsw-reset').textContent).toBe('初始化');
	});

	it('点击初始化触发 onReset 并携带当前激活页签 index', () => {
		const resets = [];
		const root = document.createElement('div');
		root.innerHTML = buildSettingsHTML(SETTINGS_TABS);
		bindSettingsBehavior(root, null, index => resets.push(index));
		root.querySelectorAll('.botsw-tab')[2].click(); // 切到技能设定
		root.querySelector('.botsw-reset').click();
		expect(resets).toEqual([2]);
	});

	it('未传 onReset 时点击初始化不报错', () => {
		const root = buildRoot();
		expect(() => root.querySelector('.botsw-reset').click()).not.toThrow();
	});

	it('getActiveIndex 追踪当前激活页签', () => {
		const root = document.createElement('div');
		root.innerHTML = buildSettingsHTML(SETTINGS_TABS);
		const api = bindSettingsBehavior(root);
		expect(api.getActiveIndex()).toBe(0);
		api.setActive(2);
		expect(api.getActiveIndex()).toBe(2);
	});

	it('createSettingsComponent 返回可开合的 GUIComponent 实例且标记 persistent', () => {
		const comp = createSettingsComponent({ placeholder: 'x' });
		expect(comp.name).toBe('BotAutoHuntSettings');
		expect(comp.persistent).toBe(true);
		expect(typeof comp.render).toBe('function');
		expect(comp.render()).toContain('botsw-tabbar');
	});
});
