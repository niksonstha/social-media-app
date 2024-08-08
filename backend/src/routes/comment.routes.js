import express from "express";
import {
  commentOnPost,
  getCommentOfPost,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/commentOnPost", commentOnPost);
router.get("/getCommentOfPost/:postId", getCommentOfPost);

export default router;
