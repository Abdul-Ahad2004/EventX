import express from "express";
import { TaskController } from "../controllers/tasks.js";

const router = express.Router();


router.post("/add-tasks/:eventId",TaskController.saveTasks)
router.delete("/delete-tasks/:eventId",TaskController.deleteTasks)
router.get("/get-tasks/:eventId",TaskController.getTasks)
router.put("/update-tasks/:eventId",TaskController.updateTasks)

export default router;