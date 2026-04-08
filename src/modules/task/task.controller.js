import * as services from "./task.services.js";
import apiResponse from "../../common/utils/api-response.js";

const addTask = async (req, res) => {
  const data = await services.addTask(req.user.id, req.body);
  apiResponse.created(res, "Task created successfully", data);
};

const editTask = async (req, res) => {
  const data = await services.editTask(req.params.id, req.body);
  apiResponse.ok(res, "Task updated successfully", data);
};

const deleteTask = async (req, res) => {
  await services.deleteTask(req.params.taskId);
  apiResponse.noContent(res);
};

const categoryTask = async (req, res) => {
  const data = await services.categoryTask(req?.user?.id, req.params.category);
  apiResponse.ok(res, "Tasks fetched successfully", data);
};

const runingTask = async (req, res) => {
  const data = await services.runingTask(req?.user?.id);
  apiResponse.ok(res, "Tasks fetched successfully", data);
};

const todayTask = async (req, res) => {
  const data = await services.todayTask(req?.user?.id);
  apiResponse.ok(res, "Tasks fetched successfully", data);
};

const doneOngoing = async (req, res) => {
  await services.doneOngoing(req.params.taskId);
  apiResponse.noContent(res);
};

const doneTask = async (req, res) => {
  await services.doneTask(req.params.taskId);
  apiResponse.noContent(res);
};

export {
  addTask,
  editTask,
  deleteTask,
  categoryTask,
  runingTask,
  todayTask,
  doneOngoing,
  doneTask,
};
