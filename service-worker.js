const CACHE_NAME = 'webinuxos-cache-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/assets/sonic wallpaper.jpeg',
  '/assets/terminal.png',
  '/assets/firefox.png',
  '/assets/notepad.png',
  '/assets/folder.png',
  '/assets/rhythmbox.png',
  '/assets/settings.png',
  '/assets/cursor.png',
  '/assets/Tux.png'

];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
