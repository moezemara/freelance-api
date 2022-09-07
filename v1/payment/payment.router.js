import {createorder, capturepayment} from './payment.controller.js';
import express from 'express'
import * as schema from '../../config/schema.js'
import * as schemaChecker from '../../src/schemaChecker.js'
import * as auth from '../../src/authChecker.js'

const router = express.Router()

router.post("/orders", auth.basic, schemaChecker.checkbody(schema.createorder_schema), createorder);
router.post("/orders/:orderID/capture", auth.basic, schemaChecker.checkparams(schema.capturePayment_schema), capturepayment);

export default router;
