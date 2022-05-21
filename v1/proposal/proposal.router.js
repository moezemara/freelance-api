import {applytojob, getpendingproposals, getproposalsofjob} from './proposal.controller.js';
import express from 'express'
import * as schema from '../../config/schema.js'
import * as schemaChecker from '../../src/schemaChecker.js'
import * as auth from '../../src/authChecker.js'

const router = express.Router()

router.post("/apply/:job_id", auth.basic, auth.freelancer, schemaChecker.checkbody(schema.applytojob_schema), applytojob) // apply to a job
router.get("/get/pending", auth.basic, auth.freelancer, getpendingproposals) // get all applied proposals
router.get("/get/proposals/:job_id", auth.basic, auth.client, getproposalsofjob) // get pending applied proposals of certain job

router.post("/:proposal_id/cancel") // cancels active proposal
router.post("/:proposal_id/boost") // boosts active proposal (adds badge on it which costs connects)

export default router;
