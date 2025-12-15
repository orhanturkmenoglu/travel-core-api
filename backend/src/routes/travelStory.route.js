import express from "express";
import authValidation from "../middlewares/auth.js";
import {
  createTravelStory,
  getAllTravelStories,
  deleteTravelStory,
} from "../controllers/travelStory.controller.js";

const router = express.Router();

router.post("/", authValidation, createTravelStory);
router.get("/", authValidation, getAllTravelStories);

// delete travelStorie

router.delete("/delete/:travelId", authValidation, deleteTravelStory);
// update TravelStory

// search travelStory query

// favorite travelStorie

export default router;
