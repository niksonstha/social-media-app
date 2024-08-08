import express from "express";

import { getPostLike, likeOnPost } from "../controllers/like.controller.js";

const router = express.Router();

router.post("/likeOnPost", likeOnPost);
router.get("/getPostLike", getPostLike);

export default router;
