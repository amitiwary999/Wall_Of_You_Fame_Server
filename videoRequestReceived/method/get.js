const {getCallRequest} = require('../function/getReceivedCallRequest')

module.exports = async(req, res) => {
    await getCallRequest(req.user.uid)
    .then(videoRequests => {
        res.status(200).send(videoRequests)
    }).catch(error => {
        res.status(500).send({message: error})
    })
}
