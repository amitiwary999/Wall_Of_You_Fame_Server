/* eslint-disable promise/no-nesting */
'use strict'

// [START import]
const express = require('express')
var bodyParser = require('body-parser')
require('dotenv').config()
const app = express()
    // [END import]

// [START middleware]
const cors = require('cors')({ origin: true })
app.use(cors)
    // [END middleware]
app.use(bodyParser.json({ limit: '50mb' }))

app.use('/sendRequest', require('./videoRequestSent/route'))
app.use('/receivedRequest', require('./videoRequestReceived/route'))
app.use('/famousPost', require('./famousPost/route'))
app.use("/profile", require('./profile/route'))
app.use("/setPostLikeSql", require('./setPostLike/route'))

const PORT = process.env.PORT || 8082;
app.listen(PORT, async () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});