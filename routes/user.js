import express from "express";
import { AuthMiddleware } from "../middlewares/auth.js";
import { UserController } from "../controllers/user.js"

const router = express.Router();

router.post("/signup", UserController.signup)
router.post("/login", UserController.login)
router.post("/logout", UserController.logout)
router.post("/post-event",AuthMiddleware.userverify,UserController.postevent)
router.post("/post-review/:plannerId",AuthMiddleware.userverify,UserController.postReview)
router.get("/get-planners/:eventId",AuthMiddleware.userverify,UserController.getPlanners)
router.post("/send-message",AuthMiddleware.userverify,UserController.sendMessage)
router.get("/get-events",AuthMiddleware.userverify,UserController.getEvents)
router.get("/numberOfApplicants/:eventId",AuthMiddleware.userverify,UserController.getnumberOfApplicants)
router.post("/set-planner/:eventId/:plannerId",AuthMiddleware.userverify,UserController.setPlanner)
router.get("/get-id",AuthMiddleware.userverify,UserController.getId)

export default router;
