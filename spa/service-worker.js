self.context = {
  "environment": {
    "client": false,
    "server": true,
    "development": false,
    "production": true,
    "mode": "spa",
    "key": "d3dc5a6320b8f4d0b36bf10f817fc945d3b157b6",
    "name": ""
  },
  "project": {
    "domain": "localhost",
    "name": "Hq Dowloader - Dowload pdf hqs from hqnow",
    "shortName": "HqDowloader",
    "color": "#D22365",
    "viewport": "width=device-width, initial-scale=1, shrink-to-fit=no",
    "type": "website",
    "display": "standalone",
    "orientation": "portrait",
    "scope": "/",
    "root": "/",
    "sitemap": false,
    "favicon": "/favicon-96x96.png",
    "disallow": [],
    "icons": {}
  },
  "settings": {},
  "worker": {
    "enabled": true,
    "fetching": false,
    "preload": [],
    "headers": {},
    "api": "",
    "cdn": "",
    "protocol": "https",
    "queues": {}
  }
};

async function load(event) {
    const response = await event.preloadResponse;
    if (response) return response;
    return await fetch(event.request);
}


async function cacheFirst(event) {
    const cache = await caches.open(self.context.environment.key);
    const cachedResponse = await cache.match(event.request);
    if (cachedResponse) return cachedResponse;
    const response = await load(event);
    await cache.put(event.request, response.clone());
    return response;
}


async function staleWhileRevalidate(event) {
    const cache = await caches.open(self.context.environment.key);
    const cachedResponse = await cache.match(event.request);
    const networkResponsePromise = load(event);
    event.waitUntil(async function() {
        const networkResponse = await networkResponsePromise;
        await cache.put(event.request, networkResponse.clone());
    }());
    return cachedResponse || networkResponsePromise;
}


async function networkFirst(event) {
    const cache = await caches.open(self.context.environment.key);
    try {
        const networkResponse = await load(event);
        await cache.put(event.request, networkResponse.clone());
        return networkResponse;
    } catch (error) {
        return await cache.match(event.request);
    }
}


function install(event) {
    const urls = [
        "/",
        ...self.context.worker.preload,
        "/manifest.webmanifest",
        `/client.js?fingerprint=${self.context.environment.key}`,
        `/client.css?fingerprint=${self.context.environment.key}`,
         
    ];
    event.waitUntil(async function() {
        const cache = await caches.open(self.context.environment.key);
        await cache.addAll([
            ...new Set(urls)
        ]);
        self.skipWaiting();
    }());
}
self.addEventListener("install", install);


function activate(event) {
    event.waitUntil(async function() {
        const cacheNames = await caches.keys();
        const cachesToDelete = cacheNames.filter((cacheName)=>cacheName !== self.context.environment.key
        );
        await Promise.all(cachesToDelete.map((cacheName)=>caches.delete(cacheName)
        ));
        if (self.registration.navigationPreload) {
            await self.registration.navigationPreload.enable();
        }
        self.clients.claim();
    }());
}
self.addEventListener("activate", activate);


function dynamicStrategy(event) {
    event.waitUntil(async function() {
        const url = new URL(event.request.url);
        if (url.origin !== location.origin) return;
        if (event.request.method !== "GET") return;
        if (url.pathname.indexOf("/nullstack/") > -1) {
            return event.respondWith(networkFirst(event));
        }
        if (url.pathname.indexOf(self.context.environment.key) > -1) {
            return event.respondWith(cacheFirst(event));
        }
        if (url.pathname.indexOf(".") > -1) {
            return event.respondWith(staleWhileRevalidate(event));
        }
        event.respondWith(networkFirst(event));
    }());
}
self.addEventListener("fetch", dynamicStrategy);
