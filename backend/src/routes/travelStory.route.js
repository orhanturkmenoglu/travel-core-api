import express from "express";
import authValidation from "../middlewares/auth.js";
import {
  createTravelStory,
  deleteTravelStory,
  archiveTravelStory,
  getTravelStoriesBySearchTitle,
  getTravelStories,
  getUserFavoriteTravelStories,
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

router.get("/favorites", authValidation, getUserFavoriteTravelStories);

// Get user's travel stories by status
router.get("/", authValidation, getTravelStories);

// Archive travel story
router.patch("/:travelId/archive", authValidation, archiveTravelStory);

// Delete travel story (ADMIN only)
router.delete(
  "/:travelId",
  authValidation,
  authorizeRole("ADMIN"),
  deleteTravelStory
);

export default router;
