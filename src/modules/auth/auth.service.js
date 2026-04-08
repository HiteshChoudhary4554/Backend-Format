import apiError from "../../common/utils/api-error.js";
import { User } from "./auth.model.js";
import * as token from "../../common/utils/jwt.utils.js";
import { sendMail } from "../../common/config/email.js";
import { uploadOnCloudinary } from "../../common/utils/upload.cloudinary.js";

const register = async (req, { name, email, password }) => {
  if (!(name || email || password || avatar)) {
    throw apiError.badRequest("Provide all fields..");
  }

  const avatarLocalPath = req?.file?.path;

  if (!avatarLocalPath) {
    throw apiError.badRequest("Avatar is required field. JMN");
  }

  const avatarRes = await uploadOnCloudinary(avatarLocalPath);

  const isExistUser = await User.findOne({ email });

  if (isExistUser) {
    throw apiError.conflict("Email already exists");
  }

  const { rawToken, hashedToken } = token.generateVerificationToken();

  let user = await User.create({
    name,
    email,
    password,
    avatar: avatarRes.url,
    publicId: avatarRes.publicId,
    verificationToken: hashedToken,
  });

  if (!user) {
    throw apiError.serverError("Something went wrong while creating user.");
  }

  // send an email to user to user with token: rawToken
  try {
    const userEmail = "hk5194557@gmail.com";
    const msg = "verify email";
    const html = `
      <h1 style="color:blue;">Welcome 🎉</h1>
      <p>Thank you for register verify Email Token :- <br> [ ${rawToken} ]</p>
     `;
    sendMail(userEmail, msg, html);
  } catch (error) {
    throw apiError.forbidden(
      "something went wrong while sending email.",
      error,
    );
  }

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.verificationToken;
  return userObj;
};

const verifyEmail = async (verificationToken) => {
  if (!verificationToken) {
    throw apiError.unauthorized("verificationToken is missing");
  }
  const hashedToken = token.hashToken(verificationToken);
  const user = await User.findOne({ verificationToken: hashedToken }).select(
    "+verificationToken",
  );

  if (!user) {
    throw apiError.unauthorized("Invalid verification token");
  }

  user.isVerified = true;
  user.verificationToken = null;
  await user.save({ validateBeforeSave: false });

  const userObj = user.toObject();
  delete userObj.verificationToken;

  return userObj;
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    throw apiError.badRequest("Provide both field Email and Password.");
  }

  const existedUser = await User.findOne({ email }).select(
    "+password +refreshToken",
  );

  if (!existedUser) {
    throw apiError.unauthorized("Invalid Email or password");
  }

  const isPassword = await existedUser.comparePassword(password);

  if (!isPassword) {
    throw apiError.unauthorized("Invalid Email or password");
  }

  if (!existedUser.isVerified) {
    throw apiError.forbidden("Please verify your email before loggin");
  }

  const accessToken = await token.generateAccessToken({
    id: existedUser._id,
    email: existedUser.email,
  });

  const refreshToken = await token.generateRefreshToken({
    id: existedUser._id,
  });

  existedUser.refreshToken = await token.hashToken(refreshToken);

  await existedUser.save({ validateBeforeSave: false });

  const userObj = existedUser.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return {
    accessToken,
    refreshToken,
    user: userObj,
  };
};

const refresh = async (refershtoken) => {
  if (!refershtoken) {
    throw apiError.unauthorized("Refersh Token missing");
  }

  const decoded = await token.verifyRefreshToken(refershtoken);

  const user = await User.findById(decoded.id).select("+refreshToken");

  if (!user) {
    throw apiError.unauthorized("User no longer exists");
  }

  if (user.refreshToken !== token.hashToken(refershtoken)) {
    throw apiError.unauthorized("invalid refresh Token");
  }

  const accessToken = await token.generateAccessToken({
    id: user._id,
    email: user.email,
  });

  const refreshToken = await token.generateRefreshToken({
    id: user._id,
  });

  user.refreshToken = await token.hashToken(refreshToken);

  await user.save({ validateBeforeSave: false });

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return {
    accessToken,
    refreshToken,
    user: userObj,
  };
};

const logout = async (userId) => {
  if (!userId) {
    throw apiError.unauthorized("userId is required.");
  }
  return await User.findByIdAndUpdate(userId, {
    refreshToken: null,
  });
};

const forgotPassword = async (email) => {
  if (!email) {
    throw apiError.unauthorized("email is required field");
  }

  const user = await User.findOne({ email }).select(
    "+resetPasswordToken +resetPasswordExpires",
  );
  if (!user) {
    throw apiError.notFound("does not exists this email in DB.");
  }

  const { rawToken, hashedToken } = await token.generateVerificationToken();

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  // send rawToken thow email for forgot password.
  try {
    const userEmail = "hk5194557@gmail.com";
    const msg = "forgot user password";
    const html = `
      <h1 style="color:blue;">Welcome 🎉</h1>
      <p>forgot password verify Token - ${rawToken}</p>
     `;
    sendMail(userEmail, msg, html);
  } catch (error) {
    throw apiError.forbidden(
      "something went wrong while sending email.",
      error,
    );
  }
  
  const userObj = user.toObject();
  delete userObj.resetPasswordToken;
  delete userObj.resetPasswordExpires;

  return userObj;
};

const getMe = async (userId) => {
  if (!userId) {
    throw apiError.badRequest("userId is required");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw apiError.unauthorized("user is does not exists.");
  }

  const userObj = user.toObject();
  delete userObj.password;

  return user;
};

const newPassword = async ({ resetToken, newPassword }) => {
  if (!resetToken || !newPassword) {
    throw apiError.badRequest("resetToken and newPassword is missing.");
  }

  const user = await User.findOne({
    resetPasswordToken: token.hashToken(resetToken),
    resetPasswordExpires: { $gt: Date.now() },
  }).select("+resetPasswordToken +resetPasswordExpires +password");

  if (!user) {
    throw apiError.unauthorized("reset token is invalid.");
  }

  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  const userObj = user.toObject();
  delete userObj.resetPasswordToken;
  delete userObj.resetPasswordExpires;
  delete userObj.password;

  return userObj;
};

const healthCheck = async () => {
  return { success: true };
};

export {
  register,
  login,
  refresh,
  logout,
  verifyEmail,
  forgotPassword,
  getMe,
  newPassword,
  healthCheck,
};
