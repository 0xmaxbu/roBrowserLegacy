/**
 * UI/Components/MapName/MapName.js
 *
 * Map name notification overlay
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 * @author Vincent Thibault, AoShinHo
 */

import DB from 'DB/DBManager.js';
import UIManager from 'UI/UIManager.js';
import GUIComponent from 'UI/GUIComponent.js';
import htmlText from './MapName.html?raw';
import cssText from './MapName.css?raw';
import Client from 'Core/Client.js';
import LangOverlay from 'DB/LangOverlay.js';

/**
 * Create Component
 */
const MapName = new GUIComponent('MapName', cssText);

MapName.render = () => htmlText;

/**
 * Mouse can cross this UI
 */
MapName.mouseMode = GUIComponent.MouseMode.CROSS;

/**
 * @var {array} _mapinfo
 */
let _mapinfo = [];

/**
 * Previous map check vars
 */
let _currMap = '';
let _prevMap = '';
let _newMap = false;
/**
 * Timeout ID for fade-out
 *
 * @type {number|null}
 */
let _fadeTimeoutId = null;
/**
 * Timeout ID for removal
 *
 * @type {number|null}
 */
let _removeTimeoutId = null;

/**
 * Initialize UI
 */
MapName.init = function init() {};

/**
 * Append MapName
 */
MapName.onAppend = function onAppend() {
	if (_fadeTimeoutId !== null) clearTimeout(_fadeTimeoutId);
	if (_removeTimeoutId !== null) clearTimeout(_removeTimeoutId);
	_fadeTimeoutId = null;
	_removeTimeoutId = null;

	if (_mapinfo && _mapinfo.notifyEnter && _newMap) {
		// Show instantly WITHOUT a CSS transition. requestAnimationFrame is
		// throttled during heavy map loading (WebGL init / asset processing
		// blocks the main thread), so a rAF-based or transition-based show is
		// delayed by ~1s+ and then immediately cancelled by the 5s fade-out
		// timer -> the box never becomes visible. Instead: disable transition,
		// jump to opacity:1, force a reflow to commit it, then re-enable the
		// transition so the 5s fade-out still animates.
		this._host.style.transition = 'none';
		this._host.style.opacity = '1';
		// Render above the Background loading blackout (z-index 1000) so the
		// name stays visible while the loading screen fades out on heavy maps
		// (cities). The value is harmless to keep between show/hide cycles.
		this._host.style.zIndex = '1001';
		void this._host.offsetHeight; // commit the shown state
		this._host.style.transition = '';

		// NOTE: use the GLOBAL setTimeout (wall-clock time), NOT Events.setTimeout.
		// Events.setTimeout schedules against the render-loop tick (_tick), which
		// is FROZEN while the main render loop is paused during map loading. Since
		// onAppend runs immediately after loading, _tick is stale by the load
		// duration, so Events.setTimeout(fn, 5000) fires almost instantly once the
		// loop resumes -> the box vanished in 0.1-1.8s instead of staying 5s.
		_fadeTimeoutId = window.setTimeout(() => {
			this._host.style.opacity = '0';
		}, 5000);

		// After 6s (5s wait + 1s CSS transition), remove
		_removeTimeoutId = window.setTimeout(() => {
			MapName.remove();
		}, 6000);
	} else {
		MapName.remove();
	}
};

/**
 * Set map
 *
 * @param {string} mapname
 */
MapName.setMap = function setMap(mapname) {
	if (!this.__loaded) {
		this.prepare();
	}

	const root = this._shadow || this._host;

	_prevMap = _currMap;
	_currMap = mapname;
	_newMap = _currMap !== _prevMap;

	const rswName = mapname.replace('.gat', '.rsw');
	_mapinfo = DB.getMapInfo(rswName);

	// i18n overlay: when a Chinese map sign-name exists, use it (mainTitle as
	// the big place name, subTitle as the small region/description line, like
	// the original English layout). Otherwise fall back to signName.
	const mapsignoverlay = LangOverlay.getMapSignName(rswName, null);
	const signMainTitle = mapsignoverlay ? (mapsignoverlay.mainTitle || '')
		: (_mapinfo && _mapinfo.signName ? _mapinfo.signName.mainTitle : '');
	const signSubTitle = mapsignoverlay ? (mapsignoverlay.subTitle || '')
		: (_mapinfo && _mapinfo.signName ? _mapinfo.signName.subTitle : '');

	const mapbg = root.querySelector('.mapbg');
	if (_mapinfo && _mapinfo.backgroundBmp) {
		Client.loadFile(`${DB.INTERFACE_PATH}display_mapname/${_mapinfo.backgroundBmp}.png`, dataURI => {
			mapbg.style.backgroundImage = `url('${dataURI}')`;
		});
	} else {
		mapbg.style.backgroundImage = 'none';
	}

	const mapsubtitle = root.querySelector('.mapsubtitle');
	mapsubtitle.textContent = signSubTitle || '';

	const maptitle = root.querySelector('.maptitle');
	maptitle.textContent = signMainTitle || '';
};

/**
 * Remove MapName from window (and so clean up items)
 */
MapName.onRemove = function OnRemove() {
	if (!this._shadow && !this._host) {
		return;
	}
	const root = this._shadow || this._host;

	root.querySelector('.mapbg').style.backgroundImage = 'none';
	root.querySelector('.mapsubtitle').textContent = '';
	root.querySelector('.maptitle').textContent = '';
};

/**
 * Resets the state of the MapName component.
 */
MapName.resetState = function () {
	_currMap = '';
	_prevMap = '';
	_newMap = false;
};

/**
 * Create component and export it
 */
export default UIManager.addComponent(MapName);
