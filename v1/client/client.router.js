import {getprofile} from './client.controller.js';
import express from 'express'
import * as auth from '../../src/authChecker.js'
import * as schema from '../../config/schema.js'
import * as schemaChecker from '../../src/schemaChecker.js'

const router = express.Router()

router.get("/profile", auth.basic, auth.client, getprofile)

export default router;