import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";
import { catchAsync } from "../utils/CatchAsync.js";

export const getProfile = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  console.log("USER ID", userId);
  // validation db check

  const user = await User.findById(userId).select(
    "_id username email createdAt updatedAt"
  );
  if (!user) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized"));
  }

  return res
    .status(httpStatus.OK)
    .json({ success: true, message: "User fetched successfully", user });
});

export const updateUserRole = catchAsync(async (req, res, next) => {
  const adminId = req.user.id; // JWT’den gelen admin
  const { role } = req.body; // Atanacak rol
  const { id } = req.params; // Rolü değişecek user

  const validRoles = ["USER", "ADMIN"];

  // Input validation
  if (!role || !validRoles.includes(role)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, "Invalid role"));
  }
  const admin = await User.findById(adminId);
  if (!admin || admin.role !== "ADMIN") {
    return next(
      new ApiError(httpStatus.FORBIDDEN, "Only admin can update roles")
    );
  }

  // Kullanıcıyı bul
  const user = await User.findById(id);
  if (!user) {
    return next(new ApiError(httpStatus.NOT_FOUND, "User not found"));
  }

  user.role = role;
  await user.save();
  res.status(httpStatus.OK).json({
    success: true,
    message: "User role updated successfully",
    data: {
      userId: user._id,
      role: user.role,
    },
  });
});
