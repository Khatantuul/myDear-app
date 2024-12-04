import express from "express";
import * as albumController from "../controllers/album-controller.js";

const router = express.Router();

router.route("/")
    .post(albumController.createAlbum) 
    .patch(albumController.addPhotosToAlbum)
    .get(albumController.fetchAllAlbums)
router.route("/test")
    .get(albumController.fetchAllUserPhotos)
router.route("/:albumId")
    .get(albumController.fetchAllAlbumPhotos)
    .patch(albumController.deletePhotosFromAlbum)
    .delete(albumController.deleteAlbum);
 

export default router;