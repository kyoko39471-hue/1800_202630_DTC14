import { db } from './firebaseConfig.js';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'fr', label: 'French', native: 'Français' },
    { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'zh', label: 'Mandarin', native: '中文' },
    { code: 'ur', label: 'Urdu', native: 'اردو' },
    { code: 'es', label: 'Spanish', native: 'Español' },
];

export function languageLabel(code) {
    return languages.find(language => language.code === code)?.label || 'English';
}

export async function getUserProfile(user) {
    const snapshot = await getDoc(doc(db, 'users', user.uid));
    return snapshot.exists() ? snapshot.data() : null;
}

// The Auth UID gives each account one profile. Merge preserves teammates' fields.
export async function saveUserProfile(user, { name, preferredLanguage } = {}) {
    if (preferredLanguage !== undefined && !languages.some(language => language.code === preferredLanguage)) {
        throw new Error('Choose one of the available languages.');
    }
    const reference = doc(db, 'users', user.uid);
    const snapshot = await getDoc(reference);
    const existing = snapshot.exists() ? snapshot.data() : {};
    const savedLanguage = preferredLanguage ?? existing.preferredLanguage ?? 'en';
    const profile = {
        uid: user.uid,
        name: name ?? existing.name ?? user.displayName ?? '',
        email: user.email,
        preferredLanguage: savedLanguage,
        updatedAt: serverTimestamp(),
    };
    if (!snapshot.exists()) profile.createdAt = serverTimestamp();
    await setDoc(reference, profile, { merge: true });
    return { ...existing, ...profile };
}
