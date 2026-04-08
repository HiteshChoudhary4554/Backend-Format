import apiError from "../../common/utils/api-error.js";
import { category } from "../../constant.js";
import { Task } from "./task.model.js";

const addTask = async (
  userId,
  { title, slug, description, category, status, dueDate = undefined },
) => {
  if (!userId || !title || !slug || !description || !category || !status) {
    throw apiError.badRequest("All fields are required");
  }

  const task = await Task.create({
    title,
    slug,
    description,
    category,
    status,
    dueDate: dueDate ? new Date(dueDate) : undefined,
    creater: userId,
  });

  if (!task) {
    throw apiError.serverError("Something went wrong while creating task.");
  }

  return task;
};

const editTask = async (
  taskId,
  { title, slug, description, category, status, dueDate },
) => {
  if (
    !taskId ||
    !title ||
    !slug ||
    !description ||
    !category ||
    !status ||
    !dueDate
  ) {
    throw apiError.badRequest("All fields are required");
  }

  const task = await Task.findById(taskId);

  if (!task) {
    throw apiError.notFound("Task not found");
  }

  task.title = title;
  task.slug = slug;
  task.description = description;
  task.category = category;
  task.status = status;
  task.dueDate = dueDate;

  await task.save();

  return task;
};

const categoryTask = async (userId, category) => {
  if (!category || !category.includes(category) || !userId) {
    throw apiError.badRequest("Invalid category");
  }

  // paginate setup

  const tasks = await Task.find({
    creater: userId,
    category,
    status: { $ne: "completed" },
  }).sort({
    createdAt: -1,
  });

  return tasks;
};

const runingTask = async (userId) => {
  if (!userId) {
    throw apiError.badRequest("Invalid userId");
  }
  const tasks = await Task.find({
    creater: userId,
    status: "ongoing",
  }).sort({
    createdAt: -1,
  });
  return tasks;
};

const todayTask = async (userId) => {
  if (!userId) {
    throw apiError.badRequest("Invalid userId");
  }
  const today = new Date();

  const start = new Date(today.setHours(0, 0, 0, 0));
  const end = new Date(today.setHours(23, 59, 59, 999));

  const tasks = await Task.find({
    creater: userId,
    dueDate: {
      $gte: start,
      $lte: end,
    },
    status: { $ne: "completed" },
  });

  return tasks;
};

const deleteTask = async (taskId) => {
  if (!taskId) {
    throw apiError.badRequest("Task ID is required");
  }
  return await Task.findByIdAndDelete(taskId);
};

const doneOngoing = async (taskId) => {
  if (!taskId) {
    throw apiError.badRequest("Task ID is required");
  }
  return await Task.findByIdAndUpdate(taskId, { status : "ongoing" });
}

const doneTask = async (taskId) => {
  if (!taskId) {
    throw apiError.badRequest("Task ID is required");
  }
  return await Task.findByIdAndUpdate(taskId, { status : "completed" });
}

export { addTask, editTask, categoryTask, runingTask, todayTask, deleteTask, doneOngoing, doneTask };
