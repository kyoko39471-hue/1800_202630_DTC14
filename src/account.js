import { onAuthReady, logoutUser } from './authentication.js';
import { getUserProfile, languageLabel } from './userProfiles.js';

const accountLink = document.querySelector('.account-link');
const profileStatus = document.getElementById('profileStatus');
let currentUser = null;

accountLink?.addEventListener('click', async event => {
    if (!currentUser) return;
    event.preventDefault();
    accountLink.setAttribute('aria-disabled', 'true');
    try { await logoutUser(); }
    catch { profileStatus.textContent = 'Could not log out. Please try again.'; }
    finally { accountLink.removeAttribute('aria-disabled'); }
});

onAuthReady(async user => {
    currentUser = user;
    accountLink.textContent = user ? 'Log out' : 'Log in';
    accountLink.href = user ? '#logout' : 'login.html';
    profileStatus.textContent = '';
    if (!user) return;
    profileStatus.textContent = 'Loading your profile…';
    try {
        const profile = await getUserProfile(user);
        if (currentUser?.uid !== user.uid) return;
        profileStatus.textContent = profile
            ? `Welcome, ${profile.name || user.displayName || 'traveller'}. Preferred language: ${languageLabel(profile.preferredLanguage)}.`
            : 'Your account is signed in. Log in again to finish saving your profile.';
    } catch {
        if (currentUser?.uid === user.uid) profileStatus.textContent = 'You’re signed in, but your profile could not be loaded. Please try again later.';
    }
});
