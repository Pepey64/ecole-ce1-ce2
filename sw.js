// Ludothèque — fonctionnement hors connexion.
// Toujours la version en ligne quand le réseau marche (les mises à jour arrivent tout de suite),
// et la dernière version enregistrée quand le réseau est coupé ou bloqué.
const CACHE = "ludotheque-v1";
const BASE = ["./", "index.html", "manifest.webmanifest", "icone-192.png", "icone-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(cles => Promise.all(cles.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req)
      .then(rep => {
        if (rep.ok) { const copie = rep.clone(); caches.open(CACHE).then(c => c.put(req, copie)); }
        return rep;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match("index.html")))
  );
});
