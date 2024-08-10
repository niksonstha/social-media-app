import { User } from "../models/user.model.js";
import { FriendRequest } from "../models/friendRequest.model.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import mongoose from "mongoose";

// Controller to suggest friends
export const suggestFriends = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if userId is valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Fetch current user's friends (accepted friend requests)
    const friends = await FriendRequest.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
      status: "accepted",
    });

    const friendIds = friends.map((friend) =>
      friend.senderId.toString() === userId
        ? friend.receiverId.toString()
        : friend.senderId.toString()
    );

    // Fetch mutual friends for potential friend suggestions
    const mutualFriends = await FriendRequest.find({
      $or: [
        { senderId: { $in: friendIds } },
        { receiverId: { $in: friendIds } },
      ],
      status: "accepted",
      $nor: [{ senderId: userId }, { receiverId: userId }],
    }).populate("senderId receiverId", "fullname profilePicture");

    // Debugging: Log mutualFriends data
    console.log("Mutual Friends:", mutualFriends);

    // Extract mutual friend IDs correctly
    const mutualFriendIds = mutualFriends.map((friend) => {
      return friend.senderId.toString() !== userId
        ? friend.senderId._id.toString()
        : friend.receiverId._id.toString();
    });

    // Remove duplicates and friends that are already in the user's friend list
    const potentialFriendIds = [...new Set(mutualFriendIds)].filter(
      (id) => !friendIds.includes(id) && mongoose.Types.ObjectId.isValid(id)
    );

    if (potentialFriendIds.length === 0) {
      return res.json({
        success: true,
        message: "No potential friends found",
        data: [],
      });
    }

    // Fetch interaction history (likes and comments) for potential friends
    const interactions = await Promise.all([
      Like.find({ userId: { $in: potentialFriendIds } }),
      Comment.find({ userId: { $in: potentialFriendIds } }),
    ]);

    const interactionCounts = {};
    interactions.flat().forEach((interaction) => {
      const id = interaction.userId.toString();
      if (!interactionCounts[id]) {
        interactionCounts[id] = 0;
      }
      interactionCounts[id] += 1;
    });

    // Calculate scores for each potential friend
    const potentialFriends = potentialFriendIds.map((id) => {
      const mutualFriendCount = mutualFriends.filter(
        (friend) =>
          friend.senderId.toString() === id ||
          friend.receiverId.toString() === id
      ).length;

      const interactionCount = interactionCounts[id] || 0;

      // Score calculation: more weight on mutual friends and interactions
      const score = mutualFriendCount * 2 + interactionCount;

      return {
        userId: id,
        mutualFriendsCount: mutualFriendCount,
        interactionCount: interactionCount,
        score: score,
      };
    });

    // Sort potential friends by score in descending order and limit the results
    const sortedFriends = potentialFriends
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Return top 5 suggestions

    // Fetch user details for the top suggestions
    const suggestedUsers = await User.find({
      _id: { $in: sortedFriends.map((friend) => friend.userId) },
    }).select("fullname username profilePicture");

    // Attach detailed information to each suggestion
    const detailedSuggestions = sortedFriends.map((friend) => {
      const user = suggestedUsers.find(
        (u) => u._id.toString() === friend.userId
      );

      return {
        userId: friend.userId,
        fullname: user.fullname,
        username: user.username,
        profilePicture: user.profilePicture,
        mutualFriendsCount: friend.mutualFriendsCount,
        interactionCount: friend.interactionCount,
        score: friend.score,
      };
    });

    return res.json({
      success: true,
      message: "Friend suggestions fetched successfully",
      data: detailedSuggestions,
    });
  } catch (error) {
    console.error("Failed to fetch friend suggestions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch friend suggestions",
      error: error.message,
    });
  }
};
