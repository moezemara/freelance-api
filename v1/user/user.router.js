import {login, logout, signup} from './user.controller.js';
import express from 'express'
import * as schema from '../../config/schema.js'
import * as schemaChecker from '../../src/schemaChecker.js'

const router = express.Router()

router.post("/login", schemaChecker.checkbody(schema.login_schema), login)
router.post("/logout", logout)
router.post("/signup", schemaChecker.checkbody(schema.signup_schema), signup)

export default router;