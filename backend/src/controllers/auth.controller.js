import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";
import { catchAsync } from "../utils/CatchAsync.js";

import {
  comparePassword,
  generateHashPassword,
  generateToken,
} from "../utils/auth.utils.js";

import {userService} from "../services/index.js";


export const registerUser = catchAsync(async (req, res) => {
  console.log("📥 Register Request Body:", req.body);

  const user = await userService.createUser(req.body);

  return res.success(httpStatus.CREATED).json({
    success: true,
    message: "User registered successfully",
    data: {
      username: user.username,
      email: user.email,
      role: user.role,
      _id: user._id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

export const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  console.log("📥 Login Request:", req.body);

  // FIND USER
  const user = await User.findOne({ email });
  console.log("🔍 User:", user ? "FOUND" : "NOT FOUND");

  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  const isPasswordMatch = await comparePassword(password, user.password);

  // PASSWORD typeChecker
  if (!isPasswordMatch) {
    return next(new ApiError(401, "Invalid credentials"));
  }

  console.log("✅ Login successful:", user._id);

  const token = generateToken(user);

  return res
    .status(httpStatus.OK)
    .cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS
      sameSite: "strict", // CSRF koruması
      maxAge: 8 * 60 * 60 * 1000, // 8 saat
    })
    .json({
      success: true,
      message: "User login successfully",
      data: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
      access_token: token,
    });
});

export const logoutUser = catchAsync(async (req, res, next) => {
  res
    .clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "dev", // HTTPS
      sameSite: "strict", // CSRF koruması
    })
    .status(httpStatus.OK)
    .json({
      success: true,
      message: "User logged out successfully",
    });
});
