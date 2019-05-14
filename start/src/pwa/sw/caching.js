importScripts('../../js/workbox.js');

const cssFiles = [
    '/css/first-section.css',
    '/css/main.css',
    '/css/second-section.css',
    '/css/third-section.css',
    '/css/tikal-tech-radar.css',
];

const scriptsFiles = [
    '/js/app.js',
    '/js/default.js',
    '/js/scripts.js',
    '/js/platform.js',
    '/js/workbox.js',
    '/pwa/index.js',
    '/pwa/sw/caching.js',
    '/pwa/sw/notifications.js'
];

const htmlFiles = [
    '/index.html',
    '/schedule/index.html',
    '/speakers/index.html',
    '/venue/index.html',
    '/updates/index.html',
    '/updates/Can-Kubernetes-Keep-a-Secret.html',
    '/updates/conversational-ui.html',
    '/updates/Full-Cycle-Development-at-netflix.html',
    '/updtes/Hacker-vs-Company-Cloud-Cyber-Security-Automated-with-Kubernetes.html',
    '/updates/Interview-With-Haggai-About-Chaos-Engineering.html',
    '/updates/OnRadar-Episode-1-A-Config-Keeping-tale.html',
    '/updates/You-Are-Not-A-Commodity.html'
]

const otherFiles = [
    '/site.webmanifest'
];

const initCaching = () =>{
    if (workbox) {
        workbox.precaching.precacheAndRoute([...cssFiles, 
            ...scriptsFiles, ...htmlFiles, ...otherFiles]);
    
        workbox.routing.registerRoute(
            /(.*)\.(?:png|gif|jpg|svg|ico|jpeg)/,
            workbox.strategies.cacheFirst({
                cacheName: 'images-cache',
                plugins: [
                    new workbox.expiration.Plugin({
                        maxEntries: 200,
                        maxAgeSeconds: 7 * 24 * 60 * 60, // a week
                    })
                ]
            })
        );
    } else {
        console.log(`Workbox didn't load 😬`);
    }
}