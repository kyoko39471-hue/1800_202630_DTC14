const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function source(file) {
    return fs.readFileSync(path.join(__dirname, '..', 'src', file), 'utf8')
        .replace(/^import .*;\r?\n/gm, '').replace(/\bexport /g, '');
}

function profiles(existing, failure) {
    const writes = [];
    const context = vm.createContext({
        db: {}, doc: (_db, collection, uid) => `${collection}/${uid}`,
        getDoc: async () => ({ exists: () => existing !== null, data: () => existing }),
        setDoc: async (...args) => { if (failure) throw failure; writes.push(args); },
        serverTimestamp: () => 'SERVER_TIME',
    });
    vm.runInContext(source('userProfiles.js') + '\nglobalThis.api = {saveUserProfile, getUserProfile, languages};', context);
    return { ...context.api, writes };
}
const user = { uid: 'account-123', email: 'sample@example.test', displayName: 'Sample User' };

test('signup saves one UID profile with language and timestamps, without password', async () => {
    const api = profiles(null);
    await api.saveUserProfile(user, { name: 'Sample User', preferredLanguage: 'pa' });
    const [reference, profile, options] = api.writes[0];
    assert.equal(reference, 'users/account-123');
    assert.equal(profile.preferredLanguage, 'pa');
    assert.equal(profile.name, 'Sample User');
    assert.equal(profile.email, user.email);
    assert.equal(profile.createdAt, 'SERVER_TIME');
    assert.equal(profile.updatedAt, 'SERVER_TIME');
    assert.equal(options.merge, true);
    assert.equal('password' in profile, false);
});
test('login preserves saved language, creation time and teammate fields', async () => {
    const api = profiles({ name: 'Saved Name', preferredLanguage: 'ur', createdAt: 'ORIGINAL', favorites: ['water'] });
    const result = await api.saveUserProfile(user);
    assert.equal(result.preferredLanguage, 'ur');
    assert.equal(result.createdAt, 'ORIGINAL');
    assert.equal(result.name, 'Saved Name');
    assert.equal(result.favorites[0], 'water');
    assert.equal('createdAt' in api.writes[0][1], false);
    assert.equal('favorites' in api.writes[0][1], false);
});
test('an explicitly changed login language updates the saved preference', async () => {
    const api = profiles({ preferredLanguage: 'fr' });
    await api.saveUserProfile(user, { preferredLanguage: 'es' });
    assert.equal(api.writes[0][1].preferredLanguage, 'es');
});
test('an older Auth account gets an English profile on next login', async () => {
    const api = profiles(null);
    await api.saveUserProfile(user);
    assert.equal(api.writes[0][1].preferredLanguage, 'en');
    assert.equal(api.writes[0][1].name, 'Sample User');
});
test('only the six requested languages are offered; invalid values are rejected', async () => {
    const api = profiles(null);
    assert.equal(Array.from(api.languages, language => language.code).join(','), 'en,fr,pa,zh,ur,es');
    await assert.rejects(api.saveUserProfile(user, { preferredLanguage: 'xx' }));
    assert.equal(api.writes.length, 0);
});
test('a denied Firestore write is reported to the form', async () => {
    const failure = Object.assign(new Error('Denied'), { code: 'permission-denied' });
    await assert.rejects(profiles(null, failure).saveUserProfile(user), error => error === failure);
});

function formHarness({ failFirstSave = false, denyLogin = false } = {}) {
    const elements = new Map();
    function element(id) {
        if (elements.has(id)) return elements.get(id);
        const classes = new Set();
        const value = { id, value: '', textContent: '', disabled: false, handlers: {},
            classList: { add: key => classes.add(key), remove: key => classes.delete(key), toggle: (key, on) => on ? classes.add(key) : classes.delete(key) },
            addEventListener: (event, handler) => { value.handlers[event] = handler; },
            querySelector: () => ({ focus() {} }), querySelectorAll: () => [],
            setAttribute() {}, reportValidity: () => true,
        };
        elements.set(id, value); return value;
    }
    const calls = { signup: 0, save: 0, login: 0, redirects: [] };
    const auth = { currentUser: null };
    const context = vm.createContext({
        document: { readyState: 'complete', getElementById: element, title: '' },
        window: { location: { assign: url => calls.redirects.push(url) } }, auth,
        signupUser: async () => { calls.signup++; auth.currentUser = user; return user; },
        loginUser: async () => { calls.login++; if (denyLogin) throw new Error('Wrong password'); return { user }; },
        authErrorMessage: () => 'Wrong email or password.',
        saveUserProfile: async (_user, options) => { calls.save++; calls.options = options; if (failFirstSave && calls.save === 1) throw Object.assign(new Error('Denied'), { code: 'permission-denied' }); },
    });
    vm.runInContext(source('loginSignup.js'), context);
    element('signupName').value = 'Sample User'; element('signupEmail').value = user.email;
    element('signupPassword').value = 'local-test-fixture'; element('signupLanguage').value = 'pa';
    element('loginEmail').value = user.email; element('loginPassword').value = 'local-test-fixture'; element('loginLanguage').value = 'en';
    return { calls, element, submit: id => element(id).handlers.submit({ preventDefault() {} }) };
}
test('signup retries profile save after denial without making a duplicate account', async () => {
    const form = formHarness({ failFirstSave: true });
    await form.submit('signupForm');
    assert.equal(form.calls.redirects.length, 0);
    assert.match(form.element('authAlert').textContent, /Your account was created/);
    await form.submit('signupForm');
    assert.equal(form.calls.signup, 1);
    assert.equal(form.calls.save, 2);
    assert.equal(form.calls.options.preferredLanguage, 'pa');
    assert.equal(form.calls.redirects[0], 'main.html');
});
test('invalid login never writes a profile or navigates away', async () => {
    const form = formHarness({ denyLogin: true });
    await form.submit('loginForm');
    assert.equal(form.calls.save, 0);
    assert.equal(form.calls.redirects.length, 0);
    assert.equal(form.element('authAlert').textContent, 'Wrong email or password.');
});
test('unchanged login dropdown does not reset an existing language to English', async () => {
    const form = formHarness();
    await form.submit('loginForm');
    assert.equal(form.calls.options.preferredLanguage, undefined);
});
test('changing the login dropdown passes the requested language to Firestore', async () => {
    const form = formHarness();
    form.element('loginLanguage').value = 'es'; form.element('loginLanguage').handlers.change();
    await form.submit('loginForm');
    assert.equal(form.calls.options.preferredLanguage, 'es');
});
