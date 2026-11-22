import { db } from './firebaseConfig.js';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'fr', label: 'French', native: 'Français' },
    { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'zh', label: 'Mandarin', native: '中文普通话' },
    { code: 'ur', label: 'Urdu', native: 'اردو' },
    { code: 'es', label: 'Spanish', native: 'Español' },
];

export function languageLabel(code) {
    return (
        languages.find((language) => language.code === code)?.label || 'English'
    );
}

export async function getUserProfile(user) {
    const snapshot = await getDoc(doc(db, 'users', user.uid));
    return snapshot.exists() ? snapshot.data() : null;
}

// The Auth UID gives each account one profile. Merge preserves teammates' fields.
export async function saveUserProfile(user, { name, preferredLanguage } = {}) {
    if (
        preferredLanguage !== undefined &&
        !languages.some((language) => language.code === preferredLanguage)
    ) {
        throw new Error('Choose one of the available languages.');
    }
    const reference = doc(db, 'users', user.uid);
    const snapshot = await getDoc(reference);
    const existing = snapshot.exists() ? snapshot.data() : {};
    const profile = {
        uid: user.uid,
        email: user.email,
        updatedAt: serverTimestamp(),
    };
    // A settings change should not overwrite a different field saved in another tab.
    if (name !== undefined || existing.name == null) {
        profile.name = name ?? user.displayName ?? '';
    }
    if (preferredLanguage !== undefined || existing.preferredLanguage == null) {
        profile.preferredLanguage = preferredLanguage ?? 'en';
    }
    if (!snapshot.exists()) {
        profile.createdAt = serverTimestamp();
        profile.savedPhrases = [];
    }

    await setDoc(reference, profile, { merge: true });
    return { ...existing, ...profile };
}
