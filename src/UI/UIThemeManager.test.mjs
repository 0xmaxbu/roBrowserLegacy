/**
 * UIThemeManager unit tests (Phase 12-01 Task 1, TDD RED phase).
 *
 * Verified with Node's built-in test runner:
 *   node --test src/UI/UIThemeManager.test.mjs
 */

import { test } from 'node:test';
import * as assert from 'node:assert/strict';

// ESM import caches the module — re-import per test via dynamic import
async function freshModule() {
    // bust cache so setTheme state does not leak between tests
    const url = new URL('./UIThemeManager.js', import.meta.url).href + '?t=' + Date.now() + Math.random();
    return (await import(url)).default;
}

test('setTheme("default") then getTheme() returns "default"', async () => {
    const M = await freshModule();
    M.setTheme('default');
    assert.equal(M.getTheme(), 'default');
});

test('setTheme("") disables theming; getThemePath returns input unchanged', async () => {
    const M = await freshModule();
    M.setTheme('');
    assert.equal(M.getThemePath('data/texture/foo.bmp'), 'data/texture/foo.bmp');
});

test('BLOCK-1: data/ prefix is preserved on texture path', async () => {
    const M = await freshModule();
    M.setTheme('default');
    assert.equal(
        M.getThemePath('data/texture/basic_interface/foo.bmp'),
        'data/custom-assets/default/texture/basic_interface/foo.bmp'
    );
});

test('BLOCK-1: data/ prefix is preserved on sprite path', async () => {
    const M = await freshModule();
    M.setTheme('default');
    assert.equal(
        M.getThemePath('data/sprite/abc/bar.spr'),
        'data/custom-assets/default/sprite/abc/bar.spr'
    );
});

test('only data/texture/ and data/sprite/ prefixes are themed', async () => {
    const M = await freshModule();
    M.setTheme('default');
    // audio is NOT themed
    assert.equal(M.getThemePath('data/audio/x.wav'), 'data/audio/x.wav');
    // path that does not start with data/texture|sprite — returned unchanged
    assert.equal(M.getThemePath('custom-assets/x.bmp'), 'custom-assets/x.bmp');
});

test('registerOverride wins over theme', async () => {
    const M = await freshModule();
    M.setTheme('default');
    M.registerOverride('data/texture/foo.bmp', 'data/custom-assets/special/texture/foo.bmp');
    assert.equal(
        M.getThemePath('data/texture/foo.bmp'),
        'data/custom-assets/special/texture/foo.bmp'
    );
});

test('clearOverrides removes manual overrides', async () => {
    const M = await freshModule();
    M.setTheme('default');
    M.registerOverride('data/texture/foo.bmp', 'override_url');
    M.clearOverrides();
    // after clear, normal theme resolution applies again
    assert.equal(
        M.getThemePath('data/texture/foo.bmp'),
        'data/custom-assets/default/texture/foo.bmp'
    );
});

test('getThemePath(null|undefined|empty) returns input unchanged', async () => {
    const M = await freshModule();
    M.setTheme('default');
    assert.equal(M.getThemePath(''), '');
    assert.equal(M.getThemePath(undefined), undefined);
    assert.equal(M.getThemePath(null), null);
});

test('setTheme coerces non-string / empty-string to disabled', async () => {
    const M = await freshModule();
    M.setTheme(undefined);
    assert.equal(M.getTheme(), '');
    assert.equal(M.getThemePath('data/texture/foo.bmp'), 'data/texture/foo.bmp');
});
