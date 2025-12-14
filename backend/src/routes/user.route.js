import express from "express";
import auth from "../middlewares/auth.js";
import authValidation from "../middlewares/auth.js";
const router = express.Router();



router.get("/list",authValidation,getAllTravels)


export default router;