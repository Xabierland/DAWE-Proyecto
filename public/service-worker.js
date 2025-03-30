/* eslint-disable no-restricted-globals */

// Service Worker mejorado para reducir peticiones duplicadas y manejar errores
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

// Definir __WB_MANIFEST como un array vacío si es undefined
self.__WB_MANIFEST = self.__WB_MANIFEST || [];

if (workbox) {
  console.log(`Workbox está cargado correctamente`);
  
  // Configuración para debug en desarrollo y silenciar en producción
  workbox.setConfig({
    debug: false  // Cambiar a true solo durante desarrollo
  });
  
  // Precachear manifest.json y recursos críticos
  workbox.precaching.precacheAndRoute([
    { url: '/manifest.json', revision: '1' },
    { url: '/index.html', revision: '1' },
    ...self.__WB_MANIFEST
  ]);
  
  // Cache para estilos y scripts (JavaScript, CSS)
  // Cambiado a CacheFirst para reducir peticiones duplicadas
  workbox.routing.registerRoute(
    ({ request }) => 
      request.destination === 'style' ||
      request.destination === 'script',
    new workbox.strategies.CacheFirst({
      cacheName: 'assets-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 días
          purgeOnQuotaError: true
        }),
        // Plugin para manejar errores de caché
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ]
    })
  );
  
  // Cache específica para manifest.json
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
  
  // Cache para imágenes optimizada
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'images-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
          purgeOnQuotaError: true
        }),
        // Solo cachear respuestas exitosas
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ],
    })
  );
  
  // Cache para fuentes
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'font',
    new workbox.strategies.CacheFirst({
      cacheName: 'fonts-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 30,
          maxAgeSeconds: 60 * 24 * 60 * 60, // 60 días
          purgeOnQuotaError: true
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ]
    })
  );
  
  // Cache para iconos de la aplicación
  workbox.routing.registerRoute(
    /\/imagenes\/icons\//,
    new workbox.strategies.CacheFirst({
      cacheName: 'app-icons-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 15,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
          purgeOnQuotaError: true
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ],
    })
  );
  
  // Para navegación: primero red, con fallback a caché para offline
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'pages-cache',
      networkTimeoutSeconds: 3, // Timeout para caer a caché si la red es lenta
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          purgeOnQuotaError: true
        }),
        // Servir una página offline específica si no hay conexión
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ],
    })
  );
  
  // Estrategia de fallback para cualquier otra petición que falle
  workbox.routing.setCatchHandler(({ event }) => {
    // Si es una navegación, devolver la página de offline
    if (event.request.destination === 'document') {
      return caches.match('/index.html');
    }
    
    // Para imágenes, devolver una imagen placeholder
    if (event.request.destination === 'image') {
      return caches.match('/imagenes/productos/default.png');
    }
    
    // Para cualquier otro caso, devolver un error amigable
    return Response.error();
  });
  
} else {
  console.error(`¡Error! Workbox no se pudo cargar`);
}

// Evento de activación - tomar control inmediatamente
self.addEventListener('activate', (event) => {
  // Tomar control de los clientes no controlados
  event.waitUntil(clients.claim());
  
  // Limpiar caches antiguas
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          // Eliminar caches obsoletas (ajustar según cacheNames definidos arriba)
          return cacheName.startsWith('workbox-') && 
                 !cacheName.includes('assets-cache') &&
                 !cacheName.includes('images-cache') &&
                 !cacheName.includes('fonts-cache') &&
                 !cacheName.includes('pages-cache') &&
                 !cacheName.includes('app-manifest') &&
                 !cacheName.includes('app-icons-cache');
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Evento de instalación - cachear recursos esenciales y activar skip waiting
self.addEventListener('install', (event) => {
  // Usar skipWaiting para activar el SW inmediatamente
  self.skipWaiting();
  
  // Cachear recursos esenciales manualmente (además del precaching)
  const cacheEsenciales = async () => {
    const cache = await caches.open('essential-cache');
    await cache.addAll([
      '/',
      '/index.html',
      '/manifest.json'
    ]);
  };
  
  event.waitUntil(cacheEsenciales());
});

// Evento de mensaje - manejar skip waiting desde la UI
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});