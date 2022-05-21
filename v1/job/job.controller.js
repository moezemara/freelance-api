import config from '../../config/config.js'
import * as response from '../../src/response.js'
import { randomUUID } from 'crypto'

export async function createjob(req, res) {
  const database = req.app.get('database');
  const data = req.body

  try {
    const profile = await database.client.selectprofile({account_id: req.session.account_id})
    if(!profile){return response.fail(res, "invalid profile")}
    
    data.job_id = randomUUID()
    data.profile_id = profile.profile_id

    const result = await database.job.insertjob(data)

    if(result.affectedRows != 0){
      return response.success(res, "job posted")
    }else{
      return response.system(res, result)
    }
  } catch (error) {
    return response.system(res, error)
  }
}

export async function getactivejobs(req, res) {
  const database = req.app.get('database');

  try {
    const jobs = await database.job.selectclientjobs({account_id: req.session.account_id, status: "active"})
    if(jobs.length == 0){return response.fail(res, "invalid profile")}

    for (const key in jobs) {
      jobs[key].skills = JSON.parse(jobs[key].skills)
    }

    return response.success(res, jobs)
  } catch (error) {
    return response.system(res, error)
  }
}

export async function browsejobs(req, res) {
  const database = req.app.get('database');

  try {
    const activeprofileid = await database.freelancer.selectactiveprofileid({account_id: req.session.account_id})
    if(!activeprofileid){return response.fail(res, "no active profile found")}
    const activeprofile = await database.freelancer.selectuserprofile({profile_id: activeprofileid.profile_id})
    if(!activeprofile){return response.fail(res, "invalid profile")}
    const profileskills = JSON.parse(activeprofile.skills)

    const alljobs = []
    for(const skill of profileskills){
      const jobs = await database.job.selectjobswithskill({skill: skill})
      alljobs.push(...jobs)
    }

    const unique_jobs = [...new Map(alljobs.map(job => [job.job_id, v])).values()]

    return response.success(res, unique_jobs)
  } catch (error) {
    return response.system(res, error)
  }
}

export async function getjob(req, res) {
  const database = req.app.get('database');

  try {
    const job = await database.job.selectjob({job_id: req.params.job_id})
    if(!job){return response.fail(res, "invalid job")}

    job.skills = JSON.parse(job.skills)
    return response.success(res, job)
  } catch (error) {
    return response.system(res, error)
  }
}