const CACHE = 'lawfirm-v1';
const ASSETS = [
  './law_firm.html',
  './manifest.json',
  // add any other local resources you use (CSS, JS are already inline)
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
});