import joi from 'joi'

export const login_schema = joi.object().keys({
  username: joi.required(),
  password: joi.required(),
  'g-recaptcha-response': joi.string().required()
})

export const signup_schema = joi.object().keys({
  fname: joi.string().min(2).required(),
  lname: joi.string().min(2).required(),
  username: joi.string().min(2).required(),
  password: joi.string().min(2).required(),
  email: joi.string().email({tlds: {allow: false}}).required(),
  type: joi.string().valid('C','F').required(),
  phone: joi.number().integer().min(5).required(),
  address: joi.string().required(),
  country: joi.string().length(2).required(),
  sex: joi.string().valid('M','F').required(),
  'g-recaptcha-response': joi.string().required()
})