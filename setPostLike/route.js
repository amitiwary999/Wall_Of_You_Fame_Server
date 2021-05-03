const {Router} = require('express');
const {validateFirebaseIdToken} = require('../util/validateFirebaseToken')
let router = Router();
router.use('', validateFirebaseIdToken())
router.get('', require('./method/post'));
module.exports = router