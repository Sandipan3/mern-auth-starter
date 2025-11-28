import express from "express";
import {
  login,
  logout,
  refreshToken,
  register,
  profile,
} from "../controllers/authControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import passport from "../middlewares/passport.js";
import { googleCallback } from "../controllers/authControllers.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, profile);
router.post("/logout", logout);
router.post("/refresh", refreshToken);

// Google OAuth Login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback
);

export default router;
