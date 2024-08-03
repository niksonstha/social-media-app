import express from "express";
import { getFriendDetail, sendFriendRequest } from "../controllers/friendRequest.controller.js";

const router = express.Router();

router.post("/send", sendFriendRequest);
router.get("/getFriendDetail", getFriendDetail);

export default router;
