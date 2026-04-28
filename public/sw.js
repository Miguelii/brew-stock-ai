self.addEventListener('install', () => {
    self.skipWaiting()
})

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim())
})

self.addEventListener('push', function (event) {
    if (event.data) {
        const data = event.data.json()
        const options = {
            body: data.body,
            icon: data.icon || '/web-app-manifest-192x192.png',
            badge: '/web-app-manifest-192x192.png',
            vibrate: [100, 50, 100],
            data: { dateOfArrival: Date.now() },
        }
        event.waitUntil(self.registration.showNotification(data.title, options))
    }
})

self.addEventListener('notificationclick', function (event) {
    event.notification.close()
    event.waitUntil(clients.openWindow('/reports'))
})
