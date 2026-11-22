const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function layout() {
    const header = { innerHTML: '' };
    const line = { hidden: true };
    const label = { textContent: '', closest: () => line };
    const context = vm.createContext({
        document: {
            querySelector: (selector) =>
                selector === '[data-app-header]' ? header : null,
            querySelectorAll: () => [],
            getElementById: (id) =>
                id === 'headerLanguageLabel' &&
                header.innerHTML.includes('id="headerLanguageLabel"')
                    ? label
                    : null,
            referrer: '',
        },
        history: { length: 1 },
        initTheme() {},
        setTheme() {},
        toggleTheme() {},
    });
    const source = fs
        .readFileSync(path.join(__dirname, '../src/layout.js'), 'utf8')
        .replace(/^import[\s\S]*?;\r?\n/gm, '')
        .replace(/\bexport /g, '');
    vm.runInContext(
        source + '\nglobalThis.api = {mountLayout, setHeaderLanguage};',
        context
    );
    return { ...context.api, header, line, label };
}

test('signed-out pages show no translation line', () => {
    const page = layout();
    page.mountLayout(null);
    assert.equal(page.header.innerHTML.includes('header-language'), false);
    assert.equal(page.header.innerHTML.includes('English'), false);
    page.setHeaderLanguage('French');
    assert.equal(page.label.textContent, '');
});
test('signed-in pages keep the line hidden until a language loads', () => {
    const page = layout();
    page.mountLayout('home');
    assert.match(page.header.innerHTML, /<p class="header-language" hidden>/);
});
test('a non-English destination reveals the translation line', () => {
    const page = layout();
    page.mountLayout('home');
    page.setHeaderLanguage('French');
    assert.equal(page.line.hidden, false);
    assert.equal(page.label.textContent, 'Translating from English to French');
});
test('an English destination hides the line instead of saying English to English', () => {
    const page = layout();
    page.mountLayout('user');
    page.setHeaderLanguage('French');
    page.setHeaderLanguage('English');
    assert.equal(page.line.hidden, true);
    assert.equal(page.label.textContent, '');
});
