const Joi = require('joi')

const validateSchema = (schema, property='body') => (req, res, next) => {
  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
  };
    const {error} = schema.validate(req[property], options); 
    if(error){
      const { details } = error; 
      const message = details.map(i => i.message).join(',')
      console.log("error", message); 
      res.status(422).json({ error: message }) 
    }else{
      return next()
    } 
}
module.exports = {
    validateSchema
}