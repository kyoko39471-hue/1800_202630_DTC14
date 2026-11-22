import { icon } from './layout.js';
import { languageLabel } from './userProfiles.js';

const speech = globalThis.speechSynthesis;
let playback = null;

// Ask the browser for voices early. Some devices populate this list asynchronously.
speech?.getVoices();
window.addEventListener('pagehide', () => stopPhraseSpeech());

export function stopPhraseSpeech(button) {
    if (!playback || (button && playback.button !== button)) return;
    const active = playback;
    playback = null;
    active.finish('');
    speech.cancel();
}

export function phraseSpeechButton(phrase, language, status) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'action phrase-icon-button';

    function setPlaying(playing) {
        button.innerHTML = icon(playing ? 'stop' : 'speaker');
        button.setAttribute('aria-pressed', String(playing));
        button.setAttribute(
            'aria-label',
            `${playing ? 'Stop audio for' : 'Listen to'} ${phrase.english}`
        );
    }
    setPlaying(false);
    button.addEventListener('click', () => {
        const wasPlaying = playback?.button === button;
        stopPhraseSpeech();
        if (wasPlaying) return;

        if (!speech || typeof globalThis.SpeechSynthesisUtterance !== 'function') {
            status.textContent = 'Audio is unavailable in this browser.';
            return;
        }
        const voice = speech.getVoices().find((candidate) =>
            candidate.localService &&
            candidate.lang.toLowerCase().split(/[-_]/)[0] === language
        );
        if (!voice) {
            status.textContent = `No local ${languageLabel(language)} voice is available.`;
            return;
        }

        const utterance = new SpeechSynthesisUtterance(phrase.translation);
        utterance.lang = voice.lang;
        utterance.voice = voice;
        const active = {
            button,
            finish(message) {
                setPlaying(false);
                status.textContent = message;
            },
        };
        function finish(message) {
            if (playback !== active) return;
            playback = null;
            active.finish(message);
        }
        utterance.onstart = () => {
            if (playback === active) status.textContent = 'Playing…';
        };
        utterance.onend = () => finish('Playback finished.');
        utterance.onerror = () => finish('Playback unavailable. Try again.');
        playback = active;
        setPlaying(true);
        status.textContent = 'Starting playback…';
        try {
            speech.speak(utterance);
        } catch {
            finish('Playback unavailable. Try again.');
        }
    });
    return button;
}
