const Joi = require('joi')

const validateSchema = (schema, property) => (req, res, next) => {
    const { error } = Joi.validate(req[property], schema); 
    const valid = error == null; 
    if (valid) { next(); } 
    else { 
      const { details } = error; 
      const message = details.map(i => i.message).join(',')
      console.log("error", message); 
      res.status(422).json({ error: message }) 
    }
}
module.exports = {
    validateSchema
}