self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open("main").then(function (cache) {
            return cache.addAll(
                [
                    "/",
                    "/global.css",
                    "/times.woff2",
                    "/icon.png",
                    "/build/bundle.css",
                    "/build/bundle.js",

                    "/sound/success.wav",
                    "/sound/thought_patterns.m4a",

                    "/sprite/backg.webp",
                    "/sprite/button1.webp",
                    "/sprite/button2.webp",

                    "/sprite/michael_happy.webp",
                    "/sprite/michael_normal.webp",
                    "/sprite/michael_wings.webp",

                    "/sprite/uriel_bat.webp",
                    "/sprite/uriel_normal.webp",
                    "/sprite/uriel_side_happy.webp",
                    "/sprite/uriel_side_normal.webp",
                ]
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});