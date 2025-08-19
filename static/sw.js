// 📱 Service Worker for Pixel Portfolio Mobile Optimization
const CACHE_NAME = 'pixel-portfolio-v1.0.0';
const STATIC_CACHE = 'pixel-portfolio-static-v1.0.0';
const DYNAMIC_CACHE = 'pixel-portfolio-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/static/css/style.css',
    '/static/css/mobile.css',
    '/static/js/gamification.js',
    '/static/js/mobile.js',
    '/static/manifest.json',
    'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Share+Tech+Mono&display=swap'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
    console.log('📱 Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('📱 Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('📱 Service Worker: Static files cached successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('📱 Service Worker: Error caching static files:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('📱 Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('📱 Service Worker: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('📱 Service Worker: Activated successfully');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Handle different types of requests
    if (isStaticFile(request)) {
        event.respondWith(handleStaticFile(request));
    } else if (isAPIRequest(request)) {
        event.respondWith(handleAPIRequest(request));
    } else {
        event.respondWith(handlePageRequest(request));
    }
});

// Check if request is for a static file
function isStaticFile(request) {
    const url = new URL(request.url);
    return url.pathname.startsWith('/static/') ||
           url.pathname.startsWith('/media/') ||
           url.hostname === 'fonts.googleapis.com' ||
           url.hostname === 'fonts.gstatic.com';
}

// Check if request is for an API
function isAPIRequest(request) {
    const url = new URL(request.url);
    return url.pathname.startsWith('/api/') ||
           url.pathname.startsWith('/admin/');
}

// Handle static file requests
async function handleStaticFile(request) {
    try {
        // Try cache first
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Fallback to network
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('📱 Service Worker: Error handling static file:', error);
        
        // Return offline fallback for images
        if (request.destination === 'image') {
            return new Response(
                '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#ccc"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="#666">Image</text></svg>',
                {
                    headers: { 'Content-Type': 'image/svg+xml' }
                }
            );
        }
        
        throw error;
    }
}

// Handle API requests
async function handleAPIRequest(request) {
    try {
        // Network first for API requests
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('📱 Service Worker: Error handling API request:', error);
        
        // Try cache as fallback
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline response
        return new Response(
            JSON.stringify({ error: 'Offline - API unavailable' }),
            {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

// Handle page requests
async function handlePageRequest(request) {
    try {
        // Network first for pages
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('📱 Service Worker: Error handling page request:', error);
        
        // Try cache as fallback
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page
        return caches.match('/offline.html')
            .then((offlineResponse) => {
                if (offlineResponse) {
                    return offlineResponse;
                }
                
                // Create basic offline page
                return new Response(
                    `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Offline - Pixel Portfolio</title>
                        <style>
                            body {
                                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                                background: #F2F2F7;
                                color: #000000;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                min-height: 100vh;
                                margin: 0;
                                padding: 20px;
                            }
                            .offline-container {
                                text-align: center;
                                max-width: 400px;
                            }
                            .offline-icon {
                                font-size: 64px;
                                margin-bottom: 20px;
                            }
                            .offline-title {
                                font-size: 24px;
                                font-weight: 700;
                                margin-bottom: 10px;
                                color: #007AFF;
                            }
                            .offline-message {
                                font-size: 16px;
                                color: #8E8E93;
                                margin-bottom: 20px;
                                line-height: 1.5;
                            }
                            .retry-button {
                                background: #007AFF;
                                color: white;
                                border: none;
                                border-radius: 12px;
                                padding: 12px 24px;
                                font-size: 16px;
                                font-weight: 600;
                                cursor: pointer;
                                transition: background-color 0.2s ease;
                            }
                            .retry-button:hover {
                                background: #0056CC;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="offline-container">
                            <div class="offline-icon">📱</div>
                            <h1 class="offline-title">You're Offline</h1>
                            <p class="offline-message">
                                It looks like you've lost your internet connection. 
                                Some features may not be available while offline.
                            </p>
                            <button class="retry-button" onclick="window.location.reload()">
                                Try Again
                            </button>
                        </div>
                    </body>
                    </html>
                    `,
                    {
                        headers: { 'Content-Type': 'text/html' }
                    }
                );
            });
    }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('📱 Service Worker: Background sync triggered:', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(handleBackgroundSync());
    }
});

// Handle background sync
async function handleBackgroundSync() {
    try {
        // Process any pending offline actions
        const pendingActions = await getPendingActions();
        
        for (const action of pendingActions) {
            await processOfflineAction(action);
        }
        
        console.log('📱 Service Worker: Background sync completed');
    } catch (error) {
        console.error('📱 Service Worker: Background sync failed:', error);
    }
}

// Get pending offline actions from IndexedDB
async function getPendingActions() {
    // This would typically use IndexedDB to store offline actions
    // For now, return empty array
    return [];
}

// Process offline action
async function processOfflineAction(action) {
    try {
        const response = await fetch(action.url, {
            method: action.method,
            headers: action.headers,
            body: action.body
        });
        
        if (response.ok) {
            console.log('📱 Service Worker: Offline action processed successfully:', action);
        } else {
            console.error('📱 Service Worker: Offline action failed:', action);
        }
    } catch (error) {
        console.error('📱 Service Worker: Error processing offline action:', error);
    }
}

// Push notification handling
self.addEventListener('push', (event) => {
    console.log('📱 Service Worker: Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'New notification from Pixel Portfolio',
        icon: '/static/icons/icon-192x192.png',
        badge: '/static/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Explore',
                icon: '/static/icons/checkmark.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/static/icons/xmark.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Pixel Portfolio', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    console.log('📱 Service Worker: Notification clicked');
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
    console.log('📱 Service Worker: Message received:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(STATIC_CACHE)
                .then((cache) => {
                    return cache.addAll(event.data.urls);
                })
        );
    }
});

// Error handling
self.addEventListener('error', (event) => {
    console.error('📱 Service Worker: Error:', event.error);
});

// Unhandled rejection handling
self.addEventListener('unhandledrejection', (event) => {
    console.error('📱 Service Worker: Unhandled rejection:', event.reason);
});

console.log('📱 Service Worker: Loaded successfully');
