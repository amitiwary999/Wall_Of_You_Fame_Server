const {Router} = require('express');
const {validateFirebaseIdToken} = require('../util/validateFirebaseToken')
let router = Router();
router.use('', validateFirebaseIdToken())
router.post('', require('./method/post'));
module.exports = router