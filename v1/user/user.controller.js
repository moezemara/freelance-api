import config from '../../config/config.js'
import * as schema from '../../config/schema.js'
import * as response from '../../config/response.js'
import * as recaptcha from '../../utility/recaptcha.js'
import { randomUUID } from 'crypto'

export async function login(req, res) {
  const database = req.app.get('database');
  const body = req.body
  const ip = req.connection.remoteAddress
  const validate = schema.login_schema.validate(req.body)

  if (validate.error){
    return response.fail(res, validate.error.details[0].message)
  }

  if(body['g-recaptcha-response'] != config.recaptcha.bypass){
    const vrecaptcha = await recaptcha.verify(body['g-recaptcha-response'], ip, res)
    if(!vrecaptcha){
      return response.fail(res, "recaptcha failed")
    }
  }

  try {
    var results = await database.account.getuserbyusername(body);
  }catch (err) {
    return response.system(res, err)
  }

  if (!results) {
    return response.fail(res, "invalid username or password")
  }

  if (body.password == results.password) {
    req.session.account_id = results.account_id;
    return response.success(res, "Welcome")
  }else {
    return response.fail(res, "invalid username or password")
  }
}

export async function logout(req, res) {
  try{
    req.session.destroy()
    return response.success(res)
  }catch (err){
    return response.system(res, err)
  }
}

export async function signup(req, res) {
  const database = req.app.get('database');
  const body = req.body
  const ip = req.connection.remoteAddress
  const validate = schema.signup_schema.validate(body)

  if (validate.error){
    return response.fail(res, validate.error.details[0].message)
  }

  if(body['g-recaptcha-response'] != config.recaptcha.bypass){
    const vrecaptcha = await recaptcha.verify(body['g-recaptcha-response'], ip, res)
    if(!vrecaptcha){
      return response.fail(res, "recaptcha failed")
    }
  }
  
  const userdata = {
    account_id: randomUUID(),
    fname: body.fname,
    lname: body.lname,
    username: body.username,
    password: body.password,
    email: body.email,
    type: body.type,
    phone: body.phone,
    address: body.address,
    country: body.country,
    sex: body.sex
  }

  try {
    await database.account.insertuser(userdata);
    return response.success(res)
  }catch (err) {
    if(err.code == 'INTERNAL_DUP'){
      return response.fail(res, err.customMessage)
    }
    else{
      return response.system(res, err)
    }
  }

  
}