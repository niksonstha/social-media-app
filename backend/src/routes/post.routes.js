import express from "express";
import { createPost, getPost } from "../controllers/post.controller.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./src/uploads");
  },
  filename: function (req, file, cb) {
    console.log(file);
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.post("/createPost", upload.single("image"), createPost);
router.get("/getPost/:id", getPost);

export default router;
