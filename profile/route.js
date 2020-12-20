const {Router} = require('express');
const {validateFirebaseIdToken} = require('../util/validateFirebaseToken')

let router = Router();
router.use('', validateFirebaseIdToken(true))
router.get('', require('./method/get'));
router.use('', validateFirebaseIdToken())
router.post('', require('./method/post'));
router.patch('', require('./method/patch'));


module.exports = router;