const {Router} = require('express');
const {validateFirebaseIdToken} = require('../util/validateFirebaseToken')

let router = Router();
router.use('', validateFirebaseIdToken(true)) //this add the authentication header required restriction on api call. So put it above the methods after which you want the authentication restriction
router.get('', require('./method/get'));

router.use('', validateFirebaseIdToken())
router.post('', require('./method/post'));


module.exports = router;