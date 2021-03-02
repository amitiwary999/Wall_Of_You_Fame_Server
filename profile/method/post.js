const {verifyInput} = require('../../util/verifyInput');
const {addProfile} = require('../functions/addUserProfile')

module.exports = async(req, res) => {
    let userId = req.user.uid
    try{
        verifyInput(req.body.name)
        verifyInput(req.body.dp)
        verifyInput(req.body.email)
        verifyInput(req.body.profileId)
    }catch(error){
        console.error("error in profile post input "+error)
        return res.status(400).send(error);
    }
    await addProfile(req.body, userId)
    .then(result => {
        res.status(200).send(result)
    })
    .catch(error => {
        res.status(500).send({message: error})
    })
}