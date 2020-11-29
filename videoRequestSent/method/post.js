const { sendVideoCallRequest, alreadyRequested} = require('../function/sendVideoCallRequest')

module.exports = async(req, res) => {
    let status = req.body.status;
    let inviteeId = req.body.inviteeId;
    let requestorId = req.user.uid; 
    
    if(status === 0){
        try{
            await alreadyRequested(requestorId, inviteeId)
        }catch(error){
            console.error(error)
            return res.status(409).send({message: error})
        }
    }else{
        requestorId = req.body.inviteeId;
        inviteeId = req.user.uid; 
    }

    let input = {
        status,
        requestorId,
        inviteeId,
        date: req.body.callTime
    }

    await sendVideoCallRequest(input)
    .then(msg => {
        res.status(200).send({message: msg})
    }).catch(error => {
        console.error(error)
        res.status(500).send({message: error})
    })
    
}

