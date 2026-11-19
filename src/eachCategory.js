
import { mountLayout, setStatus } from './layout.js';
import { startSignedIn } from './session.js';
import { languageLabel } from './userProfiles.js';

import {
    categoryNames,
    readCategory,
    readSaved,
    savedKey
} from './phraseStore.js';

import { phraseCard } from './phraseCards.js';

// Firebase
import { db } from './firebaseConfig.js';
import {
    collection,
    addDoc,
    getDocs
} from 'firebase/firestore';

mountLayout('home');

// Get the category from the URL
const category = new URLSearchParams(location.search).get('category');
const title = document.getElementById('category-title');

// Add Phrase form elements
const addButton = document.getElementById('addPhraseButton');
const addForm = document.getElementById('addPhraseForm');
const cancelButton = document.getElementById('cancelButton');
const formMessage = document.getElementById('formMessage');

let currentUser = null;
let currentLanguage = 'en';

// Display a user-created phrase
function showCustomPhrase(phrase) {

    const card = document.createElement('article');
    card.className = 'phrase-card';
    card.style.gridTemplateColumns = '1fr';

    const content = document.createElement('div');
    content.className = 'phrase-copy';

    const english = document.createElement('p');
    english.className = 'phrase-english';
    english.textContent = phrase.english;

    const translation = document.createElement('p');
    translation.className = 'phrase-translation';
    translation.textContent = phrase.translation;
    translation.lang = phrase.language;
    translation.dir = phrase.language === 'ur' ? 'rtl' : 'auto';

    const label = document.createElement('small');
    label.className = 'muted';
    label.textContent = 'Your phrase';

    content.append(english, translation, label);
    card.append(content);

    document.getElementById('phrases-go-here').prepend(card);
}

// Load category phrases
if (!Object.hasOwn(categoryNames, category)) {

    title.textContent = 'Category not found';
    addButton.hidden = true;
    setStatus('Choose a category from Home.');

} else {

    title.textContent = categoryNames[category];
    document.title = `${categoryNames[category]} | Communication Help`;

    startSignedIn(async (user, profile, isCurrent) => {

        const language = profile.preferredLanguage || 'en';

        document.getElementById('languageLabel').textContent =
            `English → ${languageLabel(language)}`;

        // Get normal phrases, bookmarks and custom phrases
        const [phrases, saved, customSnapshot] = await Promise.all([
            readCategory(category, language),
            readSaved(user),
            getDocs(collection(db, 'users', user.uid, 'customPhrases'))
        ]);

        if (!isCurrent()) return;

        currentUser = user;
        currentLanguage = language;

        // Show normal phrases
        const savedIds = new Set(saved.map(p => p.savedId));

        document.getElementById('phrases-go-here').replaceChildren(
            ...phrases.map(p =>
                phraseCard(
                    p,
                    language,
                    user,
                    savedIds.has(savedKey(p.categoryId, p.phraseId))
                )
            )
        );

        // Show this user's custom phrases
        let customCount = 0;

        customSnapshot.forEach(item => {

            const phrase = item.data();

            if (
                phrase.categoryId === category &&
                phrase.language === language
            ) {
                showCustomPhrase(phrase);
                customCount++;
            }
        });

        setStatus(
            phrases.length || customCount
                ? ''
                : 'No phrases available in this category.'
        );
    });
}

// Open the form
addButton.addEventListener('click', function () {

    addForm.hidden = false;
    addButton.hidden = true;
});

// Cancel the form
cancelButton.addEventListener('click', function () {

    addForm.reset();
    formMessage.textContent = '';

    addForm.hidden = true;
    addButton.hidden = false;
});

// Save a new phrase to Firestore
addForm.addEventListener('submit', async function (event) {

    event.preventDefault();

    if (!currentUser) {
        formMessage.textContent = 'Please log in first.';
        return;
    }

    const english = document.getElementById('englishInput').value.trim();
    const translation = document.getElementById('translationInput').value.trim();

    if (!english || !translation) {
        formMessage.textContent = 'Please fill in both fields.';
        return;
    }

    const saveButton = addForm.querySelector('button[type="submit"]');
    saveButton.disabled = true;

    formMessage.textContent = 'Saving...';

    try {

        // Save under the logged-in user's account
        await addDoc(
            collection(db, 'users', currentUser.uid, 'customPhrases'),
            {
                categoryId: category,
                english: english,
                translation: translation,
                language: currentLanguage
            }
        );

        // Show the phrase on the page
        showCustomPhrase({
            english: english,
            translation: translation,
            language: currentLanguage
        });

        // Clear and close the form
        addForm.reset();
        addForm.hidden = true;
        addButton.hidden = false;
        formMessage.textContent = '';

        setStatus('Your phrase was saved to Firestore!');

    } catch (error) {

        console.error(error);

        formMessage.textContent =
            error.code === 'permission-denied'
                ? 'Your account cannot save phrases. Check Firestore rules.'
                : 'Could not save phrase. Please try again.';

    } finally {

        saveButton.disabled = false;
    }
});
