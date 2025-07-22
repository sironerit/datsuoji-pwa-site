const CACHE_NAME = 'datsuoji-ai-v2.0.0';
const STATIC_CACHE = 'datsuoji-static-v2.0.0';
const RUNTIME_CACHE = 'datsuoji-runtime-v2.0.0';

// Files to cache on install
const STATIC_FILES = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Runtime caching patterns
const RUNTIME_CACHING = [
  {
    urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
    handler: 'CacheFirst',
    options: {
      cacheName: 'google-fonts-stylesheets'
    }
  },
  {
    urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
    handler: 'CacheFirst',
    options: {
      cacheName: 'google-fonts-webfonts',
      expiration: {
        maxEntries: 30,
        maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
      }
    }
  }
];

// Install event
self.addEventListener('install', (event) => {
  console.log('[SW] Install event');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Pre-caching static assets');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        // Force activation of new service worker
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Pre-caching failed:', error);
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      cleanupOldCaches(),
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Handle different types of requests
  if (isStaticAsset(url)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isAPIRequest(url)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isHTMLRequest(request)) {
    event.respondWith(handleHTMLRequest(request));
  } else {
    event.respondWith(handleOtherRequests(request));
  }
});

// Message event for communication with main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(RUNTIME_CACHE)
        .then((cache) => cache.addAll(event.data.payload))
    );
  }
});

// Push notification event
self.addEventListener('push', (event) => {
  console.log('[SW] Push received');
  
  if (!event.data) return;
  
  const options = {
    body: event.data.text(),
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/'
    },
    actions: [
      {
        action: 'open',
        title: '開く'
      },
      {
        action: 'dismiss',
        title: '閉じる'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('脱おじ構文AI', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        // Check if app is already open
        for (const client of clients) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      })
  );
});

// Background sync event
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Helper functions

function cleanupOldCaches() {
  return caches.keys().then((cacheNames) => {
    const validCaches = [STATIC_CACHE, RUNTIME_CACHE];
    
    return Promise.all(
      cacheNames
        .filter((cacheName) => !validCaches.includes(cacheName))
        .map((cacheName) => {
          console.log('[SW] Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
    );
  });
}

function isStaticAsset(url) {
  return url.pathname.match(/\.(css|js|png|jpg|jpeg|svg|ico|woff|woff2)$/);
}

function isAPIRequest(url) {
  return url.pathname.startsWith('/api/');
}

function isHTMLRequest(request) {
  return request.headers.get('Accept')?.includes('text/html');
}

function handleStaticAsset(request) {
  // Network First for CSS/JS to ensure fresh updates
  return fetch(request)
    .then((response) => {
      // Don't cache non-successful responses
      if (!response || response.status !== 200 || response.type !== 'basic') {
        return response;
      }
      
      // Cache the fresh response
      const responseToCache = response.clone();
      caches.open(STATIC_CACHE)
        .then((cache) => {
          cache.put(request, responseToCache);
        });
      
      return response;
    })
    .catch((error) => {
      console.error('[SW] Network failed, serving cached static asset:', error);
      // Fall back to cache if network fails
      return caches.match(request).then((cachedResponse) => {
        return cachedResponse || new Response('Offline', { status: 503 });
      });
    });
}

function handleAPIRequest(request) {
  // Network first strategy for API requests
  return fetch(request)
    .then((response) => {
      // Cache successful API responses for offline use
      if (response.ok) {
        const responseToCache = response.clone();
        caches.open(RUNTIME_CACHE)
          .then((cache) => {
            cache.put(request, responseToCache);
          });
      }
      return response;
    })
    .catch((error) => {
      console.log('[SW] API request failed, trying cache:', error);
      
      // Fall back to cache
      return caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Return offline message for API failures
        return new Response(
          JSON.stringify({
            error: 'Offline',
            message: 'この機能はオフラインでは利用できません。'
          }),
          {
            status: 503,
            statusText: 'Service Unavailable',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      });
    });
}

function handleHTMLRequest(request) {
  // Network First strategy for HTML to ensure fresh content
  return fetch(request)
    .then((response) => {
      if (response && response.status === 200) {
        // Cache the fresh response
        const responseToCache = response.clone();
        caches.open(STATIC_CACHE)
          .then((cache) => {
            cache.put(request, responseToCache);
          });
        return response;
      }
      
      // If network fails, serve from cache
      return caches.match(request).then((cachedResponse) => {
        return cachedResponse || response;
      });
    })
    .catch((error) => {
      console.log('[SW] Network failed, serving from cache:', error);
      // Serve from cache as fallback
      return caches.match(request).then((response) => {
        return response || caches.match('/index.html') || new Response('Offline', { status: 503 });
      });
    });
}

function fetchAndCache(request) {
  return fetch(request)
    .then((response) => {
      if (!response || response.status !== 200) {
        return response;
      }
      
      const responseToCache = response.clone();
      caches.open(STATIC_CACHE)
        .then((cache) => {
          cache.put(request, responseToCache);
        });
      
      return response;
    })
    .catch((error) => {
      console.error('[SW] HTML fetch failed:', error);
      
      // Try to serve index.html for navigation requests (SPA fallback)
      if (request.mode === 'navigate') {
        return caches.match('/index.html') || caches.match('/');
      }
      
      return new Response('Offline', { status: 503 });
    });
}

function handleOtherRequests(request) {
  return fetch(request).catch((error) => {
    console.log('[SW] Other request failed:', error);
    
    // Try cache as fallback
    return caches.match(request).then((response) => {
      return response || new Response('Offline', { status: 503 });
    });
  });
}

async function doBackgroundSync() {
  console.log('[SW] Performing background sync');
  
  try {
    // Sync any pending data
    const pendingData = await getStoredData('pendingSync');
    
    if (pendingData && pendingData.length > 0) {
      for (const item of pendingData) {
        try {
          await fetch(item.url, item.options);
          // Remove from pending list on success
          await removeFromPendingSync(item.id);
        } catch (error) {
          console.error('[SW] Background sync item failed:', error);
        }
      }
    }
    
    console.log('[SW] Background sync completed');
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// IndexedDB helpers for offline storage
function getStoredData(key) {
  return new Promise((resolve) => {
    // Simplified mock implementation
    // In production, you'd use IndexedDB
    resolve([]);
  });
}

function removeFromPendingSync(id) {
  return new Promise((resolve) => {
    // Simplified mock implementation
    resolve();
  });
}

// Performance monitoring
self.addEventListener('fetch', (event) => {
  // Log slow requests for monitoring
  const startTime = Date.now();
  
  event.respondWith(
    handleFetch(event.request).then((response) => {
      const duration = Date.now() - startTime;
      
      if (duration > 1000) {
        console.warn(`[SW] Slow request (${duration}ms):`, event.request.url);
      }
      
      return response;
    })
  );
});

function handleFetch(request) {
  // This would contain your main fetch logic
  return fetch(request);
}