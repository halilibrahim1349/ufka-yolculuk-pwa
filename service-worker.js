const CACHE_NAME = "ufka-yolculuk-pwa-v17";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./assets/social-preview.png",
  "./app.js",
  "./manifest.webmanifest",
  "./data/quiz-data.js",
  "./data/section-s123-fix.js",
  "./data/section-s1-learning.js",
  "./data/section-s2-learning.js",
  "./data/section-s3-learning.js",
  "./data/section-s4-learning.js",
  "./data/section-s4.js",
  "./data/section-s5.js",
  "./data/section-s5-learning.js",
  "./data/section-s6.js",
  "./data/section-s6-learning.js",
  "./data/section-s7.js",
  "./data/section-s7-learning.js",
  "./data/section-s8.js",
  "./data/section-s8-learning.js",
  "./data/section-s9.js",
  "./data/section-s9-learning.js",
  "./data/book-content.js",
  "./assets/pwa/icon-192.png",
  "./assets/pwa/icon-512.png",
  "./assets/pwa/maskable-512.png",
  "./assets/pwa/apple-touch-icon.png",
  "./assets/pwa/favicon-64.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

const putInCache = async (request, response) => {
  if (!response || response.status !== 200 || request.method !== "GET") {
    return response;
  }

  const requestUrl = new URL(request.url);
  if (requestUrl.origin !== self.location.origin) {
    return response;
  }

  const cache = await caches.open(CACHE_NAME);
  cache.put(request, response.clone());
  return response;
};

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => putInCache(new Request("./index.html"), response))
        .catch(() => caches.match("./index.html")),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request).then((response) => putInCache(event.request, response));
    }),
  );
});
