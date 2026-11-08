import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";

// Route imports
import authRoutes from "./src/routes/auth.js";
import hostelRoutes from "./src/routes/hostels.js";
import roomRoutes from "./src/routes/rooms.js";
import residentRoutes from "./src/routes/residents.js";
import feeRoutes from "./src/routes/fees.js";
import dashboardRoutes from "./src/routes/dashboard.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --------------- Middleware ---------------
app.use(cors());
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

// Health check
app.get("/api/v1/health", (_req, res) => {
  res.json({ success: true, data: null, message: "HMS API is running" });
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

// --------------- Start Server ---------------
const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 HMS API server running on http://localhost:${PORT}`);
  });
};

start();
