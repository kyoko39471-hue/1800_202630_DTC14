
import { auth, db } from "./firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import {
    doc,
    getDoc,
    setDoc,
    deleteDoc
} from "firebase/firestore";

// Connect a favorite button to Firebase
export function setupFavouriteButton(button) {

    // Load the user's favorite when login is ready
    onAuthStateChanged(auth, async function (user) {
        button.disabled = true;
        button.textContent = "♡";
        button.setAttribute("aria-pressed", "false");

        if (!user) {
            button.disabled = false;
            return;
        }

        const phraseRef = doc(
            db, "users", user.uid,
            "favoritePhrases", button.dataset.id
        );

        try {
            const saved = await getDoc(phraseRef);

            if (auth.currentUser?.uid !== user.uid) {
                return;
            }

            if (saved.exists()) {
                button.textContent = "♥";
                button.setAttribute("aria-pressed", "true");
            }

        } catch (error) {
            console.error("Error loading favorite:", error);

        } finally {
            if (auth.currentUser?.uid === user.uid) {
                button.disabled = false;
            }
        }
    });

    // Save or remove the favorite
    button.addEventListener("click", async function () {

        const user = auth.currentUser;

        if (!user) {
            alert("Please log in first.");
            return;
        }

        const phraseRef = doc(
            db, "users", user.uid,
            "favoritePhrases", button.dataset.id
        );

        const isFavorite =
            button.getAttribute("aria-pressed") === "true";

        button.disabled = true;

        try {
            if (isFavorite) {
                await deleteDoc(phraseRef);
                button.textContent = "♡";
                button.setAttribute("aria-pressed", "false");
            } else {
                await setDoc(phraseRef, {
                    text: button.dataset.phrase
                });
                button.textContent = "♥";
                button.setAttribute("aria-pressed", "true");
            }

        } catch (error) {
            console.error("Error saving favorite:", error);
            alert("Could not save favorite.");

        } finally {
            button.disabled = false;
        }
    });
}

