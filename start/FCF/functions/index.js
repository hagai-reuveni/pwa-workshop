const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.addToken = functions.https.onCall((data) => {
    const { token } = data;

    if (token) {
        admin.firestore().collection('tokens').doc(token).set({ token })
            .then(writeResult => 'OK')
            .catch(err => err);

        return 'OK';
    }

    return 'Token is missing';
});

exports.sendMessage = functions.https.onRequest((req, res) => {
    const {data} = req.body; 
    const collection = admin.firestore().collection('tokens');
    collection.get().then(tokens => {
        const arr = tokens.docs.map(doc => doc.data().token);
        
        arr.forEach(token => {
            const message = {data,token}
            admin.messaging().send(message)
                .then((response) => {
                    // Response is a message ID string.
                    console.log('Successfully sent message:', response);
                })
                .catch((error) => {
                    console.log('Error sending message:', error);
                });
        });
        res.send('OK');
    })
})