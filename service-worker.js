/**
 * Mystery of the Eternal Diya 🪔 by Subin Khullar
 * (C) 2026 Subin Khullar. All rights reserved.
 * 
 * Service Worker: Standalone Offline Caching & PWA Architecture
 */

const CACHE_NAME = 'eternal-diya-v1.0.0';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json'
];

// Service Worker Install Event - Cache Core Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Service Worker Activate Event - Purge Legacy Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((existingCache) => {
          if (existingCache !== CACHE_NAME) {
            return caches.delete(existingCache);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Service Worker Fetch Event - Cache First Strategy with Network Fallback
self.addEventListener('fetch', (event) => {
  // Do not intercept non-GET requests or Gemini external AI API calls
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('generativelanguage.googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached asset and revalidate in background
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {
          // Offline network failure silent bypass
        });
        return cachedResponse;
      }

      // Fetch from network and store in cache
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Offline Fallback for HTML navigations
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});
