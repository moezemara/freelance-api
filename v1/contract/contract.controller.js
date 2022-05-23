import config from '../../config/config.js'
import * as response from '../../src/response.js'
import { randomUUID } from 'crypto'
import * as interviewstatus from './src/checkstatus.js'

export async function getcontract(req, res) {
  const database = req.app.get('database')
  try {
    const contract = await database.contract.selectcontract({account_id: req.session.account_id, account_type: req.session.account_type, proposal_id: req.params.contract_id})
    if(!contract) return response.fail(res, "invalid contract")

    return response.success(res, contract)
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

export async function updatepeerstatus(req, res) {
  const database = req.app.get('database')
  try {
    const account_type = req.session.account_type;
    const input = req.body.input == 'Accept' ? 1 : 0
    const contract = await database.contract.selectcontract({account_id: req.session.account_id, account_type: req.session.account_type, proposal_id: req.params.contract_id})
    if(!contract) return response.fail(res, "invalid contract")
    if(contract.status == 'Active') return response.fail(res, "contract is already active")
    const status = interviewstatus.checkstatus(contract)
    // check what is possible
    const interview_result = interviewstatus.handlepermissions(res, status, account_type, input)
    if(interview_result) return interview_result

    // pre-updated status
    if(account_type == 'C'){
      var updated_contract = contract
      updated_contract.input
    }else if(account_type == 'F'){
      var updated_contract = contract
      updated_contract.input
    }

    // check pre-updated status
    const pre_updated_status = interviewstatus.checkstatus(updated_contract)
    
    // update if possible
    const update_result = database.contract.updatepeerstatus({input: input, proposal_id: req.params.proposal_id, status: pre_updated_status.status})
    if(update_result.affectedRows != 0){
      return response.success(res, pre_updated_status)
    }else{
      return response.system(res, result)
    }
    return response.success(res, contract)
  } catch (error) {
    return response.system(res, error)
  }
}