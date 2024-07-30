import express from "express";
import { AuthMiddleware } from "../middlewares/auth.js";
import { PlannerController } from "../controllers/planner.js"

const router = express.Router();

router.post("/signup", PlannerController.signup)
router.post("/login", PlannerController.login)
router.post("/logout", PlannerController.logout)
router.get("/get-events",AuthMiddleware.plannerverify,PlannerController.getEvents)
router.post("/add-request/:eventId",AuthMiddleware.plannerverify,PlannerController.addRequest)

export default router;
