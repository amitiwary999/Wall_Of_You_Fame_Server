const Joi = require('joi'); 

const schema =  {
    postVideoCallRequest: Joi.object({
        inviteeId: Joi.string().required(),
        status: Joi.string().required(),
        callTime: Joi.string().required()
    }),
    deleteVideoCallRequest: Joi.object({
        id: Joi.string().required()
    })
}

module.exports = {
    schema
}