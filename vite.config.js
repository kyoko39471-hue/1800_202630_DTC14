
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const pages = [
    'index',
    'login',
    'main',
    'eachCategory',
    'savedphrases',
    'profile'
];

export default defineConfig({
    build: {
        rollupOptions: {
            input: Object.fromEntries(
                pages.map(page => [
                    page,
                    fileURLToPath(
                        new URL(`./${page}.html`, import.meta.url)
                    )
                ])
            ),
        },
    },
});
