# Pixels

A free picture logic puzzle for young kids that works offline. The numbers next to each row and above each column say how many squares to colour there, and in which groups. Colour the right squares and a little picture appears.

Made for ages 5 and up. There is no timer and no way to lose. Undo takes back the last move, and Start over clears the grid.

## Demo

Check out the live demo at: https://mardesnic.github.io/des-pixels/

On your phone, open it and choose **Add to Home Screen** (Safari) or **Install app** (Chrome). It then opens like an app and works offline.

## Features

- Small grids to start with, bigger ones when you are ready
- Every picture has exactly one answer
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
