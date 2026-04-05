/**
 * Fichier servi en statique sur /sw.js pour éviter que Next.js ne route cette URL
 * vers app/(public)/[ville] (segment dynamique "sw.js"), ce qui provoquait des erreurs
 * de compilation / vendor-chunks au chargement du service worker.
 */
self.addEventListener('install', () => {
  self.skipWaiting()
})
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})
