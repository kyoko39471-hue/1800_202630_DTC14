# User accounts and preferred language

Branch: `feature/surkhab-auth-language`

Reuses the team's Firebase email/password authentication. Login and signup now use the app's grayscale layout with responsive forms. English is initially selected as the default and is hidden from the expanded dropdown. The five selectable languages below Password are French, Punjabi, Mandarin, Urdu, and Spanish. Leaving the signup selection unchanged saves English. This stores a preference; it does not translate the interface.

After signup, `users/{Firebase Auth UID}` stores `uid`, `name`, `email`, `preferredLanguage`, `createdAt`, and `updatedAt`. Language values are `en`, `fr`, `pa`, `zh`, `ur`, and `es`. Passwords are handled only by Firebase Authentication and are never stored in Firestore.

Login preserves an existing saved preference unless the user changes the language dropdown. Accounts from before this feature get a profile on their next successful login. Writes merge with existing documents to retain fields owned by other teammates. A failed profile save stays on the form with an error; signup can retry without creating a duplicate account. Reloading after such a failure is recoverable through login.

Successful login/signup goes to the Communication Help home page. Home reads the profile from Firestore, shows its preferred language, and offers logout.

The existing local Firebase configuration identifies project `dtc14-227e8`; environment configuration stays ignored by Git. No changes to Firestore security rules are included. Live verification needs an authorized course account and a Firestore database allowing that account to read and write its own `users/{uid}` document.

## Verification on October 22, 2026

- Confirmed in Firebase Console that project `dtc14-227e8` is named `1800-202630-dtc14`, and its default Firestore database is ready.
- Existing published rules allow public reads and writes until February 19, 2027. These rules were inspected only, not changed. Use course demo details while those rules remain in place.
- Production build passes. Vite reports its existing large Firebase bundle warning.
- Ten regression tests pass with `node --test tests/auth-language.test.cjs`. Tests cover language persistence, profile creation, merged fields, denied writes, invalid credentials, and signup retry without duplicate Auth accounts. Firebase calls are mocked in these tests.
- Browser checks confirm both forms and all six language options render. Phone layout was inspected at 320px and 402px; the 320px page has no horizontal overflow. No login-page runtime errors were reported.
- Live signup was completed by the user. Verified in Firebase Console that the resulting `users/{uid}` document contains `name`, `email`, `preferredLanguage: "pa"`, matching `uid`, `createdAt`, and `updatedAt`, with no password field. Home reads that document and displays Punjabi as the preferred language; no runtime errors were reported on Home.
- Live logout/login language updates still require the user to enter their credentials. Language preservation, language changes, and invalid credentials are covered by the automated regression tests; these were not represented as live login tests. No real signup account was created by the agent.

## Manual check

1. Open `login.html` at 320px, 402px, and desktop widths. Confirm labels and buttons fit and the dropdown is below Password.
2. Switch to Create account, choose a non-English language, and create an account yourself.
3. Confirm Home shows the selected language and the matching UID document exists in Firestore without a password field.
4. Log out and log in without changing the language. Confirm the previous preference remains.
5. Log out and select a different language during login. Confirm Home and Firestore show the new preference.
6. Confirm invalid credentials stay on the form with an error. A denied profile write should show a recoverable save error instead of redirecting.
