import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { seedDatabase } from "../utils/seed.js";

let mongoServer;

export const connectDB = async () => {
  try {
    // Try MONGO_URI from env first; fall back to in-memory server
    let uri = process.env.MONGO_URI;

    if (!uri) {
      console.log("⏳ Starting MongoMemoryServer …");
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      console.log("✅ MongoMemoryServer started");
    }

    await mongoose.connect(uri);
    console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);

    // Seed demo data when the DB is empty (first run / in-memory)
    await seedDatabase();
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
};
