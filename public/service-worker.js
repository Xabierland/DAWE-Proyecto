/* eslint-disable no-restricted-globals */

// Este service worker puede ser personalizado!
// Ver https://developers.google.com/web/tools/workbox/modules
// para la lista de módulos disponibles de Workbox, o añadir cualquier otro
// código que quieras.
// También puedes eliminar este archivo si prefieres no usar un
// service worker, y el paso de construcción de Workbox se saltará.

// Importar scripts de Workbox
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

if (workbox) {
  console.log(`Workbox está cargado`);
  
  // Personalizar el directorio de precache y el nombre del manifiesto
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
  
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

// Cualquier otra lógica personalizada del service worker puede ir aquí.