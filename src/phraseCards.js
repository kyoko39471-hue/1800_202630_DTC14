import { icon, setStatus } from './layout.js';
import { setPhraseSaved } from './phraseStore.js';
import { phraseSpeechButton, stopPhraseSpeech } from './phraseSpeech.js';

function textElement(tag, className, text) {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = text;
    return element;
}
export function phraseCard(phrase, language, user, saved, onRemove) {
    const card = document.createElement('article');
    card.className = 'phrase-card';
    const english = document.createElement('div');
    english.append(textElement('p', 'phrase-english', phrase.english));
    const translation = document.createElement('div');
    const translated = textElement(
        'p',
        'phrase-translation',
        phrase.translation
    );
    translated.lang = language;
    translated.dir = language === 'ur' ? 'rtl' : 'auto';
    translation.append(translated);
    const actions = document.createElement('div');
    actions.className = 'phrase-actions';
    const save = document.createElement('button');
    save.type = 'button';
    save.className = 'action phrase-icon-button save-phrase';
    const audioStatus = textElement('p', 'phrase-audio-status', '');
    audioStatus.setAttribute('role', 'status');
    const listen = phrase.available && phrase.translation
        ? phraseSpeechButton(phrase, language, audioStatus)
        : null;
    function updateSave() {
        save.innerHTML = icon(saved ? 'bookmark-check' : 'bookmark');
        save.setAttribute('aria-pressed', String(saved));
        save.setAttribute(
            'aria-label',
            `${saved ? 'Unsave phrase' : 'Save phrase'}: ${phrase.english}`
        );
    }
    updateSave();
    save.addEventListener('click', async () => {
        save.disabled = true;
        try {
            await setPhraseSaved(user, phrase, !saved);
            saved = !saved;
            updateSave();
            setStatus('');
            if (!saved && onRemove) {
                if (listen) stopPhraseSpeech(listen);
                onRemove(card);
            }
        } catch {
            setStatus('Couldn’t save your change. Please try again.', true);
        } finally {
            save.disabled = false;
        }
    });
    if (listen) actions.append(listen);
    actions.append(save);
    const copy = document.createElement('div');
    copy.className = 'phrase-copy';
    copy.append(english);
    if (language !== 'en' && phrase.translation) copy.append(translation);
    if (phrase.pronunciation && phrase.available) {
        copy.append(textElement('p', 'phrase-pronunciation', `Pronunciation · ${phrase.pronunciation}`));
    }
    if (listen) copy.append(audioStatus);
    card.append(copy, actions);
    return card;
}
