import express from "express";
import { getRecommendedFeed } from "../controllers/FeedRecommendation.controller.js";

const router = express.Router();

router.get("/feed/:userId", getRecommendedFeed);

export default router;
