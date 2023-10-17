import express from "express";
import * as albumController from "../controllers/album-controller.js";

const router = express.Router();

router.route("/")
    .post(albumController.createAlbum) 
    .get(albumController.fetchAllAlbums) 

export default router;