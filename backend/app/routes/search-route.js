import express from "express";
import * as searchController from "../controllers/search-controller.js";

const router = express.Router();

router.route("/")
    .get(searchController.searchAlbums);


export default router;