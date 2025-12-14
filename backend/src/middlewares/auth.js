import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";

const authValidation = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Authorization Header kontrolü
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2️⃣ Cookie kontrolü (header yoksa)
    if (!token && req.cookies?.access_token) {
      token = req.cookies.access_token;
    }

    // 3️⃣ Token yoksa
    if (!token) {
      return next(
        new ApiError(
          httpStatus.UNAUTHORIZED,
          "Authentication token is missing"
        )
      );
    }

    // 4️⃣ Token doğrulama
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5️⃣ Request içine user ekle
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    return next(
      new ApiError(
        httpStatus.UNAUTHORIZED,
        "Invalid or expired token"
      )
    );
  }
};

export default authValidation;
