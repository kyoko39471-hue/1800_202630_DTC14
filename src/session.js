import { onAuthReady } from './authentication.js';
import { getUserProfile } from './userProfiles.js';
import { setStatus } from './layout.js';

export function startSignedIn(loadPage) {
 let user = null;
 let generation = 0;
 const retry = document.getElementById('retryButton');
 async function load() {
   if (!user) return;
   const version = ++generation;
   retry.hidden = true;
   setStatus('Loading…');
   try {
     let profile = await getUserProfile(user);
     // Reading another open tab must not race signup's preferred-language write.
     if (!profile) profile = { name:user.displayName || '', preferredLanguage:'en' };
     if (version !== generation) return;
     await loadPage(user, profile, () => version === generation);
   } catch (error) {
     if (version !== generation) return;
     setStatus(error.code === 'permission-denied' ? 'Your account cannot access this data. Please contact your team.' : 'Couldn’t load. Check your connection and retry.', true);
     retry.hidden = false;
   }
 }
 retry.addEventListener('click', load);
 onAuthReady(account => {
   user = account;
   if (!user) { generation++; location.replace('login.html'); return; }
   load();
 });
}
