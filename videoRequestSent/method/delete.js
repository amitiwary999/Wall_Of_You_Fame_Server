const {deleteRequest} = require('../function/deleteVideoCallRequest')

module.exports = async(req, res) => {
    await deleteRequest(req.body.id)
    .then(msg => {
        return res.status(204).send({message: 'successfully deleted the request'})
    })
    .catch(error => {
        console.error(error);
        res.status(404).send({message: error.message})
    })
}