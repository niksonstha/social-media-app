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
    }).populate("userId", "fullname profilePicture");

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

      // Extract comments for this post
      const postCommentsData = postComments.map((comment) => ({
        _id: comment._id,
        userId: {
          _id: comment.userId._id,
          fullname: comment.userId.fullname,
          profilePicture: comment.userId.profilePicture,
        },
        comment: comment.comment,
        createdAt: comment.createdAt,
      }));

      return {
        ...post.toObject(),
        likeCount: postLikes ? postLikes.like : 0,
        commentCount: postComments.length,
        comments: postCommentsData, // Include comments in the response
        feedScore,
        createdAt: post.createdAt, // Include creation date for sorting
      };
    });

    // Separate the most recent 4 posts
    const recentPosts = recommendedFeed.slice(0, 4);
    const remainingPosts = recommendedFeed.slice(4);

    // Sort remaining posts by feedScore
    remainingPosts.sort((a, b) => b.feedScore - a.feedScore);

    // Combine recent and sorted posts
    const finalFeed = [...recentPosts, ...remainingPosts];

    return res.json({
      success: true,
      message: "Recommended feed fetched successfully",
      data: finalFeed,
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
