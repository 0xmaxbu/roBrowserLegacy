/**
 * UI/TargetManager.js
 *
 * Unified target management (Phase 12, plan 12-02).
 *
 * Wraps `EntityManager.setFocusEntity` via a runtime monkey-patch so that every
 * focus change (mouse click, Ctrl+Tab cycle, BotAutoHunt, …) flows through one
 * entry point and notifies subscribers (`onChange`).
 *
 * A lightweight requestAnimationFrame health-check applies the D-16 target
 * invalidation rules:
 *   - hostile target death → clear
 *   - friendly target death → keep (only Esc clears)
 *   - entity removed (map change / despawn) → try GID rematch, else clear after
 *     a 2s grace window
 *
 * The import side-effect does NOT auto-init (EntityManager may not be ready).
 * Wave-2 consumers call `TargetManager.init()` from their onAppend, then
 * `TargetManager.onChange(cb)` to subscribe.
 *
 * This file is part of the rAthena RO private server project (Phase 12 UI).
 */

import EntityManager from 'Renderer/EntityManager.js';
import Entity from 'Renderer/Entity/Entity.js';

// D-14: targetable entity objecttypes (biological entities, friend or foe).
// Used by downstream consumers (TargetPanel/TargetIndicator) for validation;
// Tab-cycling uses its own combat subset (see TargetKeyboard.TAB_TYPES).
const TARGETABLE_TYPES = new Set([
	Entity.TYPE_PC,
	Entity.TYPE_DISGUISED,
	Entity.TYPE_MOB,
	Entity.TYPE_PET,
	Entity.TYPE_HOM,
	Entity.TYPE_MERC,
	Entity.TYPE_ELEM,
	Entity.TYPE_NPC_ABR,
	Entity.TYPE_NPC_BIONIC
]);

class TargetManager {
	static _target = null;
	static _callbacks = new Set();
	static _patched = false;
	static _origSetFocus = null;
	static _rafId = null;
	static _rematchGid = null;
	static _rematchDeadline = 0;

	/**
	 * Install the focus monkey-patch and start the health-check loop.
	 * Idempotent — safe to call from multiple consumers' onAppend.
	 *
	 * Note: EntityManager.js:355 calls the LOCAL setFocusEntity(null) during
	 * render() entity-removal, bypassing this patch. The RAF health-check
	 * covers that case (D-16 death/removal clearing).
	 */
	static init() {
		if (this._patched) return;
		this._patched = true;

		// Monkey-patch the EXPORTED setFocusEntity. Catches click / Tab /
		// BotAutoHunt (all go through the exported object).
		this._origSetFocus = EntityManager.setFocusEntity;
		EntityManager.setFocusEntity = (entity) => {
			this._origSetFocus(entity);
			this._setTargetInternal(entity);
		};

		this._healthCheck();
	}

	/**
	 * Public API: set the target. Routes through focus so all consumers sync
	 * (used by the Ctrl+Tab keyboard cycler).
	 */
	static setTarget(entity) {
		EntityManager.setFocusEntity(entity);
	}

	/** Public API: current target entity (or null). */
	static getTarget() {
		return this._target;
	}

	/**
	 * Public API: clear the target. Resets rematch state, notifies null, and
	 * clears the underlying focus via the original (unpatched) assignment.
	 */
	static clearTarget() {
		this._rematchGid = null;
		this._rematchDeadline = 0;
		this._setTargetInternal(null);
		if (this._origSetFocus) this._origSetFocus(null);
	}

	/**
	 * Public API: subscribe to target changes.
	 * @param {(entity: object|null) => void} cb
	 * @returns {() => void} unsubscribe function
	 */
	static onChange(cb) {
		this._callbacks.add(cb);
		return () => this._callbacks.delete(cb);
	}

	/**
	 * Internal: store target, cache its GID for map-change rematch, fire
	 * subscribers. Subscriber exceptions are isolated (one bad cb doesn't
	 * break the others).
	 */
	static _setTargetInternal(entity) {
		this._target = entity;
		if (entity) {
			this._rematchGid = entity.GID;
		}
		this._callbacks.forEach(cb => {
			try {
				cb(entity);
			} catch (e) {
				console.error('[TargetManager] onChange subscriber threw:', e);
			}
		});
	}

	/**
	 * RAF health-check loop (D-16).
	 * Cheap per-frame: only does work when a target is set. Self-scheduling.
	 */
	static _healthCheck() {
		this._rafId = requestAnimationFrame(() => this._healthCheck());
		const t = this._target;
		if (!t) return;

		// Entity removed from manager (map change or full despawn)?
		const stillExists = EntityManager.get(t.GID) === t;
		if (!stillExists) {
			// Try re-match by GID (entity may have re-spawned on new map).
			const rematched = EntityManager.get(this._rematchGid);
			if (rematched && rematched !== t) {
				this._setTargetInternal(rematched);
				this._rematchDeadline = 0;
				return;
			}
			// Not found — start/continue rematch grace window (D-16).
			if (!this._rematchDeadline) this._rematchDeadline = Date.now() + 2000;
			if (Date.now() > this._rematchDeadline) {
				this._setTargetInternal(null); // "换图后目标不在 → 清除"
				this._rematchDeadline = 0;
			}
			return;
		}
		this._rematchDeadline = 0;

		// Death check (D-16). ACTION is a per-instance property (EntityAction
		// mixin sets this.ACTION on each entity), so read it off the instance.
		const isDead = t.action === t.ACTION.DIE || (t.remove_tick && t.remove_tick > 0);
		if (isDead) {
			const isHostile = t.canAttackEntity ? t.canAttackEntity() : false;
			if (isHostile) {
				this._setTargetInternal(null); // hostile death → clear
			}
			// friendly death → keep (only Esc clears), per D-16
		}
	}
}

// Export the TARGETABLE_TYPES set for downstream consumers (TargetPanel,
// TargetIndicator validation) — D-14 reference.
TargetManager.TARGETABLE_TYPES = TARGETABLE_TYPES;

// Window bridge (Phase 11 precedent: window.hudOverlay / window.targetLock).
// Allows any module (including BotAutoHunt) to access target state directly.
if (typeof window !== 'undefined') {
	window.targetManager = TargetManager;
}

export default TargetManager;
