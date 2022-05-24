import config from '../../config/config.js'
import * as response from '../../src/response.js'
import { randomUUID } from 'crypto'
import * as interviewstatus from './src/checkstatus.js'
import { exit } from 'process'

export async function getcontract(req, res) {
  const database = req.app.get('database')
  try {
    const contract = await database.contract.selectcontract({account_id: req.session.account_id, account_type: req.session.account_type, proposal_id: req.params.contract_id})
    if(!contract) return response.fail(res, "invalid contract")

    if(contract.status == 'Interview'){
      var permissions = interviewstatus.checkstatus(contract)
    }

    const milestones = await database.contract.selectmilestones({
      account_type: req.session.account_type, 
      proposal_id: req.params.contract_id,
      account_id: req.session.account_id
    })

    return response.success(res, {contract: contract, permissions: permissions, milestones: milestones})
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

export async function cancelinterview(req, res) {
  const database = req.app.get('database')
  try {

    const contract = await database.contract.selectcontract({account_id: req.session.account_id, account_type: req.session.account_type, proposal_id: req.params.contract_id})
    if(!contract) return response.fail(res, "invalid contract")
    if(contract.status != 'Interview') return response.fail(res, "contract must be in interview")

    const result = await database.contract.cancelcontract({
      proposal_id: req.params.contract_id
    })

    if(result.affectedRows != 0){
      return response.success(res)
    }else{
      return response.fail(res, "invalid contract")
    }
    
  } catch (error) {
    return response.system(res, error)
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
      updated_contract.client_acceptance = input
    }else if(account_type == 'F'){
      var updated_contract = contract
      updated_contract.freelancer_acceptance = input
    }

    // check pre-updated status
    const pre_updated_status = interviewstatus.checkstatus(updated_contract)
    
    // update if possible
    const update_result = await database.contract.updatepeerstatus({input: input, proposal_id: req.params.contract_id, status: pre_updated_status.status, account_type: account_type})
    if(update_result.affectedRows != 0){
      return response.success(res, pre_updated_status)
    }else{
      return response.system(res, result)
    }
  } catch (error) {
    return response.system(res, error)
  }
}

export async function getmilestone(req, res) {
  const database = req.app.get('database')
  try {
    const milestone = await database.contract.selectmilestone({
      account_type: req.session.account_type, 
      milestone_id: req.params.milestone_id, 
      proposal_id: req.params.contract_id,
      account_id: req.session.account_id
    })

    if(milestone.length == 0) return response.fail(res, "invalid milestone")

    return response.success(res, milestone)
  } catch (error) {
    return response.system(res, error)
  }
}

export async function getmilestones(req, res) {
  const database = req.app.get('database')
  try {
    const milestones = await database.contract.selectmilestones({
      account_type: req.session.account_type, 
      proposal_id: req.params.contract_id,
      account_id: req.session.account_id
    })

    return response.success(res, milestones)
  } catch (error) {
    return response.system(res, error)
  }
}

export async function addmilestone(req, res) {
  const database = req.app.get('database')
  const body = req.body;
  try {
    // check if possible to add
    const contract = await database.contract.selectcontract({account_id: req.session.account_id, account_type: req.session.account_type, proposal_id: req.params.contract_id})
    if(!contract) return response.fail(res, "invalid contract")
    if(contract.status != 'Interview') return response.fail(res, "you can not add on active contracts")
    const status = interviewstatus.checkstatus(contract)

    if(status.special_status != 'NAN'){
      return response.fail(res, "you are not allowed to edit")
    }

    const data = {
      milestone_id: randomUUID(),
      proposal_id: contract_id,
      amount: body.amount,
      description: body.description,
      date: body.date
    }

    const milestones = await database.contract.insertmilestone(data)

    return response.success(res)
  } catch (error) {
    return response.system(res, error)
  }
}

export async function deletemilestone(req, res) {
  const database = req.app.get('database')
  const body = req.body;
  try {
    // check if possible to add
    const contract = await database.contract.selectcontract({account_id: req.session.account_id, account_type: req.session.account_type, proposal_id: req.params.contract_id})
    if(!contract) return response.fail(res, "invalid contract")
    if(contract.status != 'Interview') return response.fail(res, "you can not add on active contracts")
    const status = interviewstatus.checkstatus(contract)

    if(status.special_status != 'NAN'){
      return response.fail(res, "you are not allowed to edit")
    }

    const result = await database.contract.deletemilestone({milestone_id: req.params.milestone_id})

    if(result.affectedRows != 0){
      return response.success(res)
    }else{
      return response.fail(res, "invalid milestone")
    }

    return response.success(res)
  } catch (error) {
    return response.system(res, error)
  }
}

export async function endmilestone(req, res) {
  const database = req.app.get('database')
  try {

    const contract = await database.contract.selectcontract({account_id: req.session.account_id, account_type: req.session.account_type, proposal_id: req.params.contract_id})
    if(!contract) return response.fail(res, "invalid contract")
    if(contract.status != 'Active') return response.fail(res, "contract must be active")

    const result = await database.contract.endmilestone({
      milestone_id: req.params.contract_id
    })

    if(result.affectedRows != 0){
      return response.success(res)
    }else{
      return response.fail(res, "invalid milestone")
    }
    
  } catch (error) {
    return response.system(res, error)
  }
}

export async function endcontract(req, res) {
  const database = req.app.get('database')
  try {

    const contract = await database.contract.selectcontract({account_id: req.session.account_id, account_type: req.session.account_type, proposal_id: req.params.contract_id})
    if(!contract) return response.fail(res, "invalid contract")
    if(contract.status != 'Active') return response.fail(res, "contract must be active")

    const result = await database.contract.endcontract({
      proposal_id: req.params.contract_id
    })

    if(result.affectedRows != 0){
      return response.success(res)
    }else{
      return response.fail(res, "invalid contract")
    }
    
  } catch (error) {
    return response.system(res, error)
  }
}