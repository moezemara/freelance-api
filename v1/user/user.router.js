import {login, logout, signup, updateaccountdata} from './user.controller.js';
import express from 'express'
import * as schema from '../../config/schema.js'
import * as schemaChecker from '../../src/schemaChecker.js'
import * as auth from '../../src/authChecker.js'

const router = express.Router()

router.post("/login", schemaChecker.checkbody(schema.login_schema), login)
router.post("/logout", logout)
router.post("/signup", schemaChecker.checkbody(schema.signup_schema), signup)
router.post("/update", auth.basic, schemaChecker.checkbody(schema.updateaccountdata_schema), updateaccountdata)

export default router;