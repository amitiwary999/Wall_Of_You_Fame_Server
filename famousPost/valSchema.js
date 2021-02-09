const Joi = require('joi'); 

const schema =  {
    getUser: Joi.object().keys({
        userId: Joi.string().required()
    })
}

module.exports = {
    schema
}