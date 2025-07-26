// Empty service worker to suppress 404 errors
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim()); 