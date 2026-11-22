const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// `clips` lists recordings that exist; leave it out to simulate a browser without Audio.
function speechPage(voices, clips) {
    const spoken = [];
    const audios = [];
    class FakeAudio {
        constructor(src) {
            this.src = src;
            this.paused = true;
            audios.push(this);
        }
        play() {
            if (clips.has(this.src)) {
                this.paused = false;
                queueMicrotask(() => this.onplaying?.());
                return Promise.resolve();
            }
            queueMicrotask(() => this.onerror?.());
            return Promise.reject(new Error('NotSupportedError'));
        }
        pause() {
            this.paused = true;
        }
    }
    const context = vm.createContext({
        ...(clips ? { Audio: FakeAudio } : {}),
        window: { addEventListener() {} },
        document: {
            createElement: () => {
                const element = {
                    handlers: {},
                    attributes: {},
                    addEventListener: (event, handler) => {
                        element.handlers[event] = handler;
                    },
                    setAttribute: (key, value) => {
                        element.attributes[key] = value;
                    },
                };
                return element;
            },
        },
        speechSynthesis: {
            getVoices: () => voices,
            speak: (utterance) => spoken.push(utterance),
            cancel() {},
        },
        SpeechSynthesisUtterance: class {
            constructor(text) {
                this.text = text;
            }
        },
        icon: (name) => name,
        languageLabel: (code) =>
            ({ pa: 'Punjabi', ur: 'Urdu', fr: 'French' })[code],
    });
    const source = fs
        .readFileSync(path.join(__dirname, '../src/phraseSpeech.js'), 'utf8')
        .replace(/^import[\s\S]*?;\r?\n/gm, '')
        .replace(/\bexport /g, '');
    vm.runInContext(
        source + '\nglobalThis.api = {phraseSpeechButton, recordingUrl};',
        context
    );
    return {
        spoken,
        audios,
        recordingUrl: context.api.recordingUrl,
        play(language, translation) {
            const status = { textContent: '' };
            const button = context.api.phraseSpeechButton(
                {
                    english: 'Thank you.',
                    translation,
                    categoryId: 'greetings',
                    phraseId: 'phrase_004',
                },
                language,
                status
            );
            button.handlers.click();
            status.button = button;
            return status;
        },
    };
}
const settle = () => new Promise((resolve) => setImmediate(resolve));

test('an online voice plays Urdu when the device has no Urdu voice', () => {
    const page = speechPage([
        { lang: 'hi-IN', localService: true },
        { lang: 'ur-PK', localService: false },
    ]);
    page.play('ur', 'شکریہ۔');
    assert.equal(page.spoken.length, 1);
    assert.equal(page.spoken[0].voice.lang, 'ur-PK');
    assert.equal(page.spoken[0].text, 'شکریہ۔');
});
test('an on-device voice is preferred over an online one', () => {
    const page = speechPage([
        { lang: 'pa-IN', localService: false, name: 'online' },
        { lang: 'pa_IN', localService: true, name: 'device' },
    ]);
    page.play('pa', 'ਧੰਨਵਾਦ।');
    assert.equal(page.spoken[0].voice.name, 'device');
});
test('a language with no voice at all explains why nothing plays', () => {
    const page = speechPage([{ lang: 'hi-IN', localService: true }]);
    const status = page.play('pa', 'ਧੰਨਵਾਦ।');
    assert.equal(page.spoken.length, 0);
    assert.equal(
        status.textContent,
        'No Punjabi voice is available in this browser.'
    );
});
test('every seeded phrase has text for every language the app offers', async () => {
    const { categories } = await import('../src/travelPhrasesData.js');
    for (const category of categories) {
        for (const phrase of category.phrases) {
            assert.equal('ar' in phrase.translations, false);
            for (const language of ['fr', 'pa', 'zh', 'ur', 'es']) {
                assert.ok(
                    phrase.translations[language],
                    `${category.id}/${phrase.id} is missing ${language}`
                );
            }
        }
    }
});
test('every phrase shown with two forms has a masculine version for audio', async () => {
    const { categories } = await import('../src/travelPhrasesData.js');
    let gendered = 0;
    for (const category of categories) {
        for (const phrase of category.phrases) {
            for (const [language, text] of Object.entries(phrase.translations)) {
                if (!/[/()]/.test(text)) continue;
                gendered++;
                const spoken = phrase.spoken?.[language];
                assert.ok(spoken, `${category.id}/${phrase.id} needs spoken.${language}`);
                assert.doesNotMatch(spoken, /[/()]/);
            }
        }
    }
    assert.equal(gendered, 13);
});
test('a recorded clip plays instead of the browser voice', async () => {
    const page = speechPage(
        [{ lang: 'ur-PK', localService: false }],
        new Set(['/audio/ur/greetings_phrase_004.mp3'])
    );
    const status = page.play('ur', 'شکریہ۔');
    await settle();
    assert.equal(page.audios[0].src, '/audio/ur/greetings_phrase_004.mp3');
    assert.equal(page.audios[0].paused, false);
    assert.equal(page.spoken.length, 0);
    assert.equal(status.textContent, 'Playing…');
});
test('a missing clip falls back to the browser voice exactly once', async () => {
    const page = speechPage([{ lang: 'ur-PK', localService: false }], new Set());
    page.play('ur', 'شکریہ۔');
    await settle();
    assert.equal(page.spoken.length, 1);
    assert.equal(page.spoken[0].text, 'شکریہ۔');
});
test('pressing stop pauses a recorded clip', async () => {
    const page = speechPage([], new Set(['/audio/zh/greetings_phrase_004.mp3']));
    const status = page.play('zh', '谢谢。');
    await settle();
    status.button.handlers.click();
    assert.equal(page.audios[0].paused, true);
    assert.equal(status.button.attributes['aria-pressed'], 'false');
    assert.equal(status.textContent, '');
});
test('the app looks for clips where the recording script saves them', async () => {
    const { clipPath } = await import('../scripts/generateAudio.js');
    const page = speechPage([]);
    assert.equal(
        page.recordingUrl({ categoryId: 'restaurants', phraseId: 'phrase_002' }, 'pa'),
        `/audio/${clipPath('pa', 'restaurants', 'phrase_002')}`
    );
});
