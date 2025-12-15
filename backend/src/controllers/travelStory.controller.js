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

export const getAllTravelStories = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const travelStories = await TravelStory.find({
      author: userId,
      status: "PUBLISHED",
    }).sort({
      isFavorite: -1,
      createdAt: -1,
    });

    return res.status(httpStatus.OK).json({
      success: true,
      message: "Travel stories fetched successfully",
      travelStories,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTravelStory = async (req, res, next) => {
  const userId = req.user.id;
  const { travelId } = req.params;
  try {
    if (!travelId) {
      return next(
        new ApiError(httpStatus.BAD_REQUEST, "Travel id is required")
      );
    }

    const existTravelStory = await TravelStory.findOne({
      _id: travelId,
      author: userId,
    });

    if (!existTravelStory) {
      return next(new ApiError(httpStatus.NOT_FOUND, "Travel story not found"));
    }

    await existTravelStory.deleteOne();

    return res.status(httpStatus.OK).json({
      success: true,
      message: "Travel story deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
