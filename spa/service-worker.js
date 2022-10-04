self.context = {
  "environment": {
    "client": false,
    "server": true,
    "development": false,
    "production": true,
    "mode": "spa",
    "key": "5e88ecddfe7334c3276d484a23e766aa9498b091",
    "name": ""
  },
  "project": {
    "name": "Hqist - Dowload pdf hqs from hqnow",
    "shortName": "Hqist",
    "color": "#202A37",
    "viewport": "width=device-width, initial-scale=1, shrink-to-fit=no",
    "type": "website",
    "display": "standalone",
    "orientation": "portrait",
    "scope": "/",
    "root": "/",
    "sitemap": false,
    "favicon": "/favicon.ico",
    "disallow": [],
    "icons": {
      "16": "./ios/16.png",
      "20": "./ios/20.png",
      "24": "./windows11/Square44x44Logo.altform-lightunplated_targetsize-24.png",
      "29": "./ios/29.png",
      "30": "./windows11/Square44x44Logo.altform-lightunplated_targetsize-30.png",
      "32": "./ios/32.png",
      "36": "./windows11/Square44x44Logo.altform-lightunplated_targetsize-36.png",
      "40": "./ios/40.png",
      "44": "./windows11/Square44x44Logo.altform-lightunplated_targetsize-44.png",
      "48": "./android/android-launchericon-48-48.png",
      "50": "./ios/50.png",
      "55": "./windows11/Square44x44Logo.scale-125.png",
      "57": "./ios/57.png",
      "58": "./ios/58.png",
      "60": "./ios/60.png",
      "63": "./windows11/StoreLogo.scale-125.png",
      "64": "./ios/64.png",
      "66": "./windows11/Square44x44Logo.scale-150.png",
      "71": "./windows11/SmallTile.scale-100.png",
      "72": "./ios/72.png",
      "75": "./windows11/StoreLogo.scale-150.png",
      "76": "./ios/76.png",
      "80": "./ios/80.png",
      "87": "./ios/87.png",
      "88": "./windows11/Square44x44Logo.scale-200.png",
      "89": "./windows11/SmallTile.scale-125.png",
      "96": "./android/android-launchericon-96-96.png",
      "100": "./ios/100.png",
      "107": "./windows11/SmallTile.scale-150.png",
      "114": "./ios/114.png",
      "120": "./ios/120.png",
      "128": "./ios/128.png",
      "142": "./windows11/SmallTile.scale-200.png",
      "144": "./ios/144.png",
      "150": "./windows11/Square150x150Logo.scale-100.png",
      "152": "./ios/152.png",
      "167": "./ios/167.png",
      "176": "./windows11/Square44x44Logo.scale-400.png",
      "180": "./ios/180.png",
      "188": "./windows11/Square150x150Logo.scale-125.png",
      "192": "./ios/192.png",
      "200": "./windows11/StoreLogo.scale-400.png",
      "225": "./windows11/Square150x150Logo.scale-150.png",
      "256": "./ios/256.png",
      "284": "./windows11/SmallTile.scale-400.png",
      "300": "./windows11/Square150x150Logo.scale-200.png",
      "310": "./windows11/LargeTile.scale-100.png",
      "388": "./windows11/LargeTile.scale-125.png",
      "465": "./windows11/LargeTile.scale-150.png",
      "512": "./ios/512.png",
      "600": "./windows11/Square150x150Logo.scale-400.png",
      "620": "./windows11/SplashScreen.scale-100.png",
      "775": "./windows11/SplashScreen.scale-125.png",
      "930": "./windows11/SplashScreen.scale-150.png",
      "1024": "./ios/1024.png",
      "1240": "./windows11/SplashScreen.scale-200.png",
      "2480": "./windows11/SplashScreen.scale-400.png"
    },
    "backgroundColor": "#202A37"
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
