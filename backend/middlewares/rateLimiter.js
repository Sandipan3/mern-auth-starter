import rateLimit from "express-rate-limit";
import { sendErrorResponse } from "../utils/response.js";

const rateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,
  handler: (req, res) => {
    return sendErrorResponse(
      res,
      "Too many attempts. Please try again later.",
      429 // Too Many Requests
    );
  },
});

export default rateLimiter;
