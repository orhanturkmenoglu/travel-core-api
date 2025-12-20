import express from "express";
import authValidation from "../middlewares/auth.js";
import {
  createTravelStory,
  deleteTravelStory,
  archiveTravelStory,
  getUserTravelStoriesByStatus,
  getTravelStoriesBySearchTitle
} from "../controllers/travelStory.controller.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { createPostSchema } from "../validations/travelStory.validation.js";
import validator from "../middlewares/validator.js";

const router = express.Router();

// Create travel story
router.post(
  "/",
  authValidation,
  validator(createPostSchema),
  createTravelStory
);

// Search travel stories by title (public)
router.get("/search", getTravelStoriesBySearchTitle);

// Get user's travel stories by status
router.get("/", authValidation, getUserTravelStoriesByStatus);

// Archive travel story
router.patch(
  "/:travelId/archive",
  authValidation,
  archiveTravelStory
);

// Delete travel story (ADMIN only)
router.delete(
  "/:travelId",
  authValidation,
  authorizeRole("ADMIN"),
  deleteTravelStory
);

export default router;
