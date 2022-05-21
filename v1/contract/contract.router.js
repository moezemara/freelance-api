import {getactivecontracts_viewer, getarchivedcontracts_viewer, acceptproposal} from './contract.controller.js';
import express from 'express'
import * as schema from '../../config/schema.js'
import * as schemaChecker from '../../src/schemaChecker.js'
import * as auth from '../../src/authChecker.js'
const router = express.Router()



router.post("/:proposal_id/accept", auth.basic, auth.client, acceptproposal) // start contract interview out of a proposal

router.get("/:profile_id/active", auth.basic, getactivecontracts_viewer) // get active contracts on profile
router.get("/:profile_id/archived", auth.basic, getarchivedcontracts_viewer) // get finished contracts on profile

////////////////////////////////////////////////////////////////////////////////////////////////////////////ashmawy done: 1, 2, 3, 4, 5.
//router.get("/contract", auth.basic, auth.freelancer, getallcontracts)  // get all user contracts    
//router.get("/contract/:contract_id", auth.basic, auth.freelancer, getcontract) // get contract data
//router.get("/contract/pending", auth.basic, auth.freelancer, getallpendingcontracts) // get all contracts not started yet (on interview)
//router.get("/contract/active", auth.basic, auth.freelancer, getallactivecontracts) // get all ongoing contracts (not yet finished)
//router.get("/contract/archived", auth.basic, auth.freelancer, getallarchivedcontracts) // get all finished contracts or unaccepted ones
///////////////////////////////////////////////////////////////////////////////////////////////////////////////


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