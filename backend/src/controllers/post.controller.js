import { Post } from "../models/post.model.js";
import cloudnaryUpload from "../services/cloudnary.js";
import fs from "fs";

export const createPost = async (req, res) => {
  try {
    // Check if caption and file path are present
    if (!req.body.caption || !req.file || !req.file.path) {
      return res.status(400).json({
        message: "Caption and image are required",
      });
    }
    let cloudImagePath = "";
    try {
      let cloudImage = await cloudnaryUpload(req.file.path);

      // Unlink the file from the local server
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error(`Failed to delete local file: ${req.file.path}`, err);
        } else {
          console.log(`Successfully deleted local file: ${req.file.path}`);
        }
      });
      cloudImagePath = cloudImage.secure_url;
    } catch (error) {
      console.log(error);
    }

    const post = await Post.create({
      caption: req.body.caption,
      image: cloudImagePath,
    });

    res.status(200).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
