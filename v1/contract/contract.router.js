import {getcontract, getactivecontracts_viewer, getarchivedcontracts_viewer, acceptproposal, getcontractsbystatus, updatepeerstatus, getmilestone, getmilestones, addmilestone, deletemilestone, endmilestone, endcontract, cancelinterview} from './contract.controller.js';
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
router.post("/:contract_id/cancel", auth.basic, cancelinterview) // cancel interview

router.post("/:contract_id/updatestatus", auth.basic, schemaChecker.checkbody(schema.updatepeerstatus_schema), updatepeerstatus) // accept, cancel offer

router.get("/:contract_id/milestone", auth.basic, getmilestones) // get milestones of a contract
router.get("/:contract_id/milestone/:milestone_id", auth.basic, getmilestone) // get milestone data

router.post("/:contract_id/milestone/add", auth.basic, schemaChecker.checkbody(schema.addmilestone_schema), addmilestone) // add milestone only to interview contracts

router.post("/:contract_id/milestone/:milestone_id/remove", auth.basic, deletemilestone) // remove milestone only from interview contracts
router.post("/:contract_id/milestone/:milestone_id/end", auth.basic, endmilestone) // end milestone status

router.post("/:contract_id/end", auth.basic, endcontract) // end contract only when active

// feedbacks only available when contract ends
router.post("/:contract_id/feedback/add") // add feedback to contract
router.post("/:contract_id/feedback/update") // update feedback of contract

export default router;