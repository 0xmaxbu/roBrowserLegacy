/**
 * UI/Components/UpdateAvailable/UpdateAvailable.js
 *
 * Update notification popup - shown when game resources have been updated
 * and the player needs to refresh the browser to load the latest content.
 *
 * Triggered by CacheManifest.hasChanged() after the manifest ETag changes.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import Renderer from 'Renderer/Renderer.js';
import UIManager from 'UI/UIManager.js';
import GUIComponent from 'UI/GUIComponent.js';
import htmlText from './UpdateAvailable.html?raw';
import cssText from './UpdateAvailable.css?raw';

/**
 * Create Component
 *
 * Modal popup centered on screen. Uses pure CSS (no GRF background)
 * so it displays correctly even before game assets are loaded.
 */
const UpdateAvailable = new GUIComponent('UpdateAvailable', cssText);

UpdateAvailable.render = () => htmlText;

/**
 * Initialize popup: bind button events and center on screen.
 */
UpdateAvailable.init = function init() {
	const root = this._shadow || this._host;

	root.querySelector('.btn-reload').addEventListener('click', () => {
		window.location.reload();
	});

	root.querySelector('.btn-later').addEventListener('click', () => {
		UpdateAvailable.remove();
	});

	centerOnScreen();
};

/**
 * Re-center on each append (window may have been resized).
 */
UpdateAvailable.onAppend = function onAppend() {
	centerOnScreen();
};

/**
 * Calculate centered position using Renderer dimensions.
 */
function centerOnScreen() {
	Object.assign(UpdateAvailable._host.style, {
		top: `${Math.max(0, (Renderer.height - 160) / 2)}px`,
		left: `${Math.max(0, (Renderer.width - 360) / 2)}px`,
		zIndex: '200'
	});
}

UpdateAvailable.needFocus = true;
UpdateAvailable.mouseMode = GUIComponent.MouseMode.FREEZE;
UpdateAvailable.persistent = true; // Survives Engine.removeComponents() during login/map transitions

/**
 * Create component based on view file and export it
 */
export default UIManager.addComponent(UpdateAvailable);
