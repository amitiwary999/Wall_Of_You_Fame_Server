const {Router} = require('express');
const {validateFirebaseIdToken} = require('../util/validateFirebaseToken')

let router = Router();

router.use('', validateFirebaseIdToken())

router.get('', require('./method/get'));
router.post('', require('./method/post'));
router.delete('', require('./method/delete'))

module.exports = router;