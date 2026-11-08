import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hostelPreference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
    },
    roomTypePreference: {
      type: String,
      enum: ["single", "double", "triple", "dormitory"],
    },
    reason: { type: String, trim: true },
    status: {
      type: String,
      enum: ["submitted", "under_review", "approved", "rejected", "cancelled"],
      default: "submitted",
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewNotes: String,
    reviewedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);
