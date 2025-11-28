import bcrypt from "bcrypt";
import User from "../models/User.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response.js";
dotenv.config();

// register
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return sendErrorResponse(res, "Fields cannot be empty", 403);
  }

  try {
    // password validation
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      )
    ) {
      return sendErrorResponse(
        res,
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
        403
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendErrorResponse(
        res,
        "A user with this email already exists.",
        403
      );
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT, 10) || 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      name,
      email,
      password: hashPassword,
      profileCompleted: false,
    });
    await user.save();

    return sendSuccessResponse(
      res,
      { message: "User registered successfully" },
      201
    );
  } catch (error) {
    console.log(error);
    return sendErrorResponse(res, "User registration was unsuccessful", 500);
  }
};

// login
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendErrorResponse(res, "Fields cannot be empty", 403);
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return sendErrorResponse(res, "User with this email does not exist", 401);
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return sendErrorResponse(res, "Incorrect password", 401);
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccessResponse(res, {
      message: "Login successful",
      accessToken,
    });
  } catch (error) {
    return sendErrorResponse(res, "Login was unsuccessful", 500);
  }
};

// refresh
export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return sendErrorResponse(res, "No refresh token in cookies", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return sendErrorResponse(res, "User not found", 401);
    }

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccessResponse(res, {
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
    });
  } catch (error) {
    return sendErrorResponse(res, "Invalid or expired refresh token", 401);
  }
};

// logout
export const logout = (req, res) => {
  try {
    res.clearCookie("refreshToken");
    return sendSuccessResponse(res, { message: "Logout successful" });
  } catch (error) {
    return sendErrorResponse(res, "Logout was unsuccessful", 500);
  }
};

// profile
export const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return sendErrorResponse(res, "User not found", 401);
    }

    return sendSuccessResponse(res, user);
  } catch (error) {
    return sendErrorResponse(res, "Server error", 500);
  }
};

export const googleCallback = (req, res) => {
  try {
    const user = req.user;

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const redirectUrl = `http://localhost:5173/auth/callback?access_token=${accessToken}`;
    return res.redirect(redirectUrl);
  } catch (error) {
    return sendErrorResponse(res, "Server error", 500);
  }
};
