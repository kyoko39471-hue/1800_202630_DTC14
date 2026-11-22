const { test } = require('node:test');
const assert = require('node:assert/strict');

const script = () => import('../scripts/generateAudio.js');

test('a voice is chosen for each of the five app languages', async () => {
    const { voices } = await script();
    assert.deepEqual(Object.keys(voices).sort(), ['es', 'fr', 'pa', 'ur', 'zh']);
});
test('every phrase is recorded once per language with real text', async () => {
    const { buildJobs } = await script();
    const jobs = buildJobs();
    assert.equal(jobs.length, 30 * 5);
    assert.equal(new Set(jobs.map((job) => job.file)).size, jobs.length);
    for (const job of jobs) assert.ok(job.text, `${job.file} has no text`);
});
test('a Mandarin-only run records just the 30 Mandarin clips', async () => {
    const { buildJobs } = await script();
    const jobs = buildJobs(['zh']);
    assert.equal(jobs.length, 30);
    assert.ok(jobs.every((job) => job.file.startsWith('zh/')));
});
test('recordings use the masculine spoken text', async () => {
    const { buildJobs } = await script();
    const lost = buildJobs(['ur', 'fr']).filter((job) =>
        job.file.endsWith('/emergency_phrase_004.mp3')
    );
    assert.deepEqual(
        lost.map((job) => job.text),
        ['میں راستہ بھول گیا ہوں۔', 'Je suis perdu.']
    );
});
test('phrase text is escaped before it is sent to Azure', async () => {
    const { ssml } = await script();
    const body = ssml('fr-FR-HenriNeural', "J'ai <faim> & soif");
    assert.match(body, /xml:lang="fr-FR"/);
    assert.match(body, /<voice name="fr-FR-HenriNeural">J&apos;ai &lt;faim&gt; &amp; soif<\/voice>/);
});
