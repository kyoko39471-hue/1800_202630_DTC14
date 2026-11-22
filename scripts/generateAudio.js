// Records every phrase with Azure neural voices into public/audio/<language>/.
//
//   npm run audio              all five languages; clips that already exist are skipped
//   npm run audio -- zh        only the listed languages (e.g. Mandarin as a test run)
//   npm run audio -- --force   record again even when a clip exists
//
// Needs AZURE_SPEECH_KEY and AZURE_SPEECH_REGION in .env. Never give them a VITE_
// prefix: Vite ships VITE_ variables to the browser, where anyone could read the key.
import { access, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { categories } from '../src/travelPhrasesData.js';

// Male voices, to match the masculine spoken text in travelPhrasesData.js.
export const voices = {
    fr: 'fr-FR-HenriNeural',
    es: 'es-ES-AlvaroNeural', // the phrases use Spain Spanish ("cacahuetes")
    zh: 'zh-CN-YunxiNeural',
    pa: 'pa-IN-OjasNeural',
    ur: 'ur-PK-AsadNeural',
};

const outputRoot = fileURLToPath(new URL('../public/audio/', import.meta.url));

export function clipPath(language, categoryId, phraseId) {
    return `${language}/${categoryId}_${phraseId}.mp3`;
}

export function buildJobs(languages = Object.keys(voices)) {
    return categories.flatMap((category) =>
        category.phrases.flatMap((phrase) =>
            languages.map((language) => ({
                language,
                file: clipPath(language, category.id, phrase.id),
                text: phrase.spoken?.[language] ?? phrase.translations[language],
            }))
        )
    );
}

const xmlEntities = { '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' };

export function ssml(voice, text) {
    const locale = voice.split('-').slice(0, 2).join('-');
    const safe = text.replace(/[<>&'"]/g, (character) => xmlEntities[character]);
    return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${locale}"><voice name="${voice}">${safe}</voice></speak>`;
}

const pause = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));

async function azure(region, key, path, init = {}) {
    // The free tier allows only a few requests per minute, so wait and retry when throttled.
    for (let attempt = 1; ; attempt++) {
        const response = await fetch(`https://${region}.tts.speech.microsoft.com${path}`, {
            ...init,
            headers: {
                'Ocp-Apim-Subscription-Key': key,
                'User-Agent': 'communication-help-audio',
                ...init.headers,
            },
        });
        if (response.status !== 429 || attempt === 6) return response;
        const wait = Number(response.headers.get('retry-after')) || 10 * attempt;
        console.log(`  Azure asked us to slow down; waiting ${wait}s…`);
        await pause(wait);
    }
}

async function checkVoices(region, key, languages) {
    const response = await azure(region, key, '/cognitiveservices/voices/list');
    if (!response.ok) {
        throw new Error(
            `Azure rejected the voice list request (HTTP ${response.status}). ` +
                'Check AZURE_SPEECH_KEY and AZURE_SPEECH_REGION in .env.'
        );
    }
    const available = await response.json();
    for (const language of languages) {
        const voice = available.find((entry) => entry.ShortName === voices[language]);
        if (voice?.Gender === 'Male') continue;
        const locale = voices[language].split('-').slice(0, 2).join('-');
        const males = available
            .filter((entry) => entry.Locale === locale && entry.Gender === 'Male')
            .map((entry) => entry.ShortName);
        throw new Error(
            `${voices[language]} is not an available male voice. ` +
                `Male ${locale} voices in this region: ${males.join(', ') || 'none'}.`
        );
    }
}

async function exists(path) {
    try {
        await access(path);
        return true;
    } catch {
        return false;
    }
}

async function main(args) {
    const key = process.env.AZURE_SPEECH_KEY;
    const region = process.env.AZURE_SPEECH_REGION;
    if (!key || !region) {
        throw new Error('Add AZURE_SPEECH_KEY and AZURE_SPEECH_REGION to .env first.');
    }
    const force = args.includes('--force');
    const requested = args.filter((arg) => !arg.startsWith('--'));
    const unknown = requested.filter((language) => !voices[language]);
    if (unknown.length) {
        throw new Error(
            `Unknown language: ${unknown.join(', ')}. Use: ${Object.keys(voices).join(', ')}.`
        );
    }
    const languages = requested.length ? requested : Object.keys(voices);
    await checkVoices(region, key, languages);

    let recorded = 0;
    let skipped = 0;
    for (const job of buildJobs(languages)) {
        const target = outputRoot + job.file;
        if (!force && (await exists(target))) {
            skipped++;
            continue;
        }
        const response = await azure(region, key, '/cognitiveservices/v1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/ssml+xml',
                'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
            },
            body: ssml(voices[job.language], job.text),
        });
        if (!response.ok) {
            throw new Error(`Azure could not record ${job.file} (HTTP ${response.status}).`);
        }
        await mkdir(new URL('.', pathToFileURL(target)), { recursive: true });
        await writeFile(target, Buffer.from(await response.arrayBuffer()));
        recorded++;
        console.log(`  recorded ${job.file}`);
    }
    console.log(`Done: ${recorded} recorded, ${skipped} already existed.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    main(process.argv.slice(2)).catch((error) => {
        console.error(error.message);
        process.exitCode = 1;
    });
}
