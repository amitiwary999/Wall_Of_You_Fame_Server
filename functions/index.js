const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

var express = require('express')
var bodyParser = require('body-parser')
var admin = require('firebase-admin')

var app = express()
app.use(bodyParser.json({ limit: '50mb' }));

admin.initializeApp();

app.post("/setPost", validateFirebaseIdToken(), async(req, res) => {
    var userId = req.user.uid
    console.log("body " + req.body + " " + req.user)
    var cityName = req.body.cityName
    var date = req.body.date
    var desc = req.body.desc
    var imageUrl = req.body.imageUrl
    var postId = req.body.postId
    await insertPost(cityName, date, desc, imageUrl, 0, 0, userId, postId)
    return res.status(200).send({ "message": "post added" })
})

function validateFirebaseIdToken() {
    return function(req, res, next) {
        // console.log('Check if request is authorized with Firebase ID token')
        if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
            !(req.cookies && req.cookies.__session)) {
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
            // Read the ID Token from cookie.
            idToken = req.cookies.__session
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

async function insertPost(cityName, date, desc, imageUrl, like, unlike, creatorId, postId) {
    var ref = admin.database().ref("BlogPosts").child(postId)
    return ref.set({
        "cityName": cityName,
        "date": date,
        "desc": desc,
        "imageUrl": imageUrl,
        "liek": 0,
        "unlike": 0,
        "creatorId": creatorId
    })
}