import { Comment } from "../models/comment.model.js"; // Adjust the path as needed
import { Post } from "../models/post.model.js"; // Adjust the path as needed

export const commentOnPost = async (req, res) => {
  const { userId, postId, comment } = req.body;

  try {
    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if a comment document exists for this post and user
    let commentDoc = await Comment.findOne({ postId, userId });

    if (commentDoc) {
      // If the document exists for this user, add the new comment to it
      commentDoc.comment.push(comment);
      await commentDoc.save();
    } else {
      // Create a new comment document for this user and post
      commentDoc = new Comment({
        userId, // Single userId
        postId,
        comment: [comment], // Store the comment in an array
      });
      await commentDoc.save();
    }

    return res.status(201).json({
      message: "Comment added successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCommentOfPost = async (req, res) => {
  const { postId } = req.params;

  try {
    // Find all comments associated with the postId
    const comments = await Comment.find({ postId }).populate(
      "userId",
      "fullname profilePicture"
    );

    if (!comments || comments.length === 0) {
      return res
        .status(404)
        .json({ message: "No comments found for this post" });
    }

    return res.status(200).json({
      message: "Comments retrieved successfully",
      data: comments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
