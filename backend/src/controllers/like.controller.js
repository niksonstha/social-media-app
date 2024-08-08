import { Like } from "../models/like.model.js";
import { Post } from "../models/post.model.js";

export const likeOnPost = async (req, res) => {
  const { userId, postId } = req.body;
  try {
    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find the like document for the post
    let like = await Like.findOne({ postId });

    if (like) {
      // Check if the user has already liked the post
      const userIndex = like.userId.indexOf(userId);
      if (userIndex > -1) {
        // User already liked the post, so unlike it
        like.userId.splice(userIndex, 1);
        like.like -= 1;
        await like.save();
        return res
          .status(200)
          .json({ message: "Post unliked successfully", likeCount: like.like });
      } else {
        // User has not liked the post yet, so add the userId to the array
        like.userId.push(userId);
        like.like += 1;
        await like.save();
        return res
          .status(201)
          .json({ message: "Post liked successfully", likeCount: like.like });
      }
    } else {
      // No like document exists for this post, so create a new one
      like = new Like({ userId: [userId], postId, like: 1 });
      await like.save();
      return res
        .status(201)
        .json({ message: "Post liked successfully", likeCount: like.like });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
