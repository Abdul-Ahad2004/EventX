import { Message } from "../models/message.js";
import { User } from "../models/user.js";
import { Planner } from "../models/planner.js";
import mongoose from "mongoose";

export const getMessages = async (req, res) => {
  const { senderId, receiverId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { "sender.id": senderId, "receiver.id": receiverId },
        { "sender.id": receiverId, "receiver.id": senderId }
      ]
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const sendMessage = async (req, res) => {
  const { senderId, senderModel, receiverId, receiverModel, content } = req.body;

  try {
    const message = new Message({
      sender: { id: senderId, model: senderModel },
      receiver: { id: receiverId, model: receiverModel },
      content
    });

    await message.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};


export const getChatUsers = async (req, res) => {
  const { senderId } = req.params;

  try {
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { "sender.id": new mongoose.Types.ObjectId(senderId) },
            { "receiver.id": new mongoose.Types.ObjectId(senderId) },
          ],
        },
      },
      {
        $addFields: {
          otherUserId: {
            $cond: [
              { $eq: ["$sender.id",new mongoose.Types.ObjectId(senderId)] },
              "$receiver.id",
              "$sender.id"
            ],
          },
          otherUserModel: {
            $cond: [
              { $eq: ["$sender.id",new mongoose.Types.ObjectId(senderId)] },
              "$receiver.model",
              "$sender.model"
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            userId: "$otherUserId",
            model: "$otherUserModel",
          },
        },
      },
    ]);

    const userIds = messages
      .filter((msg) => msg._id.model === "User")
      .map((msg) => msg._id.userId);
    const plannerIds = messages
      .filter((msg) => msg._id.model === "Planner")
      .map((msg) => msg._id.userId);

    const users = await User.find({
      _id: { $in: userIds },
    }).select("_id username");

    const planners = await Planner.find({
      _id: { $in: plannerIds },
    }).select("_id username");

    const chatUsers = [
      ...users.map((user) => ({
        id: user._id,
        username: user.username,
        model: "User",
      })),
      ...planners.map((planner) => ({
        id: planner._id,
        username: planner.username,
        model: "Planner",
      })),
    ];
    res.status(200).json(chatUsers);
  } catch (error) {
    console.error("Error fetching chat users:", error); 
    res.status(500).json({ message: "Error fetching chat users", error });
  }
};



