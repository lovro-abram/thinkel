const CACHE_NAME = 'thinkel-v11';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './saved.html',
  './settings.html',
  './wallpaper.html',
  './css/style.css',
  './js/app.js',
  './manifest.json',
  './data/sl.citati.json',
  './data/en.citati.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './icons/icon-maskable-512x512.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons+Round',
  'https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap',
  'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Caveat:wght@400;700&family=Montserrat:wght@400;600&family=Merriweather:wght@300;400;700&family=Dancing+Script:wght@400;700&display=swap'
];

// Install: pre-cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean up old cache versions & force control immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: varan stale-while-revalidate z obravnavo preusmeritev
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Obravnavamo samo GET zahteve
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then(async (networkResponse) => {
          // Če je strežnik vrnil preusmeritev (redirected), pridobimo končni URL
          if (networkResponse.redirected) {
            const redirectedResponse = await fetch(networkResponse.url);
            if (redirectedResponse.ok) {
              const cache = await caches.open(CACHE_NAME);
              cache.put(request, redirectedResponse.clone());
            }
            return redirectedResponse;
          }

          // Shranimo le veljavne standardne odzive (200 OK)
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }

          return networkResponse;
        })
        .catch(() => {
          // V primeru omrežne napake vrnemo predpomnjeno verzijo
          return cachedResponse;
        });

      // Vrnemo cachedResponse takoj če obstaja, sicer počakamo na networkResponse
      return cachedResponse || fetchPromise;
    })
  );
});