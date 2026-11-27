import '../styles/style.css';
import { initTheme, toggleTheme } from './theme.js';

const paths = {
    bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
    'bookmark-check':
        '<path d="M6 3h12v18l-6-4-6 4z"/><path d="m9 9 2 2 4-4"/>',
    moon: '<path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/>',
    home: '<path d="m3 10 9-7 9 7v11h-7v-7h-4v7H3z"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
    back: '<path d="m10 5-7 7 7 7M3 12h18"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
    speaker: '<path d="M11 5 6 9H3v6h3l5 4zM15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    languages:
        '<path d="M3 5h11M8 3v2M5 5c1 6 5 9 9 10M12 5c-1 6-5 9-9 10M14 21l4-10 4 10M16 17h4"/>',
    chevron: '<path d="m9 5 7 7-7 7"/>',
};
export function icon(name, filled = false) {
    return `<svg class="icon" viewBox="0 0 24 24" fill="${name === 'heart' && filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.heart}</svg>`;
}
export function mountLayout(active) {
    const header = document.querySelector('[data-app-header]');
    // Signed-out pages have no destination language. Signed-in pages reveal it once loaded.
    const languageLine = active
        ? `<p class="header-language" hidden>${icon('languages')}<span id="headerLanguageLabel"></span></p>`
        : '';
    if (header)
        header.innerHTML = `<div class="header-copy"><a class="brand" href="${active ? 'main.html' : 'index.html'}">Communication Help</a>${languageLine}</div><button class="action theme-toggle" type="button" data-theme-toggle aria-label="Switch to dark mode" aria-pressed="false"><span class="theme-moon">${icon('moon')}</span><span class="theme-sun">${icon('sun')}</span></button>`;
    const nav = document.querySelector('[data-app-nav]');
    if (nav)
        nav.innerHTML = [
            ['home', 'Home', 'main.html'],
            ['bookmark', 'Saved', 'savedphrases.html'],
            ['user', 'Profile', 'profile.html'],
        ]
            .map(
                ([key, label, url]) =>
                    `<a href="${url}"${active === key ? ' aria-current="page"' : ''}>${icon(key)}<span>${label}</span></a>`
            )
            .join('');
    document
        .querySelectorAll('[data-icon]')
        .forEach((element) => (element.innerHTML = icon(element.dataset.icon)));
    const back = document.querySelector('[data-app-back]');
    if (back && document.referrer && history.length > 1) {
        const previous = new URL(document.referrer);
        const appPages = [
            'main.html',
            'eachCategory.html',
            'savedphrases.html',
            'profile.html',
        ];
        const fromApp = appPages.some(
            (page) => new URL(page, location.href).pathname === previous.pathname
        );
        if (
            fromApp &&
            previous.origin === location.origin &&
            previous.href !== location.href
        ) {
            back.addEventListener('click', (event) => {
                if (
                    event.button || event.metaKey || event.ctrlKey ||
                    event.shiftKey || event.altKey
                ) return;
                event.preventDefault();
                history.back();
            });
        }
    }
    initTheme();
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
        button.addEventListener('click', toggleTheme);
    });
}
export function setHeaderLanguage(label) {
    const element = document.getElementById('headerLanguageLabel');
    if (!element) return;
    // Phrases start in English, so an English destination has nothing to announce.
    const translating = Boolean(label) && label !== 'English';
    element.textContent = translating ? `Translating from English to ${label}` : '';
    element.closest('.header-language').hidden = !translating;
}
export function setStatus(message, error = false) {
    const element = document.getElementById('pageStatus');
    if (!element) return;
    element.textContent = message;
    element.classList.toggle('page-error', error);
}
