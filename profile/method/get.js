const {fetchProfile} = require('../functions/fetchUserProfile')

module.exports = async(req, res) => {
    let userId = res.user ? res.user.uid : ""
    await fetchProfile(req.query, userId)
    .then(result => {
        res.status(200).send(result)
    })
    .catch(error => {
        res.status(500).send({message: error})
    })
}