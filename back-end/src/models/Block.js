import mongoose from "mongoose";

const blockSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },
    floorsCount: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

blockSchema.index({ hostel: 1, name: 1 }, { unique: true });

export default mongoose.model("Block", blockSchema);
