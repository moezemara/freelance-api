import jsonwebtoken from 'jsonwebtoken'
import config from '../../config/config.js'
import * as schema from '../../config/schema.js'
import * as response from '../../config/response.js'
import * as recaptcha from '../../utility/recaptcha.js'

const { sign } = jsonwebtoken;

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
    const jsontoken = sign({username: results.username, userkey: results.userkey }, config.jwt.encryptkey, {expiresIn: config.jwt.expire})
    return response.success(res, jsontoken)
  }else {
    return response.fail(res, "invalid username or password")
  }
}