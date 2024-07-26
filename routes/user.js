import express from "express";
import { AuthMiddleware } from "../middlewares/auth.js";
import { UserController } from "../controllers/user.js"

const router = express.Router();

router.post("/signup", UserController.signup)
router.post("/login", UserController.login)

export default router;
