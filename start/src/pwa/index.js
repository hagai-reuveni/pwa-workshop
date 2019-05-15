// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBfLRXB-hpP4apKs9cFPL_WuqYohXDdv_4",
    authDomain: "pwa-workshop-63f48.firebaseapp.com",
    databaseURL: "https://pwa-workshop-63f48.firebaseio.com",
    projectId: "pwa-workshop-63f48",
    storageBucket: "pwa-workshop-63f48.appspot.com",
    messagingSenderId: "1000934113831",
    appId: "1:1000934113831:web:581cee95d9a6f469"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

//Use this VAPID (taken from google firebase) to register tokens
messaging.usePublicVapidKey("BJbjv60gNlm-6v5eoE-x4YUGZb94LyJsVCtC6oM9Qqk6lWWHI1CODiiPdRDxAP_EnbGAPoxEmYb5l3mmSOChJck");

if ('serviceWorker' in navigator) {
    // sw.js can literally be empty, but must exist
    navigator.serviceWorker.register('sw.js')
        .then((registration) => messaging.useServiceWorker(registration))
        .then(() => requestNotificationsPermission())
        .then(() => getTokenFromMessagingService()) //Step 1 start here
        .then(token => sendTokenToMyServer(token))
        .then(res => {
            console.log('Notifications setup is ready');
        })
        .catch(err => console.log('Notifications Error', err));
}

const requestNotificationsPermission = () => {
    return messaging.requestPermission().then(() => {
        console.log('Notification permission granted.');
        return true;
    }).catch(function (err) {
        console.log('Unable to get permission to notify.', err);
    });
}

const getTokenFromMessagingService = () => {
    return messaging.getToken().then((currentToken) => {
        if (currentToken) {
            return currentToken;
        } else {
            console.log('No Instance ID token available. Request permission to generate one.');
            return null;
        }
    }).catch(function (err) {
        console.log('An error occurred while retrieving token. ', err);
    });
}

const sendTokenToMyServer = token => {
    if (token) {
        const addToken = firebase.functions().httpsCallable('addToken');
        return addToken({ token });
    }
    return Promise.reject('Problem sending token to backend');
}

// Will be triggered if a push is recieved but the tab is on focus
messaging.onMessage(function (payload) {
    console.log('Message received but app on Focus', payload);
    console.log(payload);
});