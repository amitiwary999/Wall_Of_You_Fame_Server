const {Router} = require('express');
const {validateFirebaseIdToken} = require('../util/validateFirebaseToken')

let router = Router();

router.use('', validateFirebaseIdToken())

router.get('', require('./method/get'));

module.exports = router;