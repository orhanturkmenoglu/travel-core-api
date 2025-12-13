import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

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
      console.log("⚠️ Missing fields");
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // CHECK EXISTING USER
    const existsUser = await User.findOne({ email });
    console.log("🔍 Existing User:", existsUser ? "FOUND" : "NOT FOUND");

    if (existsUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
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

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log("📥 Login Request:", req.body);

  try {
    // VALIDATION
    if (!email || !password) {
      console.log("⚠️ Missing fields");
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // FIND USER
    const user = await User.findOne({ email });
    console.log("🔍 User:", user ? "FOUND" : "NOT FOUND");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    // PASSWORD typeChecker
    if (!isPasswordMatch) {
      console.log("❌ Wrong password");
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
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
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
