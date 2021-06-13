const {Router} = require('express');
const {validateFirebaseIdToken} = require('../util/validateFirebaseToken')
const {validateSchema} = require('../util/schemaValidator')
const {schema} = require('./valSchema')

let router = Router();
router.post('',[validateFirebaseIdToken(), validateSchema(schema.postPostLike)], require('./method/post'));
module.exports = router