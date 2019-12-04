/* eslint-disable promise/no-nesting */
'use strict'

// [START import]
const functions = require('firebase-functions')
const express = require('express')
var bodyParser = require('body-parser')
var admin = require('firebase-admin')
const mysql = require('promise-mysql');
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

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'passalpha',
    connectionLimit: 5,
    database: 'wallfamedb'
})

async function runQuery(pool, sqlQuery) {
    return pool.then(p => {
            return p.getConnection();
        })
        .then(connection => {
            return connection.beginTransaction()
                .then(() => {
                    return connection.query(sqlQuery)
                        .then(results => {
                            return connection.commit()
                                .then(() => {
                                    connection.release();
                                    return results;
                                })
                                .catch(_error => {
                                    connection.release();
                                    return results;
                                })
                        })
                        .catch(error => {
                            console.error("not able to run query", error);
                            console.error("query not able to run query is ", sqlQuery);
                            // eslint-disable-next-line promise/no-nesting
                            connection.rollback()
                                .then(() => {
                                    connection.release();
                                    return null;
                                })
                                .catch(error => {
                                    console.error("not able to rollback", error);
                                    connection.release();
                                    return null;
                                })
                        })
                })
                .catch(error => {
                    console.error("not able to begin transaction", error);
                    console.error("query not able to begin transaction is ", sqlQuery);
                    connection.rollback()
                        .then(() => {
                            connection.release();
                            return null;
                        })
                        .catch(error => {
                            console.error("not able to rollback", error);
                            connection.release();
                            return null;
                        })
                })
        })
        .catch(error => {
            console.error("not able to get connection", error);
            console.error("query not able to get connection is ", sqlQuery);
            return null
        })
}

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
    var date = req.body.date
    var desc = req.body.desc
    var imageUrl = req.body.imageUrl
    var postId = req.body.postId
    var name = req.body.name
    var dp = req.body.dp
    await insertPost(date, desc, imageUrl, userId, postId, name, dp)
        //console.log("send final")
    return res.status(200).send(JSON.stringify({ "message": "post added" }))
})

app.post("/setUser", validateFirebaseIdToken(), async(req, res) => {
    var userId = req.user.uid
    var name = req.body.name
    var dp = req.body.dp
    var email = req.body.email

    await insertUser(name, dp, email, userId)
    return res.status(200).send(JSON.stringify({ "message": "user added" }))
})

app.post("/getPosts", validateFirebaseIdToken(), async(req, res) => {
    var startAt = req.body.nextKey
    var limit = req.body.limit
    let resultJson = await getBlogPosts(startAt, limit)
    res.status(200).send(resultJson)
})

app.post("/postLike", validateFirebaseIdToken(), async(req, res) => {
    let postId = req.body.postId;
    let incr = req.body.increment
    let result = await updateLike(postId, incr)
    console.log("post like result " + result);
    res.status(200).send("success")
})

app.post("/setPostSql", async(req, res) => {
    let postId = req.body.postId;
    let desc = req.body.desc;
    let date = req.body.date;
    let imageUrl = req.body.imageUrl;
    let creatorId = req.body.creatorId;
    let like = 0;
    let unlike = 0;

    //let sql = "INSERT INTO wallfame_blog_table (postId, desc, date, imageUrl, creatorId) VALUES (\"" + postId + "\",\"" + date + "\",\"" + imageUrl + "\",\"" + creatorId + "\",\"" + desc + "\");";
    let s = "INSERT INTO wallfame_post_table (postId, date, description, imageUrl, creatorId, likeNo, unlike) VALUES (\"" + postId + "\", \"" + date + "\", \"" + desc + "\", \"" + imageUrl + "\", \"" + creatorId + "\", " + like + ", " + unlike + ");";
    let result = await runQuery(pool, s);
    console.log("sql result " + result);
    res.status(200).send(JSON.stringify({ "message": "post added" }))
})

app.post("/getBlogSql", async(req, res) => {
    let postId = req.body.postId
    let limit = req.body.limit
    let sql = ""
    if (postId === "") {
        sql = "SELECT * FROM wallfame_post_table ORDER BY postId DESC limit " + limit + ";";
    } else {
        sql = "SELECT * FROM wallfame_post_table WHERE postId < " + postId + " ORDER BY postId DESC limit " + limit + ";";
    }

    let result = await runQuery(pool, sql);
    res.status(200).send(JSON.stringify(result))
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

async function insertPost(date, desc, imageUrl, creatorId, postId, creatorName, creatorDp) {
    console.log("insert " + postId)
    var ref = admin.database().ref("BlogPosts").child(postId)
    return ref.set({
        "date": date,
        "desc": desc,
        "imageUrl": imageUrl,
        "like": 0,
        "unlike": 0,
        "creatorId": creatorId,
        "creatorName": creatorName,
        "creatorDp": creatorDp
    })
}

async function insertUser(name, dp, email, userId) {
    var ref = admin.database().ref("Userdetail").child(userId)
    return ref.set({
        "name": name,
        "dp": dp,
        "email": email
    })
}

async function getBlogPosts(nextKey, limit) {
    let snapShotBlog
    let query
    let res = []
    if (nextKey === "") {
        query = admin.database().ref("BlogPosts").orderByKey().limitToLast(limit);
    } else {
        query = admin.database().ref("BlogPosts").orderByKey().startAt(nextKey).limitToLast(limit);
    }
    snapShotBlog = await query.once('value')
    snapShotBlog.forEach((snapShot) => {
        let key = snapShot.key
        if (key !== nextKey) {
            let date = snapShot.val().date
            let desc = snapShot.val().desc
            let imageUrl = snapShot.val().imageUrl
            let like = snapShot.val().like
            let unlike = snapShot.val().unlike
            let creatorId = snapShot.val().creatorId
            let creatorName = snapShot.val().creatorName
            let creatorDp = snapShot.val().creatorDp

            let data = { "date": date, "desc": desc, "imageUrl": imageUrl, "like": like, "unlike": unlike, "creatorId": creatorId, "postId": key, "creatorName": creatorName, "creatorDp": creatorDp };
            res.push(data);
        }
    })

    return res;
}

async function updateLike(postId, incr) {
    let query = admin.database().ref("BlogPosts").child(postId);
    let snapShotBlog = await query.once('value');
    let like = snapShotBlog.val().like;
    if (incr === 1) {
        like = like + 1;
    } else {
        like = like - 1;
    }
    return query.update({
        "like": like
    });
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