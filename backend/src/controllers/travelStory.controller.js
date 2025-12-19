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

export const getUserTravelStoriesByStatus = async (req, res, next) => {
  const userId = req.user.id;
  const { status } = req.query;

  try {
    const query = { author: userId };

    // Eğer status verilmemişse default PUBLISHED

    query.status = status ? status.toUpperCase() : "PUBLISHED";

    const travelStories = await TravelStory.find(query).sort({ createdAt: -1 });
    return res.status(httpStatus.OK).json({
      success: true,
      message: `Travel stories retrieved successfully${
        status ? ` with status ${status}` : ""
      }`,
      travelStories,
    });
  } catch (err) {
    next(err);
  }
};

export const archiveTravelStory = async (req, res, next) => {
  const userId = req.user.id;
  const { travelId } = req.params;
  try {
    if (!travelId) {
      return next(
        new ApiError(httpStatus.BAD_REQUEST, "Travel id is required")
      );
    }

    const travelStory = await TravelStory.findOne({
      author: userId,
      _id: travelId,
    });

    if (!travelStory) {
      return next(new ApiError(httpStatus.NOT_FOUND, "TRAVEL STORY NOT FOUND"));
    }

    if (travelStory.status === "ARCHIVED") {
      return next(
        new ApiError(httpStatus.CONFLICT, "Travel story is already archived")
      );
    }

    travelStory.status = "ARCHIVED";
    await travelStory.save();

    return res.status(httpStatus.OK).json({
      success: true,
      message: "Travel story archived successfully",
      data: {
        id: travelStory._id,
        status: travelStory.status,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTravelStory = async (req, res, next) => {
  const userId = req.user.id;
  const { travelId } = req.params;

  console.log("DELETE_TRAVEL_STORY_REQ", {
    userId,
    travelId,
  });

  try {
    if (!travelId) {
      console.error("TRAVEL_ID_MISSING");
      return next(
        new ApiError(httpStatus.BAD_REQUEST, "Travel id is required")
      );
    }

    const existTravelStory = await TravelStory.findOne({
      _id: travelId,
      author: userId,
    });

    console.log("FOUND_TRAVEL_STORY", existTravelStory?._id);

    if (!existTravelStory) {
      console.warn("TRAVEL_STORY_NOT_FOUND", { travelId, userId });
      return next(new ApiError(httpStatus.NOT_FOUND, "Travel story not found"));
    }

    await existTravelStory.deleteOne();

    console.log("TRAVEL_STORY_DELETED", { travelId });

    return res.status(httpStatus.NO_CONTENT).json({
      success: true,
      message: "Travel story deleted successfully",
    });
  } catch (err) {
    console.error("DELETE_TRAVEL_STORY_ERROR", err);
    next(err);
  }
};
