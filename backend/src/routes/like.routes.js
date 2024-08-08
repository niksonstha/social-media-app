import express from "express";

import { likeOnPost } from "../controllers/like.controller.js";

const router = express.Router();

router.post("/likeOnPost", likeOnPost);

export default router;
