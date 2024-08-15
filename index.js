import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/user.js";
import cookieParser from "cookie-parser";
import connectDB from "./db/connect.js";
import plannerRouter from "./routes/planner.js";
import messageRouter from "./routes/message.js";
import taskRouter from "./routes/tasks.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { Message } from "./models/message.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());
app.use("/user", userRouter);
app.use("/planner", plannerRouter);
app.use("/messages", messageRouter);
app.use("/tasks", taskRouter);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("sendMessage", async (data) => {
    const { senderId, senderModel, receiverId, receiverModel, content } = data;

    try {
      const message = new Message({
        sender: { id: senderId, model: senderModel },
        receiver: { id: receiverId, model: receiverModel },
        content,
      });

      await message.save();
      io.emit("receiveMessage", message);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
