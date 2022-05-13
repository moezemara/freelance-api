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
  phone: joi.number().integer().min(0).required(),
  address: joi.string().required(),
  country: joi.string().length(2).required(),
  sex: joi.string().valid('M','F').required(),
  'g-recaptcha-response': joi.string().required()
})

export const getprofile_schema = joi.object().keys({
  profile_id: joi.string().required()
})

export const updateprofile_schema = joi.object().keys({
  title: joi.string().min(5).max(60).required(),
  skills: joi.array().items(joi.string().required()).required(),
  pay_rate: joi.number().integer().min(0).required(),
  description: joi.string().required(),
  profile_id: joi.string().required()
})

export const createprofile_schema = joi.object().keys({
  title: joi.string().min(5).max(60).required(),
  skills: joi.array().items(joi.string().required()).required(),
  pay_rate: joi.number().integer().min(0).required(),
  description: joi.string().required()
})