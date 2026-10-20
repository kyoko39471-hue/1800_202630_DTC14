import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/style.css';

const icons = {
    home: '<path d="m3 10 9-7 9 7v11h-6v-7H9v7H3Z"/>',
    phrases: '<path d="M4 3h16v13H9l-5 5Z"/><path d="M8 7h8M8 11h6"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4M12 16v1"/>',
};

// Shared presentation only; feature listeners belong in the feature modules.
class AppNavigation extends HTMLElement {
    connectedCallback() {
        const active = this.getAttribute('active');
        const links = [
            ['home', 'index.html', 'Home'],
            ['phrases', 'phrases.html', 'Phrases'],
            ['help', 'help.html', 'Help'],
        ];
        this.innerHTML = `<nav class="bottom-nav d-flex" aria-label="Main navigation">${links.map(([key, href, label]) => `
            <a href="${href}"${active === key ? ' aria-current="page"' : ''}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[key]}</svg>
                <span>${label}</span>
            </a>`).join('')}
        </nav>`;
    }
}
customElements.define('app-navigation', AppNavigation);
