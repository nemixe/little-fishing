# Little Fishing

A gentle, ad-free fishing game for toddlers: tap to cast, catch colourful fish, drop them in the bucket. No text to read, no accounts, no tracking. It is a single HTML file plus icons, and after the first open it works offline (airplane mode is fine).

**Play:** open the GitHub Pages link for this repo (https://nemixe.github.io/little-fishing/).

## Put it on the home screen

**iPhone / iPad (Safari)**
1. Open the link in **Safari** (not inside another app's browser).
2. Tap the **Share** button (square with an arrow pointing up).
3. Scroll down and tap **Add to Home Screen**, then **Add**.
4. Launch it from the bear icon. It opens full screen like a normal app.

**Android (Chrome)**
1. Open the link in **Chrome**.
2. Tap the **⋮** menu, then **Install app** (or **Add to Home screen**).
3. Launch it from the bear icon.

Tip for little hands: turn on Guided Access (iPhone) or App pinning (Android) so the game can't be left by accident.

## Files

- `index.html`: the whole game (canvas + Web Audio, no external requests)
- `manifest.webmanifest`, `apple-touch-icon.png`, `icon-*.png`, `favicon-32.png`: install metadata and icons
- `sw.js`: service worker that caches everything for offline play (bump `VERSION` when files change)
- `tools/make_icons.js`, `tools/flatten_png.py`: regenerate the icons (the `build icons` workflow runs them and commits the PNGs)
