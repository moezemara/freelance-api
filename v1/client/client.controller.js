import config from '../../config/config.js'
import * as response from '../../src/response.js'
import { randomUUID } from 'crypto'

export async function getprofile(req, res) {
  const database = req.app.get('database')

  try {
    const profile = await database.client.selectprofile({account_id: req.session.account_id})
    if(!profile){return response.fail(res, "invalid profile")}
    const account = await database.client.selectaccount({account_id: req.session.account_id})
    if(!account){return response.fail(res, "invalid account")}
    return response.success(res, {
      account: account,
      profile: profile
    })
  } catch (error) {
    return response.system(res, error)
  }
}