import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";
import Jwt from "jsonwebtoken";
import cookie from "cookie";
const generateToken = (user) => {
  return Jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });
};
const generateHashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const registerUser = async (req, res, next) => {
  const { username, email, password } = req.body;

  console.log("📥 Register Request Body:", req.body);

  try {
    // CHECK EXISTING USER
    const existsUser = await User.findOne({ email });
    console.log("🔍 Existing User:", existsUser ? "FOUND" : "NOT FOUND");

    if (existsUser) {
      return next(new ApiError(409, "Email already exists"));
    }

    const hashedPassword = await generateHashPassword(password);

    // CREATE USER
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    console.log("✅ User Created:", newUser._id);

    return res.status(httpStatus.CREATED).json({
      success: true,
      message: "User registered successfully",
      data: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        _id: newUser._id,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
    });
  } catch (err) {
    console.log("❌ registerUser Error:", err);
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  console.log("📥 Login Request:", req.body);

  try {
  
    // FIND USER
    const user = await User.findOne({ email });
    console.log("🔍 User:", user ? "FOUND" : "NOT FOUND");

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

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
  } catch (err) {
    console.log("❌ loginUser Error:", err);
    next(err);
  }
};
