export const validator = (schema) => {
  return (req, res, next) => {
    const { value, error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      // Hata mesajlarını birleştir
      const message = error.details.map(detail => detail.message).join(", ");
      return next(new ApiError(400, message));
    }
    // Validated data ile req.body güncellenebilir
    req.body = value;
    next();
  };
};
