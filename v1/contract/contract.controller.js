import config from '../../config/config.js'
import * as response from '../../src/response.js'
import { randomUUID } from 'crypto'

export async function getallcontracts(req, res) {
  const database = req.app.get('database')
  try {
    const result = await database.freelancer.selectusercontracts({account_id: req.session.account_id})

    if(result.length == 0) return response.fail(res, "no contracts found")

    return response.success(res, result)
  } catch (error) {
    return response.system(res, error)
  }
}

export async function getcontract(req, res) {
  const database = req.app.get('database')
  try {
    const result = await database.freelancer.selectusercontract({account_id: req.session.account_id, contract_id: req.params.contract_id})
    !result 
    ? response.fail(res, "invalid contract id")
    : response.success(res, result)
  } catch (error) {
    return response.system(res, error)
  }
}

export async function getallpendingcontracts(req, res) {
  const database = req.app.get('database')
  try {
    const result = await database.freelancer.selectusercontracts_withstatus({account_id: req.session.account_id, status:'pending'})

    if(result.length == 0) return response.fail(res, "you don't have any pending contracts yet")

    return response.success(res, result)
  } catch (error) {
    return response.system(res, error)
  }
}

export async function getactivecontracts_viewer(req, res) {
  const database = req.app.get('database')
  try {
    const contracts = await database.contract.selectcontracts_viewer({profile_id: req.params.profile_id, status:'Active'})
    if(contracts.length == 0) return response.fail(res, "no contracts found")

    return response.success(res, contracts)
  } catch (error) {
    return response.system(res, error)
  }
}

export async function getarchivedcontracts_viewer(req, res) {
  const database = req.app.get('database')
  try {
    const contracts = await database.contract.selectcontracts_viewer({profile_id: req.params.profile_id, status:'Archived'})
    if(contracts.length == 0) return response.fail(res, "no contracts found")

    return response.success(res, contracts)
  } catch (error) {
    return response.system(res, error)
  }
}
