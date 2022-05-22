import config from '../../config/config.js'
import * as response from '../../src/response.js'
import { randomUUID } from 'crypto'

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

export async function acceptproposal(req, res) {
  const database = req.app.get('database')
  
  try {
    const data = {}
    const proposal = await database.proposal.selectproposal({account_id: req.session.account_id, proposal_id: req.params.proposal_id})
    if(!proposal){ return response.fail(res, "invalid proposal")}
    const job = await database.job.selectjob({job_id: proposal.job_id})
    if(!job){ return response.fail(res, "invalid job")}
    if(job.status != 'Active'){ return response.fail(res, "job no longer available")}


    data.proposal_id = req.params.proposal_id
    data.client_profile_id = proposal.client_profile_id
    data.freelancer_profile_id = proposal.freelancer_profile_id
    data.final_price = proposal.price

    const result = await database.contract.insertcontract(data)

    if(result.affectedRows != 0){
      await database.proposal.updateproposalstatus({proposal_id: req.params.proposal_id, status: "Archived"})
      return response.success(res, "interview started")
    }else{
      return response.system(res, result)
    }

  } catch (error) {
    return response.system(res, error)
  }
}

export function getcontractsbystatus(status) {
  return async function(req, res){
    const database = req.app.get('database')
    
    try {
      const contracts = await database.contract.selectcontracts({account_id: req.session.account_id, account_type: req.session.account_type, status: status})
      if(contracts.length == 0) return response.fail(res, "no contracts found")
  
      return response.success(res, contracts)
    } catch (error) {
      return response.system(res, error)
    }
  }
}