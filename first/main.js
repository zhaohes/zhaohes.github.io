//1.注册 service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/service-worker.js')
            .then(function (registration) {
                // 注册成功
                console.log('ServiceWorker registration successful');
                if('pushManager' in window){
                    registration.pushManager.getSubscription()
                        .then(function(subscription){
                            return subscription || registration.pushManager.subscribe();
                        })
                        .then(function(subscription){
                            var endpoint = subscription.endpoint;
                            var options = {
                                method: 'post',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ endpoint:endpoint })
                            };

                        })

                }
                console.log(registration);
            })
            .catch(function (err) {
                // 注册失败:(
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

