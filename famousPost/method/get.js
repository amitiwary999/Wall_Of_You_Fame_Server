const {fetchFamousPost} = require('../function/fetchFamousPosts')

module.exports = async(req, res) => {
    let userId = req.user.uid? req.user.uid: ""
    await fetchFamousPost(userId)
    .then(result => {
        res.status(200).send(result)
    })
    .catch(error => {
        console.error(error);
        res.status(500).send({message: error})
    })
}
