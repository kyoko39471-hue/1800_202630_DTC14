const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function themeHarness(saved, storageBlocked = false) {
    const writes = [];
    const attributes = {};
    const button = { setAttribute: (key, value) => (attributes[key] = value) };
    const html = { dataset: {}, style: {} };
    const handlers = {};
    const context = vm.createContext({
        document: {
            documentElement: html,
            querySelectorAll: (selector) =>
                selector === '[data-theme-toggle]' ? [button] : [],
        },
        window: {
            localStorage: {
                getItem() {
                    if (storageBlocked) throw new Error('Unavailable');
                    return saved;
                },
                setItem(key, value) {
                    if (storageBlocked) throw new Error('Unavailable');
                    writes.push([key, value]);
                },
            },
            addEventListener: (event, handler) => (handlers[event] = handler),
        },
    });
    const source = fs
        .readFileSync(path.join(__dirname, '../src/theme.js'), 'utf8')
        .replace(/\bexport /g, '');
    vm.runInContext(
        source + '\nglobalThis.api = {setTheme, toggleTheme, getTheme};',
        context
    );
    return { ...context.api, html, attributes, writes, handlers };
}

test('saved dark appearance loads on another page and keeps accessible controls in sync', () => {
    const page = themeHarness('dark');
    assert.equal(page.getTheme(), 'dark');
    assert.equal(page.html.style.colorScheme, 'dark');
    assert.equal(page.attributes['aria-label'], 'Switch to light mode');
    assert.equal(page.attributes['aria-pressed'], 'true');
    assert.equal(page.writes.length, 0);
    page.toggleTheme();
    assert.equal(page.getTheme(), 'light');
    assert.equal(page.attributes['aria-pressed'], 'false');
    assert.deepEqual(page.writes, [['communication-help-theme', 'light']]);
});

test('new visitors and unsupported stored values start in light mode', () => {
    assert.equal(themeHarness(null).getTheme(), 'light');
    assert.equal(themeHarness('invalid').getTheme(), 'light');
});

test('appearance still changes when storage is blocked', () => {
    const page = themeHarness(null, true);
    page.toggleTheme();
    assert.equal(page.getTheme(), 'dark');
});

test('appearance follows changes made in another app tab', () => {
    const page = themeHarness('light');
    page.handlers.storage({
        key: 'communication-help-theme',
        newValue: 'dark',
    });
    assert.equal(page.getTheme(), 'dark');
    assert.equal(page.writes.length, 0);
});
