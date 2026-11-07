
import { onAuthReady } from "/src/authentication.js";
import { logoutUser } from "/src/authentication.js";

// Display the logged-in user's first name.
function showName() {
    onAuthReady(function (user) {
        if (user) {
            const fullName = user.displayName || user.email || "friend";
            const firstName = fullName.split(" ")[0];

            document.getElementById("name-goes-here").textContent = firstName;
        } else {
            window.location.href = "index.html";
        }
    });
}

// Set up links for the four category cards.
function setupCategoryLinks() {
    const categoryLinks = {
        accommodation: "accommodation",
        restaurants: "restaurants",
        greetings: "greetings",
        emergency: "emergency"
    };

    document.querySelectorAll(".category-card").forEach(function (card) {
        const heading = card.querySelector("h2");

        if (!heading) {
            return;
        }

        const category = heading.textContent.trim().toLowerCase();

        if (categoryLinks[category]) {
            card.href = `eachCategory.html?category=${category}`;
        }
    });
}

document.getElementById("logoutBtn")
    .addEventListener("click", async function () {
        try {
            await logoutUser();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    });

// Run the functions.
showName();
setupCategoryLinks();
