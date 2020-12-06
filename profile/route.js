const {Router} = require('express');
const {validateFirebaseIdToken} = require('../util/validateFirebaseToken')

let router = Router();
router.use('', validateFirebaseIdToken(true))
router.get('', require('./method/get'));


module.exports = router;