const CACHE = 'attendance-v1'

self.addEventListener('install', (e) => {
  self.skipWaiting()
  e.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll([
        '/',
        '/login',
        '/register',
        '/manifest.json',
        '/icon.svg',
        '/icon-192.svg',
      ])
    )
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fetched = fetch(e.request).then((res) => {
        if (res.ok && res.type === 'basic') {
          const clone = res.clone()
          caches.open(CACHE).then((cache) => cache.put(e.request, clone))
        }
        return res
      }).catch(() => cached)
      return cached || fetched
    })
  )
})
