import { setupFavouriteButton } from "./favourite.js";
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

        if (querySnapshot.empty) {
            container.innerHTML = "<p class='empty-state'>No phrases available for this category yet.</p>";
            return;
        }

        const cards = await Promise.all(querySnapshot.docs.map(async (phraseDoc) => {
            const english = phraseDoc.data().english ?? "Phrase";

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

            const card = template.content.cloneNode(true);
            card.querySelector(".phrase-english").textContent = english;
            card.querySelector(".phrase-translation").textContent = translation;

            const button = card.querySelector(".favorite-btn");
            button.dataset.id = `${category}_${phraseDoc.id}`;
            button.dataset.phrase = english;

            return card;
        }));

        container.innerHTML = "";

        for (const card of cards) {
            const button = card.querySelector(".favorite-btn");
            container.appendChild(card);
            setupFavouriteButton(button);
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
