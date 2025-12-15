import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";

export const getProfile  = async (req, res, next) => {
  const userId = req.user.id;
  console.log("USER ID", userId);
  try {
    // validation db check

    const user = await User.findById(userId).select("_id username email createdAt updatedAt");
    if (!user) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized"));
    }

    return res
      .status(httpStatus.OK)
      .json({ success: true, message: "User fetched successfully", user });
  } catch (err) {
    next(
      new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "INTERNAL SERVER ERROR")
    );
  }
};
