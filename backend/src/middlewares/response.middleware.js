const responseMiddleware = (req, res, next) => {
  res.success = ({
    statusCode = 200,
    message = "Success",
    data = null,
    meta = null,
  }) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      meta,
    });
  };

  res.error = ({
    statusCode = 500,
    message = "Internal Server Error",
    errors = null,
  }) => {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  };
  next();
};


export default responseMiddleware;