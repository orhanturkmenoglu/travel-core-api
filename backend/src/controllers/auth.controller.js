import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";

const generateHashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  console.log("📥 Register Request Body:", req.body);

  try {
    // VALIDATION
    if (!username || !email || !password) {
      return next(new ApiError(400, "Please provide all required fields"));
    }

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

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: newUser,
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
    // VALIDATION
    if (!email || !password) {
      return next(new ApiError(400, "Email and password are required"));
    }

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

    return res.status(200).json({
      success: true,
      message: "User login successfully",
      data: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    console.log("❌ loginUser Error:", err);
    next(err);
  }
};
