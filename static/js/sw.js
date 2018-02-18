self.addEventListener('install', function (event) {
  console.log('SW Installed');
  event.waitUntil(
    caches.open('static')
      .then(function (cache) {
        cache.addAll([
          '/',
          '/index.html',
          '/static/js/app.js',
          '/static/css/app.css',
          '/static/images/audio-high.png',
          '/static/icons/wechat.png'
        ]);
      })
  );
});

self.addEventListener('activate', function () {
  console.log('SW Activated');
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(res) {
        if (res) {
          return res;
        } else {
          return fetch(event.request);
        }
      })
  );
});

self.addEventListener('push', function (event) {
  var title = 'Yay a message.';
  var body = 'We have received a push message.';
  var icon = '/static/icons/wechat.png';
  var tag = 'simple-push-demo-notification-tag';
  var data = {
    doge: {
      wow: 'such amaze notification data'
    }
  };
  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
      tag: tag,
      data: data
    })
  );
});
