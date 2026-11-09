
// Import Firebase
import { auth, db } from "./firebaseConfig.js";

import { onAuthStateChanged } from "firebase/auth";

import {
    collection,
    getDocs,
    doc,
    deleteDoc
} from "firebase/firestore";

// Get HTML elements
const phraseList = document.getElementById("phraseList");
const statusMessage = document.getElementById("statusMessage");

// Check the logged-in user
onAuthStateChanged(auth, async function (user) {

    // Clear the old list
    phraseList.innerHTML = "";

    if (!user) {
        statusMessage.textContent =
            "Please log in to see your saved phrases.";
        return;
    }

    statusMessage.textContent = "Loading saved phrases...";

    try {
        // Get favorites for the logged-in user
        const favoritesRef = collection(
            db,
            "users",
            user.uid,
            "favoritePhrases"
        );

        const snapshot = await getDocs(favoritesRef);

        // Make sure the same user is still logged in
        if (auth.currentUser?.uid !== user.uid) {
            return;
        }

        // Check if there are no favorites
        if (snapshot.empty) {
            statusMessage.textContent =
                "You have no saved phrases yet.";
            return;
        }

        statusMessage.textContent = "";

        // Display each saved phrase
        snapshot.forEach(function (phraseDoc) {

            const phrase = phraseDoc.data().text;

            const item = document.createElement("li");
            item.className = "saved-item";

            const phraseText = document.createElement("span");
            phraseText.textContent = phrase || "Untitled phrase";

            // Remove button
            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.className = "remove-btn";
            removeButton.type = "button";

            // Remove favorite when clicked
            removeButton.addEventListener("click", async function () {

                if (auth.currentUser?.uid !== user.uid) {
                    return;
                }

                removeButton.disabled = true;

                try {
                    await deleteDoc(
                        doc(
                            db,
                            "users",
                            user.uid,
                            "favoritePhrases",
                            phraseDoc.id
                        )
                    );

                    item.remove();

                    if (phraseList.children.length === 0) {
                        statusMessage.textContent =
                            "You have no saved phrases yet.";
                    }

                } catch (error) {
                    console.error("Error removing phrase:", error);
                    alert("Could not remove phrase.");
                    removeButton.disabled = false;
                }
            });

            item.appendChild(phraseText);
            item.appendChild(removeButton);
            phraseList.appendChild(item);
        });

    } catch (error) {
        console.error("Error loading saved phrases:", error);

        statusMessage.textContent =
            "Could not load saved phrases.";
    }
});
