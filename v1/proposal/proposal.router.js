import {applytojob} from './proposal.controller.js';
import express from 'express'
import * as schema from '../../config/schema.js'
import * as schemaChecker from '../../src/schemaChecker.js'
import * as auth from '../../src/authChecker.js'

const router = express.Router()

router.post("/apply/:job_id", auth.basic, auth.freelancer, schemaChecker.checkbody(schema.applytojob_schema), applytojob)

router.post("/proposal") // post proposal to a job
router.get("/proposal") // get all applied proposals
router.get("/proposal/active") // get all proposal which still has job active
router.get("/proposal/archived") // get all proposal which has contract or inactive job or canceld ones

router.post("/proposal/:proposal_id/cancel") // cancels active proposal
router.post("/proposal/:proposal_id/boost") // boosts active proposal (adds badge on it which costs connects)

export default router;