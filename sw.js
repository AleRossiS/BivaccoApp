// Service worker: keeps a copy of the app so it works offline.
const CACHE = 'bivacco-v1';                 // name of the storage box for our files
const FILES = ['./', './index.html', './manifest.webmanifest'];

/* Install: runs once, the first time. Save all files in the cache. */
self.addEventListener('install', (event) => {
  event.waitUntil(saveAll());
});

async function saveAll() {
  const cache = await caches.open(CACHE);
  await cache.addAll(FILES);
}

/* Every file request from the page passes through here. */
self.addEventListener('fetch', (event) => {
  event.respondWith(networkFirst(event.request));
});

/* Network first: try internet (fresh copy) and update the cache; if offline, use the cache. */
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE);
    cache.put(request, response.clone());   // keep the fresh copy for next time
    return response;
  } catch (err) {
    return caches.match(request);           // no network: serve the saved copy
  }
}