import mongoose from "mongoose";
import { category, status } from "../../constant.js";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 10,
      maxLength: 100,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      index: true,
      unique: true,
    },
    description: {
      type: String,
      minLength: 10,
      maxLength: 500,
    },
    category: {
      type: String,
      enum: category,
      default: category[0],
    },
    status: {
      type: String,
      enum: status,
      default: status[0],
    },
    dueDate: {
      type: Date,
      default: Date.now,
    },
    creater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

// aggregate paginate setup

export const Task = mongoose.model("Task", taskSchema);
