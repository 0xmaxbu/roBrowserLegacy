/**
 * UI/Components/TargetPanel/TargetPanel.js
 *
 * Compact HUD panel showing the current target's name, Lv (when a data source
 * exists per D-27), HP bar (LOW-4: exact numbers whenever life.hp >= 0), and a
 * conditional SP bar (MED-1: shown only when life.sp > -1 — TYPE_PC/HOM/MERC
 * have SP update sources in Main.js:312, Homun.js:91/173, Mercenary.js:35/69/106;
 * TYPE_MOB/PET/ELEM keep sp=-1 and hide the bar).
 *
 * Subscribes to TargetManager (plan 12-02) for show/hide and target tracking.
 * RAF-polls entity.life / EntityManager.getLife each frame for real-time updates.
 *
 * REVIEWS.md corrections embedded:
 *   - MED-1: SP bar conditional on `life.sp > -1` (no type-allowlist hardcode).
 *   - LOW-4: HP shown whenever `life.hp >= 0` (no "must have attacked" assumption).
 *
 * D-27 Lv matrix:
 *   - TYPE_PET / TYPE_HOM / TYPE_MERC → entity.clevel ✓
 *   - TYPE_PC / TYPE_DISGUISED → party roster baseLevel (deferred to plan 12-05
 *     PartyFriendsV1.getPartyMembers; until then hide Lv for PC targets).
 *   - TYPE_MOB / TYPE_NPC_ABR / TYPE_NPC_BIONIC → no data source → hide.
 *
 * D-19: dead target grayed out via `.tp-dead` class.
 * D-23: draggable when UILayoutStore.isEnabled(); position persisted.
 * D-28: subscriptions/drag registered in onAppend, cleaned up in onRemove.
 *
 * Phase 12-06 (Wave 2). Depends on: 12-01 (UILayoutStore), 12-02 (TargetManager).
 */

import Entity from 'Renderer/Entity/Entity.js';
import EntityManager from 'Renderer/EntityManager.js';
import UIManager from 'UI/UIManager.js';
import GUIComponent from 'UI/GUIComponent.js';
import TargetManager from 'UI/TargetManager.js';
import UILayoutStore from 'UI/UILayoutStore.js';
import htmlText from './TargetPanel.html?raw';
import cssText from './TargetPanel.css?raw';

// ─── Component creation (BLOCK-3 object-on-instance pattern) ───────────────

const TargetPanel = new GUIComponent('TargetPanel', cssText);

TargetPanel.render = () => htmlText;

TargetPanel.needFocus = false;
TargetPanel.mouseMode = GUIComponent.MouseMode.CROSS;

// ─── Lifecycle (D-28: bind in onAppend, clean in onRemove) ──────────────────

/**
 * Per-append setup: subscribe to TargetManager, start RAF poll, enable drag.
 * Safe to re-run on hot-swap (D-22 V4↔V6 toggle pattern).
 */
TargetPanel.onAppend = function onAppend() {
	this._currentTarget = null;

	// D-28: subscribe via TargetManager.onChange — show on set, hide on clear.
	this._unsub = TargetManager.onChange(entity => this._onTargetChange(entity));

	// Idempotent init — safe if multiple TargetPanel instances append (they don't,
	// but defensive per TargetManager doc).
	TargetManager.init();

	// Apply current target state (if TargetManager already had one).
	this._onTargetChange(TargetManager.getTarget());

	// RAF poll: read life HP/SP each frame (cheap property reads, single target).
	this._rafActive = true;
	this._rafId = requestAnimationFrame(() => this._pollLoop());

	// D-23: enable drag when layout editing is unlocked; persist on drag end.
	if (UILayoutStore.isEnabled()) {
		this.draggable('.tp-root');
		this.onDragEnd = () =>
			UILayoutStore.save('TargetPanel', {
				left: this._host.offsetLeft,
				top: this._host.offsetTop
			});
		const saved = UILayoutStore.restore('TargetPanel');
		if (saved) {
			this._host.style.left = saved.left + 'px';
			this._host.style.top = saved.top + 'px';
		}
	}
};

TargetPanel.onRemove = function onRemove() {
	if (this._unsub) {
		this._unsub();
		this._unsub = null;
	}
	this._rafActive = false;
	if (this._rafId) {
		cancelAnimationFrame(this._rafId);
		this._rafId = null;
	}
};

// ─── Target change handler (show/hide + name + Lv) ──────────────────────────

TargetPanel._onTargetChange = function _onTargetChange(entity) {
	if (!entity) {
		// No target → hide panel entirely (D-06.2).
		this._host.style.display = 'none';
		this._currentTarget = null;
		return;
	}
	// Show panel. NOTE: explicit 'block' because :host CSS defaults to display:none
	// (setting style.display='' would leave it hidden — deviation from plan pseudo-code).
	this._host.style.display = 'block';
	this._currentTarget = entity;

	const root = this._shadow;
	const nameEl = root.querySelector('.tp-name');
	if (nameEl) {
		// Fall back to GID if no display name is set yet.
		nameEl.textContent =
			entity.display && entity.display.name ? entity.display.name : 'Entity ' + entity.GID;
	}

	// D-27 Lv: show only where a data source exists.
	this._renderLevel(entity);

	// Immediate bar update so the panel isn't briefly stale.
	this._updateBars();
};

// ─── RAF poll loop (T-12-06-02: cheap, single-target, self-bounding) ────────

TargetPanel._pollLoop = function _pollLoop() {
	if (!this._rafActive) return;
	this._updateBars();
	this._rafId = requestAnimationFrame(() => this._pollLoop());
};

// ─── HP / SP bar rendering (D-27 + MED-1 + LOW-4) ───────────────────────────

TargetPanel._updateBars = function _updateBars() {
	const t = this._currentTarget;
	if (!t) return;

	const root = this._shadow;

	// D-27 + LOW-4: prefer entity.life (live instance); fall back to life cache.
	// Either source returns hp=-1 when no data is available → percentage-only bar.
	const fallback = { hp: -1, hp_max: -1, sp: -1, sp_max: -1 };
	const cachedLife = EntityManager.getLife(t.GID);
	const life =
		t.life && t.life.hp !== undefined
			? {
					hp: t.life.hp,
					hp_max: t.life.hp_max,
					sp: t.life.sp,
					sp_max: t.life.sp_max
				}
			: cachedLife || fallback;

	// HP bar — LOW-4: show exact whenever life.hp >= 0 (no "must attack" assumption).
	const hpFill = root.querySelector('.tp-hpfill');
	const hpText = root.querySelector('.tp-hptext');
	if (life.hp >= 0 && life.hp_max > 0) {
		const pct = Math.max(0, Math.min(100, (life.hp / life.hp_max) * 100));
		if (hpFill) hpFill.style.width = pct + '%';
		if (hpText) hpText.textContent = life.hp + ' / ' + life.hp_max;
	} else {
		// D-27 downgrade: full bar, no exact number (non-party PC, unattacked monster).
		if (hpFill) hpFill.style.width = '100%';
		if (hpText) hpText.textContent = '???';
	}

	// MED-1: SP bar shown ONLY when life.sp > -1 (TYPE_PC/HOM/MERC have data;
	// TYPE_MOB/PET/ELEM keep sp=-1 → bar hidden). Element stays in DOM, JS toggles.
	const spBar = root.querySelector('.tp-spbar');
	if (spBar) {
		if (life.sp !== undefined && life.sp > -1 && life.sp_max > 0) {
			spBar.style.display = '';
			const spFill = root.querySelector('.tp-spfill');
			const spText = root.querySelector('.tp-sptext');
			const spPct = Math.max(0, Math.min(100, (life.sp / life.sp_max) * 100));
			if (spFill) spFill.style.width = spPct + '%';
			if (spText) spText.textContent = life.sp + ' / ' + life.sp_max;
		} else {
			spBar.style.display = 'none';
		}
	}

	// D-19: dead target gray-out. ACTION is per-instance (EntityAction mixin sets
	// entity.ACTION on each entity), so read off the instance (not Entity static).
	const isDead = t.action === t.ACTION.DIE || (t.remove_tick && t.remove_tick > 0);
	const tpRoot = root.querySelector('.tp-root');
	if (tpRoot) tpRoot.classList.toggle('tp-dead', !!isDead);

	// D-19 distance gray-out (`.tp-far`) — left for future refinement once a
	// distance threshold is decided; .tp-far class already styled in CSS.
};

// ─── Lv rendering (D-27 matrix) ─────────────────────────────────────────────

TargetPanel._renderLevel = function _renderLevel(entity) {
	const lvlEl = this._shadow.querySelector('.tp-lvl');

	let lvl = null;
	switch (entity.objecttype) {
		case Entity.TYPE_PET:
		case Entity.TYPE_HOM:
		case Entity.TYPE_MERC:
			// Creature level — direct entity property.
			lvl = entity.clevel;
			break;
		case Entity.TYPE_PC:
		case Entity.TYPE_DISGUISED:
			// Party member baseLevel — requires PartyFriendsV1.getPartyMembers()
			// (plan 12-05 BLOCK-4 adds it). Until then, hide Lv for PC targets.
			// TODO(12-05): refine with party-roster check.
			lvl = null;
			break;
		case Entity.TYPE_MOB:
		case Entity.TYPE_NPC_ABR:
		case Entity.TYPE_NPC_BIONIC:
			// Monster: NO level data source (MonsterTable stores name strings only).
			lvl = null;
			break;
		default:
			lvl = null;
	}

	if (lvl != null && lvl > 0) {
		lvlEl.textContent = 'Lv.' + lvl;
		lvlEl.style.display = '';
	} else {
		lvlEl.style.display = 'none';
	}
};

// ─── Register & export (BLOCK-3: UIManager.addComponent pattern) ────────────

export default UIManager.addComponent(TargetPanel);
