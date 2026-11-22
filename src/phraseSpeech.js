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
    active.stop();
    active.finish('');
}

// Clips recorded by scripts/generateAudio.js sound the same on every device.
export function recordingUrl(phrase, language) {
    return `/audio/${language}/${phrase.categoryId}_${phrase.phraseId}.mp3`;
}

// Most desktops ship no on-device Punjabi or Urdu voice, so fall back to the
// browser's online voices. On-device voices still win because they work offline.
function voiceFor(language) {
    const matches = speech.getVoices().filter(
        (candidate) =>
            candidate.lang.toLowerCase().split(/[-_]/)[0] === language
    );
    return matches.find((candidate) => candidate.localService) || matches[0];
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

        const active = {
            button,
            stop() {},
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
        function started() {
            if (playback === active) status.textContent = 'Playing…';
        }

        function speakWithBrowserVoice() {
            if (playback !== active) return;
            if (!speech || typeof globalThis.SpeechSynthesisUtterance !== 'function') {
                finish('Audio is unavailable in this browser.');
                return;
            }
            const voice = voiceFor(language);
            if (!voice) {
                finish(`No ${languageLabel(language)} voice is available in this browser.`);
                return;
            }
            const utterance = new SpeechSynthesisUtterance(phrase.translation);
            utterance.lang = voice.lang;
            utterance.voice = voice;
            utterance.onstart = started;
            utterance.onend = () => finish('Playback finished.');
            utterance.onerror = () => finish('Playback unavailable. Try again.');
            active.stop = () => speech.cancel();
            try {
                speech.speak(utterance);
            } catch {
                finish('Playback unavailable. Try again.');
            }
        }

        playback = active;
        setPlaying(true);
        status.textContent = 'Starting playback…';
        if (typeof globalThis.Audio !== 'function') {
            speakWithBrowserVoice();
            return;
        }
        // A missing clip fires both the error event and a rejected play(); fall back once.
        const audio = new Audio(recordingUrl(phrase, language));
        let fellBack = false;
        function fallBack() {
            if (fellBack) return;
            fellBack = true;
            audio.pause();
            speakWithBrowserVoice();
        }
        active.stop = () => audio.pause();
        audio.onplaying = started;
        audio.onended = () => finish('Playback finished.');
        audio.onerror = fallBack;
        audio.play().catch(fallBack);
    });
    return button;
}
