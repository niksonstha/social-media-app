// models/FriendRequest.js
import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "decline"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const FriendRequest = mongoose.model(
  "FriendRequest",
  friendRequestSchema
);
