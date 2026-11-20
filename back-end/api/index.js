// Vercel Serverless Entry Point
// This wraps the Express app for Vercel's Node.js serverless runtime

import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "../src/config/db.js";

// Route imports
import authRoutes from "../src/routes/auth.js";
import hostelRoutes from "../src/routes/hostels.js";
import roomRoutes from "../src/routes/rooms.js";
import residentRoutes from "../src/routes/residents.js";
import feeRoutes from "../src/routes/fees.js";
import dashboardRoutes from "../src/routes/dashboard.js";
import chatRoutes from "../src/routes/chat.js";

dotenv.config();

const app = express();

// --------------- Middleware ---------------
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
}));
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));
app.use(morgan("dev"));

// --------------- API Routes ---------------
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/hostels", hostelRoutes);
app.use("/api/v1/rooms", roomRoutes);
app.use("/api/v1/residents", residentRoutes);
app.use("/api/v1/fees", feeRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/chat", chatRoutes);

// Health check
app.get("/api/v1/health", (_req, res) => {
  res.json({ success: true, data: null, message: "HMS API is running ✅" });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, data: null, message: "Route not found" });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(err.statusCode || 500).json({
    success: false,
    data: null,
    message: err.message || "Internal server error",
  });
});

// Connect DB once and export handler (Vercel caches between warm invocations)
let isConnected = false;

const handler = async (req, res) => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  return app(req, res);
};

export default handler;
