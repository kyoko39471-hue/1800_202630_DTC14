# Communication Help

## Overview

Communication Help is a web app for English-speaking travellers. It helps them read, hear and save useful phrases in the language of the place they are visiting.

Developed by team DTC14 for COMP 1800 at BCIT.

## Features

- Browse phrases by category: accommodation, restaurants, greetings and emergency
- Read each phrase in French, Punjabi, Mandarin, Urdu or Spanish
- Listen to recorded audio, with the browser's own voice as a backup
- Search within a category and save phrases to your account
- Choose a destination language at sign-up and change it in your profile
- Light and dark mode, on desktop and mobile

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Backend**: Firebase Authentication and Cloud Firestore
- **Audio**: Microsoft Azure AI Speech, recorded ahead of time

## Usage

You need Node.js 20.19+ or 22.12+.

1. Clone the repository and run `npm install`.
2. Copy `.env_template` to `.env` and add the Firebase settings.
3. Run `npm run dev` and open the address shown (usually `http://localhost:5173`).

Run the tests with `node --test tests/*.test.cjs`. The Azure settings are only needed to record new audio; see [docs/phrase-audio.md](docs/phrase-audio.md).

## Project Structure

```
├── *.html           # the six pages
├── src/             # page scripts, phrase cards, audio, Firebase
├── styles/          # style.css
├── images/          # category photos
├── public/audio/    # recorded phrase clips
├── scripts/         # generateAudio.js records the clips
├── tests/
└── docs/
```

## Contributors

- **Sijin** - BCIT CST Student with a background in philosophy and is passionate about building user-friendly applications. Fun fact: Favorite city to live in: Vancouver; favorite city to travel to: Seoul.
- **Zamin** - BCIT CST Student with a passion for outdoor adventures and user-friendly applications. Fun fact: Loves solving Rubik's Cubes in under a minute.
- **Surkhab** - BCIT CST Student, Frontend enthusiast with a knack for creative design. Fun fact: Has a collection of over 50 houseplants.

## Limitations

- The app offers a fixed set of phrases and does not translate free text.
- Transportation phrases are translated and recorded but not shown in the app yet.
- Audio uses the masculine form of gendered phrases.
