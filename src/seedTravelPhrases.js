
import { db } from "./firebaseConfig.js";
import { categories } from "./travelPhrasesData.js";

import {
    doc,
    getDoc,
    setDoc
} from "firebase/firestore";

export async function seedTravelPhrases() {
    try {
        for (const category of categories) {

            // Category document
            const categoryRef = doc(db, "categories", category.id);
            const categorySnap = await getDoc(categoryRef);

            if (!categorySnap.exists() ||
                categorySnap.data().name !== category.name) {

                await setDoc(categoryRef, {
                    name: category.name
                }, { merge: true });
            }

            // Phrase documents
            for (const phrase of category.phrases) {

                const phraseRef = doc(
                    db,
                    "categories",
                    category.id,
                    "phrases",
                    phrase.id
                );

                const phraseSnap = await getDoc(phraseRef);
                const english = phrase.translations.english;

                // Create or update only when needed
                if (!phraseSnap.exists() ||
                    phraseSnap.data().english !== english) {

                    await setDoc(phraseRef, {
                        english: english
                    }, { merge: true });
                }

                // Translation documents
                for (const [language, text]
                    of Object.entries(phrase.translations)) {

                    if (language === "english") {
                        continue;
                    }

                    const translationRef = doc(
                        db,
                        "categories",
                        category.id,
                        "phrases",
                        phrase.id,
                        "translations",
                        language
                    );

                    const translationSnap = await getDoc(translationRef);

                    // Create or update only when needed
                    if (!translationSnap.exists() ||
                        translationSnap.data().text !== text) {

                        await setDoc(translationRef, {
                            text: text
                        }, { merge: true });
                    }
                }
            }
        }

        console.log("Travel phrases synchronized with Firestore!");

    } catch (error) {
        console.error("Error syncing travel phrases:", error);
    }
}
