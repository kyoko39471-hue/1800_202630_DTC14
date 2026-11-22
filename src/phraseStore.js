import { db } from './firebaseConfig.js';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc,
    arrayUnion,
    arrayRemove,
} from 'firebase/firestore';

export const categoryNames = {
    accommodation: 'Accommodation',
    restaurants: 'Restaurants',
    greetings: 'Greetings',
    emergency: 'Emergency',
};
export function savedKey(categoryId, phraseId) {
    if (
        !Object.hasOwn(categoryNames, categoryId) ||
        typeof phraseId !== 'string' ||
        !/^[a-zA-Z0-9_-]+$/.test(phraseId)
    )
        throw new Error('Invalid phrase reference.');
    return `${categoryId}_${phraseId}`;
}
async function withTranslation(phrase, language) {
    if (language === 'en')
        return { ...phrase, translation: phrase.english, available: true };
    const translation = await getDoc(
        doc(
            db,
            'categories',
            phrase.categoryId,
            'phrases',
            phrase.phraseId,
            'translations',
            language
        )
    );
    const data = translation.exists() ? translation.data() : {};
    const { text, pronunciation } = data;
    return {
        ...phrase,
        translation:
            typeof text === 'string' && text
                ? text
                : 'Translation unavailable for this language.',
        available: typeof text === 'string' && !!text,
        pronunciation: typeof pronunciation === 'string' ? pronunciation : '',
    };
}
export async function readCategory(categoryId, language) {
    if (!Object.hasOwn(categoryNames, categoryId))
        throw new Error('Unknown category.');
    const snapshot = await getDocs(
        collection(db, 'categories', categoryId, 'phrases')
    );
    return Promise.all(
        snapshot.docs.map((phrase) =>
            withTranslation(
                {
                    categoryId,
                    phraseId: phrase.id,
                    english: phrase.data().english || '',
                },
                language
            )
        )
    );
}
export async function readSaved(user) {
    const snapshot = await getDoc(
        doc(db, 'users', user.uid)
    );

    if (!snapshot.exists()) return [];

    const saved = snapshot.data().savedPhrases ?? [];

    if (!Array.isArray(saved)) {
        throw new Error('Invalid saved phrases data.');
    }

    return saved.flatMap((savedId) => {
        const categoryId = Object.keys(categoryNames).find(
            (category) =>
                typeof savedId === 'string' &&
                savedId.startsWith(`${category}_`)
        );

        if (!categoryId) return [];

        const phraseId = savedId.slice(categoryId.length + 1);

        try {
            savedKey(categoryId, phraseId);
        } catch {
            return [];
        }

        return [{ savedId, categoryId, phraseId }];
    });
}

export async function readSavedPhrase(reference, language) {
    try {
        savedKey(reference.categoryId, reference.phraseId);
    } catch {
        return null;
    }
    const snapshot = await getDoc(
        doc(
            db,
            'categories',
            reference.categoryId,
            'phrases',
            reference.phraseId
        )
    );
    if (!snapshot.exists())
        return {
            ...reference,
            english: 'This phrase is no longer available.',
            translation: '',
            available: false,
            deleted: true,
        };
    return withTranslation(
        { ...reference, english: snapshot.data().english || '' },
        language
    );
}
export async function setPhraseSaved(user, phrase, save) {
    if (!user?.uid) {
        throw new Error('Please log in.');
    }

    const reference = doc(db, 'users', user.uid);

    const key = savedKey(
        phrase.categoryId,
        phrase.phraseId
    );

    await updateDoc(reference, {
        savedPhrases: save
            ? arrayUnion(key)
            : arrayRemove(key)
    });
}
