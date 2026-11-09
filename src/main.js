import { mountLayout, setStatus } from './layout.js';
import { startSignedIn } from './session.js';
import { languageLabel } from './userProfiles.js';
import { logoutUser } from './authentication.js';

mountLayout('home');
document.getElementById('logoutBtn').addEventListener('click', async event => {
 const button = event.currentTarget;
 button.disabled = true;
 try { await logoutUser(); }
 catch { button.disabled = false; setStatus('Couldn’t log out. Please try again.', true); }
});
startSignedIn(async (user, profile) => {
 document.getElementById('name-goes-here').textContent = (profile.name || user.displayName || 'friend').split(' ')[0];
 document.getElementById('languageLabel').textContent = `Translate to ${languageLabel(profile.preferredLanguage)}`;
 setStatus('');
});
