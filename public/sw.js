// Service worker de BuddyEtude
//  - Application installable : l'interface s'ouvre même avec une connexion instable
//    (page d'accueil de l'appli mise en cache, fichiers /assets/ versionnés mis en cache).
//  - Notifications push : affiche les notifications envoyées par les Cloud Functions (FCM)
//    et ouvre la bonne page au clic.
// Les données (Firestore, Storage, Auth) ne passent jamais par ce cache.

const CACHE = "buddyetude-v1";
const SHELL = "/index.html";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.add(SHELL)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Pages : réseau d'abord (toujours la dernière version), cache seulement hors connexion
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(SHELL, copy));
          }
          return response;
        })
        .catch(() => caches.match(SHELL))
    );
    return;
  }

  // Fichiers versionnés (nom avec empreinte) : cache d'abord, ils ne changent jamais
  if (url.pathname.startsWith("/assets/")) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      }))
    );
  }
});

// --- Notifications push (messages "data" envoyés par les Cloud Functions)
self.addEventListener("push", (event) => {
  let payload = {};
  try { payload = event.data ? event.data.json() : {}; } catch { payload = {}; }
  const data = payload.data || payload;
  const title = data.title || "BuddyEtude";
  event.waitUntil(
    // Site ouvert et au premier plan : l'interface affiche déjà les pastilles, pas de doublon
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      if (windows.some((w) => w.focused && w.visibilityState === "visible")) return undefined;
      return self.registration.showNotification(title, {
        body: data.body || "",
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        tag: data.tag || undefined,
        renotify: Boolean(data.tag),
        data: { link: data.link || "/Dashboard" },
      });
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const link = event.notification.data?.link || "/Dashboard";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      for (const w of windows) {
        if (new URL(w.url).origin === self.location.origin && "focus" in w) {
          w.navigate(link).catch(() => {});
          return w.focus();
        }
      }
      return self.clients.openWindow(link);
    })
  );
});
