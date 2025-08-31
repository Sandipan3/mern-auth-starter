import express from "express";
import {
  login,
  logout,
  profile,
  refreshAccessToken,
  register,
} from "../controllers/authControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, profile);
router.post("/logout", logout);
router.get("/refresh", refreshAccessToken);

export default router;
