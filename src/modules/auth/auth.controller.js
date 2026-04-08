import * as service from "./auth.service.js";
import apiResponse from "../../common/utils/api-response.js";

const register = async (req, res) => {
  const data = await service.register(req,req.body);
  apiResponse.ok(res, "User register successfully", data); 
};

const login = async (req, res) => {
  const data = await service.login(req.body);
  apiResponse.ok(res, "User login successfully", data);
};

const refresh = async (req, res) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  const data = await service.refresh(token);
  apiResponse.ok(res, "Token refesh successfully", data);
};

const logout = async (req, res) => {
  await service.logout(req.user.id);
  apiResponse.noContent(res);
};

const verifyEmail = async (req, res) => {
  let verificationToken;
  if (req.headers.authorization?.startsWith("Bearer")) {
    verificationToken = req.headers.authorization.split(" ")[1];
  }
  const data = await service.verifyEmail(verificationToken);
  apiResponse.ok(res, "verified successfully", data);
};

const forgetPassword = async (req, res) => {
  const data = await service.forgotPassword(req.body.email);
  apiResponse.ok(res, "password forget successfully", data);
};

const getMe = async (req, res) => {
  const data = await service.getMe(req.user.id);
  apiResponse.ok(res, "get user data successfully", data);
};

const newPassword = async (req, res) => {
  const data = await service.newPassword(req.body);
  apiResponse.ok(res, "password Updated successfully", data);
};

const healthCheck = async (req, res) => {
  console.log("req ==>>> request aayi babu");
  
  const data = await service.healthCheck();
  apiResponse.ok(res, "Auth service is healthy", data);
};

export {
  register,
  login,
  refresh,
  logout,
  verifyEmail,
  forgetPassword,
  getMe,
  newPassword,
  healthCheck,
};
