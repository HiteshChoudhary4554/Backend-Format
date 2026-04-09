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

app.use("/api/user", userRouter);

export default app;
