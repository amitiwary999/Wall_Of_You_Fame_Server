'use strict'

// [START import]
const functions = require('firebase-functions')
const express = require('express')
var bodyParser = require('body-parser')
var admin = require('firebase-admin')
const app = express()
    // [END import]

// [START middleware]
const cors = require('cors')({ origin: true })
app.use(cors)
    // [END middleware]
app.use(bodyParser.json({ limit: '50mb' }))
var serviceAccount = require('./tele-a36a5-firebase-adminsdk-q3zzt-8245e30711.json')
var databaseURL = 'https://tele-a36a5.firebaseio.com/'
admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: databaseURL
    })
    // [START index]
    // This endpoint provides displays the index page.
app.get('/', (req, res) => {
        const date = new Date()
        const hours = (date.getHours() % 12) + 1; // London is UTC + 1hr
        // [START_EXCLUDE silent]
        res.set('Cache-Control', `public, max-age=${secondsLeftBeforeEndOfHour(date)}`)
            // [END_EXCLUDE silent]
        res.send('hours is' + hours)
    })
    // [END index]

app.post("/setPost", validateFirebaseIdToken(), async(req, res) => {
    var userId = req.user.uid
    console.log("body " + req.body + " " + req.user)
    var cityName = req.body.cityName
    var date = req.body.date
    var desc = req.body.desc
    var imageUrl = req.body.imageUrl
    var postId = req.body.postId
    await insertPost(cityName, date, desc, imageUrl, 0, 0, userId, postId)
        //console.log("send final")
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
            //console.log('Found "__session" cookie');
            // Read the ID Token from cookie.
            idToken = req.cookies.__session;
        } else {
            // No cookie
            res.status(403).send('Unauthorized')
            return
        }
        admin.auth().verifyIdToken(req.headers.authorization.split('Bearer ')[1]).then((decodedIdToken) => {
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
    console.log("insert " + postId)
    var ref = admin.database().ref("BlogPosts").child(postId)
    return ref.set({
        "cityName": cityName,
        "date": date,
        "desc": desc,
        "imageUrl": imageUrl,
        "like": 0,
        "unlike": 0,
        "creatorId": creatorId
    })
}

// [START seconds_left]
// Returns the number of seconds left before the next hour starts.
function secondsLeftBeforeEndOfHour(date) {
    const m = date.getMinutes();
    const s = date.getSeconds();
    return 3600 - (m * 60) - s;
}
// [END seconds_left]

// [START export]
// Export the express app as an HTTP Cloud Function
exports.app = functions.https.onRequest(app)
    // [END export]