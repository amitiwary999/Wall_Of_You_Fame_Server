const {fetchProfile} = require('../functions/fetchUserProfile')

module.exports = async(req, res) => {
    await fetchProfile(req.query)
    .then(result => {
        res.status(200).send(result)
    })
    .catch(error => {
        res.status(500).send({message: error})
    })
}