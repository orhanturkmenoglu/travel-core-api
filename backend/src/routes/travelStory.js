import express from "express";
import authValidation from "../middlewares/auth.js";
import { createTravelStory } from "../controllers/travelStory.controller.js";

const router = express.Router();

router.post("/",authValidation,createTravelStory)

export default router;
