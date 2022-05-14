import {getallprofiles, getprofile, createprofile, updateprofile} from './freelancer.controller.js';
import express from 'express'
import * as auth from '../../src/authChecker.js'
import * as schema from '../../config/schema.js'
import * as schemaChecker from '../../src/schemaChecker.js'

const router = express.Router()

router.get("/profile", auth.basic, auth.freelancer, getallprofiles)
router.get("/profile/:profile_id", auth.basic, schemaChecker.checkbody(schema.getprofile_schema), getprofile)
router.post("/profile", auth.basic, auth.freelancer, schemaChecker.checkbody(schema.createprofile_schema), createprofile)
router.post("/profile/:profile_id/update", auth.basic, auth.freelancer, 
schemaChecker.checkparams(schema.updateprofile_params_schema), schemaChecker.checkbody(schema.updateprofile_body_schema), 
updateprofile)

export default router;