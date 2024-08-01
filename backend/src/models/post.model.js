import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
