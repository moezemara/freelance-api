import {login, logout, signup} from './user.controller.js';
import express from 'express'

const router = express.Router()

router.post("/login", login)
router.post("/logout", logout)
router.post("/signup", signup)

export default router;