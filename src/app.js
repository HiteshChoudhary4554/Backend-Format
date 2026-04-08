import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", process.env.FRONTEND_URL],
    credentials: true,
  }),
);

app.set("trust proxy", 1);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));

// import all routes
import userRouter from "./modules/auth/auth.routes.js";
import taskRouter from "./modules/task/task.routes.js";

app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);

export default app;
