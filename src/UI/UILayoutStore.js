/**
 * UI/UILayoutStore.js
 *
 * Persists UI panel positions to localStorage under a single global key
 * (`ui_layout_positions`). Cross-character global (D-23) so layouts survive
 * character switches.
 *
 * Value schema:
 *   { componentName: { left: number, top: number }, ... }
 *
 * Designed for use with GUIComponent.draggable(handle) (D-23): on `onDragEnd`
 * call `UILayoutStore.save(this.name, { left: host.offsetLeft, top: host.offsetTop })`,
 * and on `onAppend` call `UILayoutStore.restore(this.name)` to apply.
 *
 * Phase 12-01 Task 1.
 */

const STORAGE_KEY = 'ui_layout_positions';

class UILayoutStore {
    static _enabled = true;

    /**
     * Enable/disable persistence. When disabled, `save()` is a no-op.
     * `restore()` continues to read prior saves.
     * @param {boolean} v
     */
    static setEnabled(v) {
        this._enabled = !!v;
    }

    /** @return {boolean} */
    static isEnabled() {
        return this._enabled;
    }

    /**
     * Persist a panel position under its component name.
     * Float coords are truncated to integers (DOM pixels).
     * Silently ignores quota errors.
     * @param {string} componentName
     * @param {{left:number, top:number}} pos
     */
    static save(componentName, pos) {
        if (!this._enabled) return;
        const all = this._readAll();
        all[componentName] = { left: pos.left | 0, top: pos.top | 0 };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        } catch (e) {
            // quota exceeded or storage disabled — silently drop
        }
    }

    /**
     * Read a previously saved panel position.
     * @param {string} componentName
     * @return {{left:number, top:number}|null}
     */
    static restore(componentName) {
        const all = this._readAll();
        return all[componentName] || null;
    }

    /** Remove all saved positions. */
    static clear() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
            // ignore
        }
    }

    /** @return {Record<string, {left:number, top:number}>} */
    static _readAll() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        } catch (e) {
            // corrupted entry — start fresh
            return {};
        }
    }
}

export default UILayoutStore;
