/* eslint-disable promise/no-nesting */
'use strict'

// [START import]
const express = require('express')
var bodyParser = require('body-parser')
var admin = require('firebase-admin')
const mysql = require('promise-mysql');
require('dotenv').config()
const app = express()
    // [END import]

// [START middleware]
const cors = require('cors')({ origin: true })
app.use(cors)
    // [END middleware]
app.use(bodyParser.json({ limit: '50mb' }))
var serviceAccount = require('./tele-a36a5-firebase-adminsdk-6gt5g-1343f42669.json')
var databaseURL = 'https://expinf.firebaseio.com/'
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: databaseURL
// })

const pool = mysql.createPool({
  user: process.env.sqlUser,
    // host: '34.93.68.9',
  password: process.env.sqlPassword,
  database: process.env.sqlDatabase,
  socketPath: "/cloudsql/expinf:asia-south1:famouswall",
  connectionLimit: 100,
  connectTimeout: 10000, //  10 seconds
  acquireTimeout: 10000, //  10 seconds
  waitForConnections: true, //  Default: true
  queueLimit: 0,
  charset: "utf8mb4_unicode_ci", //  for special characters and emoji, else error
  supportBigNumbers: true,
  bigNumberStrings: true,
});

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

app.use('/sendRequest', require('./videoRequestSent/route'))
app.use('/receivedRequest', require('./videoRequestReceived/route'))
app.use('/famousPost', require('./famousPost/route'))
app.use("/profile", require('./profile/route'))
app.use("/setPostLikeSql", require('./setPostLike/route'))

app.post("/setPost", validateFirebaseIdToken(), async(req, res) => {
    var userId = req.user.uid
    console.log("body " + req.body + " " + req.user)
    var date = Date.now();
    var desc = req.body.desc
    var imageUrl = req.body.imageUrl
    var postId = req.body.postId
    var name = req.body.name
    var dp = req.body.dp
    var mimeType = req.body.mimeType
    await insertPost(date, desc, imageUrl, userId, postId, name, dp, mimeType)
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

app.post("/setUserSql", validateFirebaseIdToken(), async(req, res) => {
    let userId = req.user.uid
    let name = req.body.name
    let dp = req.body.dp
    let email = req.body.email

    let result = await insertUserSql(name, dp, email, userId)
    if (result !== null && result !== undefined) {
        return res.status(200).send(JSON.stringify({ "message": "user added" }))
    } else {
        return res.status(500).send("user profile not created")
    }
})

app.post("/getPosts", validateFirebaseIdToken(), async(req, res) => {
    var startAt = req.body.nextKey
    var limit = req.body.limit
    var userId = req.user.uid;
    let resultJson = await getBlogPosts(startAt, limit, userId)
    res.status(200).send(resultJson)
})

app.post("/postLike", validateFirebaseIdToken(), async(req, res) => {
    let postId = req.body.postId;
    let incr = req.body.increment;
    let userId = req.user.uid;
    let result = await updateLike(postId, incr, userId)
    console.log("post like result " + result);
    res.status(200).send("success")
})

app.post("/setPostSql", validateFirebaseIdToken(), async(req, res) => {
    var userId = req.user.uid
    console.log("body " + req.body + " " + req.user)
    var date = Date.now();
    var description = req.body.desc
    var mediaUrl = req.body.mediaUrl
    var mediaThumbUrl = req.body.mediaThumbUrl
    var postId = req.body.postId
    var mimeType = req.body.mimeType

    //let sql = "INSERT INTO wallfame_blog_table (postId, desc, date, imageUrl, creatorId) VALUES (\"" + postId + "\",\"" + date + "\",\"" + imageUrl + "\",\"" + creatorId + "\",\"" + desc + "\");";
    let s = "INSERT INTO wallfame_post_table (postId, date, description, mediaUrl, mediaThumbUrl, mimeType, creatorId) VALUES (\"" + postId + "\", " + date + ", \"" + description + "\", \"" + mediaUrl + "\", \"" + mediaThumbUrl + "\", \"" + mimeType + "\", \"" + userId + "\");";
    let result = await runQuery(pool, s);
    console.log("sql result " + result);
    res.status(200).send(JSON.stringify({ "message": "post added" }))
})

app.post("/getBlogSql", validateFirebaseIdToken(true), async(req, res) => {
    let userId = req.user?req.user.uid:""
    let postId = req.body.nextKey
    let limit = req.body.limit
    // let sql = ""

    //for now no need to do pagination
    let  sql = "SELECT group_concat(mediaUrl) as mediaUrl, group_concat(mediaThumbUrl) as mediaThumbUrl, group_concat(wallfame_post_table.postId) as postId, group_concat(date) as date, group_concat(description) as description, group_concat(mimeType) as mimeType, userName, userDp, wallfame_post_table.creatorId, (CASE WHEN isl.famousUserId IS NULL THEN 0 ELSE 1 END) as isLiked, group_concat((CASE WHEN bookmark.postId IS NULL THEN 0 ELSE 1 END)) as isBookmarked FROM wallfame_post_table INNER JOIN (SELECT userId, userName, userDp FROM wallfame_user_table)u ON u.userId = wallfame_post_table.creatorId LEFT JOIN (Select famousUserId, userId FROM wallfame_post_like_table WHERE userId = \"" + userId + "\")isl ON  isl.famousUserId = wallfame_post_table.creatorId LEFT JOIN (Select postId, userId FROM wallfame_bookmark_table WHERE userId = \"" + userId + "\")bookmark ON  bookmark.postId = wallfame_post_table.postId GROUP BY creatorId having count(*) >0 ORDER BY group_concat(wallfame_post_table.postId) DESC limit " + limit + ";";

    // if (postId === "") {
    //     sql = "SELECT group_concat(mediaUrl) as mediaUrl, group_concat(mediaThumbUrl) as mediaThumbUrl, group_concat(wallfame_post_table.postId) as postId, group_concat(date) as date, group_concat(description) as description, group_concat(mimeType) as mimeType, userName, userDp, wallfame_post_table.creatorId, group_concat((CASE WHEN isl.postId IS NULL THEN 0 ELSE 1 END)) as isLiked, group_concat((CASE WHEN bookmark.postId IS NULL THEN 0 ELSE 1 END)) as isBookmarked FROM wallfame_post_table INNER JOIN (SELECT userId, userName, userDp FROM wallfame_user_table)u ON u.userId = wallfame_post_table.creatorId LEFT JOIN (Select famousUserId, userId FROM wallfame_post_like_table WHERE userId = \"" + userId + "\")isl ON  isl.famousUserId = wallfame_post_table.creatorId LEFT JOIN (Select postId, userId FROM wallfame_bookmark_table WHERE userId = \"" + userId + "\")bookmark ON  bookmark.postId = wallfame_post_table.postId GROUP BY creatorId having count(*) >0 ORDER BY group_concat(wallfame_post_table.postId) DESC limit " + limit + ";";
    // } else {
    //     sql = "SELECT wallfame_post_table.*, userName, userDp, COUNT(l.postId) as likeCount FROM wallfame_post_table INNER JOIN (SELECT userId, userName, userDp FROM wallfame_user_table)u ON u.userId = wallfame_post_table.creatorId LEFT JOIN (SELECT postId, userId FROM wallfame_post_like_table)l ON l.postId = wallfame_post_table.postId GROUP BY wallfame_post_table.postId WHERE wallfame_post_table.postId < " + postId + " ORDER BY wallfame_post_table.postId DESC limit " + limit + ";";
    // }

    let result = await runQuery(pool, sql);
    console.log("result blog "+result);
    res.status(200).send(JSON.stringify(result))
})

//liked the famous user
app.post("/setPostLikeSql", validateFirebaseIdToken(), async(req, res) => {
    let userId = req.user.uid
    let postId = req.body.postId;
    let incr = req.body.increment;
    let sql
    if (incr === 1) {
        sql = "INSERT INTO wallfame_post_like_table (postId, userId) VALUES (\"" + postId + "\", \"" + userId + "\");"
    } else {
        sql = "DELETE FROM wallfame_post_like_table WHERE postId = \"" + postId + "\" AND userId = \"" + userId + "\";"
    }
    let result = await runQuery(pool, sql);
    if (result !== null && result !== undefined) {
        return res.status(200).send("successful")
    } else {
        return res.status(500).send("failed post like")
    }
})

app.post("/setBookmarkSql", validateFirebaseIdToken(), async(req, res) => {
    let userId = req.user.uid;
    let postId = req.body.postId;
    let addBookmark = req.body.addBookmark;
    let sql = ""
    if(addBookmark){
        sql = "INSERT INTO wallfame_bookmark_table (postId, userId) VALUES ('" + postId + "', '" + userId + "')"
    }else{
        sql = "DELETE FROM wallfame_bookmark_table WHERE postId = '"+postId+"' AND userId = '"+userId+"' "
    }
    let result = await runQuery(pool, sql)
    return res.status(200).send("successful").end()
})

app.post("/postVideoRequest", validateFirebaseIdToken(), async(req, res) => {
    let requestorId = req.user.uid;
    let inviteeId = req.body.inviteeId
    let status = req.body.status
    let date = req.body.callTime;
    let id =  requestorId+inviteeId
    let hashId = generateHash(id);
    let roomNameId = requestorId+""+Date.now()+""+inviteeId;
    let roomNameHash = generateHash(roomNameId);
    if(status == 0){
      inviteeId = req.body.inviteeId;
      requestorId = req.user.uid; 
      let alreadyRequestedQuery =  "SELECT * FROM wallfame_video_requests_table WHERE status = 0 AND id='"+hashId+"' OR status=1 AND updatedAt > CURRENT_TIMESTAMP";
      let result =  await runQuery(pool, alreadyRequestedQuery);
      if(result.length>0){
          return res.status(500).send({message: 'You can make new request if your previous request rejected or completed'})
      }
    }else{
        requestorId = req.body.inviteeId;
        inviteeId = req.user.uid; 
        let id =  requestorId+inviteeId
        hashId = generateHash(id); 
    }

    let sql = "INSERT INTO wallfame_video_requests_table(id, requestorId, inviteeId, roomName, status, updatedAt) VALUES ('"+hashId+"', '"+ requestorId + "', '" + inviteeId + "','"+roomNameHash+"', '"+ status +"', '" + date + "') ON DUPLICATE KEY UPDATE status = '"+status+"', updatedAt = '"+date+"';"
    let result = await runQuery(pool, sql);
    if(result ? result.affectedRows : false){
        res.status(200).send('successful').end();
    }else{
        res.status(500).send("can't make video request").end();
    }
})

app.post("/deleteVideoRequest", validateFirebaseIdToken(), async(req, res) => {
    let id = req.body.id;
    let sql = "DELETE FROM wallfame_video_requests_table WHERE id = '"+id+"'";
    let result = await runQuery(pool, sql);
    console.log("delete video call request result "+JSON.stringify(result))
    if(result){
        res.status(200).send("deleted successfully")
    }else{
        res.status(500).send("something went wrong")
    }
})

app.post("/getVideoRequestReceived", validateFirebaseIdToken(), async(req, res) => {
    let inviteeId = req.user.uid;
    let sql = "SELECT * FROM wallfame_video_requests_table INNER JOIN (SELECT userId, userName, userDp FROM wallfame_user_table)u ON u.userId = wallfame_video_requests_table.requestorId WHERE inviteeId = '"+ inviteeId+"' AND status != 2";
    let result = await runQuery(pool, sql);
    if(result){
        res.status(200).send(JSON.stringify(result)).end()
    }else{
        res.status(500).send("No video request").end()
    }
})

app.post("/getVideoRequestSent", validateFirebaseIdToken(), async(req, res) => {
    let requestorId = req.user.uid;
    let sql = "SELECT * FROM wallfame_video_requests_table INNER JOIN (SELECT userId, userName, userDp FROM wallfame_user_table)u ON u.userId = wallfame_video_requests_table.inviteeId WHERE requestorId = '"+ requestorId+"'";
    let result = await runQuery(pool, sql);
    if(result ? result.length : false){
        res.status(200).send(JSON.stringify(result)).end()
    }else{
        res.status(500).send("No video request").end()
    }
})

app.post("/getroomName", validateFirebaseIdToken(), async(req, res) => {
    let userId = req.user.uid;
    let id = req.body.roomQueryId;
    let roomnameQuery = "SELECT roomName from wallfame_video_requests_table WHERE (inviteeId = '"+userId+"' OR requestorId = '"+userId+"') AND id='"+id+"'"
    let result = await runQuery(pool, roomnameQuery)
    if(result.length>0){
        res.status(200).send(result[0]);
    }else{
        res.status(500).send({message: 'no room'})
    }
})

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

async function insertPost(date, desc, imageUrl, creatorId, postId, creatorName, creatorDp, mimeType) {
    console.log("insert " + postId)
    var ref = admin.database().ref("BlogPosts").child(postId)
    return ref.set({
        "date": date,
        "desc": desc,
        "imageUrl": imageUrl,
        "creatorId": creatorId,
        "creatorName": creatorName,
        "creatorDp": creatorDp,
        "mimeType": mimeType
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

async function insertUserSql(userName, userDp, userEmail, userId) {
    let s = "INSERT IGNORE INTO wallfame_user_table (userId, userName, userDp, userEmail) VALUES (\"" + userId + "\", \"" + userName + "\", \"" + userDp + "\", \"" + userEmail + "\");";
    let result = await runQuery(pool, s);
    return result
}

async function getBlogPosts(nextKey, limit, userId) {
    let snapShotBlog
    let query
    let res = []
    if (nextKey === "") {
        query = admin.database().ref("BlogPosts").orderByKey().limitToLast(limit);
    } else {
        query = admin.database().ref("BlogPosts").orderByKey().endAt(nextKey).limitToLast(limit);
    }
    snapShotBlog = await query.once('value')
    snapShotBlog.forEach((snapShot) => {
        let key = snapShot.key
        if (key !== nextKey) {
            let date = snapShot.val().date
            let desc = snapShot.val().desc
            let imageUrl = snapShot.val().imageUrl
                // let like = snapShot.val().like
                // let unlike = snapShot.val().unlike
            let creatorId = snapShot.val().creatorId
            let creatorName = snapShot.val().creatorName
            let creatorDp = snapShot.val().creatorDp
            let mimeType = snapShot.val().mimeType
            let likesBy = snapShot.val().like
            let like = 0
            let isLiked = 0
            if (likesBy !== null && likesBy !== undefined) {
                const map = new Map(Object.entries(likesBy));
                //console.log("likes " + likesBy + " " + likesBy.size + " " + map.size);
                //console.log("aa " + map.get(userId));
                like = map.size
                isLiked = 0
                if (map.get(userId) !== null) {
                    isLiked = 1
                }
            }
            let data = { "date": date, "desc": desc, "imageUrl": imageUrl, "like": like, "creatorId": creatorId, "postId": key, "creatorName": creatorName, "creatorDp": creatorDp, "isLiked": isLiked, "mimeType": mimeType };
            //let data = { "date": date, "desc": desc, "imageUrl": imageUrl, "like": like, "unlike": unlike, "creatorId": creatorId, "postId": key, "creatorName": creatorName, "creatorDp": creatorDp };
            res.unshift(data);
        }
    })

    return res;
}

async function updateLike(postId, incr, userId) {
    let ref = admin.database().ref("BlogPosts").child(postId).child("like");
    if (incr === 1) {
        return ref.set({
            [userId]: 1
        });
    } else {
        return ref.set({
            [userId]: null
        });
    }
}

function generateHash(string) {
    var hash = 0;
    if (string.length == 0)
        return hash;
    for (let i = 0; i < string.length; i++) {
        var charCode = string.charCodeAt(i);
        hash = ((hash << 7) - hash) + charCode;
        hash = hash & hash;
    }
    return hash;
}

const PORT = process.env.PORT || 8082;
app.listen(PORT, async () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});