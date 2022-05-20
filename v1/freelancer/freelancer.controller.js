import config from '../../config/config.js'
import * as response from '../../src/response.js'
import { randomUUID } from 'crypto'

export async function getallprofiles(req, res) {
  const database = req.app.get('database')
  try {
    const allprofiles = await database.freelancer.selectuserprofiles({account_id: req.session.account_id})
    if(allprofiles.length == 0) return response.fail(res, "you have not created a profile yet")
    const account = await database.account.selectuserbyaccountid({account_id: req.session.account_id})
    if(!account) return response.fail(res, "invalid account")
    const activeprofile = await database.freelancer.selectuserprofile({profile_id: account.active_profile_id})
    if(!activeprofile) return response.fail(res, "you have no active profiles")

    activeprofile.skills = JSON.parse(activeprofile.skills)

    let {active_profile_id, ...o_account} = account
    let {account_id, ...o_activeprofile} = activeprofile

    return response.success(res,{
      account: o_account,
      profile: o_activeprofile,
      ids: allprofiles,
      active_id: active_profile_id,
      accessable: activeprofile.account_id == req.session?.account_id ? true : false
    })
  } catch (error) {
    return response.system(res, error)
  }
}

export async function getprofile(req, res) {
  const database = req.app.get('database')
  try {
    const profile = await database.freelancer.selectuserprofile({profile_id: req.params.profile_id})
    if(!profile){return response.fail(res, "invalid profile id")}
    const allprofiles = await database.freelancer.selectuserprofiles({account_id: profile.account_id})
    if(allprofiles.length == 0) return response.fail(res, "user has no profiles")
    const account = await database.account.selectuserbyaccountid({account_id: profile.account_id})
    if(!account) return response.fail(res, "invalid account")

    let {active_profile_id, ...o_account} = account
    let {account_id, ...o_profile} = profile

    profile.skills = JSON.parse(profile.skills)
    return response.success(res, {
      account: o_account,
      profile: o_profile,
      ids: allprofiles,
      active_id: active_profile_id,
      accessable: profile.account_id == req.session?.account_id ? true : false
    })
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
    const activeprofileid = await database.freelancer.selectactiveprofileid({account_id: req.session.account_id})
    if(!activeprofileid.profile_id) {
      const result = await database.freelancer.activateprofile(body)
    }

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
    result.affectedRows == 0 
    ? response.fail(res, "invalid profile id")
    : response.success(res)
  } catch (error) {
    return response.system(res, error)
  }
}

export async function deleteprofile(req, res) {
  const database = req.app.get('database')
  try {
    const activeprofileid = await database.freelancer.selectactiveprofileid({account_id: req.session.account_id})
    if(!activeprofileid){return response.fail(res, "no active profile found")}
    const result = await database.freelancer.deleteprofile(
      {
        account_id: req.session.account_id, 
        profile_id: req.params.profile_id, 
        activeprofileid: activeprofileid.profile_id
      }
    )
    if(result.affectedRows == 0 && activeprofileid.profile_id == req.params.profile_id)
    {return response.fail(res, "you can not delete active profiles")}
    
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

export async function getallactivecontracts(req, res) {
  const database = req.app.get('database')
  try {
    const result = await database.freelancer.selectusercontracts_withstatus({account_id: req.session.account_id, status:'active'})

    if(result.length == 0) return response.fail(res, "you don't have any active contracts yet")

    return response.success(res, result)
  } catch (error) {
    return response.system(res, error)
  }
}

export async function getallarchivedcontracts(req, res) {
  const database = req.app.get('database')
  try {
    const result = await database.freelancer.selectusercontracts_withstatus({account_id: req.session.account_id, status:'archived'})

    if(result.length == 0) return response.fail(res, "you don't have any archived contracts yet")

    return response.success(res, result)
  } catch (error) {
    return response.system(res, error)
  }
}
