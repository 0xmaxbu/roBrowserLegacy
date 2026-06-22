/**
 * UI/Components/BasicInfo/BasicInfoV6/BasicInfoV6.js
 *
 * Phase 12 rewrite of the player status panel (D-06.1 layout, D-20 colours).
 *
 * Displays: 48x48 job icon + character name + HP bar+number + SP bar+number
 *           + Lv.N. Does NOT show EXP/Zeny/Weight (deferred to follow-up
 *           windows). Keeps the V4 update() API surface as no-ops for the
 *           non-displayed keys so Inventory/Vending/Main.js don't break (D-26).
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 * REVIEWS.md compliance:
 *   BLOCK-3: object-on-instance pattern (mirror BasicInfoV4.js:42/423).
 *   MED-2:   DOM contains hidden '#item > .btn_overlay' so InventoryV1.js
 *            :248/268/449 `BasicInfo.getUI().ui.find('#item .btn_overlay')`
 *            resolves instead of returning an empty jQuery set.
 * LOW-1:   job icon loaded via `DB.INTERFACE_PATH +
 *            'renewalparty/icon_jobs_<jobID>.bmp'` (PartyFriendsV1.js:951
 *            precedent). No hardcoded Korean-path prefix literal —
 *            DB.INTERFACE_PATH already encodes it.
 *   LOW-5:   `update(type, val1, val2)` reads val1/val2 (matches V4 :304 and
 *            Main.js:254/316 which calls update('hp', hp, hp_max)). Does NOT
 *            read Session.Character.hp (which doesn't exist).
 */

import DB from 'DB/DBManager.js';
import Client from 'Core/Client.js';
import Session from 'Engine/SessionStorage.js';
import UIManager from 'UI/UIManager.js';
import GUIComponent from 'UI/GUIComponent.js';
import UILayoutStore from 'UI/UILayoutStore.js';
import htmlText from './BasicInfoV6.html?raw';
import cssText from './BasicInfoV6.css?raw';

// BLOCK-3: object-on-instance pattern (identical shape to BasicInfoV4.js:42).
const BasicInfoV6 = new GUIComponent('BasicInfoV6', cssText);

// D-26: V4-compatible property surface. External callers (Inventory, Vending,
// Main.js) read/write these; V6 keeps them as state but does not render them.
BasicInfoV6.base_exp = 0;
BasicInfoV6.base_exp_next = 1;
BasicInfoV6.job_exp = 0;
BasicInfoV6.job_exp_next = -1;
BasicInfoV6.weight = 0;
BasicInfoV6.weight_max = 1;

BasicInfoV6.render = () => htmlText;

function _getRoot() {
	return BasicInfoV6._shadow || BasicInfoV6._host;
}

/**
 * D-26 + LOW-5: update(type, val1, val2) — argument-passing API matching
 * BasicInfoV4.js:304 and the Main.js:254/316 callsite
 * `BasicInfo.getUI().update('hp', hp, hp_max)`.
 *
 * Non-displayed keys ('jlvl', 'zeny', 'bexp', 'jexp', 'weight', 'ap') are
 * accepted as no-ops so existing callers don't break.
 */
BasicInfoV6.update = function update(type, val1, val2) {
	const root = _getRoot();
	if (!root) return;

	switch (type) {
		case 'hp':
			this._setBar(root, '.bi-hp', val1, val2);
			break;
		case 'sp':
			this._setBar(root, '.bi-sp', val1, val2);
			break;
		case 'blvl': {
			const el = root.querySelector('.bi-level');
			if (el) el.textContent = 'Lv.' + val1;
			break;
		}
		case 'name': {
			const el = root.querySelector('.bi-name');
			if (el) el.textContent = val1;
			break;
		}
		case 'job':
			this._loadJobIcon(root, val1);
			break;
		// D-26 no-op keys: 'jlvl', 'zeny', 'bexp', 'jexp', 'weight', 'ap'
		default:
			break;
	}
};

/**
 * Set a bar's fill width and "val / max" text.
 * @param {HTMLElement} root  shadow/host root
 * @param {string}      sel   bar selector prefix ('.bi-hp' or '.bi-sp')
 * @param {number}      val   current value
 * @param {number}      max   maximum value
 */
BasicInfoV6._setBar = function _setBar(root, sel, val, max) {
	const fill = root.querySelector(sel + '-fill');
	const text = root.querySelector(sel + '-text');
	const pct = max > 0 ? Math.max(0, Math.min(100, (val / max) * 100)) : 0;
	if (fill) fill.style.width = pct + '%';
	if (text) text.textContent = val + ' / ' + max;
};

/**
 * LOW-1: Load the job icon via DB.INTERFACE_PATH (PartyFriendsV1.js:951
 * precedent). DB.INTERFACE_PATH already encodes the CP949 Korean interface
 * path prefix — never hardcode that prefix literal here.
 *
 * @param {HTMLElement} root
 * @param {number}      jobId  job class id (DB.getJobClass result space)
 */
BasicInfoV6._loadJobIcon = function _loadJobIcon(root, jobId) {
	if (jobId == null) return;
	const path = DB.INTERFACE_PATH + 'renewalparty/icon_jobs_' + jobId + '.bmp';
	Client.loadFile(path, url => {
		const img = root.querySelector('.bi-job-icon');
		if (img) img.src = url;
	});
};

/**
 * D-28: init runs ONCE (during prepare(), guarded by __loaded). Do NOT
 * register persistent event listeners or draggable() here — those belong
 * in onAppend/onRemove so they survive the V4<->V6 hot-swap (D-22).
 */
BasicInfoV6.init = function init() {
	/* one-time setup — currently nothing to do */
};

/**
 * D-28: onAppend runs EVERY append. Register drag + pull current values
 * from Session so a freshly hot-swapped V6 doesn't show stale '---' text.
 */
BasicInfoV6.onAppend = function onAppend() {
	const root = _getRoot();

	if (UILayoutStore.isEnabled()) {
		// WR-04: guard draggable() so it only binds once. GUIComponent.draggable
		// creates a new onStart closure each call and calls addEventListener
		// without deduplication (GUIComponent.js:723-724). The shadow DOM
		// persists across remove/append (prepare is guarded by __loaded), so
		// the handle element and its listeners survive hot-swap. Calling
		// draggable() again on each append would accumulate N+1 competing
		// drag handler sets. This flag is NOT reset in onRemove — the
		// listeners stay bound to the persistent element and remain valid
		// when the host is re-attached.
		if (!this._dragBound) {
			this.draggable('.bi-root');
			this._dragBound = true;
		}
		this.onDragEnd = () => {
			UILayoutStore.save('BasicInfoV6', {
				left: this._host.offsetLeft,
				top: this._host.offsetTop
			});
		};
		const saved = UILayoutStore.restore('BasicInfoV6');
		if (saved) {
			this._host.style.left = saved.left + 'px';
			this._host.style.top = saved.top + 'px';
		}
	}

	// LOW-5: HP/SP live on Session.Entity.life.* (Main.js:250/312), NOT on
	// Session.Character. Pull current values on append so the panel shows
	// real data immediately instead of placeholder '---'.
	const life = Session.Entity && Session.Entity.life;
	if (life) {
		this.update('hp', life.hp, life.hp_max);
		this.update('sp', life.sp, life.sp_max);
	}
	if (Session.Character) {
		this.update('name', Session.Character.name);
		this.update('blvl', Session.Character.level);
		this.update('job', Session.Character.job);
	}
};

/**
 * D-28: onRemove runs EVERY remove. Currently no dynamic listeners to tear
 * down. WR-04: _dragBound is intentionally NOT reset here — the shadow DOM
 * persists (guarded by __loaded in prepare), so the drag listeners on the
 * handle element survive the remove/append cycle. Resetting would cause the
 * next onAppend to call draggable() again, re-adding duplicate handlers.
 */
BasicInfoV6.onRemove = function onRemove() {
	/* no-op — see WR-04 comment above */
};

// BLOCK-3: export via UIManager.addComponent (identical shape to
// BasicInfoV4.js:423). UIVersionManager integration depends on this exact
// pattern — do NOT switch to `class extends GUIComponent` + default-export
// the instance.
export default UIManager.addComponent(BasicInfoV6);
