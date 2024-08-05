import { FriendRequest } from "../models/friendRequest.model.js";
import { User } from "../models/user.model.js";

export const getFriendDetail = async (req, res) => {
  try {
    const { currentUser, checkingUser } = req.query;

    // Find friend request in both directions
    const friendRequest = await FriendRequest.findOne({
      $or: [
        { senderId: currentUser, receiverId: checkingUser },
        { senderId: checkingUser, receiverId: currentUser },
      ],
    });

    if (!friendRequest) {
      return res.status(404).json({
        status: "error",
        message: "No friend request found between the users",
      });
    }

    let isSender = false;
    let isReceiver = false;
    if (currentUser === friendRequest.senderId.toString()) {
      isSender = true;
    } else if (currentUser === friendRequest.receiverId.toString()) {
      isReceiver = true;
    }

    res.status(200).json({
      status: "success",
      data: friendRequest,
      isSender,
      isReceiver,
    });
  } catch (error) {
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
