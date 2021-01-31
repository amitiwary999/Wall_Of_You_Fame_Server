const {verifyInput} = require('../../util/verifyInput')
const {updateProfile} = require('../functions/updateProfile')

module.exports = async(req, res) => {
    try{
        verifyInput(req.body.userName)
        verifyInput(req.body.userDp)
    }catch(error){
        console.error("error in input in profile patch "+error)
        return res.status(400).send(error)
    }

    await updateProfile(req.body, req.user.uid)
    .then(result => {
        res.status(200).send({message: result})
    })
    .catch(error =>{
        console.error("error in profile update "+error)
        res.status(500).send(error)
    })
}