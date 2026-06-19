const CACHE_NAME = 'quickdrink-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/app.js',
    '/manifest.json',
    '/icons/android/drawable-hdpi/QuickDrink.png',
    '/icons/android/drawable-xxxhdpi/QuickDrink.png'
];

// តម្លើង និង Cache ឯកសារ
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// ទាញយកពី Cache មកបង្ហាញបើគ្មានអ៊ីនធឺណិត
self.addEventListener('fetch', event => {
    // មិន Cache API request ទៅកាន់ Backend ទេ
    if (event.request.url.includes('/api/')) return;

    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});