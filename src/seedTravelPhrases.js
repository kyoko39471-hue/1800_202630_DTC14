import { db } from "./firebaseConfig.js";
import { categories } from "./travelPhrasesData.js";

import {
    doc,
    getDoc,
    setDoc
} from "firebase/firestore";

export async function seedTravelPhrases() {

    try {
        // Loop through each category
        for (const category of categories) {

            // Reference to a category document
            const categoryRef = doc(
                db,
                "categories",
                category.id
            );

            // Create category if it does not exist
            const categorySnap = await getDoc(categoryRef);

            if (!categorySnap.exists()) {
                await setDoc(categoryRef, {
                    name: category.name
                });
            }

            // Loop through phrases in this category
            for (const phrase of category.phrases) {

                const phraseRef = doc(
                    db,
                    "categories",
                    category.id,
                    "phrases",
                    phrase.id
                );

                const phraseSnap = await getDoc(phraseRef);

                // Create phrase if it does not exist
                if (!phraseSnap.exists()) {
                    await setDoc(phraseRef, {
                        english: phrase.translations.english
                    });
                }

                // Loop through translations
                for (const [language, text]
                    of Object.entries(phrase.translations)) {

                    // English is stored in the phrase document
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

                    const translationSnap =
                        await getDoc(translationRef);

                    // Create translation if it does not exist
                    if (!translationSnap.exists()) {
                        await setDoc(translationRef, {
                            text: text
                        });
                    }
                }
            }
        }

        console.log("Travel phrases seeding completed!");

    } catch (error) {
        console.error("Error seeding travel phrases:", error);
    }
}