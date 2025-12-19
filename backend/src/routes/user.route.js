import express from "express";
import auth from "../middlewares/auth.js";
import authValidation from "../middlewares/auth.js";
import { getProfile, updateUserRole } from "../controllers/user.controller.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
const router = express.Router();

router.get("/getUsers", authValidation, getProfile);

router.patch(
  "/:id/role",
  authValidation,
  authorizeRole("ADMIN"),
  updateUserRole
);

export default router;
