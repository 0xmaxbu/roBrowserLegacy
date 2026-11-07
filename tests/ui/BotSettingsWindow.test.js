import { describe, it, expect, beforeEach } from 'vitest';

// SettingsWindow 是零游戏依赖的纯 DOM 模块，无需 mock 重型依赖
import { createSettingsWindow } from '../../src/Plugins/BotAutoHunt/settings/SettingsWindow.js';

const TABS = [
	{ id: 'basic', label: '基本设定' },
	{ id: 'monster', label: '魔物设定' },
	{ id: 'skill', label: '技能设定' },
	{ id: 'potion', label: '药水设定' },
	{ id: 'loot', label: '捡拾设定' },
	{ id: 'move', label: '移动设定' },
	{ id: 'item', label: '道具设定' },
	{ id: 'service', label: '挂机服务' }
];

describe('SettingsWindow', () => {
	let win;

	beforeEach(() => {
		document.body.innerHTML = '';
		win = createSettingsWindow({ title: '自动战斗设置', tabs: TABS });
	});

	it('构建 8 个页签，标题与传入一致', () => {
		const tabs = win.root.querySelectorAll('.botsw-tab');
		expect(tabs).toHaveLength(8);
		const labels = Array.from(tabs).map(t => t.textContent);
		expect(labels).toEqual(TABS.map(t => t.label));
	});

	it('默认激活第一个页签，其余页签未激活', () => {
		const tabs = win.root.querySelectorAll('.botsw-tab');
		expect(tabs[0].classList.contains('active')).toBe(true);
		expect(tabs[1].classList.contains('active')).toBe(false);
	});

	it('点击页签切换激活态与对应内容面板', () => {
		const tabs = win.root.querySelectorAll('.botsw-tab');
		tabs[3].click(); // 药水设定
		expect(tabs[3].classList.contains('active')).toBe(true);
		expect(tabs[0].classList.contains('active')).toBe(false);
		// 对应面板可见，其余隐藏
		const panes = win.root.querySelectorAll('.botsw-pane');
		expect(panes[3].style.display).not.toBe('none');
		expect(panes[0].style.display).toBe('none');
	});

	it('每个页签都有占位内容面板', () => {
		const panes = win.root.querySelectorAll('.botsw-pane');
		expect(panes).toHaveLength(8);
		panes.forEach(p => expect(p.textContent.length).toBeGreaterThan(0));
	});

	it('关闭按钮隐藏窗口，open 重新显示', () => {
		win.open();
		expect(win.root.style.display).not.toBe('none');
		const closeBtn = win.root.querySelector('.botsw-close');
		closeBtn.click();
		expect(win.root.style.display).toBe('none');
		win.open();
		expect(win.root.style.display).not.toBe('none');
	});

	it('open 激活指定页签（右键直达场景）', () => {
		win.open('loot');
		const tabs = win.root.querySelectorAll('.botsw-tab');
		expect(tabs[4].classList.contains('active')).toBe(true);
	});

	it('窗口根节点挂载到 DOM 且不透传鼠标事件给游戏层', () => {
		win.open();
		expect(win.root.parentElement).toBe(document.body);
		// mousedown 等事件不应冒泡出窗口根（游戏 MouseEventHandler 依赖 document 监听）
		const seen = [];
		document.addEventListener('mousedown', () => seen.push('doc'), { once: true });
		const evt = new MouseEvent('mousedown', { bubbles: true });
		win.root.dispatchEvent(evt);
		expect(seen).toHaveLength(0);
	});
});
