import {login} from "./user.controller.js";
import express from "express";

const router = express.Router();

router.post("/login", login);

export default router;
