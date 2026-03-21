const CACHE_NAME = 'sos-calma-v2.6.0';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/audio/recognize_1.mp3',
  '/audio/recognize_2.mp3',
  '/audio/reframe_1.mp3',
  '/audio/reframe_2.mp3',
  '/audio/breathe_1.mp3',
  '/audio/breathe_2.mp3',
  '/audio/visualize_1_01.mp3',
  '/audio/visualize_1_02.mp3',
  '/audio/visualize_1_03.mp3',
  '/audio/visualize_1_04.mp3',
  '/audio/visualize_1_05.mp3',
  '/audio/visualize_1_06.mp3',
  '/audio/visualize_1_07.mp3',
  '/audio/visualize_1_08.mp3',
  '/audio/visualize_1_09.mp3',
  '/audio/visualize_1_10.mp3',
  '/audio/visualize_1_11.mp3',
  '/audio/identify_1.mp3',
  '/audio/focus_1.mp3',
  '/audio/anchor_1.mp3'
];

// Install: cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  // Do NOT skipWaiting here — wait for user to confirm update
});

// Activate: clean old caches, claim clients
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: network first, fallback to cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// Listen for SKIP_WAITING message from app
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
