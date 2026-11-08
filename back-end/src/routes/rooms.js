import { Router } from "express";
import Room from "../models/Room.js";
import Bed from "../models/Bed.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

// ──────────────────────── List rooms ────────────────────────
router.get("/", protect, async (req, res) => {
  try {
    const { hostel, block, floor, type, status } = req.query;
    const filter = {};
    if (hostel) filter.hostel = hostel;
    if (block) filter.block = block;
    if (floor !== undefined) filter.floor = Number(floor);
    if (type) filter.type = type;

    // status filter: available / full
    const rooms = await Room.find(filter)
      .populate("block", "name")
      .populate("hostel", "name code")
      .sort("roomNumber");

    let result = rooms;
    if (status === "available") {
      result = rooms.filter((r) => r.occupiedBeds < r.capacity);
    } else if (status === "full") {
      result = rooms.filter((r) => r.occupiedBeds >= r.capacity);
    }

    res.json({ success: true, data: result, message: "Rooms fetched" });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
});

// ──────────────────────── Get single room with beds ────────────────────────
router.get("/:id", protect, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate("block", "name")
      .populate("hostel", "name code");

    if (!room) {
      return res
        .status(404)
        .json({ success: false, data: null, message: "Room not found" });
    }

    const beds = await Bed.find({ room: room._id }).populate(
      "resident",
      "registrationNumber status"
    );

    res.json({
      success: true,
      data: { ...room.toObject(), beds },
      message: "Room fetched",
    });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
});

// ──────────────────────── Create room ────────────────────────
router.post(
  "/",
  protect,
  authorize("super_admin", "warden"),
  async (req, res) => {
    try {
      const room = await Room.create(req.body);

      // Auto-create beds for the room
      const beds = [];
      for (let i = 1; i <= room.capacity; i++) {
        beds.push({ bedNumber: `${room.roomNumber}-B${i}`, room: room._id });
      }
      await Bed.insertMany(beds);

      res
        .status(201)
        .json({ success: true, data: room, message: "Room created with beds" });
    } catch (err) {
      const status = err.code === 11000 ? 409 : 500;
      res
        .status(status)
        .json({ success: false, data: null, message: err.message });
    }
  }
);

// ──────────────────────── Update room ────────────────────────
router.put(
  "/:id",
  protect,
  authorize("super_admin", "warden"),
  async (req, res) => {
    try {
      const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!room) {
        return res
          .status(404)
          .json({ success: false, data: null, message: "Room not found" });
      }
      res.json({ success: true, data: room, message: "Room updated" });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, data: null, message: err.message });
    }
  }
);

// ──────────────────────── Delete room ────────────────────────
router.delete(
  "/:id",
  protect,
  authorize("super_admin"),
  async (req, res) => {
    try {
      const room = await Room.findByIdAndDelete(req.params.id);
      if (!room) {
        return res
          .status(404)
          .json({ success: false, data: null, message: "Room not found" });
      }
      await Bed.deleteMany({ room: room._id });
      res.json({ success: true, data: null, message: "Room and beds deleted" });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, data: null, message: err.message });
    }
  }
);

// ──────────────────────── List beds for a room ────────────────────────
router.get("/:id/beds", protect, async (req, res) => {
  try {
    const beds = await Bed.find({ room: req.params.id }).populate(
      "resident",
      "registrationNumber status"
    );
    res.json({ success: true, data: beds, message: "Beds fetched" });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
});

export default router;
