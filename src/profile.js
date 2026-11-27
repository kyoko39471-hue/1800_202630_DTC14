import { mountLayout, setHeaderLanguage, setStatus } from './layout.js';
import { startSignedIn } from './session.js';
import {
    addDestinationLanguages,
    languageLabel,
    getUserProfile,
    saveUserProfile,
} from './userProfiles.js';

mountLayout('user');
const selector = document.getElementById('preferredLanguage');
const save = document.getElementById('saveLanguage');
const name = document.getElementById('profileName');
const edit = document.getElementById('editProfile');
const editor = document.getElementById('profileEditor');
const nameInput = document.getElementById('displayName');
const saveProfile = document.getElementById('saveProfile');
const cancel = document.getElementById('cancelEdit');
let account = null;
let displayName = '';

function disableControls(disabled) {
    for (const control of [selector, save, edit, nameInput, saveProfile, cancel]) {
        control.disabled = disabled;
    }
}

function setEditing(editing) {
    editor.hidden = !editing;
    edit.setAttribute('aria-expanded', String(editing));
    if (editing) {
        nameInput.value = displayName;
        nameInput.setCustomValidity('');
        nameInput.focus();
    } else {
        edit.focus();
    }
}

async function saveAndVerify(field, value, saving, failure) {
    const user = account;
    disableControls(true);
    setStatus(saving);
    try {
        await saveUserProfile(user, { [field]: value });
        const profile = await getUserProfile(user);
        if (profile?.[field] !== value) {
            throw new Error('Change was not confirmed.');
        }
        return true;
    } catch {
        setStatus(failure, true);
        return false;
    } finally {
        disableControls(false);
    }
}

addDestinationLanguages(selector);
startSignedIn(async (user, profile) => {
    account = user;
    displayName = profile.name || user.displayName || '';
    name.textContent = displayName || '—';
    document.getElementById('profileEmail').textContent = user.email || '—';
    selector.value = profile.preferredLanguage || 'en';
    disableControls(false);
    setStatus('');
});
document
    .getElementById('profileForm')
    .addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!account || save.disabled) return;
        const value = selector.value;
        if (value === 'en') {
            setStatus('Choose a destination language first.', true);
            return;
        }
        const saved = await saveAndVerify(
            'preferredLanguage', value, 'Saving language…',
            'Couldn’t confirm the language change. Please try again.'
        );
        if (!saved) return;
        setHeaderLanguage(languageLabel(value));
        setStatus('Language saved and verified.');
    });

edit.addEventListener('click', () => setEditing(editor.hidden));
cancel.addEventListener('click', () => setEditing(false));
nameInput.addEventListener('input', () => nameInput.setCustomValidity(''));
editor.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!account || saveProfile.disabled) return;
    const value = nameInput.value.trim();
    if (!value) {
        nameInput.setCustomValidity('Enter a display name.');
        nameInput.reportValidity();
        return;
    }
    const saved = await saveAndVerify(
        'name', value, 'Saving profile…',
        'Couldn’t confirm the profile change. Please try again.'
    );
    if (!saved) return;
    displayName = value;
    name.textContent = value;
    setStatus('Profile updated.');
    setEditing(false);
});
