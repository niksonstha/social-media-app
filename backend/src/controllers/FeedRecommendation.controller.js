import { Comment } from "../models/comment.model.js";
import { FriendRequest } from "../models/friendRequest.model.js";
import { Like } from "../models/like.model.js";
import { Post } from "../models/post.model.js";

export const getRecommendedFeed = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get the list of friends (accepted friend requests)
    const friends = await FriendRequest.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
      status: "accepted",
    }).select("senderId receiverId");

    const friendIds = friends.map((friend) =>
      friend.senderId.toString() === userId
        ? friend.receiverId
        : friend.senderId
    );

    // Fetch posts only from friends
    const posts = await Post.find({ userId: { $in: friendIds } })
      .populate("userId", "fullname profilePicture")
      .sort({ createdAt: -1 });

    const likes = await Like.find({ postId: { $in: posts.map((p) => p._id) } });
    const comments = await Comment.find({
      postId: { $in: posts.map((p) => p._id) },
    });

    const recommendedFeed = posts.map((post) => {
      // Affinity Score Calculation
      const postLikes = likes.find((like) => like.postId.equals(post._id));
      const postComments = comments.filter((comment) =>
        comment.postId.equals(post._id)
      );

      // Example weights (can be adjusted)
      const likeWeight = 1;
      const commentWeight = 2;
      const decayFactor = Math.exp(
        -(
          (Date.now() - new Date(post.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
        )
      ); // decay factor based on days

      const affinityScore =
        (postLikes ? postLikes.like * likeWeight : 0) +
        postComments.length * commentWeight;
      const feedScore = affinityScore * decayFactor;

      return {
        ...post.toObject(),
        likeCount: postLikes ? postLikes.like : 0,
        commentCount: postComments.length,
        feedScore,
      };
    });

    // Sort posts based on feedScore
    recommendedFeed.sort((a, b) => b.feedScore - a.feedScore);

    return res.json({
      success: true,
      message: "Recommended feed fetched successfully",
      data: recommendedFeed,
    });
  } catch (error) {
    console.error("Failed to get recommended feed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get recommended feed",
      error: error.message,
    });
  }
};
