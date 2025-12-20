import ApiError from "../utils/ApiError.js";
import httpStatus, { status } from "http-status";
import TravelStory from "./../models/travelStory.model.js";
import { uploadTravelStoryImage } from "../utils/cloudinary.js";

export const createTravelStory = async (req, res, next) => {
  const userId = req.user.id;
  const { title, story, location, travelDate, imageUrl, tags, rating } =
    req.body;

  try {
    // 🔹 travelDate parse
    // Kabul edilen format: YYYY-MM-DD (ÖNERİLEN)
    const parsedTravelDate = new Date(travelDate);

    if (isNaN(parsedTravelDate.getTime())) {
      return next(
        new ApiError(httpStatus.BAD_REQUEST, "Invalid travelDate format")
      );
    }

    // İMAGE UPLOAD CLOUDINARY
    const uploadImage = await uploadTravelStoryImage(imageUrl);
    console.log("Upload Respone : ", uploadImage);

    const travelStory = await TravelStory.create({
      title,
      story,
      location,
      travelDate: parsedTravelDate,
      imageUrl: uploadImage,
      tags,
      author: userId,
      rating,
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

export const getTravelStories = async (req, res, next) => {
  const userId = req.user.id;
  const { status, minRating, maxRating, page=1,limit=10 } = req.query;
  try {
    const query = { 
      author: userId,
      status:status ? status.toUpperCase() : "PUBLISHED",
     };

     
    // RATING FILTER
    if (minRating || maxRating) {
      if (!minRating || !maxRating) {
        return next(
          new ApiError(
            httpStatus.BAD_REQUEST,
            "minRating and maxRating are required"
          )
        );
      }

      const min = Number(minRating);
      const max = Number(maxRating);
      
      if (Number.isNaN(min) || Number.isNaN(max)) {
        return next(
          new ApiError(
            httpStatus.BAD_REQUEST,
            "minRating and maxRating must be valid numbers"
          )
        );
      }
      query.rating = { $gte: min, $lte: max };
    }

    // PAGINATION 

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 50);
    const skip = (pageNumber - 1) * limitNumber;

    const [travelStories,totalCount] = await Promise.all([
      TravelStory.find(query)
      .sort({createdAt:-1})
      .skip(skip)
      .limit(limitNumber)
      .lean(),
      TravelStory.countDocuments(query)
    ]);

    return res.status(httpStatus.OK).json({
      success: true,
      message: `Travel stories retrieved successfully${
        status ? ` with status ${status}` : ""
      }`,
      pagination:{
        page:pageNumber,
        limit:limitNumber,
        totalPages: Math.ceil(totalCount/limitNumber),
        totalCount
      },
      data: travelStories,
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

backendden üç yerdne veri gelir body,params,query,
params /travel/:travelId 
query /travel?status=published&minRating=3&maxRating=5&pagination=10
body ise post,put patch isteklerinde gelir

altın kurall : params : iidentitly kimlik işlemlerinde kullanılır
query: filtreleme sıralama pagination sort gibi işlemlerde kullanılır
body : veri oluşturma güncelleme işlemlerinde kullanılır

// query akış şaması 
client - query params - controller - filter object - mongoose query , pagination - sort -response 

