import { db } from './firebaseConfig.js';
import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

export const categoryNames = { accommodation:'Accommodation', restaurants:'Restaurants', greetings:'Greetings', emergency:'Emergency' };
export function savedKey(categoryId, phraseId) {
 if (!Object.hasOwn(categoryNames, categoryId) || typeof phraseId !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(phraseId)) throw new Error('Invalid phrase reference.');
 return `${categoryId}_${phraseId}`;
}
async function withTranslation(phrase, language) {
 if (language === 'en') return { ...phrase, translation:phrase.english, available:true };
 const translation = await getDoc(doc(db,'categories',phrase.categoryId,'phrases',phrase.phraseId,'translations',language));
 const text = translation.exists() ? translation.data().text : null;
 return { ...phrase, translation:typeof text === 'string' && text ? text : 'Translation unavailable for this language.', available:typeof text === 'string' && !!text };
}
export async function readCategory(categoryId, language) {
 if (!Object.hasOwn(categoryNames, categoryId)) throw new Error('Unknown category.');
 const snapshot = await getDocs(collection(db,'categories',categoryId,'phrases'));
 return Promise.all(snapshot.docs.map(phrase => withTranslation({ categoryId, phraseId:phrase.id, english:phrase.data().english || '' },language)));
}
export async function readSaved(user) {
 const snapshot = await getDocs(collection(db,'users',user.uid,'savedPhrases'));
 return snapshot.docs.map(item => ({ savedId:item.id, ...item.data() }));
}
export async function readSavedPhrase(reference, language) {
 try { savedKey(reference.categoryId, reference.phraseId); } catch { return null; }
 const snapshot = await getDoc(doc(db,'categories',reference.categoryId,'phrases',reference.phraseId));
 if (!snapshot.exists()) return { ...reference, english:'This phrase is no longer available.', translation:'', available:false, deleted:true };
 return withTranslation({ ...reference, english:snapshot.data().english || '' },language);
}
export async function setPhraseSaved(user, phrase, save) {
 if (!user?.uid) throw new Error('Please log in.');
 const reference = doc(db,'users',user.uid,'savedPhrases',savedKey(phrase.categoryId,phrase.phraseId));
 if (save) await setDoc(reference,{ categoryId:phrase.categoryId, phraseId:phrase.phraseId, createdAt:serverTimestamp() });
 else await deleteDoc(reference);
}
