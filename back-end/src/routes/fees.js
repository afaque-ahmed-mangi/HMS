import { Router } from "express";
import FeeHead from "../models/FeeHead.js";
import Invoice from "../models/Invoice.js";
import Payment from "../models/Payment.js";
import { protect, authorize } from "../middleware/auth.js";
import crypto from "crypto";

const router = Router();

// ══════════════════════════════════════════════════════════
//  FEE HEADS
// ══════════════════════════════════════════════════════════

router.get("/fee-heads", protect, async (_req, res) => {
  try {
    const heads = await FeeHead.find().sort("name");
    res.json({ success: true, data: heads, message: "Fee heads fetched" });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
});

router.post(
  "/fee-heads",
  protect,
  authorize("super_admin", "accountant"),
  async (req, res) => {
    try {
      const head = await FeeHead.create(req.body);
      res
        .status(201)
        .json({ success: true, data: head, message: "Fee head created" });
    } catch (err) {
      const status = err.code === 11000 ? 409 : 500;
      res
        .status(status)
        .json({ success: false, data: null, message: err.message });
    }
  }
);

router.put(
  "/fee-heads/:id",
  protect,
  authorize("super_admin", "accountant"),
  async (req, res) => {
    try {
      const head = await FeeHead.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!head) {
        return res
          .status(404)
          .json({ success: false, data: null, message: "Fee head not found" });
      }
      res.json({ success: true, data: head, message: "Fee head updated" });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, data: null, message: err.message });
    }
  }
);

// ══════════════════════════════════════════════════════════
//  INVOICES
// ══════════════════════════════════════════════════════════

router.get(
  "/invoices",
  protect,
  authorize("super_admin", "accountant", "warden"),
  async (req, res) => {
    try {
      const { resident, status, page = 1, limit = 20 } = req.query;
      const filter = {};
      if (resident) filter.resident = resident;
      if (status) filter.status = status;

      const invoices = await Invoice.find(filter)
        .populate({
          path: "resident",
          populate: { path: "user", select: "name email" },
        })
        .populate("lineItems.feeHead", "name")
        .populate("issuedBy", "name")
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .sort("-createdAt");

      const total = await Invoice.countDocuments(filter);

      res.json({
        success: true,
        data: { invoices, total, page: Number(page), pages: Math.ceil(total / limit) },
        message: "Invoices fetched",
      });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, data: null, message: err.message });
    }
  }
);

router.get("/invoices/:id", protect, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate({
        path: "resident",
        populate: { path: "user", select: "name email phone" },
      })
      .populate("lineItems.feeHead", "name description")
      .populate("issuedBy", "name");

    if (!invoice) {
      return res
        .status(404)
        .json({ success: false, data: null, message: "Invoice not found" });
    }
    res.json({ success: true, data: invoice, message: "Invoice fetched" });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
});

router.post(
  "/invoices",
  protect,
  authorize("super_admin", "accountant"),
  async (req, res) => {
    try {
      const { resident, lineItems, dueDate } = req.body;

      const totalAmount = lineItems.reduce((sum, li) => sum + li.amount, 0);
      const invoiceNumber = `INV-${Date.now()}-${crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase()}`;

      const invoice = await Invoice.create({
        invoiceNumber,
        resident,
        lineItems,
        totalAmount,
        dueDate,
        status: "issued",
        issuedBy: req.user._id,
        issuedAt: new Date(),
      });

      res
        .status(201)
        .json({ success: true, data: invoice, message: "Invoice created" });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, data: null, message: err.message });
    }
  }
);

// ══════════════════════════════════════════════════════════
//  PAYMENTS
// ══════════════════════════════════════════════════════════

router.get(
  "/payments",
  protect,
  authorize("super_admin", "accountant", "warden"),
  async (req, res) => {
    try {
      const { invoice, resident, page = 1, limit = 20 } = req.query;
      const filter = {};
      if (invoice) filter.invoice = invoice;
      if (resident) filter.resident = resident;

      const payments = await Payment.find(filter)
        .populate("invoice", "invoiceNumber totalAmount")
        .populate({
          path: "resident",
          populate: { path: "user", select: "name email" },
        })
        .populate("receivedBy", "name")
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .sort("-paidAt");

      const total = await Payment.countDocuments(filter);

      res.json({
        success: true,
        data: { payments, total, page: Number(page), pages: Math.ceil(total / limit) },
        message: "Payments fetched",
      });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, data: null, message: err.message });
    }
  }
);

router.post(
  "/payments",
  protect,
  authorize("super_admin", "accountant"),
  async (req, res) => {
    try {
      const { invoice: invoiceId, amount, method, transactionRef, notes } = req.body;

      const invoice = await Invoice.findById(invoiceId);
      if (!invoice) {
        return res
          .status(404)
          .json({ success: false, data: null, message: "Invoice not found" });
      }

      const receiptNumber = `RCT-${Date.now()}-${crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase()}`;

      const payment = await Payment.create({
        receiptNumber,
        invoice: invoiceId,
        resident: invoice.resident,
        amount,
        method,
        transactionRef,
        notes,
        receivedBy: req.user._id,
      });

      // Update invoice paid amount & status
      invoice.paidAmount += amount;
      if (invoice.paidAmount >= invoice.totalAmount) {
        invoice.status = "paid";
      } else {
        invoice.status = "partially_paid";
      }
      await invoice.save();

      res
        .status(201)
        .json({ success: true, data: payment, message: "Payment recorded" });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, data: null, message: err.message });
    }
  }
);

export default router;
