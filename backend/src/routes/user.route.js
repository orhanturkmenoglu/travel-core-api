import express from "express";
import auth from "../middlewares/auth.js";
import authValidation from "../middlewares/auth.js";
import { getProfile  } from "../controllers/user.controller.js";
const router = express.Router();


router.get("/getUsers",authValidation,getProfile )


export default router;