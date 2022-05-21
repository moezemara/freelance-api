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
    return response.system(res, error)
  }
}