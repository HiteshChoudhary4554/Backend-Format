import { Router } from "express";
import multer from "multer";
import * as controller from "./task.controller.js";
import { authenticate } from "../../common/middleware/auth.middleware.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import { addTaskDto } from "./dto/addTask.dto.js";
import { editTaskDto } from "./dto/editTask.dto.js";

const taskRouter = Router();
const upload = multer();

taskRouter.use(authenticate);

taskRouter.post(
  "/add-task",
  upload.none(),
  validate(addTaskDto),
  controller.addTask,
);
taskRouter.put(
  "/edit-task/:id",
  upload.none(),
  validate(editTaskDto),
  controller.editTask,
);
taskRouter.patch("/done/:taskId", controller.doneTask);
taskRouter.patch("/done-ongoing/:taskId", controller.doneOngoing);
taskRouter.delete("/delete-task/:taskId", controller.deleteTask);
taskRouter.get("/category/:category", controller.categoryTask);
taskRouter.get("/running", controller.runingTask);
taskRouter.get("/today", controller.todayTask);

export default taskRouter;
