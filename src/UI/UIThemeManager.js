/**
 * UI/UIThemeManager.js
 *
 * Resolves RO GRF asset paths to themed equivalents served by the remote-client
 * PHP proxy via a local data folder overlay (REVIEWS.md BLOCK-1).
 *
 * Themed path format (BLOCK-1: data/ prefix is REQUIRED):
 *   `data/texture/foo.bmp`  + theme `default`
 *     → `data/custom-assets/default/texture/foo.bmp`
 *
 * The remote-client `index.php:191` allow-list only accepts URLs starting with
 * `data/` or `BGM/`, so the `data/` prefix MUST be preserved. The PHP proxy's
 * `Client::getFile()` (Client.php:432) then checks the local data folder first
 * before falling back to the GRF, so files at `data/custom-assets/<theme>/...`
 * in the container shadow the equivalent GRF paths.
 *
 * Phase 12 (D-24): no actual themed BMP consumers — this is infrastructure
 * for future phases. UIThemeManager is disabled by default (uiTheme='').
 *
 * This file is part of the Phase 12-01 plan.
 */

class UIThemeManager {
    static _theme = '';
    static _overrides = new Map();

    /**
     * Set the active theme name.
     * Pass '' / null / undefined to disable theming.
     * @param {string} themeName
     */
    static setTheme(themeName) {
        this._theme = (typeof themeName === 'string' && themeName.length) ? themeName : '';
    }

    /** @return {string} active theme name ('' = disabled) */
    static getTheme() {
        return this._theme;
    }

    /**
     * Resolve a GRF asset path to its themed equivalent.
     * - Manual overrides (registerOverride) win over theme.
     * - Only `data/texture/` and `data/sprite/` prefixes are themed.
     * - `data/` prefix is ALWAYS preserved (BLOCK-1).
     * @param {string} grfPath
     * @return {string} resolved path (unchanged if no theme / no match)
     */
    static getThemePath(grfPath) {
        if (!grfPath) return grfPath;
        if (this._overrides.has(grfPath)) return this._overrides.get(grfPath);
        if (!this._theme) return grfPath;

        // BLOCK-1: keep 'data/' prefix so remote-client index.php:191 allows it.
        // Result: data/custom-assets/<theme>/texture|sprite/...
        if (grfPath.startsWith('data/texture/')) {
            return 'data/custom-assets/' + this._theme + '/texture/' + grfPath.slice('data/texture/'.length);
        }
        if (grfPath.startsWith('data/sprite/')) {
            return 'data/custom-assets/' + this._theme + '/sprite/' + grfPath.slice('data/sprite/'.length);
        }
        return grfPath;
    }

    /**
     * Register a manual override.
     * The override URL is returned by getThemePath verbatim (checked before theme).
     * @param {string} grfPath  original GRF path (key)
     * @param {string} url      resolved URL to serve instead
     */
    static registerOverride(grfPath, url) {
        this._overrides.set(grfPath, url);
    }

    /** Remove all manual overrides. */
    static clearOverrides() {
        this._overrides.clear();
    }
}

export default UIThemeManager;
