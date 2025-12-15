const errorHandler = (err, req, res, next) => {
  console.log("Error Handler :", err);

  const statusCode = err.statusCode || 500;

  console.error("❌ ERROR HANDLER:", {
    message: err.message,
    statusCode,
    stack: err.stack,
  });

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;
