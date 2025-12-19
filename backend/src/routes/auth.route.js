import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import {
  createUserSchema,
  loginUserSchema,
} from "../validations/user.validation.js";
import { validator } from "./../middlewares/validator.js";

const router = express.Router();

router.post("/register", validator(createUserSchema), registerUser);
router.post("/login", validator(loginUserSchema), loginUser);

export default router;
