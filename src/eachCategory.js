import { mountLayout, setStatus } from './layout.js';
import { startSignedIn } from './session.js';
import {
    categoryNames,
    readCategory,
    readSaved,
    savedKey,
} from './phraseStore.js';
import { phraseCard } from './phraseCards.js';
import { stopPhraseSpeech } from './phraseSpeech.js';

mountLayout('home');
const category = new URLSearchParams(location.search).get('category');
const title = document.getElementById('category-title');
const searchField = document.getElementById('phraseSearch');
const search = document.getElementById('searchPhrases');
search.value = history.state?.phraseSearch ?? '';
const results = document.getElementById('phraseResults');
const list = document.getElementById('phrases-go-here');
let cards = [];

function normalize(text) {
    return text
        .normalize('NFKD')
        .replace(/(\p{Script=Latin})\p{Mark}+/gu, '$1')
        .toLowerCase()
        .trim();
}

function filterPhrases() {
    const query = normalize(search.value);
    let matches = 0;
    for (const { card, terms } of cards) {
        card.hidden = !terms.some((term) => term.includes(query));
        if (!card.hidden) matches++;
    }
    results.textContent = matches
        ? `${matches} ${matches === 1 ? 'phrase' : 'phrases'}`
        : 'No matching phrases.';
}

search.addEventListener('input', () => {
    history.replaceState({ ...history.state, phraseSearch: search.value }, '');
    stopPhraseSpeech();
    filterPhrases();
});
const validCategory = Object.hasOwn(categoryNames, category);
title.textContent = validCategory ? categoryNames[category] : 'Category not found';
document.title = `${title.textContent} | Communication Help`;
startSignedIn(async (user, profile, isCurrent) => {
    if (!validCategory) {
        setStatus('Choose a category from Home.');
        return;
    }
    const language = profile.preferredLanguage || 'en';
    const [phrases, saved] = await Promise.all([
        readCategory(category, language),
        readSaved(user),
    ]);
    if (!isCurrent()) return;
    const savedIds = new Set(saved.map((p) => p.savedId));
    stopPhraseSpeech();
    cards = phrases.map((phrase) => ({
        card: phraseCard(
            phrase,
            language,
            user,
            savedIds.has(savedKey(phrase.categoryId, phrase.phraseId))
        ),
        terms: [
            phrase.english,
            ...(phrase.available ? [phrase.translation] : []),
            ...(phrase.pronunciation ? [phrase.pronunciation] : []),
        ].map(normalize),
    }));
    list.replaceChildren(...cards.map(({ card }) => card));
    searchField.hidden = cards.length === 0;
    filterPhrases();
    setStatus(phrases.length ? '' : 'No phrases available in this category.');
});
