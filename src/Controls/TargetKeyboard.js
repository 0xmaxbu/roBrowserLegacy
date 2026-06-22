/**
 * Controls/TargetKeyboard.js
 *
 * Phase 12, plan 12-02 (Task 2): keyboard target cycling + conditional Esc.
 *
 * Registers a CAPTURE-phase keydown listener on `window` so it fires BEFORE
 * Escape.onKeyDown (which is registered in the bubble phase and does not call
 * stopImmediatePropagation). This enables the D-13 conditional behaviour:
 *   - Ctrl+Tab       → cycle to nearest attackable target (forward)
 *   - Ctrl+Shift+Tab → cycle reverse
 *   - Esc            → if a target exists, clear it and SUPPRESS the Escape
 *                      menu; otherwise let the Escape menu open normally
 *
 * REVIEWS.md MED-3 (Tab/ChatBox conflict):
 *   ChatBox.js:946 uses plain `KEYS.TAB` to switch between the nickname and
 *   message input boxes. A capture-phase plain-Tab handler would steal Tab
 *   from chat focus. Fix: target cycling is gated by `event.ctrlKey`, so plain
 *   Tab is left untouched. Precedent: MiniMapV2.js:220 uses Ctrl+Tab for the
 *   same reason (`if (event.which === KEYS.TAB && KEYS.CTRL)`).
 *
 * This file is part of the rAthena RO private server project (Phase 12 UI).
 */

import KEYS from 'Controls/KeyEventHandler.js';
import EntityManager from 'Renderer/EntityManager.js';
import Session from 'Engine/SessionStorage.js';
import Entity from 'Renderer/Entity/Entity.js';
import TargetManager from 'UI/TargetManager.js';

// D-13/D-14: combat target subset for Ctrl+Tab cycling.
// Broader TARGETABLE_TYPES (PET/HOM/MERC/ELEM) are click-selectable but not
// combat targets — Ctrl+Tab is for selecting things to attack, so it excludes
// friendlies and non-combat pets/companions.
const TAB_TYPES = new Set([
	Entity.TYPE_PC,
	Entity.TYPE_DISGUISED,
	Entity.TYPE_MOB,
	Entity.TYPE_NPC_ABR,
	Entity.TYPE_NPC_BIONIC
]);

let _installed = false;
let _handler = null;

/**
 * Install the capture-phase keydown listener. Idempotent.
 * Must be called once when the player enters the map (same bootstrap that
 * calls TargetManager.init()).
 */
function init() {
	if (_installed) return;
	_installed = true;

	_handler = (event) => {
		// MED-3: Ctrl+Tab / Ctrl+Shift+Tab cycles attackable targets.
		// Plain Tab is left alone so ChatBox.js:946 can switch nickname↔message.
		// (MiniMapV2.js:220 precedent: Ctrl+Tab is the established
		// non-conflicting modifier for Tab-based UI toggles.)
		if (event.which === KEYS.TAB && event.ctrlKey) {
			event.preventDefault();
			cycleTarget(event.shiftKey); // Ctrl+Shift+Tab = reverse
			event.stopImmediatePropagation();
			return;
		}

		// Esc: conditional — clear target if one exists and suppress the
		// Escape menu; otherwise let bubble-phase Escape.onKeyDown show it.
		if (event.which === KEYS.ESCAPE || event.key === 'Escape') {
			if (TargetManager.getTarget()) {
				TargetManager.clearTarget();
				event.stopImmediatePropagation(); // suppress Escape menu (D-13)
				event.preventDefault();
			}
			// else: do nothing — let bubble-phase Escape.onKeyDown run
		}
	};

	// CAPTURE phase: fires before bubble-phase Escape.onKeyDown.
	window.addEventListener('keydown', _handler, true);
}

/**
 * Remove the capture-phase listener. Optional — the listener is cheap and
 * safe to leave installed across map changes; call this only if you really
 * want to tear down target keyboard handling (e.g. a feature flag toggle).
 */
function cleanup() {
	if (_handler) {
		window.removeEventListener('keydown', _handler, true);
		_handler = null;
	}
	_installed = false;
}

/**
 * Cycle to the next/previous nearest attackable entity by Euclidean distance.
 * Excludes friendlies (D-13: Ctrl+Tab is for combat; friendlies are selected
 * by mouse click).
 *
 * @param {boolean} reverse true for Ctrl+Shift+Tab (previous target)
 */
function cycleTarget(reverse) {
	const src = Session.Entity;
	if (!src || !src.position) return;

	const candidates = [];
	EntityManager.forEach(entity => {
		if (entity === src) return;
		if (!TAB_TYPES.has(entity.objecttype)) return;
		// ACTION is a per-instance property (EntityAction mixin), read off
		// the instance, not off the Entity class.
		if (entity.action === entity.ACTION.DIE) return;
		if (entity.remove_tick && entity.remove_tick > 0) return;
		// Exclude friendlies: Ctrl+Tab is for combat targets.
		if (entity.canAttackEntity && !entity.canAttackEntity()) return;

		const dx = entity.position[0] - src.position[0];
		const dy = entity.position[1] - src.position[1];
		candidates.push({ entity, dist: dx * dx + dy * dy });
	});

	if (!candidates.length) return;
	candidates.sort((a, b) => a.dist - b.dist);

	const cur = TargetManager.getTarget();
	let idx = cur ? candidates.findIndex(c => c.entity === cur) : -1;
	idx = reverse
		? (idx <= 0 ? candidates.length - 1 : idx - 1)
		: (idx + 1) % candidates.length;

	TargetManager.setTarget(candidates[idx].entity);
}

export default { init, cleanup };
