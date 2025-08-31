import express from "express";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import authMiddleware from "./middlewares/authMiddleware.js";
import allowedRoles from "./middlewares/roleMiddleware.js";
import connectDB from "./utils/ConnectDB.js";
import cookieParser from "cookie-parser";

// app setup
const app = express();

//=========GLOBAL MIDDLEWARES===========
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
//=======================================

// MongoDB Connection
connectDB();

//authRoues
app.use("/api/v1", authRoutes);

//===dummy protected route to test the authmiddleWare and roleMiddleware========
const rtr = express.Router();

rtr.get("/", (req, res) => {
  return res.status(200).json({
    status: "success",
    data: {
      userId: req.user.id,
      role: req.user.role,
    },
  });
});

//mount
app.use("/dummy-admin", authMiddleware, allowedRoles("admin"), rtr);
app.use("/dummy-student", authMiddleware, allowedRoles("student"), rtr);
app.use("/dummy-instructor", authMiddleware, allowedRoles("instructor"), rtr);

//=====I will delete this later=================================================

export default app;
