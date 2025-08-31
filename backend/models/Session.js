import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  userIP: {
    type: String,
    required: true,
  },

  userAgent: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },

  location: {
    city: { type: String },
    region: { type: String },
    country: { type: String },
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 7 * 24 * 60 * 60,
  },
});

export default mongoose.model("Session", sessionSchema);
