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

	it('官方标题栏：位图背景 + 系统按钮 + 关闭按钮齐备', () => {
		const root = buildRoot();
		const titlebar = root.querySelector('.titlebar');
		expect(titlebar).toBeTruthy();
		expect(titlebar.dataset.background).toBe('basic_interface/titlebar_mid.bmp');
		expect(root.querySelector('.base.node')).toBeTruthy();
		const closeBtn = root.querySelector('.base.close');
		expect(closeBtn).toBeTruthy();
		expect(closeBtn.dataset.background).toBe('basic_interface/sys_close_off.bmp');
	});

	it('点击官方关闭按钮触发 onClose 回调', () => {
		let closed = false;
		const root = document.createElement('div');
		root.innerHTML = buildSettingsHTML(SETTINGS_TABS);
		bindSettingsBehavior(root, () => {
			closed = true;
		});
		root.querySelector('.base.close').click();
		expect(closed).toBe(true);
	});

	it('createSettingsComponent 返回可开合的 GUIComponent 实例', () => {
		const comp = createSettingsComponent({ placeholder: 'x' });
		expect(comp.name).toBe('BotAutoHuntSettings');
		expect(typeof comp.render).toBe('function');
		expect(comp.render()).toContain('botsw-tabbar');
		comp.prepare && comp.prepare();
	});
});
