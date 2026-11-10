# Communication Help UI and account integration

Feature branch: `feature/surkhab-ui-language-refinement`, based on the merged Sijin redesign at `801d15b`.

## Implemented

- Preserves the four categories, illustrations, and Home/Saved/Profile navigation from the approved demo. Layout uses two Home columns on phones and four on wider screens, with a centred maximum width. Phrase cards use one column on phones.
- Keeps the existing Firebase project (`dtc14-227e8`) and email/password authentication helpers. Login and signup redirect to `main.html`.
- English is the initial default, hidden from the expanded language list. The five choices are French, Punjabi, Mandarin, Urdu, and Spanish. An untouched login selector preserves an existing preference.
- Profiles use `users/{uid}` with name, email, UID, preferred-language code, and timestamps. Merge writes preserve other team fields. A failed signup profile save can be retried without creating a duplicate Auth account. Passwords are never stored in Firestore.
- Profile language changes are written and read back. Home, categories, and Saved use the stored preference. Missing translations are explicitly marked unavailable; the current team data contains Arabic instead of Urdu, so Urdu translations still need content from the team.
- Saved phrases use `users/{uid}/savedPhrases/{categoryId}_{phraseId}` with category/phrase references and a creation timestamp. Shared phrase data stays in Sijin's existing categories/phrases/translations structure. The old local test-user picker is replaced; its browser test data is not migrated or deleted.
- Phrase cards show English, translation, and an icon-only heart. Liked hearts fill light red. The app uses a white theme; Saved navigation retains its bookmark icon. Show phrase and the large-text dialog were removed on November 9 following team feedback. Empty, loading, error, retry, and signed-out states remain. Help stays in Profile; Logout is restored beside the greeting in the Home header.

## Verification

- Automated checks cover profile merges, language defaults and validation, failed-write retries, invalid login, per-user bookmarks, distinct category phrase IDs, missing translations, and signed-out/loading failures.
- Production build passes. Vite reports a Firebase bundle-size advisory.
- Live test account: Punjabi profile read from the shared Firestore project. French selected in Profile, server read confirmed `fr`, then Punjabi restored.
- Live bookmark saved, observed in Firestore under that account, survived page refresh, and was removed successfully. The temporary bookmark was cleaned up.
- Home has no horizontal overflow at 320, 402, 1366, or 1920 pixels. Phone and laptop evidence is stored outside the repository.
- Fresh signup completed privately by the user on November 8, 2026. A server read confirmed the new users/{uid} document, matching UID, name, email, creation/update timestamps, and preferredLanguage en (English default). Home and Profile displayed the same preference. Fresh re-login after logout remains a manual check; the login logic is covered by automated tests.
- Physical laptop/projector connection: pending; user confirmed no projector is available. A 1920×1080 browser viewport was checked, which is not a hardware connection test.

No security rules, Firebase settings, or shared phrase translations were changed.
