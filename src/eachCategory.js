
import { db } from "/src/firebaseConfig.js";

import {
    collection,
    doc,
    getDocs,
    getDoc
} from "firebase/firestore";

// Category names
const categoryNames = {
    accommodation: "Accommodation",
    restaurants: "Restaurants",
    greetings: "Greetings",
    emergency: "Emergency"
};

// Read the category from the URL
const params = new URLSearchParams(window.location.search);
const category = params.get("category");

// Get HTML elements
const title = document.getElementById("category-title");
const container = document.getElementById("phrases-go-here");
const template = document.getElementById("phraseCardTemplate");

// Temporary language setup for Sprint 03
const language = "fr";

async function displayPhrases() {
    try {
        const phrasesRef = collection(
            db,
            "categories",
            category,
            "phrases"
        );

        const querySnapshot = await getDocs(phrasesRef);

        for (const phraseDoc of querySnapshot.docs) {
            const english = phraseDoc.data().english;

            const translationRef = doc(
                db,
                "categories",
                category,
                "phrases",
                phraseDoc.id,
                "translations",
                language
            );

            const translationSnap = await getDoc(translationRef);

            const translation = translationSnap.exists()
                ? translationSnap.data().text
                : "Translation unavailable";

            // HTML
            const card = template.content.cloneNode(true);

            // Firestore
            card.querySelector(".phrase-english").textContent = english;
            card.querySelector(".phrase-translation").textContent = translation;

            // Card to the page
            container.appendChild(card);
        }

    } catch (error) {
        console.error("Error retrieving phrases:", error);
    }
}

if (!Object.hasOwn(categoryNames, category)) {
    title.textContent = "Category not found";
} else {
    const categoryName = categoryNames[category];

    title.textContent = categoryName;
    document.title = `${categoryName} | Communication Help`;

    displayPhrases();
}
