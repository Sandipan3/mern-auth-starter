import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

export const generateAccessToken = (userId) => {
  return jwt.sign({ userId: userId }, process.env.JWT_KEY, {
    expiresIn: "5m",
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId: userId }, process.env.JWT_KEY, {
    expiresIn: "2h",
  });
};
