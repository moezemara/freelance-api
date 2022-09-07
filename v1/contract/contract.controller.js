import config from '../../config/config.js'
import * as response from '../../src/response.js'
import { randomUUID } from 'crypto'
import * as interviewstatus from './src/checkstatus.js'

export async function getcontract(req, res) {
  const database = req.app.get('database')
  try {
    const contract = await database.contract.selectcontract({account_id: req.session.account_id, account_type: req.session.account_type, proposal_id: req.params.contract_id})
    if(!contract) return response.fail(res, "invalid contract")

    //if(contract.status == 'Interview'){
    var permissions = interviewstatus.checkstatus(contract)
    //}

    const names = await database.contract.selectcontractaccountnames({proposal_id: contract.proposal_id})
    contract.client_name = names.client_name
    contract.freelancer_name = names.freelancer_name
    
    const description = await database.proposal.selectproposaljobdescription({proposal_id: contract.proposal_id})
    contract.description = description.description

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

    for (const key in contracts) {
      const names = await database.contract.selectcontractaccountnames({proposal_id: contracts[key].proposal_id})
      const description = await database.proposal.selectproposaljobdescription({proposal_id: contracts[key].proposal_id})
      contracts[key].description = description.description
      contracts[key].client_name = names.client_name
      contracts[key].freelancer_name = names.freelancer_name
    }

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

    for (const key in contracts) {
      const names = await database.contract.selectcontractaccountnames({proposal_id: contracts[key].proposal_id})
      const description = await database.proposal.selectproposaljobdescription({proposal_id: contracts[key].proposal_id})
      contracts[key].description = description.description
      contracts[key].client_name = names.client_name
      contracts[key].freelancer_name = names.freelancer_name
    }

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
    data.final_price = 0

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
  

      for (const key in contracts) {
        const names = await database.contract.selectcontractaccountnames({proposal_id: contracts[key].proposal_id})
        const description = await database.proposal.selectproposaljobdescription({proposal_id: contracts[key].proposal_id})
        contracts[key].description = description.description
        contracts[key].client_name = names.client_name
        contracts[key].freelancer_name = names.freelancer_name
      }

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


    if(contract.client_acceptance == 1){
      const client_account = await database.account.selectuserbyprofileid({profile_id: contract.client_profile_id, account_type: "C"})
      const newbalance = client_account.balance + contract.final_price
      const escrowbalance = client_account.escrowbalance - contract.final_price
      const updatebalance = await database.account.updateaccountdata({attribute: "balance", data: newbalance, account_id: client_account.account_id})
      const updateescrowbalance = await database.account.updateaccountdata({attribute: "escrow_balance", data: escrowbalance, account_id: client_account.account_id}) 
    }

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
    const account = await database.account.selectuserbyaccountid({account_id: req.session.account_id})
    const contract = await database.contract.selectcontract({account_id: req.session.account_id, account_type: req.session.account_type, proposal_id: req.params.contract_id})
    if(!contract) return response.fail(res, "invalid contract")
    if(contract.status != 'Interview') return response.fail(res, "invalid contract operation")
    const status = interviewstatus.checkstatus(contract)
    
    // check what is possible
    const interview_result = interviewstatus.handlepermissions(res, status, account_type, input)
    if(interview_result) return interview_result
    

    // update balance of client before accepting and after canceling
    if(account_type == 'C' && input == 1 && contract.final_price > account.balance){
      return response.fail(res, "insufficient balance")
    }else if(account_type == 'C' && input == 1 && contract.final_price <=  account.balance){
      const newbalance = account.balance - contract.final_price
      const escrowbalance = account.escrowbalance + contract.final_price
      const updatebalance = await database.account.updateaccountdata({attribute: "balance", data: newbalance, account_id: req.session.account_id})
      const updateescrowbalance = await database.account.updateaccountdata({attribute: "escrow_balance", data: escrowbalance, account_id: req.session.account_id}) 
    }else if(input == 0 && contract.client_acceptance == 1){
      const client_account = await database.account.selectuserbyprofileid({profile_id: contract.client_profile_id, account_type: "C"})
      const newbalance = client_account.balance + contract.final_price
      const escrowbalance = client_account.escrowbalance - contract.final_price
      const updatebalance = await database.account.updateaccountdata({attribute: "balance", data: newbalance, account_id: client_account.account_id})
      const updateescrowbalance = await database.account.updateaccountdata({attribute: "escrow_balance", data: escrowbalance, account_id: client_account.account_id}) 
    }

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
    

    if(pre_updated_status.status == 'Active'){
      const freelancer_account = await database.account.selectuserbyprofileid({profile_id: contract.client_profile_id, account_type: "F"})
      const freelancer_escrowbalance = freelancer_account.escrowbalance + contract.final_price
      const update_freelancer_escrowbalance = await database.account.updateaccountdata({attribute: "escrow_balance", data: freelancer_escrowbalance, account_id: freelancer_account.account_id})  
    }    

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
    if(contract.status != 'Interview') return response.fail(res, "you are not allowed to edit")
    const status = interviewstatus.checkstatus(contract)

    if(status.special_status != 'NAN'){
      return response.fail(res, "you are not allowed to edit")
    }

    const data = {
      milestone_id: randomUUID(),
      proposal_id: req.params.contract_id,
      amount: body.amount,
      description: body.description,
      date: body.date
    }

    const milestones = await database.contract.insertmilestone(data)
    await database.contract.updatecontractfinalprice({proposal_id: req.params.contract_id})

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
    if(contract.status != 'Interview') return response.fail(res, "you are not allowed to edit")
    const status = interviewstatus.checkstatus(contract)

    if(status.special_status != 'NAN'){
      return response.fail(res, "you are not allowed to edit")
    }

    const result = await database.contract.deletemilestone({milestone_id: req.params.milestone_id, proposal_id: req.params.contract_id})

    if(result.affectedRows == 0){
      return response.fail(res, "invalid milestone")
    }

    await database.contract.updatecontractfinalprice({proposal_id: req.params.contract_id})

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


    const milestone = await database.contract.selectmilestone({
      account_type: req.session.account_type, 
      milestone_id: req.params.milestone_id, 
      proposal_id: req.params.contract_id,
      account_id: req.session.account_id
    })

    if(milestone.length == 0) return response.fail(res, "invalid milestone")


    const result = await database.contract.endmilestone({
      milestone_id: req.params.milestone_id,
      proposal_id: req.params.contract_id
    })


    if(result.affectedRows == 0){
      return response.fail(res, "invalid milestone")
    }

    const client_account = await database.account.selectuserbyprofileid({profile_id: contract.client_profile_id, account_type: "C"})
    const freelancer_account = await database.account.selectuserbyprofileid({profile_id: contract.client_profile_id, account_type: "F"})
    
    const freelancer_newbalance = parseFloat(freelancer_account.balance) + parseFloat(milestone.amount)
    const freelancer_escrowbalance = parseFloat(freelancer_account.escrowbalance) - parseFloat(milestone.amount)
    const update_freelancer_balance = await database.account.updateaccountdata({attribute: "balance", data: freelancer_newbalance, account_id: freelancer_account.account_id})
    const update_freelancer_escrowbalance = await database.account.updateaccountdata({attribute: "escrow_balance", data: freelancer_escrowbalance, account_id: freelancer_account.account_id})

    const client_escrowbalance = client_account.escrowbalance - milestone.amount
    const update_client_escrowbalance = await database.account.updateaccountdata({attribute: "escrow_balance", data: client_escrowbalance, account_id: client_account.account_id}) 
  

    return response.success(res)
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


    const milestones = await database.contract.selectinternalmilestones({proposal_id: req.params.contract_id})

    var remaining_amount = 0

    for (const milestone in milestones) {
      if(milestone.status == "Reviewing"){
        return response.fail(res, "please finish under review milestones first")
      }else{
        remaining_amount+= milestone.amount
      }
    }

    const result = await database.contract.endcontract({
      proposal_id: req.params.contract_id
    })

    if(result.affectedRows == 0){
      return response.fail(res, "invalid contract")
    }

    if(remaining_amount != 0){
      const client_account = await database.account.selectuserbyprofileid({profile_id: contract.client_profile_id, account_type: "C"})
      const freelancer_account = await database.account.selectuserbyprofileid({profile_id: contract.client_profile_id, account_type: "F"})
  
      const freelancer_escrowbalance = freelancer_account.escrowbalance - remaining_amount
      const update_freelancer_escrowbalance = await database.account.updateaccountdata({attribute: "escrow_balance", data: freelancer_escrowbalance, account_id: freelancer_account.account_id})
      
      const client_newbalance = client_account.balance + remaining_amount
      const client_escrowbalance = client_account.escrowbalance - remaining_amount
      const update_client_escrowbalance = await database.account.updateaccountdata({attribute: "escrow_balance", data: client_escrowbalance, account_id: client_account.account_id}) 
      const update_client_balance = await database.account.updateaccountdata({attribute: "balance", data: client_newbalance, account_id: client_account.account_id})  
    }

    return response.success(res)
  } catch (error) {
    return response.system(res, error)
  }
}