// Service Worker for LexHRIS
const CACHE_NAME = 'lexhris-cache-v1';
const urlsToCache = [
  './',
  './index.html'  // replace with your actual HTML file name if different
];

// Install event – cache critical resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event – clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event – serve from cache, then network
self.addEventListener('fetch', event => {
  // For Google Firebase scripts and APIs, always go network first
  if (event.request.url.includes('firebase') || event.request.url.includes('googleapis')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchResponse => {
        // Cache dynamic resources (but avoid caching Firebase dynamic stuff)
        if (!event.request.url.includes('firebase') && !event.request.url.includes('googleapis')) {
          const responseClone = fetchResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return fetchResponse;
      });
    }).catch(() => {
      // Offline fallback – you can return a custom page if desired
    })
  );
});