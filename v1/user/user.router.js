import {login, logout, signup} from './user.controller.js';
import express from 'express'
import * as schema from '../../config/schema.js'
import * as schemaChecker from '../../src/schemaChecker.js'

const router = express.Router()

router.post("/login", schemaChecker.checkbody(schema.login_schema), login)
router.post("/logout", logout)
router.post("/signup", schemaChecker.checkbody(schema.signup_schema), signup)

router.get("/account/profile") // get account details
router.post("/account/update/password") // change account password
router.post("/account/update/name") // change first and last name
router.post("/account/update/email") // change email
router.post("/account/update/phone") // change phone number
router.post("/account/update/address") // change address and country
router.post("/account/update/profile") // change profile picture

export default router;