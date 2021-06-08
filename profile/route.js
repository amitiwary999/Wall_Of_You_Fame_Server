const {Router} = require('express');
const {validateFirebaseIdToken} = require('../util/validateFirebaseToken')
const {validateSchema} = require('../util/schemaValidator')
const {schema} = require('./valSchema')

let router = Router();
router.get('',[validateFirebaseIdToken(true), validateSchema(schema.getUser, 'query')], require('./method/get'));
router.post('',[validateFirebaseIdToken(), validateSchema(schema.postUser)], require('./method/post'));
router.patch('', [validateFirebaseIdToken(), validateSchema(schema.patchUser)], require('./method/patch'));


module.exports = router;