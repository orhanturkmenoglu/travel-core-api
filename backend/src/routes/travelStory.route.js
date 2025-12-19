import express from "express";
import authValidation from "../middlewares/auth.js";
import {
  createTravelStory,
  getAllTravelStories,
  deleteTravelStory,
  archiveTravelStory,
} from "../controllers/travelStory.controller.js";

const router = express.Router();

router.post("/", authValidation, createTravelStory);
router.get("/", authValidation, getAllTravelStories);

router.patch("/:travelId/archive", authValidation, archiveTravelStory);

// delete travelStorie

router.delete("/delete/:travelId", authValidation, deleteTravelStory);
// update TravelStory

// search travelStory query

// favorite travelStorie

export default router;
