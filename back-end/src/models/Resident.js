import mongoose from "mongoose";

const residentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    registrationNumber: { type: String, unique: true, sparse: true },
    dateOfBirth: Date,
    gender: { type: String, enum: ["male", "female", "other"] },
    bloodGroup: String,
    permanentAddress: String,
    guardianName: String,
    guardianPhone: String,
    guardianRelation: String,
    guardian: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    hostel: { type: mongoose.Schema.Types.ObjectId, ref: "Hostel" },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    bed: { type: mongoose.Schema.Types.ObjectId, ref: "Bed" },
    checkInDate: Date,
    checkOutDate: Date,
    status: {
      type: String,
      enum: ["pending", "active", "inactive", "checked_out"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Resident", residentSchema);
