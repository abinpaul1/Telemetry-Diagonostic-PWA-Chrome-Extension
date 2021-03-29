const staticDevCoffee = "telemetry-pwa-v1";
const assets = [
    "/",
    "/index.html",
    "/diagnostics.html",
    "/state.html",
    "/js/app.js",
    "/js/system_data.js",
    "/css/bootstrap/bootstrap.min.css",
    "/css/bootstrap/bootstrap.min.css.map",
    "/js/bootstrap/jquery.min.js",
    "/js/bootstrap/bootstrap.min.js",
    "/css/canvasjs/jquery-ui.1.11.2.min.css",
    "/js/canvasjs/jquery-1.11.1.min.js",
    "/js/canvasjs/jquery-ui.1.11.2.min.js",
    "/js/canvasjs/jquery.canvasjs.min.js"
];

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(staticDevCoffee).then(cache => {
            cache.addAll(assets);
        })
    );
});

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request);
        })
    );
});