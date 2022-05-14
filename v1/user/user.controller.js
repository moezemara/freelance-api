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
    var results = await database.account.selectuserbyusername(body);
  }catch (err) {
    return response.system(res, err)
  }

  if (!results) {
    return response.fail(res, "invalid username or password")
  }

  if (body.password == results.password) {
    req.session.account_id = results.account_id
    req.session.account_type = results.account_type
    req.session.verified = results.verified
    req.session.banned = results.banned

    return response.success(res)
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

    if (userdata.type == "C"){
      try {
        await database.account.insertclientprofile({account_id: userdata.account_id, profile_id: randomUUID()});
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

export async function getallprofiles(req, res) {
  const database = req.app.get('database')
  if(!req.session.account_id){
    return response.fail(res, 'session expired')
  }

  if(req.session.account_type != "F") {return response.fail(res, "only freelancers allowed")}

  try {
    const result = await database.account.selectuserprofiles({account_id: req.session.account_id})

    if(result.length == 0) return response.fail(res, "you have not created a profile yet")

    return response.success(res, result)
  } catch (error) {
    return response.system(res, error)
  }
}

export async function getprofile(req, res) {
  const database = req.app.get('database')

  if(!req.session.account_id){
    return response.fail(res, 'session expired')
  }

  if (req.session.account_type != "F") {return response.fail(res, "only freelancers allowed")}

  const validate = schema.getprofile_schema.validate(req.params)
  if (validate.error){
    return response.fail(res, validate.error.details[0].message)
  }

  try {
    const result = await database.account.selectuserprofile({account_id: req.session.account_id, profile_id: req.params.profile_id})
    !result 
    ? response.fail(res, "invalid profile id")
    : response.success(res, result)
  } catch (error) {
    return response.system(res, error)
  }
}

export async function createprofile(req, res) {
  const database = req.app.get('database')
  const body = req.body

  if(!req.session.account_id){
    return response.fail(res, 'session expired')
  }

  if(req.session.account_type != "F") {return response.fail(res, "only freelancers allowed")}

  const validate = schema.createprofile_schema.validate(body)
  if (validate.error){
    return response.fail(res, validate.error.details[0].message)
  }

  body.account_id = req.session.account_id
  body.profile_id = randomUUID()

  try {
    const result = await database.account.insertuserprofile(body)
    return response.success(res)
  } catch (error) {
    return response.system(res, error)
  }
}

export async function updateprofile(req, res) {
  const database = req.app.get('database')
  const body = req.body

  if(!req.session.account_id){
    return response.fail(res, 'session expired')
  }

  if(req.session.account_type != "F") {return response.fail(res, "only freelancers allowed")}


  body.profile_id = req.params.profile_id

  const validate = schema.updateprofile_schema.validate(body)
  if (validate.error){
    return response.fail(res, validate.error.details[0].message)
  }

  body.account_id = req.session.account_id

  try {
    const result = await database.account.updateuserprofile(body)
    result.affectedRows == 0 
    ? response.fail(res, "invalid profile id")
    : response.success(res)
  } catch (error) {
    return response.system(res, error)
  }
}

export async function getclientprofile(req, res) {
  const database = req.app.get('database')

  if(!req.session.account_id){
    return response.fail(res, 'session expired')
  }

  if (req.session.account_type != "C") {return response.fail(res, "only clients allowed")}

  try {
    const result = await database.account.selectclientprofile({account_id: req.session.account_id})
    !result 
    ? response.fail(res, "user has not created a profile yet")
    : response.success(res, result)
  } catch (error) {
    return response.system(res, error)
  }
}