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
      return res.status(200).json({
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

export const acceptFriendRequest = async (req, res) => {
  const { acceptedBy, acceptedTo } = req.body.params;

  if (!acceptedBy || !acceptedTo) {
    return res
      .status(400)
      .json({ error: "acceptedBy and acceptedTo are required parameters." });
  }

  try {
    const friendRequest = await FriendRequest.findOneAndUpdate(
      {
        senderId: acceptedTo,
        receiverId: acceptedBy,
      },
      {
        status: "accepted",
      },
      {
        new: true, // This option returns the updated document
      }
    );

    if (!friendRequest) {
      return res.status(404).json({ error: "Friend request not found." });
    }

    res.status(200).json({ friendRequest });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const declineFriendRequest = async (req, res) => {
  const { declinedBy, declinedTo, actionType } = req.query;

  if (!declinedBy || !declinedTo) {
    return res
      .status(400)
      .json({ error: "declinedBy and declinedTo are required parameters." });
  }

  try {
    let friendRequest;
    if (actionType === "decline") {
      friendRequest = await FriendRequest.findOneAndDelete({
        senderId: declinedTo,
        receiverId: declinedBy,
      });
    } else if (actionType === "unfriend") {
      friendRequest = await FriendRequest.findOneAndDelete({
        $or: [
          { senderId: declinedBy, receiverId: declinedTo },
          { senderId: declinedTo, receiverId: declinedBy },
        ],
      });
    }

    if (!friendRequest) {
      return res.status(404).json({
        error: `${
          actionType === "decline" ? "Friend request" : "Friend"
        } not found.`,
      });
    }

    res.status(200).json({
      success: true,
      message: `${
        actionType === "decline"
          ? "Friend request declined"
          : "Unfriended successfully"
      }.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};
