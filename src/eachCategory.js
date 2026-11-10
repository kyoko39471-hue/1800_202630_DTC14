import { mountLayout, setStatus } from './layout.js';
import { startSignedIn } from './session.js';
import { languageLabel } from './userProfiles.js';
import { categoryNames, readCategory, readSaved, savedKey } from './phraseStore.js';
import { phraseCard } from './phraseCards.js';

mountLayout('home');
const category = new URLSearchParams(location.search).get('category');
const title=document.getElementById('category-title');
if (!Object.hasOwn(categoryNames,category)) {
 title.textContent='Category not found'; setStatus('Choose a category from Home.');
} else {
 title.textContent=categoryNames[category]; document.title=`${categoryNames[category]} | Communication Help`;
 startSignedIn(async (user,profile,isCurrent) => {
   const language=profile.preferredLanguage || 'en';
   document.getElementById('languageLabel').textContent=`English → ${languageLabel(language)}`;
   const [phrases,saved]=await Promise.all([readCategory(category,language),readSaved(user)]);
   if (!isCurrent()) return;
   const savedIds=new Set(saved.map(p=>p.savedId));
   document.getElementById('phrases-go-here').replaceChildren(...phrases.map(p=>phraseCard(p,language,user,savedIds.has(savedKey(p.categoryId,p.phraseId)))));
   setStatus(phrases.length?'':'No phrases available in this category.');
 });
}
