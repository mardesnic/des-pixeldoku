# Pixeldoku

A free picture logic puzzle for young kids that works offline. The numbers next to each row and above each column say how many squares to colour there, and in which groups. Colour the right squares and a little picture appears.

Made for ages 5 and up. There is no timer and no way to lose. Undo takes back the last move, and Start over clears the grid.

## Demo

Check out the live demo at: https://mardesnic.github.io/des-pixeldoku/

On your phone, open it and choose **Add to Home Screen** (Safari) or **Install app** (Chrome). It then opens like an app and works offline.

## Features

- Four sizes, from 5 × 5 to 10 × 10, each with its own hand-drawn pictures
- Tap a square to colour it, or drag along a row or column
- Each number is a little block, and turns green as soon as its group of squares is in place
- A row's or column's numbers turn orange when its squares can't match them, such as two squares apart for a 2
- The picture shows in its colours once it's solved, and tells you what it is
- Every picture has exactly one answer, found without guessing
- Next picks one you haven't solved yet
- Undo and Start over
- Picks up where you left off after a reload
- Keeps the screen on while you play
- In English and Croatian, following the phone's language unless you pick one
- Light and dark mode
- No ads, accounts or tracking

## Development

```bash
npm install
npm run dev        # local dev server
npm test           # game and translation tests
npm run build      # production build in dist/
```

`npm run deploy` builds the app and publishes it to GitHub Pages.

The pictures are drawn as text in `src/lib/pictures.ts`, one letter a square for its colour. The tests check that each one can be solved one line at a time.
