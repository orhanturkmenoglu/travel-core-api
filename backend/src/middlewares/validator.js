import ApiError from "../utils/ApiError.js";

const validator = (schema) => {
  return (req, res, next) => {
   const { value, error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      // Hata mesajlarını birleştir
      const message = error.details.map(detail => detail.message).join(", ");
      return next(new ApiError(400, message));
    }

    if(!value){
      return next(new ApiError(400, "Validated data is required"));
    }
    // Validated data ile req.body güncellenebilir
    req.body = value;
    next();
  };
};

export default validator;