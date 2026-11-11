import { describe, it, expect, vi } from 'vitest';

// SettingsWindow 的窗口骨架依赖 GUIComponent（游戏重型依赖）——mock 掉，
// 页签构建/切换/关闭逻辑在 buildSettingsHTML + bindSettingsBehavior 纯函数上测试
vi.mock('UI/CursorManager.js', () => ({
	// 游戏内光标：测试只需记录 setType 调用（真实模块依赖渲染器/canvas）
	default: { ACTION: { DEFAULT: 0, CLICK: 2 }, setType: vi.fn(), getActualType: () => 0 }
}));
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

	it('标题栏使用游戏标准素材（titlebar 平铺条 + sys_base/sys_close 系统按钮）', () => {
		const root = buildRoot();
		const base = root.querySelector('.botsw-btn-base');
		const close = root.querySelector('.botsw-btn-close');
		expect(root.querySelector('.botsw-top').getAttribute('data-background')).toBe('basic_interface/titlebar_mid.bmp');
		expect(base.getAttribute('data-background')).toBe('basic_interface/sys_base_off.bmp');
		expect(base.getAttribute('data-hover')).toBe('basic_interface/sys_base_on.bmp');
		expect(close.getAttribute('data-background')).toBe('basic_interface/sys_close_off.bmp');
		expect(close.getAttribute('data-hover')).toBe('basic_interface/sys_close_on.bmp');
		expect(root.querySelector('.botsw-top-text').textContent).toBe('自动战斗');
	});

	it('页签为装备栏同款样式（纯 CSS，无位图 data-* 属性）', () => {
		const root = buildRoot();
		const tab = root.querySelector('.botsw-tab');
		expect(tab.getAttribute('data-background')).toBeNull();
		expect(tab.getAttribute('data-hover')).toBeNull();
		expect(tab.getAttribute('data-down')).toBeNull();
		expect(tab.getAttribute('data-active')).toBeNull();
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

	it('T9 官方分页器：setPager 控制显隐/标签/翻页回调（« 1 / 2 »）', () => {
		const root = document.createElement('div');
		root.innerHTML = buildSettingsHTML(SETTINGS_TABS);
		const api = bindSettingsBehavior(root);
		const pager = root.querySelector('.botsw-pager');
		expect(pager).toBeTruthy(); // footer 中间分页器容器存在
		// 默认未显示（CSS display:none；内联样式空，setPager 后才置 flex）
		expect(pager.style.display).not.toBe('flex');
		// 两页页签：显示 + 标签 + 回调
		const switches = [];
		api.setPager(0, 2, delta => switches.push(delta));
		expect(pager.style.display).toBe('flex');
		expect(root.querySelector('.botsw-pager-label').textContent).toBe('1 / 2');
		root.querySelector('.botsw-pager-next').click();
		expect(switches).toEqual([1]);
		root.querySelector('.botsw-pager-prev').click();
		expect(switches).toEqual([1, -1]);
		// 单页页签：隐藏 + 回调失效
		api.setPager(0, 0, null);
		expect(pager.style.display).toBe('none');
	});

	it('createSettingsComponent 返回可开合的 GUIComponent 实例且标记 persistent', () => {
		const comp = createSettingsComponent({ placeholder: 'x' });
		expect(comp.name).toBe('BotAutoHuntSettings');
		expect(comp.persistent).toBe(true);
		expect(typeof comp.render).toBe('function');
		expect(comp.render()).toContain('botsw-tabbar');
	});
});

describe('T9.14 页签/分页滚动复位', () => {
	it('页签切换后共用滚动层 scrollTop 归零', () => {
		const root = document.createElement('div');
		root.innerHTML = buildSettingsHTML(SETTINGS_TABS, '占位');
		bindSettingsBehavior(root);
		const wrap = root.querySelector('.botsw-panewrap');
		// jsdom 无布局（scrollTop 会被 clamp 为 0），实例上覆盖为普通值属性以验证写入
		Object.defineProperty(wrap, 'scrollTop', { value: 120, writable: true, configurable: true });
		const tabs = root.querySelectorAll('.botsw-tab');
		tabs[3].click(); // 切到药水设定
		expect(wrap.scrollTop).toBe(0);
	});

	it('behavior.resetScroll() 归零滚动层（分页器翻页复用同一入口）', () => {
		const root = document.createElement('div');
		root.innerHTML = buildSettingsHTML(SETTINGS_TABS, '占位');
		const behavior = bindSettingsBehavior(root);
		const wrap = root.querySelector('.botsw-panewrap');
		Object.defineProperty(wrap, 'scrollTop', { value: 80, writable: true, configurable: true });
		behavior.resetScroll();
		expect(wrap.scrollTop).toBe(0);
	});
});
