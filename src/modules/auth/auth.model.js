import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 50,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      trim: true,
      index: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      // by default hide
    },
    avatar: {
      type: String,
      required: [true, "Avatar is required"],
    },
    publicId: {
      type: String,
      required: [true, "Public id is required"],
    },
    isVerified: {
      type: Boolean,
      reuired: true,
    },
    verificationToken: {
      type: String,
      select: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: String,
      select: false,
    },
  },
  { timestamps: true },
);

// Hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (clearTextPassword) {
  return await bcrypt.compare(clearTextPassword, this.password);
};



export const User = mongoose.model("User", userSchema);
