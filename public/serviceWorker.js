var objectCache = "my-cache";
var dataCache = "data-cache";
var cachedGet = [
    "/", "/styles.css", "/index.js", "/api/transaction", "/icons/icon-192x192.png", "/icons/icon-512x512.png", "/manifest.json", "/db.js" 
];

console.log(self);
self.addEventListener('install', function (event) {
    event.waitUntil(caches.open(objectCache).then(function(cache){
        console.log("cacheOpened")
        return cache.addAll(cachedGet);
    })
    );
});
self.addEventListener('fetch', function (event) {
    if (event.request.url.includes("/api/")) {
        event.respondWith(
            caches.open(dataCache).then(cache => {
                return fetch(event.request)
                .then(response => {
                    if (response.status === 200) {
                        cache.put(event.request.url, response.clone())
                    }
                    return response;
                })
            })
        )
    }

    
            event.respondWith(
                fetch(event.request).catch(function() {
                return caches.match(event.request).then(function(response) {
                    if (response) {
                        return response;
                    }
                else if (event.request.headers.get("accept").includes("text/html")) {
                    return caches.match("/")
                };
                });
            })
            );
                   
    console.log(event.request.url);
  });