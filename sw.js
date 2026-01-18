/* ============================================
   Service Worker
   Offline support and caching
   ============================================ */

const CACHE_NAME = 'vibe-web-os-v2.0.0';

const CACHE_URLS = [
  './',
  './index.html',
  './css/variables.css',
  './css/base.css',
  './css/layout.css',
  './css/utilities.css',
  './css/components/window.css',
  './css/components/menubar.css',
  './css/components/dock.css',
  './css/components/spotlight.css',
  './css/components/notifications.css',
  './css/components/context-menu.css',
  './js/utils/icons.js',
  './js/core/bus.js',
  './js/core/fs.js',
  './js/core/window-manager.js',
  './js/core/app-registry.js',
  './js/core/menubar.js',
  './js/core/dock.js',
  './js/core/spotlight.js',
  './js/core/notifications.js',
  './js/core/shell.js',
  './js/core/boot.js',
  './js/apps/finder.js',
  './js/apps/textedit.js',
  './js/apps/codeedit.js',
  './js/apps/notes.js',
  './js/apps/settings.js',
  './js/apps/preview.js',
  './js/apps/safari.js',
  './js/apps/doom.js',
  './js/main.js'
];

// Install event - cache all files
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(CACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // Could return a custom offline page here
        console.log('[Service Worker] Fetch failed for:', event.request.url);
      })
  );
});
