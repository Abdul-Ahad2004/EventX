import express from "express";
import { AuthMiddleware } from "../middlewares/auth.js";
import { PlannerController } from "../controllers/planner.js"

const router = express.Router();

router.post("/signup", PlannerController.signup)
router.post("/login", PlannerController.login)
router.post("/logout", PlannerController.logout)

export default router;
