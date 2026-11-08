import { Router } from "express";
import Hostel from "../models/Hostel.js";
import Block from "../models/Block.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

// ──────────────────────── List hostels ────────────────────────
router.get("/", protect, async (req, res) => {
  try {
    const hostels = await Hostel.find()
      .populate("warden", "name email")
      .sort("name");

    res.json({ success: true, data: hostels, message: "Hostels fetched" });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
});

// ──────────────────────── Get single hostel ────────────────────────
router.get("/:id", protect, async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id).populate(
      "warden",
      "name email"
    );
    if (!hostel) {
      return res
        .status(404)
        .json({ success: false, data: null, message: "Hostel not found" });
    }

    const blocks = await Block.find({ hostel: hostel._id });

    res.json({
      success: true,
      data: { ...hostel.toObject(), blocks },
      message: "Hostel fetched",
    });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
});

// ──────────────────────── Create hostel ────────────────────────
router.post(
  "/",
  protect,
  authorize("super_admin", "warden"),
  async (req, res) => {
    try {
      const hostel = await Hostel.create(req.body);
      res
        .status(201)
        .json({ success: true, data: hostel, message: "Hostel created" });
    } catch (err) {
      const status = err.code === 11000 ? 409 : 500;
      res
        .status(status)
        .json({ success: false, data: null, message: err.message });
    }
  }
);

// ──────────────────────── Update hostel ────────────────────────
router.put(
  "/:id",
  protect,
  authorize("super_admin", "warden"),
  async (req, res) => {
    try {
      const hostel = await Hostel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!hostel) {
        return res
          .status(404)
          .json({ success: false, data: null, message: "Hostel not found" });
      }
      res.json({ success: true, data: hostel, message: "Hostel updated" });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, data: null, message: err.message });
    }
  }
);

// ──────────────────────── Delete hostel ────────────────────────
router.delete(
  "/:id",
  protect,
  authorize("super_admin"),
  async (req, res) => {
    try {
      const hostel = await Hostel.findByIdAndDelete(req.params.id);
      if (!hostel) {
        return res
          .status(404)
          .json({ success: false, data: null, message: "Hostel not found" });
      }
      // Cascade delete blocks
      await Block.deleteMany({ hostel: hostel._id });

      res.json({ success: true, data: null, message: "Hostel deleted" });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, data: null, message: err.message });
    }
  }
);

// ────────────── Block CRUD (nested under hostels) ──────────────
router.post(
  "/:hostelId/blocks",
  protect,
  authorize("super_admin", "warden"),
  async (req, res) => {
    try {
      const block = await Block.create({
        ...req.body,
        hostel: req.params.hostelId,
      });
      res
        .status(201)
        .json({ success: true, data: block, message: "Block created" });
    } catch (err) {
      const status = err.code === 11000 ? 409 : 500;
      res
        .status(status)
        .json({ success: false, data: null, message: err.message });
    }
  }
);

router.get("/:hostelId/blocks", protect, async (req, res) => {
  try {
    const blocks = await Block.find({ hostel: req.params.hostelId }).sort(
      "name"
    );
    res.json({ success: true, data: blocks, message: "Blocks fetched" });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
});

export default router;
