import mongoose from "mongoose";

const hostelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    code: { type: String, required: true, trim: true, unique: true },
    type: { type: String, enum: ["boys", "girls", "co-ed"], default: "boys" },
    address: { type: String, trim: true },
    warden: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    totalCapacity: { type: Number, default: 0 },
    occupiedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Hostel", hostelSchema);
