self.addEventListener('push', (event) => {
  const data = event.data?.json() || {}
  event.waitUntil(self.registration.showNotification(data.title || 'Komrez', { body: data.message || 'You have a new update.', icon: '/notification-icon.png', badge: '/notification-icon.png', data: { link: data.link || '/' }, tag: `${data.type || 'update'}-${data.link || ''}`, renotify: true }))
})
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target = new URL(event.notification.data?.link || '/', self.location.origin).href
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => { const existing = windows.find((client) => client.url.startsWith(self.location.origin)); if (existing) { existing.navigate(target); return existing.focus() } return clients.openWindow(target) }))
})
