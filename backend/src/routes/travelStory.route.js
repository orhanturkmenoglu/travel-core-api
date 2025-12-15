import express from "express";
import authValidation from "../middlewares/auth.js";
import {
  createTravelStory,
  getAllTravelStories,
} from "../controllers/travelStory.controller.js";

const router = express.Router();

router.post("/", authValidation, createTravelStory);
router.get("/", authValidation, getAllTravelStories);

export default router;
