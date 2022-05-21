import {createjob, getactivejobs, browsejobs, getjob} from './job.controller.js';
import express from 'express'
import * as schema from '../../config/schema.js'
import * as schemaChecker from '../../src/schemaChecker.js'
import * as auth from '../../src/authChecker.js'

const router = express.Router()


router.post("/create", auth.basic, auth.client, schemaChecker.checkbody(schema.createjob_schema), createjob) // create a job

// TODO: data fetched from database table needs to be customized
router.get("/get/active", auth.basic, auth.client, getactivejobs) // get active jobs posted by clients
router.get("/browse", auth.basic, auth.freelancer, browsejobs) // get all jobs matching active profile skills
router.get("/browse/:job_id", auth.basic, getjob) // get details of a job

export default router;