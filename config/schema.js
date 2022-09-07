import joi from 'joi'
import countries from '../src/countries.js'

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
  address: joi.string().min(5).max(200).required(),
  country: joi.string().valid(...countries).required(),
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

export const updateaccountdata_schema = joi.object().keys({
  attribute: joi.string().valid('first_name', 'last_name', 'password', 'email', 'phone', 'address', 'country', 'sex').required(),
  data: joi.when('attribute', {
    is: joi.string().valid('first_name', 'last_name', 'password'),
    then: joi.string().min(2).required(),
    otherwise: joi.when('attribute', {
      is: 'email',
      then: joi.string().email({tlds: {allow: false}}).required(),
      otherwise: joi.when('attribute', {
        is: 'phone',
        then: joi.number().integer().min(0).required(),
        otherwise: joi.when('attribute', {
          is: 'address',
          then: joi.string().min(5).max(200).required(),
          otherwise: joi.when('attribute', {
            is: 'country',
            then: joi.string().valid(...countries).required(),
            otherwise: joi.when('attribute', {
              is: 'sex',
              then: joi.string().valid('M','F').required()
            })
          })
        })
      })
    })
  }).required()
})

export const capturePayment_schema = joi.object().keys({
  orderID: joi.string().required()
})


export const createorder_schema = joi.object().keys({
  amount: joi.number().integer().min(10).required()
})
