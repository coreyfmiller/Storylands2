// Storylands offline support.
//
// These books are read at bedtime, in the back of a car, and on a plane. A
// flaky connection used to mean a blank screen halfway through a story. The
// whole library is about 14 MB of WebP now, which is small enough to keep.
//
// Two strategies, chosen by what the request is for:
//
//   Images and fonts  — cache first. A page illustration never changes; once
//                       page 7 is on the device it should never be fetched
//                       again, on any connection.
//   Everything else   — network first, falling back to cache. The app shell
//                       should update the moment a deploy lands, and only
//                       pretend to be offline when it actually is.
//
// Bump VERSION on any change here. Old caches are deleted on activate, so a
// stale asset cannot outlive a deploy.

const VERSION = 'v2'
const SHELL = `storylands-shell-${VERSION}`
const MEDIA = `storylands-media-${VERSION}`
const KEEP = [SHELL, MEDIA]

// Enough to open the app with no connection at all. Page art is not listed:
// precaching 93 images would make the first visit download the entire library
// before anything rendered. It arrives as it is read, and stays.
const SHELL_URLS = ['/', '/offline']

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL)
      // One bad URL must not fail the whole install, or the worker never
      // activates and offline silently does not exist.
      await Promise.allSettled(SHELL_URLS.map((url) => cache.add(new Request(url))))
      await self.skipWaiting()
    })(),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys()
      await Promise.all(names.filter((n) => !KEEP.includes(n)).map((n) => caches.delete(n)))
      await self.clients.claim()
    })(),
  )
})

function isMedia(request, url) {
  const d = request.destination
  if (d === 'image' || d === 'font' || d === 'audio') return true
  // Narration audio and its manifest are immutable per deploy and are the
  // difference between a book working on a plane and not.
  return /\.(webp|png|jpg|jpeg|svg|woff2?|mp3|m4a|ogg)$/i.test(url.pathname)
    || /\/audio\/narration\.json$/.test(url.pathname)
}

self.addEventListener('fetch', (event) => {
  const { request } = event

  // Only GET. A POST is never safe to replay from a cache.
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  // Never cache analytics. It would both lie about traffic and replay old
  // events on reconnect.
  if (url.pathname.startsWith('/_vercel/')) return

  if (isMedia(request, url)) {
    event.respondWith(cacheFirst(request))
    return
  }

  event.respondWith(networkFirst(request))
})

async function cacheFirst(request) {
  const cache = await caches.open(MEDIA)
  const hit = await cache.match(request)
  if (hit) return hit
  try {
    const res = await fetch(request)
    // Opaque and error responses are not worth keeping; caching an error would
    // make a one-off failure permanent.
    if (res.ok && res.type === 'basic') cache.put(request, res.clone())
    return res
  } catch (e) {
    const shell = await caches.open(SHELL)
    const fallback = await shell.match(request)
    if (fallback) return fallback
    throw e
  }
}

async function networkFirst(request) {
  const cache = await caches.open(SHELL)
  try {
    const res = await fetch(request)
    if (res.ok && res.type === 'basic') cache.put(request, res.clone())
    return res
  } catch (e) {
    const hit = await cache.match(request)
    if (hit) return hit
    // A navigation with nothing cached gets a real page rather than the
    // browser's dinosaur, so a child sees words they can understand.
    if (request.mode === 'navigate') {
      const offline = await cache.match('/offline')
      if (offline) return offline
    }
    throw e
  }
}
