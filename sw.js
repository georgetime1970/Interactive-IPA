// sw.js  最简版也行
self.addEventListener('install', (e) => {
  self.skipWaiting()
})

self.addEventListener('fetch', (e) => {
  // 可以什么都不做，只是占位
})
