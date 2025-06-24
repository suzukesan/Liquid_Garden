/// <reference lib="webworker" />

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

declare const self: ServiceWorkerGlobalScope;

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  self.clients.claim()
})

self.addEventListener('push', (event) => {
  const data = event.data?.json() || {}
  const title = data.title || '🌿 Liquid Garden'
  const options = {
    body: data.body || 'Time to care for your plants',
    icon: '/icon-192x192.png',
    badge: '/icon-96x96.png',
    data: data
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus()
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('/')
      }
    })
  )
}) 