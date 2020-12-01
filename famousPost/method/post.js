const {saveFamousPost} = require('../function/addFamousPost')

module.exports = async(req, res) => {
    await saveFamousPost(req.user.uid, req.body)
    .then(msg => {
        res.status(200).send({message: msg})
    })
    .catch(error => {
        console.error(error)
        res.status(500).send({message: error})
    })
}