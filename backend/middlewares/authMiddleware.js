import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import { sendErrorResponse } from "../utils/response.js";
dotenv.config();

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return sendErrorResponse(res, "No access token provided", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const user = await User.findById(decoded.userId).select("name role");

    if (!user) {
      return sendErrorResponse(res, "User not found", 401);
    }

    req.user = {
      userId: decoded.userId,
      name: user.name,
      role: user.role,
    };

    next(); // proceed to controller
  } catch (error) {
    return sendErrorResponse(res, "Invalid or expired access token", 401);
  }
};

export default authMiddleware;
