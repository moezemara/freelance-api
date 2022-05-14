import config from '../../config/config.js'
import * as response from '../../src/response.js'
import { randomUUID } from 'crypto'

export async function getprofile(req, res) {
  const database = req.app.get('database')

  try {
    const result = await database.client.selectprofile({account_id: req.session.account_id})
    !result 
    ? response.fail(res, "user has not created a profile yet")
    : response.success(res, result)
  } catch (error) {
    return response.system(res, error)
  }
}