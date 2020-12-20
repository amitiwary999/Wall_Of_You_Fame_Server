const {updateProfile} = require('../functions/updateProfile')

module.exports = async(req, res) => {
    try{
        verifyInput(req.body.name)
        verifyInput(req.body.dp)
    }catch(error){
        return res.status(400).send({message: error})
    }

    await updateProfile(req.body, req.user.uid)
    .then(result => {
        res.status(200).send({message: result})
    })
    .catch(error =>{
        res.status(500).send({message: error})
    })
}