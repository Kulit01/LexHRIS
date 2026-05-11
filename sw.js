// LexHRIS Service Worker – caches core files for offline use
const CACHE_NAME = 'lexhris-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './sw.js'
  // Add additional assets (images, fonts, CSS) as needed
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Network-first strategy for navigation; cache-first for assets
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match('./index.html'))
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(cached => cached || fetch(event.request))
    );
  }
});