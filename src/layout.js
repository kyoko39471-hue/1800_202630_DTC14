import '../styles/style.css';

const paths = {
 bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
 home: '<path d="m3 10 9-7 9 7v11h-7v-7h-4v7H3z"/>',
 heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
 user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
 back: '<path d="m10 5-7 7 7 7M3 12h18"/>',
 languages: '<path d="M3 5h11M8 3v2M5 5c1 6 5 9 9 10M12 5c-1 6-5 9-9 10M14 21l4-10 4 10M16 17h4"/>',
 chevron: '<path d="m9 5 7 7-7 7"/>',
};
export function icon(name, filled = false) {
 return `<svg class="icon" viewBox="0 0 24 24" fill="${name === 'heart' && filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.heart}</svg>`;
}
export function mountLayout(active) {
 const header = document.querySelector('[data-app-header]');
 if (header) header.innerHTML = '<a class="brand" href="main.html">COMMUNICATION HELP</a>';
 const nav = document.querySelector('[data-app-nav]');
 if (nav) nav.innerHTML = [['home','Home','main.html'],['bookmark','Saved','savedphrases.html'],['user','Profile','profile.html']].map(([key,label,url]) => `<a href="${url}"${active===key?' aria-current="page"':''}>${icon(key)}<span>${label}</span></a>`).join('');
 document.querySelectorAll('[data-icon]').forEach(element => element.innerHTML = icon(element.dataset.icon));
}
export function setStatus(message, error = false) {
 const element = document.getElementById('pageStatus');
 if (!element) return;
 element.textContent = message;
 element.classList.toggle('page-error', error);
}
