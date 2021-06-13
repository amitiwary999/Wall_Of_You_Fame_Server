const Joi = require('joi'); 

const schema =  {
    getUser: Joi.object().keys({
        userId: Joi.string().required()
    }),
    postUser: Joi.object().keys({
        desc: Joi.string().required(),
        postId: Joi.string().required(),
        mediaUrl: Joi.string().optional(),
        mediaThumbUrl: Joi.string().when('mediaUrl', {is: Joi.exist(), then: Joi.require(), otherwise: Joi.optional()}),
        MimeType: Joi.string().when("mediaUrl", {is: Joi.exist(), then: Joi.required(), otherwise: Joi.optional()})
    })
}

module.exports = {
    schema
}