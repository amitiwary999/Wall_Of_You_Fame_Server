const {updateProfile} = require('../functions/updateProfile')

module.exports = async(req, res) => {
    await updateProfile(req.body, req.user.uid)
    .then(result => {
        return res.status(200).send({message: result})
    })
    .catch(error =>{
        console.error("error in profile update "+error)
        res.status(500).send(error)
    })
}