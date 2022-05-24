import config from '../../config/config.js'
import * as response from '../../src/response.js'
import * as recaptcha from '../../src/recaptcha.js'
import { randomUUID } from 'crypto'
import bcrypt from 'bcryptjs'

export async function login(req, res) {
  const database = req.app.get('database');
  const body = req.body
  const ip = req.connection.remoteAddress

  if(body['g-recaptcha-response'] != config.recaptcha.bypass){
    const vrecaptcha = await recaptcha.verify(body['g-recaptcha-response'], ip, res)
    if(!vrecaptcha){
      return response.fail(res, "recaptcha failed")
    }
  }

  try {
    var results = await database.account.selectuserbyusername(body);
  }catch (err) {
    return response.system(res, err)
  }

  if (!results) {
    return response.fail(res, "invalid username or password")
  }

  const compare = bcrypt.compareSync(body.password, results.password);

  if (compare) {
    req.session.account_id = results.account_id
    req.session.account_type = results.account_type
    req.session.verified = results.verified
    req.session.banned = results.banned

    return response.success(res, {type: results.account_type})
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

  if(body['g-recaptcha-response'] != config.recaptcha.bypass){
    const vrecaptcha = await recaptcha.verify(body['g-recaptcha-response'], ip, res)
    if(!vrecaptcha){
      return response.fail(res, "recaptcha failed")
    }
  }
  
  const salt = bcrypt.genSaltSync(10)
  body.password = bcrypt.hashSync(body.password, salt)

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

    if (userdata.type == "C"){
      try {
        await database.client.insertprofile({account_id: userdata.account_id, profile_id: randomUUID()});
      } catch (error) {
        try {
          await database.account.deleteuseraccount({account_id: userdata.account_id})
        } catch (error) {
          response.system(res, error)
        }
        response.system(res, error)
      }
    }

    req.session.account_id = userdata.account_id
    req.session.account_type = userdata.type
    req.session.verified = "N"
    req.session.banned = "N"

    return response.success(res, {type: userdata.account_type})

  }catch (err) {
    if(err.code == 'INTERNAL_DUP'){
      return response.fail(res, err.customMessage)
    }
    else{
      return response.system(res, err)
    }
  }
}