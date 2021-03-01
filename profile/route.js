const {Router} = require('express');
const {validateFirebaseIdToken} = require('../util/validateFirebaseToken')
const {validateSchema} = require('../util/schemaValidator')
const {schema} = require('./valSchema')


let router = Router();
router.use('', validateFirebaseIdToken(true))
router.get('', require('./method/get'));
router.use('', validateFirebaseIdToken())
router.post('', require('./method/post'));
router.patch('', require('./method/patch'));


module.exports = router;