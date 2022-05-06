import joi from 'joi'

export const login_schema = joi.object().keys({
  username: joi.required(),
  password: joi.required(),
  'g-recaptcha-response': joi.string().required()
})