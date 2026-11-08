/**
 * Plugins/BotAutoHunt/settings/SettingsWindow.js
 *
 * 自动战斗设置窗口 — GUIComponent 组件（官方《RO乐园》现代蓝色 UI 风格）
 *
 * 设计约定：
 * - 位于 settings/ 子目录：PluginManager 的 glob 只扫描 Plugins 下两层深（目录名/文件名），
 *   本文件位于第三层，不会被误当作插件自动加载，仅由 BotAutoHunt.js 显式 import。
 * - 样式对照官方公告截图（docs/assets/official-auto-battle/，公告 id=217525）：
 *   浅蓝窗体 + 顶部控制点条 + 蓝字页签（激活白底）+ 白色圆角内容面板（蓝色节标题条）+
 *   底部初始化/關閉按钮。纯 CSS 绘制，不依赖 GRF 位图。
 * - 生命周期：append() 打开 / remove() 关闭，persistent=true（引擎在登录/地图
 *   切换时会 removeComponents 清除非持久组件，窗口开合由插件自行管理）。
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

/** 窗口 CSS（官方現代藍色 UI，對照 docs/assets/official-auto-battle/ 截圖）
 *  注意：GUIComponent shadow 內無法用文檔級 id 選擇器命中宿主，
 *  全部規則使用 :host 與純類名選擇器。 */
const CSS_TEXT = `
:host {
	width: 480px; /* 8 页签单行无换行的最小宽度（官方 7 页签为 443px，多「挂机服务」页签） */
	height: 360px;
	top: 110px;
	left: 36%;
	min-width: 460px;
}

.ui-component-root {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	background: linear-gradient(to bottom, #e8f0f7, #dce8f2);
	border: 1px solid #7f9fc0;
	border-radius: 6px;
	font-family: "Microsoft JhengHei", Gulim, Dotum, sans-serif;
	font-size: 12px;
	color: #1a3a5c;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	box-shadow: 0 4px 14px rgba(30, 60, 100, 0.35);
}

/* 頂部标题栏：游戏标准素材（titlebar_mid 水平平铺 + sys_base/sys_close 系统按钮，同 SkillListMH 规范） */
.botsw-top {
	flex: 0 0 auto;
	height: 17px;
	background-color: #a9c4dc;
	background-repeat: repeat-x; /* titlebar_mid 12×17 位图水平平铺 */
	border-bottom: 1px solid #7f9fc0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 3px;
	cursor: move;
}

.botsw-sysbtn {
	width: 11px;
	height: 11px;
	background-repeat: no-repeat;
	cursor: pointer;
}

.botsw-top-left {
	display: flex;
	align-items: center;
	gap: 3px;
}

.botsw-top-text {
	font-size: 11px;
	font-weight: bold;
	color: #1a3a5c;
	text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.85);
	line-height: 1;
	white-space: nowrap;
}

.botsw-top-right {
	display: flex;
}

/* 頁籤列 */
.botsw-tabbar {
	flex: 0 0 auto;
	display: flex;
	gap: 1px;
	padding: 3px 4px 0;
	background: #cfdfef;
	border-bottom: 1px solid #9db8d2;
}

.botsw-tab {
	flex: 1 1 auto;
	height: 26px;
	line-height: 24px;
	padding: 0 2px;
	cursor: pointer;
	border: none;
	border-radius: 3px 3px 0 0;
	color: #2e4058;
	font-size: 11px; /* 与游戏内页签字号一致 */
	font-family: inherit;
	text-align: center;
	white-space: nowrap; /* 页签文字禁止换行（窗口宽度已按 8 页签单行设计） */
	background-size: 100% 100%;
	background-color: #dce9f5; /* 位图加载失败兑底 */
	user-select: none;
}

.botsw-tab.active {
	color: #0d2b4d;
	font-weight: bold;
}

/* T2: 数字输入去原生上下箭头（保持 type=number 整数语义，仅文本框） */
.botsw-pane input[type='number']::-webkit-outer-spin-button,
.botsw-pane input[type='number']::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}
.botsw-pane input[type='number'] {
	-moz-appearance: textfield;
	appearance: textfield;
}

/* 白色圓角內容面板 + 藍色節標題條 */
.botsw-panel {
	flex: 1 1 auto;
	display: flex;
	flex-direction: column;
	margin: 6px;
	background: #ffffff;
	border: 1px solid #b8cde0;
	border-radius: 8px;
	overflow: hidden;
}

.botsw-panewrap {
	flex: 1 1 auto;
	overflow-y: auto;
	background: #ffffff;
}

.botsw-pane {
	padding: 4px 10px; /* 紧凑：官方无滚动条，一页容纳全部内容 */
	text-align: center;
	color: #1a3a5c;
	line-height: 1.2;
}

/* 底部：初始化（左）/ 關閉（右） */
.botsw-footer {
	flex: 0 0 auto;
	display: flex;
	justify-content: space-between;
	padding: 4px 8px;
}

.botsw-footer button {
	padding: 2px 12px;
	font-size: 12px;
	font-family: inherit;
	color: #1a3a5c;
	background: linear-gradient(to bottom, #ffffff, #d5e2ee);
	border: 1px solid #9db8d2;
	border-radius: 3px;
	cursor: pointer;
}

.botsw-footer button:hover {
	background: linear-gradient(to bottom, #ffffff, #c4d8ea);
}
`;

/**
 * 構建窗口內部 HTML（獨立導出，便於 jsdom 測試）
 *
 * 結構對照官方截圖（docs/assets/official-auto-battle/）：
 *   頂部控制點條 → 頁籤列 → 白色圓角面板（藍色節標題條 + 內容）→ 底部初始化/關閉
 *
 * @param {Array}  tabs        頁籤定義 [{id, label}]
 * @param {string} placeholder 頁籤佔位文案
 * @return {string} HTML 字符串
 */
export function buildSettingsHTML(tabs, placeholder) {
	const list = tabs || SETTINGS_TABS;
	const ph = placeholder || '本页签建设中';

	let tabHtml = '';
	let paneHtml = '';
	list.forEach(function (tab, index) {
		// T2: 页签用游戏标准三态位图（achievement_re/tab_*.bmp，GUIComponent data-active 跟随 .active 类自动换图）
		tabHtml +=
			'<button class="botsw-tab" data-index="' + index + '" ' +
			'data-background="achievement_re/tab_out.bmp" ' +
			'data-hover="achievement_re/tab_over.bmp" ' +
			'data-down="achievement_re/tab_press.bmp" ' +
			'data-active="achievement_re/tab_press.bmp">' + tab.label + '</button>';
		paneHtml += '<div class="botsw-pane" data-index="' + index + '">' + ph + '</div>';
	});

	return (
		'<div class="botsw-top" data-background="basic_interface/titlebar_mid.bmp">' +
			'<div class="botsw-top-left">' +
				'<div class="botsw-sysbtn botsw-btn-base" data-background="basic_interface/sys_base_off.bmp" data-hover="basic_interface/sys_base_on.bmp"></div>' +
				'<span class="botsw-top-text">自动战斗</span>' +
			'</div>' +
			'<div class="botsw-top-right">' +
				'<div class="botsw-sysbtn botsw-btn-close" data-background="basic_interface/sys_close_off.bmp" data-hover="basic_interface/sys_close_on.bmp"></div>' +
			'</div>' +
		'</div>' +
		'<div class="botsw-tabbar">' + tabHtml + '</div>' +
		'<div class="botsw-panel">' +
			'<div class="botsw-panewrap">' + paneHtml + '</div>' +
		'</div>' +
		'<div class="botsw-footer">' +
			'<button class="botsw-reset">初始化</button>' +
			'<button class="botsw-close">关闭</button>' +
		'</div>'
	);
}

/**
 * 為窗口根節點綁定頁籤切換/關閉/初始化行為（獨立導出，便於 jsdom 測試）
 *
 * @param {HTMLElement} root        包含 .botsw-tabbar/.botsw-panel 的根元素
 * @param {Function}    [onClose]   關閉回調
 * @param {Function}    [onReset]   初始化回調（參數：當前激活頁籤 index）
 * @return {{ setActive: Function, getActiveIndex: Function }}
 */
export function bindSettingsBehavior(root, onClose, onReset) {
	const tabs = Array.from(root.querySelectorAll('.botsw-tab'));
	const panes = Array.from(root.querySelectorAll('.botsw-pane'));
	let activeIndex = 0;
	// 页签位图三态由 GUIComponent 构造函数的 _processAllDataAttrs 统一接线
	// （data-active 的 MutationObserver 监听 .active 类自动换图，此处勿重复调用 processDataAttrs）

	function setActive(index) {
		activeIndex = index;
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

	const closeBtn = root.querySelector('.botsw-close');
	if (closeBtn) {
		closeBtn.addEventListener('click', function () {
			if (typeof onClose === 'function') onClose();
		});
	}

	// T2: 标题栏 sys_close 系统按钮（与 footer 关闭同一回调）
	const tbClose = root.querySelector('.botsw-btn-close');
	if (tbClose) {
		tbClose.addEventListener('click', function () {
			if (typeof onClose === 'function') onClose();
		});
	}

	// T2: 初始化按鈕（官方窗口底部左側；重置當前頁籤設定，未交付頁籤空實現）
	const resetBtn = root.querySelector('.botsw-reset');
	if (resetBtn) {
		resetBtn.addEventListener('click', function () {
			if (typeof onReset === 'function') onReset(activeIndex);
		});
	}

	return { setActive: setActive, getActiveIndex: function () { return activeIndex; } };
}

/**
 * 創建設置窗口組件（GUIComponent，官方現代藍色樣式）
 *
 * @param {Object}   [opts]
 * @param {string}   [opts.placeholder] 頁籤佔位文案
 * @param {Function} [opts.onClose]     關閉回調
 * @param {Function} [opts.onReset]     初始化回調（參數：當前激活頁籤 index）
 * @return {GUIComponent} 用 append() 打開、remove() 關閉
 */
export function createSettingsComponent(opts) {
	const opts_ = opts || {};
	const html = buildSettingsHTML(SETTINGS_TABS, opts_.placeholder);

	const Component = new GUIComponent('BotAutoHuntSettings', CSS_TEXT);
	// 引擎在登錄/地圖切換時會 UIManager.removeComponents() 清除非持久組件
	// （MapRenderer.js:130、LoginEngine 多處），UpdateAvailable 同款先例：
	// 本窗口由插件自行管理開合，必須標記 persistent 才不會被周期性清除
	Component.persistent = true;
	Component.render = function () {
		return html;
	};

	Component.init = function () {
		const root = this._shadow;
		const comp = this;
		const topbar = root.querySelector('.botsw-top');
		if (topbar) {
			this.draggable(topbar); // 僅頂部條拖拽，內容區文字保持可選中
		}
		const behavior = bindSettingsBehavior(root, function () {
			comp.remove();
			if (typeof opts_.onClose === 'function') opts_.onClose();
		}, function (tabIndex) {
			if (typeof opts_.onReset === 'function') opts_.onReset(tabIndex);
		});
		// T4: 暴露当前页签索引（魔物清单扫描轮询判断是否需要重建列表）
		Component.getActiveIndex = behavior.getActiveIndex;
	};

	/** 取指定頁籤內容根元素（供外部填充頁籤內容，index 對應 buildSettingsHTML 順序） */
	Component.getPane = function (index) {
		return this._shadow.querySelector('.botsw-pane[data-index="' + index + '"]');
	};

	return Component;
}

export default createSettingsComponent;
