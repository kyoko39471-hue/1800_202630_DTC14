# Phrase audio

Phrase cards play a recorded clip from `public/audio/<language>/<category>_<phrase>.mp3`.
If a clip is missing, the card falls back to the browser's own voice, which many devices
do not have for Punjabi or Urdu.

## Recording the clips

Clips are made once with Azure AI Speech neural voices (male voices, masculine phrasing)
by `scripts/generateAudio.js`. The free F0 tier allows 0.5 million characters a month; all
five languages together are about 3,200 characters.

1. Add `AZURE_SPEECH_KEY` and `AZURE_SPEECH_REGION` to your own `.env` (see `.env_template`).
   Never add a `VITE_` prefix and never commit the key.
2. Record one language and have a native speaker listen first: `npm run audio -- zh`
3. Record the rest: `npm run audio` (existing clips are skipped; add `-- --force` to redo them).

Re-run the script whenever a translation in `src/travelPhrasesData.js` changes. Where a card
shows two forms (e.g. `perdido/a`), the audio reads that phrase's `spoken` text instead.
