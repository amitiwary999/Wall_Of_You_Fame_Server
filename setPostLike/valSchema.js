const Joi = require('joi'); 

const schema =  {
    postPostLike: Joi.object({
        postId: Joi.string().required(),
        increment: Joi.string().required()
    })
}

module.exports = {
    schema
}