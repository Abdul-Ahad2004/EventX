import jwt from "jsonwebtoken";
import { Message } from "../models/message.js";

export async function getMessages(req, res) {
  try {
    const { sender, receiverId } = req.params;
    let token;
    if (sender === "User") {
      token = req.cookies?.id;
      if (!token) {
        return res.status(400).json({ message: "User not authenticated" });
      }
    } else if (sender === "Planner") {
      const token = req.cookies?.plannerId;

      if (!token) {
        return res.status(400).json({ message: "Planner not authenticated" });
      }
    } else {
      throw new Error("Sender is invalid");
    }

    jwt.verify(token, "secret", function (err) {
      if (err) {
        return res.status(403).json({ message: "Your Token is Invalid " });
      }
    });
    const senderId = token;
    const messages = await Message.find({
      $or: [
        { "sender.id": senderId, "receiver.id": receiverId },
        { "sender.id": receiverId, "receiver.id": senderId },
      ],
    }).sort({ timestamp: 1 });

    return res
      .status(201)
      .json({ message: "Messages fetch successfully", messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ message: " Errors in fetching messages" });
  }
}
