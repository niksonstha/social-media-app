import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    comment: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);
