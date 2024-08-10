import express from "express";
import dotenv from "dotenv"
import userRouter from "./routes/user.js"
import cookieParser from "cookie-parser";
import connectDB from "./db/connect.js";
import plannerRouter from "./routes/planner.js"
import messageRouter from "./routes/message.js"
import taskRouter from "./routes/tasks.js"
import cors from "cors"

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000

connectDB()

app.use(express.json())
app.use(cors({
  origin:"http://localhost:5173",
  credentials: true
}));
app.use(cookieParser())
app.use("/user", userRouter);
app.use("/planner",plannerRouter)
app.use("/messages",messageRouter)
app.use("/tasks",taskRouter)



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
