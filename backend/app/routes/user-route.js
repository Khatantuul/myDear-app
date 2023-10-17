import express from "express";
import * as userController from "../controllers/user-controller.js";

const router = express.Router();

router.route("/")
    .post(userController.postUser) 
router.route("/login")
    .post(userController.authenticate)
router.route("/oauth/login")
    .post(userController.authenticateOauth)
router.route("/signup")
    .post(userController.postUserNonOauth)

export default router;