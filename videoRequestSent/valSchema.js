const Joi = require('joi')
.extend(require('@joi/date'));

const schema =  {
    postVideoCallRequest: Joi.object({
        inviteeId: Joi.string().required(),
        status: Joi.number().integer().required(),
        callTime: Joi.date().format('YYYY-MM-DD HH:mm:ss').required()
    }),
    deleteVideoCallRequest: Joi.object({
        id: Joi.string().required()
    })
}

module.exports = {
    schema
}