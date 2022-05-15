import {getallprofiles, getprofile, createprofile, updateprofile, activateprofile, getallcontracts, getcontract} from './freelancer.controller.js';
import express from 'express'
import * as auth from '../../src/authChecker.js'
import * as schema from '../../config/schema.js'
import * as schemaChecker from '../../src/schemaChecker.js'

const router = express.Router()

router.get("/profile", auth.basic, auth.freelancer, getallprofiles) // get all profiles
router.get("/profile/:profile_id", auth.basic, schemaChecker.checkparams(schema.getprofile_schema), getprofile) // get profile details
router.post("/profile", auth.basic, auth.freelancer, schemaChecker.checkbody(schema.createprofile_schema), createprofile) // create profile
router.post("/profile/:profile_id/update", auth.basic, auth.freelancer, 
schemaChecker.checkparams(schema.updateprofile_params_schema), schemaChecker.checkbody(schema.updateprofile_body_schema), 
updateprofile) // update profile

router.post("/profile/:profile_id/activate", auth.basic, auth.freelancer, activateprofile) // activate profile to be used getting jobs
router.get("/job") // get all jobs matching active profile skills
router.get("/job/:job_id") // get details of a job

router.post("/proposal") // post proposal to a job
router.get("/proposal") // get all applied proposals
router.get("/proposal/active") // get all proposal which still has job active
router.get("/proposal/archived") // get all proposal which has contract or inactive job or canceld ones

router.post("/proposal/:proposal_id/cancel") // cancels active proposal
router.post("/proposal/:proposal_id/boost") // boosts active proposal (adds badge on it which costs connects)


////////////////////////////////////////////////////////////////////////////////////////////////////////////ashmawy done: 1, 2
router.get("/contract", auth.basic, auth.freelancer, getallcontracts)  // get all user contracts    
router.get("/contract/:contract_id", auth.basic, auth.freelancer, schemaChecker.checkparams(schema.getcontract_schema), getcontract) // get contract data
router.get("/contract/pending") // get all contracts not started yet (on interview)
router.get("/contract/active") // get all ongoing contracts (not yet finished)
router.get("/contract/archived") // get all finished contracts or unaccepted ones

router.post("/contract/pending/:contract_id/updatestatus") // accept, cancel, end offer
router.post("/contract/pending/:contract_id/updateprice") // update interview contract price (only when not pending acceptance)

router.get("/contract/:contract_id/milestone") // get milestones of a contract
router.get("/contract/:contract_id/milestone/:milestone_id/add") // add milestone only to (pending and active contracts)
router.get("/contract/:contract_id/milestone/:milestone_id/remove") // remove milestone only from (pending and active contracts)
router.get("/contract/:contract_id/milestone/:milestone_id/update") // update milestone only on (pending and active contracts)

router.post("/contract/:contract_id/end") // end contract only when active

// feedbacks only available when contract ends
router.post("/contract/:contract_id/feedback/add") // add feedback to contract
router.post("/contract/:contract_id/feedback/update") // update feedback of contract

export default router;