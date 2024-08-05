import express from "express";
import {
  acceptFriendRequest,
  getFriendDetail,
  sendFriendRequest,
} from "../controllers/friendRequest.controller.js";

const router = express.Router();

router.post("/send", sendFriendRequest);
router.get("/getFriendDetail", getFriendDetail);
router.patch("/acceptFriendRequest", acceptFriendRequest);

export default router;
