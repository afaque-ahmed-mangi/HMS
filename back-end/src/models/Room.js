import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, trim: true },
    block: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Block",
      required: true,
    },
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },
    floor: { type: Number, required: true, default: 0 },
    type: {
      type: String,
      enum: ["single", "double", "triple", "dormitory"],
      default: "double",
    },
    capacity: { type: Number, required: true, default: 2 },
    occupiedBeds: { type: Number, default: 0 },
    amenities: [String],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

roomSchema.index({ hostel: 1, block: 1, roomNumber: 1 }, { unique: true });

export default mongoose.model("Room", roomSchema);
