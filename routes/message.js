import express from "express";
import { getMessages } from "../controllers/message.js";
const router = express.Router();

router.get("/:sender/:receiverId", getMessages)

export default router;