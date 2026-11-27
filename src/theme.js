const storageKey = 'communication-help-theme';

export function getTheme() {
    return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function setTheme(theme, remember = true) {
    const selected = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = selected;
    document.documentElement.style.colorScheme = selected;
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
        const label = `Switch to ${selected === 'dark' ? 'light' : 'dark'} mode`;
        button.setAttribute('aria-label', label);
        button.setAttribute('aria-pressed', String(selected === 'dark'));
        button.title = label;
    });
    if (remember) {
        try {
            window.localStorage.setItem(storageKey, selected);
        } catch {
            // The toggle still works when browser storage is unavailable.
        }
    }
}

export function toggleTheme() {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
}

export function initTheme() {
    let saved = 'light';
    try {
        saved = window.localStorage.getItem(storageKey);
    } catch {
        // Start in light mode if browser storage is unavailable.
    }
    setTheme(saved, false);
}

initTheme();
window.addEventListener('storage', (event) => {
    if (event.key === storageKey) setTheme(event.newValue, false);
});
