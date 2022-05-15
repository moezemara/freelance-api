import config from '../../config/config.js'
import * as response from '../../src/response.js'
import { randomUUID } from 'crypto'

export async function getallprofiles(req, res) {
  const database = req.app.get('database')
  try {
    const result = await database.freelancer.selectuserprofiles({account_id: req.session.account_id})

    if(result.length == 0) return response.fail(res, "you have not created a profile yet")

    return response.success(res, result)
  } catch (error) {
    return response.system(res, error)
  }
}

export async function getprofile(req, res) {
  const database = req.app.get('database')
  try {
    const result = await database.freelancer.selectuserprofile({profile_id: req.params.profile_id})
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

  body.account_id = req.session.account_id
  body.profile_id = randomUUID()

  try {
    const result = await database.freelancer.insertuserprofile(body)
    return response.success(res)
  } catch (error) {
    return response.system(res, error)
  }
}

export async function updateprofile(req, res) {
  const database = req.app.get('database')
  const body = req.body

  body.profile_id = req.params.profile_id
  body.account_id = req.session.account_id

  try {
    const result = await database.freelancer.updateuserprofile(body)
    result.affectedRows == 0 
    ? response.fail(res, "invalid profile id")
    : response.success(res)
  } catch (error) {
    return response.system(res, error)
  }
}

export async function activateprofile(req, res) {
  const database = req.app.get('database')
  try {
    const result = await database.freelancer.activateprofile({account_id: req.session.account_id, profile_id: req.params.profile_id})
    console.log(result)
    result.affectedRows == 0 
    ? response.fail(res, "invalid profile id")
    : response.success(res)
  } catch (error) {
    return response.system(res, error)
  }
}






export async function getallcontracts(req, res) {
  const database = req.app.get('database')
  try {
    const result = await database.freelancer.selectusercontracts({freelancer_profile_id: req.session.freelancer_profile_id})

    if(result.length == 0) return response.fail(res, "you don't have any contracts yet")

    return response.success(res, result)
  } catch (error) {
    return response.system(res, error)
  }
}

export async function getcontract(req, res) {
  const database = req.app.get('database')
  try {
    const result = await database.freelancer.selectusercontract({contract_id: req.params.contract_id})
    !result 
    ? response.fail(res, "invalid contract id")
    : response.success(res, result)
  } catch (error) {
    return response.system(res, error)
  }
}