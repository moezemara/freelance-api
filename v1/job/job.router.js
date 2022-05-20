import {createjob, getactivejobs} from './job.controller.js';
import express from 'express'
import * as schema from '../../config/schema.js'
import * as schemaChecker from '../../src/schemaChecker.js'
import * as auth from '../../src/authChecker.js'

const router = express.Router()


router.post("/create", auth.basic, auth.client, schemaChecker.checkbody(schema.createjob_schema), createjob) // create a job
router.get("/get/active", auth.basic, auth.client, getactivejobs) // get active jobs posted by clients

router.get("/job/browse", auth.basic, auth.freelancer) // get all jobs matching active profile skills

router.get("/job/:job_id", auth.basic) // get details of a job
router.post("/job/:job_id/apply", auth.basic, auth.freelancer) // apply to a job

export default router;