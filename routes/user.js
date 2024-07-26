import express from "express";
import { AuthMiddleware } from "../middlewares/auth.js";
import { AuthController } from "../controllers/user.js"

const router = express.Router();

router.post("/signup", AuthController.signup)
router.post("/login", AuthController.login)

export default router;
