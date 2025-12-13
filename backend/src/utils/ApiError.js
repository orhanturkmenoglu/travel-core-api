class ApiError extends Error {
  constructor(statusCode, message, isOperational = true) {
    super(message);

    this.statusCode = statusCode;

    if (isOperational) {
      this.isOperational = isOperational;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
