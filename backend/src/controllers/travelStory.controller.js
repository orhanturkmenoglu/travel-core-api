import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";
import TravelStory from "./../models/travelStory.model.js";

export const createTravelStory = async (req, res, next) => {
  const userId = req.user.id;
  const { title, story, location, travelDate, ImageUrl, tags } = req.body;

  try {
    // 🔹 Validation
    if (!title || !story || !location || !travelDate || !ImageUrl || !tags) {
      return next(
        new ApiError(httpStatus.BAD_REQUEST, "All fields are required")
      );
    }

    // 🔹 User check
    const existsUser = await User.findById(userId);
    if (!existsUser) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized"));
    }

    // 🔹 travelDate parse
    // Kabul edilen format: YYYY-MM-DD (ÖNERİLEN)
    const parsedTravelDate = new Date(travelDate);

    if (isNaN(parsedTravelDate.getTime())) {
      return next(
        new ApiError(httpStatus.BAD_REQUEST, "Invalid travelDate format")
      );
    }

    const travelStory = await TravelStory.create({
      title,
      story,
      location,
      travelDate: parsedTravelDate,
      ImageUrl,
      tags,
      author: userId,
    });

    return res.status(httpStatus.CREATED).json({
      success: true,
      message: "Travel story created successfully",
      travelStory,
    });
  } catch (err) {
    next(err);
  }
};
