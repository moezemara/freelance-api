import {login, logout, signup, getallprofiles, getprofile, createprofile, updateprofile, getclientprofile} from './user.controller.js';
import express from 'express'

const router = express.Router()

router.post("/login", login)
router.post("/logout", logout)
router.post("/signup", signup)

router.get("/profile", getallprofiles)
router.get("/profile/:profile_id", getprofile)
router.post("/profile", createprofile)
router.post("/profile/:profile_id/update", updateprofile)

router.get("/client/profile", getclientprofile)

export default router;