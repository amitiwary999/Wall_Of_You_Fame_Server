const Joi = require('joi'); 

const schema =  {
    getUser: Joi.object({
        userId: Joi.string().optional()
    }),
    postUser: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        dp: Joi.string().required(),
        profileId: Joi.string().required() 
    }),
    patchUser: Joi.object({
        name: Joi.string().optional(),
        dp: Joi.string().optional()
    })
}

module.exports = {
    schema
}