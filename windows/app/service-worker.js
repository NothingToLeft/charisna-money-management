"use strict";

const CACHE_NAME = "charisna-money-management-v14.1.2-mint";
const APP_FILES = [
  "./",
  "./index.html?v=14.1.2-mint",
  "./styles.css?v=14.1.2-mint",
  "./styles-pro.css?v=14.1.2-mint",
  "./styles-patch-v9.css?v=14.1.2-mint",
  "./styles-patch-v10.css?v=14.1.2-mint",
  "./styles-patch-v11.css?v=14.1.2-mint",
  "./styles-patch-v12.css?v=14.1.2-mint",
  "./styles-native.css?v=14.1.2-mint",
  "./styles-cute-v13.css?v=14.1.2-mint",
  "./styles-mobile-v13-1.css?v=14.1.2-mint",
  "./styles-patch-v14.css?v=14.1.2-mint",
  "./styles-mint.css?v=14.1.2-mint",
  "./native-bootstrap.js?v=14.1.2-mint",
  "./app.js?v=14.1.2-mint",
  "./app-pro.js?v=2026-11-07-cloud-password",
  "./app-patch-v9.js?v=14.1.2-mint",
  "./app-patch-v10.js?v=14.1.2-mint",
  "./app-patch-v11.js?v=14.1.2-mint",
  "./app-patch-v12.js?v=14.1.2-mint",
  "./app-patch-v13.js?v=14.1.2-mint",
  "./app-patch-v14.js?v=14.1.2-mint",
  "./superapp-sync.js?v=14.1.2-superapp-audit",
  "./manifest.webmanifest?v=14.1.2-mint",
  "./PRIVACY-POLICY.html",
  "./CHANGELOG.html",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./vendor/chart.umd.js",
  "./vendor/xlsx.full.min.js",
  "./vendor/jspdf.umd.min.js",
  "./vendor/tesseract.min.js",
  "./vendor/supabase.js",
  "./vendor/jszip.min.js",
  "./vendor/exceljs.min.js",
  "./vendor/worker.min.js",
  "./vendor/tesseract-core-lstm.wasm.js",
  "./vendor/tesseract-core-lstm.wasm",
  "./ocr/eng.traineddata.gz",
  "./ocr/ind.traineddata.gz"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_FILES)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((name) => name.startsWith("charisna-money-management-") && name !== CACHE_NAME).map((name) => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("./index.html?v=14.1.2-mint", copy));
          return response;
        })
        .catch(() => caches.match("./index.html?v=14.1.2-mint"))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response?.status === 200) caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()));
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data?.json() || {};
  } catch {
    payload = { title: "CHARISNA Money Management", body: event.data?.text() || "Ada pengingat keuangan baru." };
  }

  const title = payload.title || "CHARISNA Money Management";
  const options = {
    body: payload.body || "Buka aplikasi untuk melihat pengingat tagihan.",
    icon: "./icons/icon-192.png",
    badge: "./icons/icon-192.png",
    tag: payload.tag || "charisna-bill-reminder",
    renotify: Boolean(payload.renotify),
    requireInteraction: Boolean(payload.requireInteraction),
    timestamp: payload.timestamp || Date.now(),
    data: {
      url: payload.url || "./index.html?v=14.1.2-mint",
      scheduleId: payload.scheduleId || null,
      dueDate: payload.dueDate || null
    },
    actions: [
      { action: "open", title: "Buka CHARISNA" },
      { action: "dismiss", title: "Nanti" }
    ]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "dismiss") return;
  const targetUrl = new URL(event.notification.data?.url || "./index.html?v=14.1.2-mint", self.location.origin).href;
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      const existing = list.find((client) => client.url.startsWith(self.location.origin) && "focus" in client);
      if (existing) {
        existing.postMessage({ type: "OPEN_REMINDER_CENTER", data: event.notification.data || {} });
        return existing.focus();
      }
      return clients.openWindow(targetUrl);
    })
  );
});
