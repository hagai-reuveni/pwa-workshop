importScripts('https://www.gstatic.com/firebasejs/6.0.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.0.1/firebase-messaging.js');

firebase.initializeApp({'messagingSenderId': '1000934113831'});

const messaging = firebase.messaging();

const initMessaging = () =>{
    messaging.setBackgroundMessageHandler(function (payload) {
        console.log('[firebase-messaging-sw.js] Received background message ', payload);
        // Customize notification here
        var notificationTitle = payload.data.title;
        var notificationOptions = {
            body: payload.data.body,
            icon: '/mstile-150x150.png',
            data:{url:payload.data.url}
        };
        
        return self.registration.showNotification(notificationTitle,notificationOptions);
    });
}

self.addEventListener('notificationclick', function(event) {
    console.log(event);
    const url = event.notification.data.url;
    event.notification.close(); // Android needs explicit close.
    event.waitUntil(
        clients.matchAll({type: 'window'}).then( windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                console.log(client);
                // If so, just focus it.
                if (url.indexOf(client.url) > -1  && 'focus' in client) {
                     client.focus();
                     self.location.href = url;
                     return null;
                }
            }
            // If not, then open the target URL in a new window/tab.
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});