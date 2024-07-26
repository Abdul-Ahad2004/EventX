import express from "express";
import { UserController } from "../controllers/user.js";
import { AuthMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.get("/:id", AuthMiddleware.verify, UserController.getUser)


export default router;
