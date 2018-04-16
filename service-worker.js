//2.缓存站点的资源
var versionName = 'first-cache-v5';
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(versionName).then(function (cache) {
            return cache.addAll([
                '/',
                '/index.html',
                '/main.css',
                '/main.js',
                '/dog.jpg',
                '/dog2.jpg'
            ]);
        })
    );
});
//3.清除旧的缓存数据
self.addEventListener('activate', function (event) {
    event.waitUntil(
        Promise.all([
            // 更新客户端
            self.clients.claim(),
            // 清理旧版本
            caches.keys().then(function (cacheList) {
                return Promise.all(
                    cacheList.map(function (cacheName) {
                        if (cacheName !== versionName) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ])
    );
});
//4.处理动态缓存
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            if (response) return response;
            var request = event.request.clone(); // 把原始请求拷过来
            return fetch(request).then(function (httpRes) {
                if (!httpRes || httpRes.status !== 200)  return httpRes;
                var responseClone = httpRes.clone();
                caches.open(versionName).then(function (cache) {
                    cache.put(event.request, responseClone);
                });
                return httpRes;
            });
        })
    );
});
//5.消息推送
self.addEventListener('push', function (event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }
    var data = {};
    if (event.data) {
        data = event.data.json();
    }
    // 解析通知内容
    var title = data.title || "Introducing WhatFontIs is the Easiest Way to Identify Fonts Online";
    var message = data.message || "A free service to help you ...";
    var icon = "https://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2017/10/1507698696SitePoint@2x-96x96.png";
    var notification = self.registration.showNotification(title, {
        body: message,
        icon: icon
    });
});
