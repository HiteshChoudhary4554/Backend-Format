import crypto, { createSecretKey } from "crypto";
import jwt from "jsonwebtoken";

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex")
}

const generateVerificationToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  return { rawToken, hashedToken };
};

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESSTOKEN_SECRET, {
    expiresIn: process.env.JWT_ACCESSTOKEN_EXPIRES || "15m",
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESHTOKEN_SECRET, {
    expiresIn: process.env.JWT_REFRESHTOKEN_EXPIRES || "1d",
  });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESSTOKEN_SECRET);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESHTOKEN_SECRET);
};

export {
  hashToken,
  generateVerificationToken,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
