import {getallprofiles, getprofile, createprofile, updateprofile, activateprofile, deleteprofile} from './freelancer.controller.js';
import express from 'express'
import * as auth from '../../src/authChecker.js'
import * as schema from '../../config/schema.js'
import * as schemaChecker from '../../src/schemaChecker.js'

const router = express.Router()

router.get("/profile", auth.basic, auth.freelancer, getallprofiles) // get all profiles
router.get("/profile/:profile_id", auth.basic, getprofile) // get profile details
router.post("/profile", auth.basic, auth.freelancer, schemaChecker.checkbody(schema.createprofile_schema), createprofile) // create profile
router.post("/profile/:profile_id/update", auth.basic, auth.freelancer, schemaChecker.checkbody(schema.updateprofile_body_schema), updateprofile) // update profile
router.post("/profile/:profile_id/activate", auth.basic, auth.freelancer, activateprofile) // activate profile to be used getting jobs
router.post("/profile/:profile_id/delete", auth.basic, auth.freelancer, deleteprofile) // delete profile

export default router;