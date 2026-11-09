import { mountLayout, setStatus } from './layout.js';
import { startSignedIn } from './session.js';
import { languages, getUserProfile, saveUserProfile } from './userProfiles.js';

mountLayout('user');
const selector=document.getElementById('preferredLanguage');
const save=document.getElementById('saveLanguage');
let account=null;
for(const language of languages) {
 const option=document.createElement('option'); option.value=language.code; option.textContent=language.label+(language.code==='en'?' (default)':''); option.hidden=language.code==='en'; selector.append(option);
}
startSignedIn(async (user,profile) => {
 account=user;
 document.getElementById('profileName').textContent=profile.name || user.displayName || '—';
 document.getElementById('profileEmail').textContent=user.email || '—';
 selector.value=profile.preferredLanguage || 'en'; selector.disabled=false; save.disabled=false; setStatus('');
});
document.getElementById('profileForm').addEventListener('submit',async event=>{
 event.preventDefault(); if(!account)return;
 const value=selector.value; save.disabled=true; selector.disabled=true; setStatus('Saving language…');
 try {
   await saveUserProfile(account,{preferredLanguage:value});
   const profile=await getUserProfile(account);
   if(profile?.preferredLanguage!==value)throw new Error('Preference was not confirmed.');
   setStatus('Language saved and verified.');
 }catch { setStatus('Couldn’t confirm the language change. Please try again.',true); }
 finally {save.disabled=false;selector.disabled=false;}
});
