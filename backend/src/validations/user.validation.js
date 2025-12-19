import Joi from "joi";
import { passwordRegex, passwordMessage } from "../utils/passwordValidator.js";

export const createUserSchema = Joi.object({
  username: Joi.string().min(2).required().messages({
    "string.empty": "Username is required",
    "string.min": "Username must be at least 2 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
  }),
  password: Joi.string().pattern(passwordRegex()).required().messages({
    "string.empty": "Password is required",
    "string.pattern.base": passwordMessage(),
  }),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
  }),
  password: Joi.string().pattern(passwordRegex()).required().messages({
    "string.empty": "Password is required",
    "string.pattern.base": passwordMessage(),
  }),
});
