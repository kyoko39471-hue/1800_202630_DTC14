const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function harness(fail = false) {
    const writes = [],
        statuses = [];
    function element(tag) {
        return {
            tag,
            children: [],
            attributes: {},
            handlers: {},
            disabled: false,
            append(...children) {
                this.children.push(...children);
            },
            setAttribute(key, value) {
                this.attributes[key] = value;
            },
            addEventListener(event, handler) {
                this.handlers[event] = handler;
            },
        };
    }
    const context = vm.createContext({
        document: { createElement: element },
        icon: (name) => name,
        setStatus: (...args) => statuses.push(args),
        setPhraseSaved: async (...args) => {
            if (fail) throw new Error('Denied');
            writes.push(args);
        },
    });
    const source = fs
        .readFileSync(path.join(__dirname, '../src/phraseCards.js'), 'utf8')
        .replace(/^import[\s\S]*?;\r?\n/gm, '')
        .replace(/\bexport /g, '');
    vm.runInContext(source + '\nglobalThis.makeCard = phraseCard;', context);
    return { makeCard: context.makeCard, writes, statuses };
}
const phrase = {
    categoryId: 'greetings',
    phraseId: 'hello',
    english: 'Hello!',
    translation: 'Bonjour !',
};
const user = { uid: 'account-a' };

test('bookmark saves the same user-specific phrase and updates its accessible state', async () => {
    const api = harness();
    const card = api.makeCard(phrase, 'fr', user, false);
    const button = card.children[1].children[0];
    assert.equal(button.innerHTML, 'bookmark');
    await button.handlers.click();
    assert.deepEqual(api.writes[0], [user, phrase, true]);
    assert.equal(button.innerHTML, 'bookmark-check');
    assert.equal(button.attributes['aria-pressed'], 'true');
    assert.equal(button.attributes['aria-label'], 'Unsave phrase: Hello!');
});

test('successful unsave removes the card from Saved after the write finishes', async () => {
    const api = harness();
    let removed;
    const card = api.makeCard(
        phrase,
        'fr',
        user,
        true,
        (value) => (removed = value)
    );
    await card.children[1].children[0].handlers.click();
    assert.equal(api.writes[0][2], false);
    assert.equal(removed, card);
});

test('failed unsave keeps the existing saved state and card available for retry', async () => {
    const api = harness(true);
    let removed = false;
    const card = api.makeCard(phrase, 'fr', user, true, () => (removed = true));
    const button = card.children[1].children[0];
    await button.handlers.click();
    assert.equal(button.attributes['aria-pressed'], 'true');
    assert.equal(button.disabled, false);
    assert.equal(removed, false);
    assert.equal(api.statuses.at(-1)[1], true);
});
