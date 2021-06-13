const {Router} = require('express');
const {validateFirebaseIdToken} = require('../util/validateFirebaseToken')
const {validateSchema} = require('../util/schemaValidator')
const {schema} = require('./valSchema')

let router = Router();
// authorization is optional to fetch profile. Public data can be fetched if authorization token is not present
router.get('', [validateFirebaseIdToken(true), validateSchema(schema.getUser, 'query')], require('./method/get'));
router.post('',[validateFirebaseIdToken(), validateSchema(schema.postUser)], require('./method/post'));


module.exports = router;