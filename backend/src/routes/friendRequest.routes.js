import express from "express";
import {
  acceptFriendRequest,
  declineFriendRequest,
  getFriendDetail,
  getFriendRequestNotification,
  sendFriendRequest,
} from "../controllers/friendRequest.controller.js";

const router = express.Router();

router.post("/send", sendFriendRequest);
router.get("/getFriendDetail", getFriendDetail);
router.patch("/acceptFriendRequest", acceptFriendRequest);
router.delete("/declineFriendRequest", declineFriendRequest);
router.get("/getFriendRequestNotification/:id", getFriendRequestNotification);

export default router;
