import { FriendRequest } from "../models/friendRequest.model.js";
import { User } from "../models/user.model.js";

export const getFriendDetail = async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;

    const friendRequest = await FriendRequest.findOne({
      senderId,
      receiverId,
    });

    res.status(200).json({
      status: "success",
      data: friendRequest,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const sendFriendRequest = async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if a friend request already exists between these users
    const existingRequest = await FriendRequest.findOne({
      senderId,
      receiverId,
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ success: false, message: "Friend request already sent" });
    }

    await FriendRequest.create({ senderId, receiverId });

    res.status(201).json({
      success: true,
      message: "Friend request sent",
    });
  } catch (error) {
    console.log(error);
  }
};
