const {getCallRequest} = require('../function/getVideoCallRequest')

module.exports = async(req, res) => {
    await getCallRequest(req.user.uid)
    .then(videoRequests => {
        return res.status(200).send(videoRequests)
    }).catch(error => {
        res.status(500).send({message: error.message})
    })
}