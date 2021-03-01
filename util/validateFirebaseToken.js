var admin = require('firebase-admin')
var serviceAccount = require('../modechange-d4996-firebase-adminsdk-j90rs-e17e0c1a24.json')
var databaseURL = 'https://expinf.firebaseio.com/'
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: databaseURL
})

//if noLoginRequired is true then it means no authentication required for profile
function validateFirebaseIdToken(noLoginRequired) {
    return function(req, res, next) {
        console.log("need auth "+noLoginRequired)
        // console.log('Check if request is authorized with Firebase ID token')
        if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
            !(req.cookies && req.cookies.__session) && !noLoginRequired) {

            console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
                    'Make sure you authorize your request by providing the following HTTP header:',
                    'Authorization: Bearer <Firebase ID Token>',
                    'or by passing a "__session" cookie.')
                // console.log("Nothing came")
            res.status(403).send('Unauthorized')
            return
        }

        let idToken
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            // console.log('Found "Authorization" header')
            // Read the ID Token from the Authorization header.
            idToken = req.headers.authorization.split('Bearer ')[1]
        } else if (req.cookies) {
            //console.log('Found "__session" cookie');
            // Read the ID Token from cookie.
            idToken = req.cookies.__session;
        } else if (noLoginRequired) {
            req.user = null
            return next()
        } else {
            // No cookie
            res.status(403).send('Unauthorized')
            return
        }
        admin.auth().verifyIdToken(idToken).then((decodedIdToken) => {
            //   //console.log()
            req.user = decodedIdToken
            return next()
        }).catch((error) => {
            console.error('Error while verifying Firebase ID token:', error)
            res.status(403).send('Unauthorized')
        })
    }
}

module.exports = {
    validateFirebaseIdToken
}