/**
 * Plugins/BotAutoHunt/settings/SettingsWindow.js
 *
 * 自动战斗设置窗口 — 纯 DOM 模块（零游戏依赖）
 *
 * 设计约定：
 * - 位于 settings/ 子目录：PluginManager 的 glob 只扫描 Plugins 下两层深（目录名/文件名），
 *   本文件位于第三层，不会被误当作插件自动加载，仅由 BotAutoHunt.js 显式 import。
 * - 零依赖：不 import 任何游戏模块，便于 vitest (jsdom) 直接测试。
 * - 事件阻断：所有鼠标事件在根节点 stopPropagation，防止透传到游戏的
 *   MouseEventHandler（与 BotAutoHunt 面板同一约定）。
 * - 样式：遵循插件内联样式约定（不引入外部 css 文件）。
 *
 * 术语：用户可见名称为「自动战斗」（见仓库根 GLOSSARY.md）。
 */

const WINDOW_Z_INDEX = 1000;

/** 窗口默认尺寸与配色（与 BotAutoHunt 面板视觉一致） */
const STYLE = {
	window:
		'position:fixed;top:120px;left:40%;z-index:' + WINDOW_Z_INDEX + ';' +
		'width:520px;max-width:92vw;height:360px;max-height:80vh;' +
		'background:linear-gradient(to bottom,#f7ecd3,#e8d5ae);' +
		'border:2px solid #7a5c2e;border-radius:6px;' +
		'box-shadow:0 6px 18px rgba(0,0,0,0.5);' +
		'font-family:Gulim,Dotum,"Malgun Gothic",sans-serif;' +
		'font-size:12px;color:#484848;user-select:none;display:none;',
	titlebar:
		'height:26px;line-height:26px;padding:0 8px;' +
		'background:linear-gradient(to bottom,#8a6a35,#6d5228);' +
		'color:#ffefc9;font-weight:bold;border-radius:4px 4px 0 0;' +
		'cursor:move;display:flex;justify-content:space-between;align-items:center;',
	tabbar:
		'display:flex;flex-wrap:wrap;gap:2px;padding:4px 6px 0;' +
		'background:rgba(122,92,46,0.15);border-bottom:1px solid #a58a55;',
	tab:
		'padding:4px 10px;cursor:pointer;border:1px solid #a58a55;' +
		'border-bottom:none;border-radius:4px 4px 0 0;background:#d9c49a;color:#5a4423;',
	tabActive:
		'background:#ffefc9;color:#3a2c14;font-weight:bold;',
	paneWrap:
		'height:calc(100% - 62px);overflow-y:auto;padding:10px;',
	pane:
		'padding:16px;text-align:center;color:#7a6a4a;',
	close:
		'cursor:pointer;color:#ffefc9;font-size:14px;padding:0 4px;' +
		'background:none;border:none;line-height:1;'
};

/**
 * 创建设置窗口
 *
 * @param {Object} options
 * @param {string}   options.title 窗口标题
 * @param {Array}    options.tabs  页签定义 [{id, label}]
 * @param {string}   [options.placeholder] 页签占位文案
 * @param {Function} [options.makeDraggable] 拖拽实现 (element, handle)，由调用方注入
 * @return {Object} { root, open, close, isOpen }
 */
export function createSettingsWindow(options) {
	const opts = options || {};
	const tabs = opts.tabs || [];
	const placeholder = opts.placeholder || '本页签建设中';

	const root = document.createElement('div');
	root.className = 'bot-settings-window';

	const titlebar = document.createElement('div');
	titlebar.className = 'botsw-titlebar';
	titlebar.style.cssText = STYLE.titlebar;
	const titleEl = document.createElement('span');
	titleEl.textContent = opts.title || '设置';
	const closeBtn = document.createElement('button');
	closeBtn.className = 'botsw-close';
	closeBtn.style.cssText = STYLE.close;
	closeBtn.textContent = '✕';
	titlebar.appendChild(titleEl);
	titlebar.appendChild(closeBtn);

	const tabbar = document.createElement('div');
	tabbar.className = 'botsw-tabbar';
	tabbar.style.cssText = STYLE.tabbar;

	const paneWrap = document.createElement('div');
	paneWrap.className = 'botsw-panewrap';
	paneWrap.style.cssText = STYLE.paneWrap;

	const tabEls = [];
	const paneEls = [];

	tabs.forEach(function (tab, index) {
		const tabEl = document.createElement('div');
		tabEl.className = 'botsw-tab';
		tabEl.dataset.index = String(index);
		tabEl.textContent = tab.label;
		tabEl.style.cssText = STYLE.tab;
		tabbar.appendChild(tabEl);
		tabEls.push(tabEl);

		const pane = document.createElement('div');
		pane.className = 'botsw-pane';
		pane.dataset.index = String(index);
		pane.style.cssText = STYLE.pane;
		pane.textContent = placeholder;
		paneWrap.appendChild(pane);
		paneEls.push(pane);
	});

	root.appendChild(titlebar);
	root.appendChild(tabbar);
	root.appendChild(paneWrap);
	root.style.cssText = STYLE.window;

	// 事件阻断：防止透传到游戏 MouseEventHandler
	['mousedown', 'mouseup', 'click', 'mousemove', 'wheel', 'contextmenu', 'dblclick'].forEach(function (type) {
		root.addEventListener(type, function (e) {
			e.stopPropagation();
		}, false);
	});

	function setActive(index) {
		tabEls.forEach(function (tabEl, i) {
			const active = i === index;
			tabEl.classList.toggle('active', active);
			tabEl.style.cssText = STYLE.tab + (active ? STYLE.tabActive : '');
			paneEls[i].style.display = active ? '' : 'none';
		});
	}

	tabEls.forEach(function (tabEl, index) {
		tabEl.addEventListener('click', function () {
			setActive(index);
		});
	});

	closeBtn.addEventListener('click', function () {
		close();
	});

	if (typeof opts.makeDraggable === 'function') {
		opts.makeDraggable(root, titlebar);
	}

	let openTabIndex = 0;
	function open(tabId) {
		let index = 0;
		if (tabId) {
			const found = tabs.findIndex(function (t) {
				return t.id === tabId;
			});
			if (found >= 0) index = found;
		}
		setActive(index);
		openTabIndex = index;
		root.style.display = '';
		if (!root.parentElement) {
			document.body.appendChild(root);
		}
	}

	function close() {
		root.style.display = 'none';
	}

	if (tabs.length) {
		setActive(0);
	}

	return {
		root: root,
		open: open,
		close: close,
		isOpen: function () {
			return root.style.display !== 'none';
		},
		get activeTabIndex() {
			return openTabIndex;
		}
	};
}

export default createSettingsWindow;
