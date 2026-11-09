import { icon, setStatus } from './layout.js';
import { languageLabel } from './userProfiles.js';
import { setPhraseSaved } from './phraseStore.js';

function textElement(tag, className, text) {
 const element = document.createElement(tag);
 element.className = className;
 element.textContent = text;
 return element;
}
export function phraseCard(phrase, language, user, saved, onRemove) {
 const card = document.createElement('article'); card.className = 'phrase-card';
 const english = document.createElement('div');
 english.append(textElement('span','field-label','English'),textElement('p','phrase-english',phrase.english));
 const translation = document.createElement('div');
 translation.append(textElement('span','field-label',languageLabel(language)));
 const translated = textElement('p','',phrase.translation);
 translated.lang = language; translated.dir = language === 'ur' ? 'rtl' : 'auto'; translation.append(translated);
 const actions = document.createElement('div'); actions.className = 'actions';
 const save = document.createElement('button'); save.type='button'; save.className='action';
 function updateSave() { save.innerHTML=icon('heart',saved); save.setAttribute('aria-pressed',String(saved)); save.setAttribute('aria-label',`${saved?'Unlike phrase':'Like phrase'}: ${phrase.english}`); }
 updateSave();
 save.addEventListener('click', async () => {
   save.disabled=true;
   try {
     await setPhraseSaved(user,phrase,!saved);
     saved=!saved; updateSave(); setStatus('');
     if (!saved && onRemove) onRemove(card);
   } catch { setStatus('Couldn’t save your change. Please try again.',true); }
   finally { save.disabled=false; }
 });
 actions.append(save);
 card.append(english,translation,actions);
 return card;
}
