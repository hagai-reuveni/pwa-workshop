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

const FCFUrl = 'https://us-central1-pwa-workshop-63f48.cloudfunctions.net';

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
//pull out VAPID public key from: 
messaging.usePublicVapidKey("BJbjv60gNlm-6v5eoE-x4YUGZb94LyJsVCtC6oM9Qqk6lWWHI1CODiiPdRDxAP_EnbGAPoxEmYb5l3mmSOChJck");

if ('serviceWorker' in navigator) {
    // sw.js can literally be empty, but must exist
    navigator.serviceWorker.register('sw.js')
        .then((registration) => messaging.useServiceWorker(registration))
        .then(() => requestPermission())
        .then(() => getToken())
        .then(token => sendTokenToServer(token))
        .then(res  => {
            console.log('Notifications setup is ready');
        })
        .catch(err => console.log('Notifications Error',err));
}

const sendTokenToServer = token =>{
    const addToken = firebase.functions().httpsCallable('addToken');
    return addToken({token});
}


const getToken = () => {
    return messaging.getToken().then(function (currentToken) {
        if (currentToken) {
            return currentToken;
        } else {
            console.log('No Instance ID token available. Request permission to generate one.');
        }
    }).catch(function (err) {
        console.log('An error occurred while retrieving token. ', err);
    });
}

const requestPermission = () => {
    return messaging.requestPermission().then(function () {
        console.log('Notification permission granted.');
        return true;
    }).catch(function (err) {
        console.log('Unable to get permission to notify.', err);
    });
}

messaging.onMessage(function (payload) {
    console.log('Message received but app on Focus', payload);
    console.log(payload);
});