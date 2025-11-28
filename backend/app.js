import express from "express";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import connectDB from "./utils/connectDb.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import passport from "./middlewares/passport.js";
import session from "express-session";

// app setup
const app = express();

//=========GLOBAL MIDDLEWARES===========
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
//====localhost=====================
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );
//=======================================

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
connectDB();

//routes
app.use("/api/v1/auth", authRoutes);

app.use(errorMiddleware);

export default app;
