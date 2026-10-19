import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

// Build every HTML entry so navigation also works in the production output.
const pages = ['index', 'express-needs', 'directions', 'travel-phrases', 'phrases', 'help', 'login', 'main'];
export default defineConfig({
    build: {
        rollupOptions: {
            input: Object.fromEntries(pages.map(page => [page, fileURLToPath(new URL(`./${page}.html`, import.meta.url))])),
        },
    },
});
