/* eslint-disable no-restricted-globals */

// Este service worker puede ser personalizado!
// Ver https://developers.google.com/web/tools/workbox/modules
// para la lista de módulos disponibles de Workbox, o añadir cualquier otro
// código que quieras.
// También puedes eliminar este archivo si prefieres no usar un
// service worker, y el paso de construcción de Workbox se saltará.

// Importar scripts de Workbox
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

// Definir __WB_MANIFEST como un array vacío si es undefined
// Esto evita errores cuando no se genera el precache manifest
self.__WB_MANIFEST = self.__WB_MANIFEST || [];

if (workbox) {
  console.log(`Workbox está cargado`);
  
  // Precachear el manifest.json junto con otros recursos importantes
  workbox.precaching.precacheAndRoute([
    { url: '/manifest.json', revision: '1' },
    ...self.__WB_MANIFEST
  ]);
  
  // Regla específica para manifest.json
  workbox.routing.registerRoute(
    /manifest\.json$/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'app-manifest',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 1,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
        }),
      ],
    })
  );
  
  // Cache para imágenes
  workbox.routing.registerRoute(
    ({request}) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'images',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
        }),
      ],
    })
  );
  
  // Cache para fuentes
  workbox.routing.registerRoute(
    ({request}) => request.destination === 'font',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'fonts',
    })
  );
  
  // Cache para CSS y JavaScript 
  workbox.routing.registerRoute(
    ({request}) => 
      request.destination === 'style' ||
      request.destination === 'script',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-resources',
    })
  );
  
  // Cache para iconos de la aplicación
  workbox.routing.registerRoute(
    /\/img\/icons\//,
    new workbox.strategies.CacheFirst({
      cacheName: 'app-icons',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 10,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
        }),
      ],
    })
  );
  
  // Navegar por las rutas - usa Network First, cayendo en caché
  workbox.routing.registerRoute(
    ({request}) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'pages',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
        }),
      ],
    })
  );
  
} else {
  console.log(`Workbox no se pudo cargar`);
}

// Esto permite que la aplicación web active skipWaiting a través de
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Evento de instalación
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Evento de activación
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});