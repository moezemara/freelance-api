import {getcontract, getactivecontracts_viewer, getarchivedcontracts_viewer, acceptproposal, getcontractsbystatus, updatepeerstatus} from './contract.controller.js';
import express from 'express'
import * as schema from '../../config/schema.js'
import * as schemaChecker from '../../src/schemaChecker.js'
import * as auth from '../../src/authChecker.js'
const router = express.Router()

router.post("/proposal/:proposal_id/accept", auth.basic, auth.client, acceptproposal) // start contract interview out of a proposal

router.get("/active", auth.basic, getcontractsbystatus("Active")) // active contracts
router.get("/archived", auth.basic, getcontractsbystatus("Archived")) // finished contracts
router.get("/pending", auth.basic, getcontractsbystatus("Interview")) // on interviews

router.get("/profile/:profile_id/active", auth.basic, getactivecontracts_viewer) // get active contracts on freelancer profile
router.get("/profile/:profile_id/archived", auth.basic, getarchivedcontracts_viewer) // get finished contracts on freelancer profile

router.get("/:contract_id", auth.basic, getcontract) // get contract data

router.post("/:contract_id/updatestatus", auth.basic, schemaChecker.checkbody(schema.updatepeerstatus_schema), updatepeerstatus) // accept, cancel offer
router.post("/:contract_id/updateprice") // update interview contract price (only when not pending acceptance)

router.get("/:contract_id/milestone") // get milestones of a contract
router.get("/:contract_id/milestone/:milestone_id/add") // add milestone only to (pending and active contracts)
router.get("/:contract_id/milestone/:milestone_id/remove") // remove milestone only from (pending and active contracts)
router.get("/:contract_id/milestone/:milestone_id/update") // update milestone only on (pending and active contracts)

router.post("/:contract_id/end") // end contract only when active

// feedbacks only available when contract ends
router.post("/:contract_id/feedback/add") // add feedback to contract
router.post("/:contract_id/feedback/update") // update feedback of contract

export default router;