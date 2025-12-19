import express from "express";
import authValidation from "../middlewares/auth.js";
import {
  createTravelStory,
  deleteTravelStory,
  archiveTravelStory,
  getUserTravelStoriesByStatus,
} from "../controllers/travelStory.controller.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { createPostSchema } from "../validations/travelStory.validation.js";
import  validator  from './../middlewares/validator.js';

const router = express.Router();

router.post("/",validator(createPostSchema),authValidation, createTravelStory);

router.get("/",authValidation,getUserTravelStoriesByStatus);

router.patch("/:travelId/archive", authValidation, archiveTravelStory);

// delete travelStorie

router.delete("/delete/:travelId",authorizeRole("ADMIN"), authValidation, deleteTravelStory);
// update TravelStory

// search travelStory query

// favorite travelStorie

export default router;
