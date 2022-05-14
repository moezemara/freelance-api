import {getprofile} from './client.controller.js';
import express from 'express'
import * as auth from '../../src/authChecker.js'
import * as schema from '../../config/schema.js'
import * as schemaChecker from '../../src/schemaChecker.js'

const router = express.Router()

router.get("/profile", auth.basic, auth.client, getprofile)

router.get("/job") // all posted jobs
router.get("/job/:job_id") // get details of a job
router.get("/job/active") // all active jobs (no freelancers hired yet or not disabled)
router.get("/job/archived") // all finished (freelancers hired), disabled jobs

router.post("/job") // post a job

router.post("/job/:job_id/close") // close current active job
router.post("/job/:job_id/update")  // update data of current job
router.post("/job/:job_id/boost") // adds custom flag to the job (costs credit)

export default router;