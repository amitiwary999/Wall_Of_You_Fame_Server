const {addProfile} = require('../functions/addUserProfile')

module.exports = async(req, res) => {
    let userId = req.user.uid
    await addProfile(req.body, userId)
    .then(result => {
        return res.status(200).send(result)
    })
    .catch(error => {
        res.status(500).send({message: error})
    })
}