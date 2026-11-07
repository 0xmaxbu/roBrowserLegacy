/**
 * Plugins/BotAutoHunt/settings/SettingsWindow.js
 *
 * 自动战斗设置窗口 — GUIComponent 组件（官方窗口样式）
 *
 * 设计约定：
 * - 位于 settings/ 子目录：PluginManager 的 glob 只扫描 Plugins 下两层深（目录名/文件名），
 *   本文件位于第三层，不会被误当作插件自动加载，仅由 BotAutoHunt.js 显式 import。
 * - 官方样式：标题栏使用 GRF 位图（basic_interface/titlebar_mid.bmp），系统/关闭按钮
 *   使用官方位图（sys_base / sys_close），由 GUIComponent 的 data-background 机制加载。
 * - 生命周期：append() 打开 / remove() 关闭，可反复开合（DOM 持久，页签状态保留）。
 *
 * 术语：用户可见名称为「自动战斗」（见仓库根 GLOSSARY.md）。
 */

import GUIComponent from 'UI/GUIComponent.js';

/** 8 页签定义（T1 占位，T2-T8 逐个填充内容） */
export const SETTINGS_TABS = [
	{ id: 'basic', label: '基本设定' },
	{ id: 'monster', label: '魔物设定' },
	{ id: 'skill', label: '技能设定' },
	{ id: 'potion', label: '药水设定' },
	{ id: 'loot', label: '捡拾设定' },
	{ id: 'move', label: '移动设定' },
	{ id: 'item', label: '道具设定' },
	{ id: 'service', label: '挂机服务' }
];

/** 窗口 CSS（官方窗口规范：白底、圆角、标题栏位图、标准字号）
 *  注意：GUIComponent 的 shadow 内无法用文档级 id 选择器命中宿主，
 *  全部规则使用 :host 与纯类名选择器。 */
const CSS_TEXT = `
:host {
	width: 520px;
	height: 380px;
	top: 120px;
	left: 35%;
	min-width: 420px;
}

.ui-component-root {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	background-color: white;
	border-radius: 5px;
	border: 1px solid #4b4b4b;
	font-family: Gulim, Dotum, "Malgun Gothic", sans-serif;
	font-size: 12px;
	color: #3c3c3c;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}

.titlebar {
	position: relative;
	height: 23px;
	flex: 0 0 auto;
	cursor: move;
}

.titlebar .base {
	width: 11px;
	height: 11px;
	position: absolute;
	top: 4px;
	border: none;
	padding: 0;
	background-color: transparent;
	background-repeat: no-repeat;
	cursor: pointer;
}

.titlebar .base.node { left: 3px; }
.titlebar .base.close { right: 3px; }

.titlebar .title {
	line-height: 23px;
	text-align: center;
	color: #2d2d2d;
	font-weight: bold;
	font-size: 12px;
	text-shadow: 0 1px 0 rgba(255,255,255,0.6);
}

.botsw-tabbar {
	flex: 0 0 auto;
	display: flex;
	flex-wrap: wrap;
	gap: 2px;
	padding: 4px 6px 0;
	background: #e8dcc0;
	border-bottom: 1px solid #a58a55;
}

.botsw-tab {
	padding: 4px 10px;
	cursor: pointer;
	border: 1px solid #a58a55;
	border-bottom: none;
	border-radius: 4px 4px 0 0;
	background: #d9c49a;
	color: #5a4423;
	font-size: 12px;
	font-family: inherit;
}

.botsw-tab.active {
	background: #fffef2;
	color: #2d2d2d;
	font-weight: bold;
}

.botsw-panewrap {
	flex: 1 1 auto;
	overflow-y: auto;
	background: #fffef2;
}

.botsw-pane {
	padding: 16px;
	text-align: center;
	color: #7a6a4a;
	line-height: 1.8;
}
`;

/**
 * 构建窗口内部 HTML（独立导出，便于 jsdom 测试）
 *
 * 官方标题栏结构对齐 CashShop/Escape：
 *   titlebar(data-background=titlebar_mid.bmp) > node(sys_base) + title + close(sys_close)
 *
 * @param {Array}  tabs        页签定义 [{id, label}]
 * @param {string} placeholder 页签占位文案
 * @return {string} HTML 字符串
 */
export function buildSettingsHTML(tabs, placeholder) {
	const list = tabs || SETTINGS_TABS;
	const ph = placeholder || '本页签建设中';

	let tabHtml = '';
	let paneHtml = '';
	list.forEach(function (tab, index) {
		tabHtml +=
			'<button class="botsw-tab" data-index="' + index + '">' + tab.label + '</button>';
		paneHtml += '<div class="botsw-pane" data-index="' + index + '">' + ph + '</div>';
	});

	return (
		'<div class="titlebar" data-background="basic_interface/titlebar_mid.bmp">' +
			'<button class="base node" data-background="basic_interface/sys_base_off.bmp" data-hover="basic_interface/sys_base_on.bmp"></button>' +
			'<div class="title">自动战斗设置</div>' +
			'<button class="base close" data-background="basic_interface/sys_close_off.bmp" data-hover="basic_interface/sys_close_on.bmp"></button>' +
		'</div>' +
		'<div class="botsw-tabbar">' + tabHtml + '</div>' +
		'<div class="botsw-panewrap">' + paneHtml + '</div>'
	);
}

/**
 * 为窗口根节点绑定页签切换/关闭行为（独立导出，便于 jsdom 测试）
 *
 * @param {HTMLElement} root        包含 .botsw-tabbar/.botsw-panewrap 的根元素
 * @param {Function}    [onClose]   关闭回调
 */
export function bindSettingsBehavior(root, onClose) {
	const tabs = Array.from(root.querySelectorAll('.botsw-tab'));
	const panes = Array.from(root.querySelectorAll('.botsw-pane'));

	function setActive(index) {
		tabs.forEach(function (tabEl, i) {
			tabEl.classList.toggle('active', i === index);
			if (panes[i]) panes[i].style.display = i === index ? '' : 'none';
		});
	}

	tabs.forEach(function (tabEl, index) {
		tabEl.addEventListener('click', function () {
			setActive(index);
		});
	});

	if (panes[0]) panes[0].style.display = '';
	for (let i = 1; i < panes.length; i++) panes[i].style.display = 'none';
	tabs.forEach(function (tabEl, i) {
		tabEl.classList.toggle('active', i === 0);
	});

	const closeBtn = root.querySelector('.base.close');
	if (closeBtn) {
		closeBtn.addEventListener('click', function () {
			if (typeof onClose === 'function') onClose();
		});
	}

	return { setActive: setActive };
}

/**
 * 创建设置窗口组件（GUIComponent，官方样式）
 *
 * @param {Object}   [opts]
 * @param {string}   [opts.placeholder] 页签占位文案
 * @param {Function} [opts.onClose]     关闭回调
 * @return {GUIComponent} 用 append() 打开、remove() 关闭
 */
export function createSettingsComponent(opts) {
	const opts_ = opts || {};
	const html = buildSettingsHTML(SETTINGS_TABS, opts_.placeholder);

	const Component = new GUIComponent('BotAutoHuntSettings', CSS_TEXT);
	Component.render = function () {
		return html;
	};

	Component.init = function () {
		this.draggable();
		const root = this._shadow;
		const comp = this;
		bindSettingsBehavior(root, function () {
			comp.remove();
			if (typeof opts_.onClose === 'function') opts_.onClose();
		});
	};

	return Component;
}

export default createSettingsComponent;
