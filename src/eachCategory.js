
const categoryNames = {
    accommodation: "Accommodation",
    restaurants: "Restaurants",
    greetings: "Greetings",
    emergency: "Emergency"
};

// Read the category from the URL.
const params = new URLSearchParams(window.location.search);
const category = params.get("category");

// Get HTML elements.
const title = document.getElementById("category-title");
const message = document.getElementById("category-message");
const container = document.getElementById("phrases-go-here");
const template = document.getElementById("phraseCardTemplate");

if (!Object.hasOwn(categoryNames, category)) {
    title.textContent = "Category not found";
    message.textContent = "Please go back and select a category.";
} else {
    const categoryName = categoryNames[category];

    title.textContent = categoryName;
    document.title = `${categoryName} | Communication Help`;

    // UI preview only. Firestore will be connected later.
    for (let i = 0; i < 4; i++) {
        const card = template.content.cloneNode(true);

        card.querySelector(".phrase-english").textContent = "Phrase";
        card.querySelector(".phrase-translation").textContent = "Translation";

        container.appendChild(card);
    }

    message.textContent =
        "Layout preview — phrases will be loaded from Firestore.";
}
