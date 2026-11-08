import mongoose from "mongoose";

const lineItemSchema = new mongoose.Schema(
  {
    feeHead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeeHead",
      required: true,
    },
    description: String,
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: true,
    },
    lineItems: [lineItemSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    paidAmount: { type: Number, default: 0, min: 0 },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["draft", "issued", "partially_paid", "paid", "overdue", "cancelled"],
      default: "draft",
    },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    issuedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);
