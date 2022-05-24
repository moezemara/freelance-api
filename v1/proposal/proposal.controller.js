import config from '../../config/config.js'
import * as response from '../../src/response.js'
import { randomUUID } from 'crypto'

export async function applytojob(req, res) {
  const database = req.app.get('database');
  const data = req.body
  try {
    const freelancer_profile_id = await database.freelancer.selectactiveprofileid({account_id: req.session.account_id})
    if(!freelancer_profile_id){return response.fail(res, "no active profile found")}
    const client_profile_id = await database.proposal.selectclientprofileid({job_id: req.params.job_id})
    if(!client_profile_id){return response.fail(res, "invalid job")}

    data.proposal_id = randomUUID()
    data.job_id = req.params.job_id
    data.freelancer_profile_id = freelancer_profile_id.profile_id
    data.client_profile_id = client_profile_id.profile_id
    
    const result = await database.proposal.insertproposal(data)

    if(result.affectedRows != 0){
      return response.success(res, "proposal posted")
    }else{
      return response.system(res, result)
    }
  } catch (error) {
    if(error.errno == 1062){
      return response.fail(res, "you have already applied to this job")
    }
    else{
      return response.system(res, error)
    }
  }
}

export async function getpendingproposals(req, res) {
  const database = req.app.get('database');
  
  try {
    const proposals = await database.proposal.selectpendingproposals({account_id: req.session.account_id})
    if(proposals.length == 0){ return response.fail(res, "no proposals found")}
    
    for (const key in proposals) {
      const names = await database.proposal.selectproposalaccountnames({proposal_id: proposals[key].proposal_id})
      proposals[key].client_name = names.client_name
      proposals[key].freelancer_name = names.freelancer_name
    }

    return response.success(res, proposals)
  } catch (error) {
    return response.system(res, error)
  }
}

export async function getproposalsofjob(req, res) {
  const database = req.app.get('database');
  
  try {
    const proposals = await database.proposal.selectjobproposals({account_id: req.session.account_id, job_id: req.params.job_id, status: "Pending"})
    if(proposals.length == 0){ return response.fail(res, "no proposals found")}
    
    for (const key in proposals) {
      const names = await database.proposal.selectproposalaccountnames({proposal_id: proposals[key].proposal_id})
      proposals[key].client_name = names.client_name
      proposals[key].freelancer_name = names.freelancer_name
    }
    
    return response.success(res, proposals)
  } catch (error) {
    return response.system(res, error)
  }
}

export async function withdrawproposal(req, res) {
  const database = req.app.get('database');
  
  try {
    const result = await database.proposal.deleteproposal({account_id: req.session.account_id, proposal_id: req.params.proposal_id})
    if(result.affectedRows == 0){ return response.fail(res, "invalid proposal")}
    
    return response.success(res, "proposal deleted")

  } catch (error) {
    return response.system(res, error)
  }
}