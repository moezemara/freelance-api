import joi from 'joi'

export const login_schema = joi.object().keys({
  username: joi.string().max(30).required(),
  password: joi.string().max(30).required(),
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
  address: joi.string().max(200).required(),
  country: joi.string().length(2).required(),
  sex: joi.string().valid('M','F').required(),
  'g-recaptcha-response': joi.string().required()
})

export const updateprofile_body_schema = joi.object().keys({
  title: joi.string().min(5).max(60).required(),
  skills: joi.array().items(joi.string().required()).required(),
  pay_rate: joi.number().integer().min(1).required(),
  description: joi.string().max(1000).required(),
  category: joi.string().max(30).required()
})

export const createprofile_schema = joi.object().keys({
  title: joi.string().min(5).max(60).required(),
  skills: joi.array().items(joi.string().required()).required(),
  pay_rate: joi.number().integer().min(0).required(),
  description: joi.string().max(1000).required(),
  category: joi.string().max(30).required()
})

export const createjob_schema = joi.object().keys({
  title: joi.string().min(5).max(60).required(),
  category: joi.string().max(30).required(),
  experience: joi.string().valid("Advanced","Intermediate","Entry").required(),
  skills: joi.array().items(joi.string().required()).required(),
  description: joi.string().max(1000).required(),
  price: joi.number().integer().min(1).required(),
  time: joi.number().integer().min(1).required()
})

export const applytojob_schema = joi.object().keys({
  cover_letter: joi.string().max(2000).required(),
  price: joi.number().integer().min(1).required(),
  expected_date: joi.number().integer().required()
})

export const updatepeerstatus_schema = joi.object().keys({
  input: joi.string().valid("Accept", "Cancel").required()
})

export const addmilestone_schema = joi.object().keys({
  description: joi.string().max(2000).required(),
  amount: joi.number().integer().min(1).required(),
  date: joi.number().integer().required()
})

