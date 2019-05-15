importScripts('https://www.gstatic.com/firebasejs/6.0.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.0.1/firebase-messaging.js');

firebase.initializeApp({ 'messagingSenderId': '1000934113831' });

const messaging = firebase.messaging();

const initMessaging = () => {
    messaging.setBackgroundMessageHandler(payload => {
        console.log('[notifications.js] Received background message ', payload);

        const notificationTitle = payload.data.title;
        const notificationOptions = {
            body: payload.data.body,
            icon: '/pwa/images/mstile-150x150.png',
            data: { url: payload.data.url }
        };

        return self.registration.showNotification(notificationTitle, notificationOptions);
    });
}

//Open the app when clicking the notification
self.addEventListener('notificationclick', event => {
    console.log('Notification have been clicked', event);
    event.notification.close(); // Explicit close.
    const url = event.notification.data.url;
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                // If so, just focus it.
                if (url.indexOf(client.url) > -1 && 'focus' in client) {
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

//clients API - https://developer.mozilla.org/en-US/docs/Web/API/Clients