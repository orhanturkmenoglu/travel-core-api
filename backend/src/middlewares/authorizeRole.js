import ApiError from "../utils/ApiError.js";
import httpStatus from 'http-status';

export const authorizeRole = (...roles) => {
    return (req, res, next) => {
        // Eğer req.user yoksa veya role yetkili değilse
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new ApiError(httpStatus.FORBIDDEN, "Forbidden: You don't have permission"));
        }
        next();
    }
}
