import { sendErrorResponse } from "../utils/response.js";

const allowedRoles = (...roles) => {
  return (req, res, next) => {
    // Admin can access everything
    if (req.user.role === "admin") return next();

    // Check if user role is allowed
    if (!roles.includes(req.user.role)) {
      return sendErrorResponse(res, "Forbidden!", 403);
    }

    next();
  };
};

export default allowedRoles;
