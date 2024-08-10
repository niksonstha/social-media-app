import express from "express";
import { getRecommendedFeed } from "../controllers/FeedRecommendation.controller.js";
import { suggestFriends } from "../controllers/friendSuggestion.controller.js";

const router = express.Router();

router.get("/feed/:userId", getRecommendedFeed);
router.get("/friendSuggestion/:userId", suggestFriends);

export default router;
