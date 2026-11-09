import { loginUser, signupUser, authErrorMessage } from './authentication.js';
import { auth } from './firebaseConfig.js';
import { saveUserProfile } from './userProfiles.js';

function initAuthUI() {
    const alert = document.getElementById('authAlert');
    const status = document.getElementById('authStatus');
    const loginView = document.getElementById('loginView');
    const signupView = document.getElementById('signupView');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginLanguage = document.getElementById('loginLanguage');
    const signupLanguage = document.getElementById('signupLanguage');
    let loginLanguageChanged = false;
    let pendingSignupUser = null;
    let busy = false;

    function clearError() {
        alert.classList.add('d-none');
        alert.textContent = '';
    }

    function showError(message) {
        alert.textContent = message;
        alert.classList.remove('d-none');
    }

    function showView(signup) {
        if (busy) return;
        clearError();
        status.textContent = '';
        loginView.classList.toggle('d-none', signup);
        signupView.classList.toggle('d-none', !signup);
        document.title = `${signup ? 'Create account' : 'Log in'} | Communication Help`;
        (signup ? signupView : loginView).querySelector('input').focus();
    }

    function setBusy(value, message = '') {
        busy = value;
        status.textContent = message;
        [loginForm, signupForm].forEach(form => {
            form.setAttribute('aria-busy', String(value));
            form.querySelectorAll('input, select, button').forEach(control => control.disabled = value);
        });
    }

    function profileError(error, signedUp) {
        const cause = error?.code === 'permission-denied'
            ? 'Firestore did not allow your profile to be saved.'
            : 'Your profile could not be saved. Check your connection and try again.';
        return `${signedUp ? 'Your account was created.' : 'Your login was successful.'} ${cause} ${signedUp ? 'Submit again to retry, or log in to finish later.' : 'Log in again to retry.'}`;
    }

    document.getElementById('toSignup').addEventListener('click', event => {
        event.preventDefault();
        signupLanguage.value = loginLanguage.value;
        showView(true);
    });
    document.getElementById('toLogin').addEventListener('click', event => {
        event.preventDefault();
        showView(false);
    });
    loginLanguage.addEventListener('change', () => { loginLanguageChanged = true; });

    loginForm.addEventListener('submit', async event => {
        event.preventDefault();
        if (busy || !loginForm.reportValidity()) return;
        clearError();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const preferredLanguage = loginLanguageChanged ? loginLanguage.value : undefined;
        setBusy(true, 'Logging in…');
        let signedIn = false;
        try {
            const credential = await loginUser(email, password);
            signedIn = true;
            status.textContent = 'Loading your profile…';
            await saveUserProfile(credential.user, { preferredLanguage });
            document.getElementById('loginPassword').value = '';
            window.location.assign('main.html');
        } catch (error) {
            showError(signedIn ? profileError(error, false) : authErrorMessage(error));
            setBusy(false);
        }
    });

    signupForm.addEventListener('submit', async event => {
        event.preventDefault();
        if (busy || !signupForm.reportValidity()) return;
        clearError();
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const preferredLanguage = signupLanguage.value;
        if (!name) { showError('Please enter your full name.'); return; }
        setBusy(true, 'Creating your account…');
        try {
            // A failed profile write must not create a second Auth account on retry.
            if (!pendingSignupUser || pendingSignupUser.email?.toLowerCase() !== email.toLowerCase() || auth.currentUser?.uid !== pendingSignupUser.uid) {
                pendingSignupUser = null;
                pendingSignupUser = await signupUser(name, email, password);
            }
            status.textContent = 'Saving your profile…';
            await saveUserProfile(pendingSignupUser, { name, preferredLanguage });
            document.getElementById('signupPassword').value = '';
            window.location.assign('main.html');
        } catch (error) {
            showError(pendingSignupUser ? profileError(error, true) : authErrorMessage(error));
            setBusy(false);
        }
    });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAuthUI, { once: true });
else initAuthUI();
