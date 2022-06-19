import config from '../../config/config.js'
import * as response from '../../src/response.js'

export async function stats(req, res) {
  const database = req.app.get('database');

  try {
    var results = await database.global.selectstats();
  }catch (err) {
    return response.system(res, err)
  }

  return response.success(res, results)
}
