import { mountLayout, setStatus } from './layout.js';
import { startSignedIn } from './session.js';
import { languageLabel } from './userProfiles.js';
import { readSaved, readSavedPhrase } from './phraseStore.js';
import { phraseCard } from './phraseCards.js';

mountLayout('bookmark');
startSignedIn(async (user,profile,isCurrent) => {
 const language=profile.preferredLanguage || 'en';
 const references=await readSaved(user);
 const phrases=(await Promise.all(references.map(p=>readSavedPhrase(p,language)))).filter(Boolean);
 if (!isCurrent()) return;
 const container=document.getElementById('phrases-go-here');
 function updateEmpty() {
   const count=container.children.length;
   document.getElementById('emptyState').hidden=count>0;
   document.getElementById('languageLabel').textContent=count?`${count} saved · English → ${languageLabel(language)}`:'Keep useful phrases close at hand.';
 }
 container.replaceChildren(...phrases.map(p=>phraseCard(p,language,user,true,card=>{card.remove();updateEmpty();})));
 updateEmpty(); setStatus('');
});
