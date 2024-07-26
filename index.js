import express from "express";
import dotenv from "dotenv"
import authRouter from "./routes/auth.js"
import userRouter from "./routes/user.js"
import cookieParser from "cookie-parser";
import connectDB from "./db/connect.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000

connectDB()
app.use(express.json())
app.use(cookieParser())
app.use("/auth/user", authRouter);
app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
