import express from "express";
import dotenv from "dotenv"

dotenv.config();
const app = express();

/*
  Falsy Values in JS
  -> false
  -> 0
  -> ""
  -> null
  -> undefined
  -> NaN
*/

/*
REST APIs
  -> GET (Retrieve the data from the server)
  -> POST (Creates a new data in the server/db)
  -> DELETE (Delete the data in the server)
  -> PUT (Update the data in the server)
  -> PATCH (Update the data in the server)
*/
const PORT = process.env.PORT || 3000

import authRouter from "./routes/auth.js"
import userRouter from "./routes/user.js"
import cookieParser from "cookie-parser";

app.use(express.json())
app.use(cookieParser())
app.use("/auth/user", authRouter);
app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
