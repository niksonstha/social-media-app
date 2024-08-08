import express from "express";
import { commentOnPost } from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/commentOnPost", commentOnPost);

export default router;
