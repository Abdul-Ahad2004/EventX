import express from "express";
import { getMessages,getChatUsers } from "../controllers/message.js";
const router = express.Router();

router.get("/get-messages/:senderId/:receiverId", getMessages)
router.get("/get-chat-users/:senderId", getChatUsers);

export default router;