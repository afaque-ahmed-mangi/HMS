import mongoose from "mongoose";

const feeHeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: String,
    amount: { type: Number, required: true, min: 0 },
    frequency: {
      type: String,
      enum: ["one_time", "monthly", "quarterly", "yearly"],
      default: "monthly",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("FeeHead", feeHeadSchema);
