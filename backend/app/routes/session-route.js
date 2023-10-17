import express from "express";
import * as sessionController from "../controllers/session-controller.js";

const router = express.Router();

router.route("/")
    .get(sessionController.getUserInfo)
    .delete(sessionController.logout) 


export default router;