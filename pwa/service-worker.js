const staticDevCoffee = "pwa-poc-v1";
const assets = [
    "/",
    "/index.html",
    "/diagnostics.html",
    "/state.html",
    "/css/style.css",
    "/js/app.js",
    "/js/system_data.js"
    "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css",
    "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js",
    "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js",
    "https://canvasjs.com/assets/css/jquery-ui.1.11.2.min.css",
    "https://canvasjs.com/assets/script/jquery-1.11.1.min.js",
    "https://canvasjs.com/assets/script/jquery-ui.1.11.2.min.js",
    "https://canvasjs.com/assets/script/jquery.canvasjs.min.js"
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