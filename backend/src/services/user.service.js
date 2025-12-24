import User from "../models/user.model.js";
import { generateHashPassword } from "../utils/auth.utils.js";

const createUser = async (userBody) => {
  // CHECK EXISTING USER
  const existsUser = await User.findOne({ email: userBody.email });
  console.log("🔍 Existing User:", existsUser ? "FOUND" : "NOT FOUND");

  if (existsUser) {
    return next(new ApiError(409, "Email already exists"));
  }

  const hashedPassword = await generateHashPassword(userBody.password);

  // CREATE USER
  const newUser = await User.create({
    username: userBody.username,
    email: userBody.email,
    password: hashedPassword,
  });

  return newUser;
};

export default {
  createUser,
};
