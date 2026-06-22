/**
 * UILayoutStore unit tests (Phase 12-01 Task 1, TDD RED phase).
 *
 * Verified with Node's built-in test runner:
 *   node --test src/UI/UILayoutStore.test.mjs
 *
 * Provides a minimal localStorage shim on globalThis so the module under test
 * behaves the same as in a browser environment.
 */

import { test } from 'node:test';
import * as assert from 'node:assert/strict';

// Minimal localStorage shim backed by a Map.
function makeLocalStorage() {
    const store = new Map();
    return {
        getItem(key) { return store.has(key) ? store.get(key) : null; },
        setItem(key, val) { store.set(key, String(val)); },
        removeItem(key) { store.delete(key); },
        clear() { store.clear(); },
        get _store() { return store; }
    };
}

async function freshModule(localStorage) {
    // Replace globalThis.localStorage for the duration of the import + test.
    const prev = globalThis.localStorage;
    globalThis.localStorage = localStorage;
    try {
        const url = new URL('./UILayoutStore.js', import.meta.url).href + '?t=' + Date.now() + Math.random();
        return (await import(url)).default;
    } finally {
        // restore happens in test teardown, keep shim active for assertions
    }
}

test('save then restore returns the same position', async () => {
    const ls = makeLocalStorage();
    const S = await freshModule(ls);
    S.setEnabled(true);
    S.save('BasicInfoV6', { left: 100, top: 50 });
    assert.deepEqual(S.restore('BasicInfoV6'), { left: 100, top: 50 });
});

test('restore returns null for unsaved component', async () => {
    const ls = makeLocalStorage();
    const S = await freshModule(ls);
    S.setEnabled(true);
    assert.equal(S.restore('Nonexistent'), null);
});

test('positions persist under global key ui_layout_positions', async () => {
    const ls = makeLocalStorage();
    const S = await freshModule(ls);
    S.setEnabled(true);
    S.save('A', { left: 1, top: 2 });
    const raw = ls.getItem('ui_layout_positions');
    assert.ok(raw, 'expected ui_layout_positions to be set');
    const parsed = JSON.parse(raw);
    assert.deepEqual(parsed.A, { left: 1, top: 2 });
});

test('save is no-op when disabled', async () => {
    const ls = makeLocalStorage();
    const S = await freshModule(ls);
    S.setEnabled(false);
    S.save('A', { left: 10, top: 20 });
    // nothing written
    assert.equal(ls.getItem('ui_layout_positions'), null);
});

test('restore still works after setEnabled(false) (reads prior saves)', async () => {
    const ls = makeLocalStorage();
    const S = await freshModule(ls);
    S.setEnabled(true);
    S.save('A', { left: 5, top: 6 });
    S.setEnabled(false);
    assert.deepEqual(S.restore('A'), { left: 5, top: 6 });
});

test('multiple components coexist in the same storage key', async () => {
    const ls = makeLocalStorage();
    const S = await freshModule(ls);
    S.setEnabled(true);
    S.save('A', { left: 1, top: 2 });
    S.save('B', { left: 3, top: 4 });
    assert.deepEqual(S.restore('A'), { left: 1, top: 2 });
    assert.deepEqual(S.restore('B'), { left: 3, top: 4 });
});

test('save with float coords truncates to int', async () => {
    const ls = makeLocalStorage();
    const S = await freshModule(ls);
    S.setEnabled(true);
    S.save('A', { left: 12.7, top: -3.9 });
    assert.deepEqual(S.restore('A'), { left: 12, top: -3 });
});

test('clear removes all saved positions', async () => {
    const ls = makeLocalStorage();
    const S = await freshModule(ls);
    S.setEnabled(true);
    S.save('A', { left: 1, top: 2 });
    S.clear();
    assert.equal(S.restore('A'), null);
    assert.equal(ls.getItem('ui_layout_positions'), null);
});

test('setEnabled(false) then isEnabled() returns false', async () => {
    const ls = makeLocalStorage();
    const S = await freshModule(ls);
    S.setEnabled(false);
    assert.equal(S.isEnabled(), false);
    S.setEnabled(true);
    assert.equal(S.isEnabled(), true);
});

test('save is resilient to localStorage quota errors (does not throw)', async () => {
    const ls = makeLocalStorage();
    ls.setItem = () => { throw new Error('QuotaExceededError'); };
    const S = await freshModule(ls);
    S.setEnabled(true);
    // must not throw
    S.save('A', { left: 1, top: 2 });
});

test('restore is resilient to corrupted JSON in localStorage', async () => {
    const ls = makeLocalStorage();
    ls.setItem('ui_layout_positions', '{not valid json');
    const S = await freshModule(ls);
    S.setEnabled(true);
    // returns null instead of throwing
    assert.equal(S.restore('A'), null);
});

test('default _enabled is false (D-23: layout locked by default)', async () => {
    const ls = makeLocalStorage();
    const S = await freshModule(ls);
    // D-23: default = locked = _enabled=false (draggable only when explicitly enabled)
    assert.equal(S.isEnabled(), false);
});
