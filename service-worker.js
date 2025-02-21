// service-worker.js

const CACHE_NAME = 'wanzo-tech-api-cache-v1';
const urlsToCache = [
  '/',
  'index.html',
  'manifest.json',
  'admin.html', // Ganti dengan path ke file CSS Anda
  'server.js',    // Ganti dengan path ke file JavaScript utama Anda
  '/icon-192x192.png', // Ganti dengan path ke file ikon Anda
  '/icon-512x512.png'  // Ganti dengan path ke file ikon Anda
];

// Instalasi Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache berhasil dibuka.');
        return cache.addAll(urlsToCache);
      })
  );
});

// Strategi Cache First untuk mengambil aset
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - mengembalikan respons dari cache
        if (response) {
          return response;
        }

        // Jika tidak ada di cache, ambil dari jaringan
        return fetch(event.request).then(
          (response) => {
            // Periksa apakah respons valid
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Penting: Buat salinan respons dan simpan di cache
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Aktivasi Service Worker (opsional: untuk membersihkan cache lama)
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Menghapus cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Penanganan Push Notifications (kerangka dasar)
self.addEventListener('push', (event) => {
  console.log('Push notification diterima', event);

  let notificationTitle = 'WANZOFC TECH API';
  let notificationOptions = {
    body: 'Anda mendapatkan notifikasi baru!',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png' ,//ikon kecil untuk bilah status
    data: {
      url: '/' // URL yang akan dibuka saat notifikasi diklik
    }
  };

  if (event.data) {
    const dataText = event.data.text();
    try {
      const data = JSON.parse(dataText);
      notificationTitle = data.title || notificationTitle;
      notificationOptions.body = data.body || notificationOptions.body;
      notificationOptions.icon = data.icon || notificationOptions.icon;
      notificationOptions.data.url = data.url || notificationOptions.data.url;

    } catch (e) {
       notificationOptions.body = dataText;
    }
  }
  event.waitUntil(self.registration.showNotification(notificationTitle, notificationOptions));
});

// Menangani Klik pada Notifikasi Push
self.addEventListener('notificationclick', (event) => {
  const notification = event.notification;
  const action = event.action;

  if (action === 'close') {
    notification.close();
  } else {
    clients.openWindow(notification.data.url);
    notification.close();
  }
});
