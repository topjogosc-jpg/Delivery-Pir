
const CACHE_NAME = 'delivery-pira-v2';
const APP_ICON = 'https://cdn-icons-png.flaticon.com/512/706/706164.png';

// Instalação do Service Worker e Cache de arquivos essenciais
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json'
      ]);
    })
  );
  self.skipWaiting();
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Interceptação de requisições para modo offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

/**
 * ESCUTADOR DE MENSAGENS (Notificações Internas do App)
 * Usado quando o lojista altera o status do pedido no App.tsx
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, orderId } = event.data;
    
    const options = {
      body: body,
      icon: APP_ICON,
      badge: APP_ICON,
      vibrate: [200, 100, 200],
      tag: 'order-update-' + (orderId || 'general'),
      renotify: true,
      data: {
        url: '/#orders' // Link para onde o usuário vai ao clicar
      }
    };

    self.registration.showNotification(title, options);
  }
});

/**
 * ESCUTADOR DE PUSH (Notificações Remotas via Servidor)
 * Preparado para quando você integrar um serviço como Firebase
 */
self.addEventListener('push', (event) => {
  let data = { title: 'Delivery Pira', body: 'Você tem uma nova atualização!' };
  
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    data.body = event.data.text();
  }

  const options = {
    body: data.body,
    icon: APP_ICON,
    badge: APP_ICON,
    vibrate: [100, 50, 100],
    data: { url: '/#orders' }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

/**
 * CLIQUE NA NOTIFICAÇÃO
 * Abre o aplicativo ou foca na aba já aberta
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Se já tiver uma aba aberta, foca nela
      for (const client of clientList) {
        if (client.url.includes(location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Se não, abre uma nova
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
