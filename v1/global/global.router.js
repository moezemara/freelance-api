import {stats} from './global.controller.js';
import express from 'express'
import * as schema from '../../config/schema.js'
import * as schemaChecker from '../../src/schemaChecker.js'

const router = express.Router()

router.get("/stats", stats)

export default router;