/**
 * UI/Components/GraphicsOption/GraphicsOption.js
 *
 * Manage Graphics details
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 * @author Vincent Thibault, AoShinHo
 */

import FPS from 'UI/Components/FPS/FPS.js';
import Configs from 'Core/Configs.js';
import Context from 'Core/Context.js';
import Preferences from 'Core/Preferences.js';
import GraphicsSettings from 'Preferences/Graphics.js';
import Renderer from 'Renderer/Renderer.js';
import UIManager from 'UI/UIManager.js';
import GUIComponent from 'UI/GUIComponent.js';
import htmlText from './GraphicsOption.html?raw';
import cssText from './GraphicsOption.css?raw';

import MemoryManager from 'Core/MemoryManager.js';
import ChatBox from 'UI/Components/ChatBox/ChatBox.js';
import UILayoutStore from 'UI/UILayoutStore.js';

// Phase 12 components are loaded lazily to avoid a circular dependency:
// Entity.js → EntityControl.js → … → Escape.js → GraphicsOption.js
// → PartyPanel.js → TargetManager.js → Entity.js
// Static imports would cause Entity to be undefined at module-init time.
let _phase12 = null;
async function getPhase12() {
	if (!_phase12) {
		const [BasicInfo, ButtonBar, PartyPanel, TargetPanel, TargetKeyboard] = await Promise.all([
			import('UI/Components/BasicInfo/BasicInfo.js'),
			import('UI/Components/ButtonBar/ButtonBar.js'),
			import('UI/Components/PartyPanel/PartyPanel.js'),
			import('UI/Components/TargetPanel/TargetPanel.js'),
			import('Controls/TargetKeyboard.js')
		]);
		_phase12 = {
			BasicInfo: BasicInfo.default,
			ButtonBar: ButtonBar.default,
			PartyPanel: PartyPanel.default,
			TargetPanel: TargetPanel.default,
			TargetKeyboard: TargetKeyboard.default
		};
	}
	return _phase12;
}

/**
 * Create Component
 */
const GraphicsOption = new GUIComponent('GraphicsOption', cssText);

/**
 * @var {Preferences} Graphics
 */
const _preferences = Preferences.get(
	'GraphicsOption',
	{
		x: 300,
		y: 300
	},
	1.1
);

/**
 * Render HTML
 */
GraphicsOption.render = () => htmlText;

/**
 * Initialize UI
 */
GraphicsOption.init = function init() {
	const root = this._shadow || this._host;

	const baseBtn = root.querySelector('.base');
	if (baseBtn) {
		baseBtn.addEventListener('mousedown', event => {
			event.stopImmediatePropagation();
			event.preventDefault();
		});
	}

	const closeBtn = root.querySelector('.close');
	if (closeBtn) {
		closeBtn.addEventListener('mousedown', e => {
			e.stopImmediatePropagation();
		});
		closeBtn.addEventListener('click', () => {
			GraphicsOption.remove();
		});
	}

	root.querySelectorAll('.tab-button').forEach(btn => {
		btn.addEventListener('click', onTabSwitch);
	});

	const resetBtn = root.querySelector('.reset-button');
	if (resetBtn) {
		resetBtn.addEventListener('click', onResetToDefaults.bind(this));
	}

	const bindChange = (selector, handler) => {
		const el = root.querySelector(selector);
		if (el) el.addEventListener('change', handler);
	};

	bindChange('.details', onUpdateQualityDetails);
	bindChange('.cursor-option', onToggleGameCursor);
	bindChange('.screensize', onUpdateScreenSize);
	bindChange('.fpslimit', onUpdateFPSLimit);
	bindChange('.fps', onToggleFPSDisplay);
	bindChange('.pixel-perfect', onTogglePixelPerfect);

	// Post-Processing
	bindChange('.bloom', onToggleBloom);
	bindChange('.bloom-intensity', onUpdateBloomIntensity);
	bindChange('.blur', onToggleBlur);
	bindChange('.blur-intensity', onUpdateBlurIntensity);
	bindChange('.blur-area', onUpdateBlurArea);
	bindChange('.casEnabled', oncasEnabled);
	bindChange('.casContrast', oncasContrast);
	bindChange('.casSharpening', oncasSharpening);
	bindChange('.fxaaEnabled', onfxaaEnabled);
	bindChange('.fxaaSubpix', onfxaaSubpix);
	bindChange('.fxaaEdgeThreshold', onfxaaEdgeThreshold);
	bindChange('.vibranceEnabled', onvibranceEnabled);
	bindChange('.vibrance', onvibrance);
	bindChange('.cartoonEnabled', oncartoonEnabled);
	bindChange('.cartoonPower', oncartoonPower);
	bindChange('.cartoonEdgeSlope', oncartoonEdgeSlope);

	// Performance Mode
	bindChange('.performanceMode', onTogglePerformanceMode);
	bindChange('.view-area', onUpdateAreaView);

	bindChange('.new-ui', onToggleUseNewUI);
	bindChange('.lock-layout', onToggleLockLayout);

	const restoreBtn = root.querySelector('.restore-layout');
	if (restoreBtn) {
		restoreBtn.addEventListener('click', onRestoreLayout);
	}

	this.draggable('.titlebar');
};

/**
 * When append the element to html
 */
GraphicsOption.onAppend = function onAppend() {
	this._host.style.top = `${_preferences.y}px`;
	this._host.style.left = `${_preferences.x}px`;

	const root = this._shadow || this._host;

	root.querySelector('.details').value = GraphicsSettings.quality;
	root.querySelector('.screensize').value = GraphicsSettings.screensize;
	root.querySelector('.cursor-option').checked = GraphicsSettings.cursor;
	root.querySelector('.fpslimit').value = GraphicsSettings.fpslimit;
	root.querySelector('.fps').checked = FPS._host ? FPS._host.style.display !== 'none' : false;
	root.querySelector('.pixel-perfect').checked = GraphicsSettings.pixelPerfectSprites;

	// Post-Processing
	root.querySelector('.bloom').checked = GraphicsSettings.bloom;
	root.querySelector('.bloom-intensity').value = GraphicsSettings.bloomIntensity;
	root.querySelector('.blur').checked = GraphicsSettings.blur;
	root.querySelector('.blur-area').value = GraphicsSettings.blurArea;
	root.querySelector('.blur-intensity').value = GraphicsSettings.blurIntensity;
	root.querySelector('.fxaaEnabled').checked = GraphicsSettings.fxaaEnabled;
	root.querySelector('.fxaaSubpix').value = GraphicsSettings.fxaaSubpix;
	root.querySelector('.fxaaEdgeThreshold').value = GraphicsSettings.fxaaEdgeThreshold;
	root.querySelector('.vibranceEnabled').checked = GraphicsSettings.vibranceEnabled;
	root.querySelector('.vibrance').value = GraphicsSettings.vibrance;
	root.querySelector('.casEnabled').checked = GraphicsSettings.casEnabled;
	root.querySelector('.casContrast').value = GraphicsSettings.casContrast;
	root.querySelector('.casSharpening').value = GraphicsSettings.casSharpening;
	root.querySelector('.cartoonEnabled').checked = GraphicsSettings.cartoonEnabled;
	root.querySelector('.cartoonEdgeSlope').value = GraphicsSettings.cartoonEdgeSlope;
	root.querySelector('.cartoonPower').value = GraphicsSettings.cartoonPower;

	// Performance Mode
	root.querySelector('.performanceMode').checked = GraphicsSettings.performanceMode;
	root.querySelector('.view-area').value = GraphicsSettings.viewArea;
	root.querySelector('.new-ui').checked = GraphicsSettings.useNewUI;
	root.querySelector('.lock-layout').checked = GraphicsSettings.lockLayout;
};

/**
 * Once remove, save preferences
 */
GraphicsOption.onRemove = function onRemove() {
	_preferences.x = parseInt(this._host.style.left, 10);
	_preferences.y = parseInt(this._host.style.top, 10);
	_preferences.save();
};

/**
 * Modify game details to perform faster
 */
function onUpdateQualityDetails() {
	GraphicsSettings.quality = parseInt(this.value, 10);
	GraphicsSettings.save();

	Configs.set('quality', GraphicsSettings.quality);
	Renderer.resize();
}

/**
 * Toggle game cursor
 */
function onToggleGameCursor() {
	GraphicsSettings.cursor = !!this.checked;
	GraphicsSettings.save();

	if (!GraphicsSettings.cursor) {
		document.body.classList.remove('custom-cursor');
	} else {
		document.body.classList.add('custom-cursor');
	}
}

/**
 * Update the fps limit
 */
function onUpdateFPSLimit() {
	GraphicsSettings.fpslimit = parseInt(this.value, 10);
	GraphicsSettings.save();

	if (Renderer.frameLimit > 0) {
		clearInterval(Renderer.updateId);
	}

	Renderer.frameLimit = GraphicsSettings.fpslimit;
	Renderer.rendering = false;
	Renderer.render(null);
}

/**
 * Toggle the fps display
 */
function onToggleFPSDisplay() {
	FPS.toggle(!!this.checked);
}

function onTogglePixelPerfect() {
	GraphicsSettings.pixelPerfectSprites = !!this.checked;
	GraphicsSettings.save();

	if (GraphicsSettings.pixelPerfectSprites) {
		function reloadSprites() {
			const gl = Renderer.getContext();
			const sprFiles = MemoryManager.search(/\.spr$/i);
			for (let i = 0; i < sprFiles.length; i++) {
				MemoryManager.remove(gl, sprFiles[i]);
			}
		}
		reloadSprites();
	} else {
		ChatBox.addText(
			'[System] Pixel Perfect is disabled. Reload the page (F5) to apply the changes.',
			ChatBox.TYPE.INFO,
			ChatBox.FILTER.PUBLIC_LOG
		);
	}
}

/**
 * Post-Processing
 */
function onToggleBloom() {
	GraphicsSettings.bloom = !!this.checked;
	GraphicsSettings.save();
}

function onUpdateBloomIntensity() {
	GraphicsSettings.bloomIntensity = parseFloat(this.value);
	GraphicsSettings.save();
}

function onToggleBlur() {
	GraphicsSettings.blur = !!this.checked;
	GraphicsSettings.save();
}

function onUpdateBlurIntensity() {
	GraphicsSettings.blurIntensity = parseFloat(this.value);
	GraphicsSettings.save();
}

function onUpdateBlurArea() {
	GraphicsSettings.blurArea = parseFloat(this.value);
	GraphicsSettings.save();
}

function oncasEnabled() {
	GraphicsSettings.casEnabled = !!this.checked;
	GraphicsSettings.save();
}

function oncasContrast() {
	GraphicsSettings.casContrast = parseFloat(this.value);
	GraphicsSettings.save();
}

function oncasSharpening() {
	GraphicsSettings.casSharpening = parseFloat(this.value);
	GraphicsSettings.save();
}

function onvibranceEnabled() {
	GraphicsSettings.vibranceEnabled = !!this.checked;
	GraphicsSettings.save();
}

function onvibrance() {
	GraphicsSettings.vibrance = parseFloat(this.value);
	GraphicsSettings.save();
}

function onfxaaEnabled() {
	GraphicsSettings.fxaaEnabled = !!this.checked;
	GraphicsSettings.save();
}

function onfxaaSubpix() {
	GraphicsSettings.fxaaSubpix = parseFloat(this.value);
	GraphicsSettings.save();
}

function onfxaaEdgeThreshold() {
	GraphicsSettings.fxaaEdgeThreshold = parseFloat(this.value);
	GraphicsSettings.save();
}

function oncartoonEnabled() {
	GraphicsSettings.cartoonEnabled = !!this.checked;
	GraphicsSettings.save();
}

function oncartoonPower() {
	GraphicsSettings.cartoonPower = parseFloat(this.value);
	GraphicsSettings.save();
}

function oncartoonEdgeSlope() {
	GraphicsSettings.cartoonEdgeSlope = parseFloat(this.value);
	GraphicsSettings.save();
}

/**
 * Performance Mode
 */
function onTogglePerformanceMode() {
	GraphicsSettings.performanceMode = !!this.checked;
	GraphicsSettings.save();
}

function onUpdateAreaView() {
	GraphicsSettings.viewArea = parseInt(this.value);
	GraphicsSettings.save();
}

/**
 * Resizing window size
 */
function onUpdateScreenSize() {
	const isFullScreen = Context.isFullScreen();

	GraphicsSettings.screensize = this.value;
	GraphicsSettings.save();

	if (GraphicsSettings.screensize === 'full') {
		if (!isFullScreen) {
			Context.requestFullScreen();
		}
		return;
	}

	if (isFullScreen) {
		Context.cancelFullScreen();
	}

	if (Context.Is.POPUP) {
		const size = GraphicsSettings.screensize.split('x');

		if (size[0] != window.innerWidth && size[1] != window.innerHeight) {
			window.resizeTo(size[0], size[1]);
			window.moveTo((screen.availWidth - size[0]) / 2, (screen.availHeight - size[1]) / 2);
		}
	}
}

function onTabSwitch(event) {
	const btn = event.currentTarget;
	const tabName = btn.dataset.tab;
	const root = GraphicsOption._shadow || GraphicsOption._host;

	root.querySelectorAll('.tab-button').forEach(b => {
		b.classList.remove('selected');
	});
	btn.classList.add('selected');

	root.querySelectorAll('.tab-content').forEach(tc => {
		tc.classList.remove('selected');
	});
	const targetTab = root.querySelector('#' + tabName);
	if (targetTab) targetTab.classList.add('selected');
}

/**
 * D-22: Toggle new UI (BasicInfoV6 + Phase 12 panels) at runtime.
 * Uses BasicInfo.toggleNewUI() hot-swap — no page reload.
 */
async function onToggleUseNewUI() {
	GraphicsSettings.useNewUI = !!this.checked;
	GraphicsSettings.save();

	const { BasicInfo, ButtonBar, PartyPanel, TargetPanel, TargetKeyboard } = await getPhase12();
	BasicInfo.toggleNewUI(GraphicsSettings.useNewUI);

	if (GraphicsSettings.useNewUI) {
		ButtonBar.append();
		PartyPanel.append();
		TargetPanel.append();
		TargetKeyboard.init();
	} else {
		ButtonBar.remove();
		PartyPanel.remove();
		TargetPanel.remove();
		TargetKeyboard.cleanup();
	}
}

/**
 * D-23: Toggle layout lock. When locked, panels are not draggable.
 */
async function onToggleLockLayout() {
	GraphicsSettings.lockLayout = !!this.checked;
	GraphicsSettings.save();

	// lockLayout=true → enabled=false (not draggable)
	UILayoutStore.setEnabled(!GraphicsSettings.lockLayout);

	// Re-append visible Phase 12 panels so onAppend re-evaluates isEnabled()
	if (GraphicsSettings.useNewUI) {
		const { ButtonBar, PartyPanel, TargetPanel } = await getPhase12();
		[ButtonBar, PartyPanel, TargetPanel].forEach(p => {
			if (p._host && p._host.parentNode) {
				p.remove();
				p.append();
			}
		});
	}
}

/**
 * D-23: Restore default layout — clears all saved positions and
 * re-appends panels so they snap back to CSS defaults.
 */
async function onRestoreLayout() {
	UILayoutStore.clear();
	// Re-append visible Phase 12 panels to reset positions
	if (GraphicsSettings.useNewUI) {
		const { BasicInfo, ButtonBar, PartyPanel, TargetPanel } = await getPhase12();
		[ButtonBar, PartyPanel, TargetPanel].forEach(p => {
			if (p._host && p._host.parentNode) {
				p.remove();
				p.append();
			}
		});
		// BasicInfo: re-toggle to reset position
		BasicInfo.toggleNewUI(true);
	}
	ChatBox.addText(
		'[系统] 布局已恢复为默认设置。',
		ChatBox.TYPE.INFO,
		ChatBox.FILTER.PUBLIC_LOG
	);
}

function onResetToDefaults() {
	const defaultSettings = GraphicsSettings.defaults;

	Object.keys(defaultSettings).forEach(key => {
		if (defaultSettings.hasOwnProperty(key)) {
			GraphicsSettings[key] = defaultSettings[key];
		}
	});
	GraphicsSettings.save();

	GraphicsOption.onAppend();
}

GraphicsOption.needFocus = true;
GraphicsOption.mouseMode = GUIComponent.MouseMode.STOP;

/**
 * Create component and export it
 */
export default UIManager.addComponent(GraphicsOption);
