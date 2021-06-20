const { sendVideoCallRequest, alreadyRequested} = require('../function/sendVideoCallRequest')

module.exports = async(req, res) => {
    await sendVideoCallRequest(req.body, req.user.uid)
    .then(msg => {
        return res.status(200).send({message: msg})
    }).catch(error => {
        console.error(error)
        res.status(500).send({message: error.message})
    })
    
}

