import { Router } from "express";
import * as controller from "./auth.controller.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import { registerDto } from "./dto/register.dto.js";
import { loginDto } from "./dto/login.dto.js";
import { authenticate } from "./auth.middleware.js";
import { newPasswordDto } from "./dto/newPassword.dto.js";
import { forgotPasswordDto } from "./dto/forgetPass.dto.js";
import { upload } from "../../common/middleware/multer.middleware.js";

const userRouter = Router();

// register
userRouter
  .route("/register")
  .post(upload.single("avatar"), validate(registerDto), controller.register);

// verify Email
userRouter
  .route("/verify-email")
  .post(controller.verifyEmail);

// login
userRouter
  .route("/login")
  .post(upload.none(), validate(loginDto), controller.login);

// logout
userRouter.route("/logout").delete(authenticate, controller.logout);

// refresh Token
userRouter.route("/refresh").patch(controller.refresh);

// forget Password
userRouter
  .route("/forgot-Password")
  .post(upload.none(), validate(forgotPasswordDto), controller.forgetPassword);

// new Password
userRouter
  .route("/new-password")
  .post(upload.none(), validate(newPasswordDto), controller.newPassword);

// get me
userRouter.route("/get-me").get(authenticate, controller.getMe);

// health check
userRouter.route("/health").get(controller.healthCheck);

export default userRouter;
