import { icon, setStatus } from './layout.js';
import { setPhraseSaved } from './phraseStore.js';

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
    save.className = 'action save-phrase';
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
            if (!saved && onRemove) onRemove(card);
        } catch {
            setStatus('Couldn’t save your change. Please try again.', true);
        } finally {
            save.disabled = false;
        }
    });
    actions.append(save);
    const copy = document.createElement('div');
    copy.className = 'phrase-copy';
    copy.append(english, translation);
    card.append(copy, actions);
    return card;
}
