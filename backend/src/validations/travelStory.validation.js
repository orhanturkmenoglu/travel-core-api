import Joi from "joi";

export const createPostSchema = Joi.object({
  title: Joi.string().min(5).max(100).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 5 characters",
    "string.max": "Title can be at most 100 characters",
  }),

  story: Joi.string().min(20).required().messages({
    "string.empty": "Story content cannot be empty",
    "string.min": "Story must be at least 20 characters",
  }),

  location: Joi.object().required().messages({
    "string.empty": "Location is required",
  }),

  travelDate: Joi.date().iso().required().messages({
    "date.base": "Please enter a valid date",
    "any.required": "Travel date is required",
  }),

  imageUrl: Joi.string().uri().required().messages({
    "string.uri": "Please enter a valid image URL",
  }),

  tags: Joi.array().items(Joi.string().min(2).max(20)).optional().messages({
    "array.base": "Tags must be an array",
    "string.min": "Each tag must be at least 2 characters",
    "string.max": "Each tag can be at most 20 characters",
  }),

  rating:Joi.number().min(1).max(5).default(1).optional().messages({
    "number.base":"Rating must be a number",
    "number.min":"Rating must be at least 1",
    "number.max":"Rating can be at most 5",
  })
});
