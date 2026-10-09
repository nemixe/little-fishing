// Little Fishing service worker: caches the app on first open so it keeps working offline.
// Bump VERSION whenever any file changes so devices pick up the new build.
const VERSION = 'little-fishing-v5.1';
const FILES = ['./', './index.html', './manifest.webmanifest', './apple-touch-icon.png',
  './icon-192.png', './icon-512.png', './icon-maskable-512.png', './favicon-32.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('little-fishing-') && k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    // network first for the page (so updates arrive), cached copy when offline
    e.respondWith(fetch(req).then(res => {
      const copy = res.clone(); caches.open(VERSION).then(c => c.put('./index.html', copy)); return res;
    }).catch(() => caches.match('./index.html', {ignoreSearch: true})));
    return;
  }
  e.respondWith(caches.match(req, {ignoreSearch: true}).then(hit => hit || fetch(req)));
});
