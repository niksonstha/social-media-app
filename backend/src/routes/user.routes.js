import express from "express";
import {
  createUser,
  getProfilePicture,
  loginUser,
  updateProfile,
} from "../controllers/user.controller.js";

import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./src/uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.post("/registerUser", createUser);
router.post("/loginUser", loginUser);
router.post("/updateProfile", upload.single("profileImage"), updateProfile);
router.get("/getProfilePicture/:id", getProfilePicture);

export default router;
