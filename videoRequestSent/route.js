const {Router} = require('express');
const {validateFirebaseIdToken} = require('../util/validateFirebaseToken')
const {validateSchema} = require('../util/schemaValidator')
const {schema} = require('./valSchema')

let router = Router();

router.use('', validateFirebaseIdToken())

router.get('',validateFirebaseIdToken(), require('./method/get'));
router.post('',[validateFirebaseIdToken(), validateSchema(schema.postVideoCallRequest)], require('./method/post'));
router.delete('',[validateFirebaseIdToken(), validateSchema(schema.deleteVideoCallRequest)], require('./method/delete'))

module.exports = router;