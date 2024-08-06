import express from "express";
import {
  acceptFriendRequest,
  declineFriendRequest,
  getFriendDetail,
  sendFriendRequest,
} from "../controllers/friendRequest.controller.js";

const router = express.Router();

router.post("/send", sendFriendRequest);
router.get("/getFriendDetail", getFriendDetail);
router.patch("/acceptFriendRequest", acceptFriendRequest);
router.delete("/declineFriendRequest", declineFriendRequest);

export default router;
