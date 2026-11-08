import { Router } from "express";
import Resident from "../models/Resident.js";
import Application from "../models/Application.js";
import Bed from "../models/Bed.js";
import Room from "../models/Room.js";
import Hostel from "../models/Hostel.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

// ══════════════════════════════════════════════════════════
//  RESIDENT CRUD
// ══════════════════════════════════════════════════════════

// List all residents (admin/warden)
router.get(
  "/",
  protect,
  authorize("super_admin", "warden", "accountant"),
  async (req, res) => {
    try {
      const { status, hostel, page = 1, limit = 20 } = req.query;
      const filter = {};
      if (status) filter.status = status;
      if (hostel) filter.hostel = hostel;

      const residents = await Resident.find(filter)
        .populate("user", "name email phone")
        .populate("hostel", "name code")
        .populate("room", "roomNumber")
        .populate("bed", "bedNumber")
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .sort("-createdAt");

      const total = await Resident.countDocuments(filter);

      res.json({
        success: true,
        data: { residents, total, page: Number(page), pages: Math.ceil(total / limit) },
        message: "Residents fetched",
      });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, data: null, message: err.message });
    }
  }
);

// Get single resident
router.get("/:id", protect, async (req, res) => {
  try {
    const resident = await Resident.findById(req.params.id)
      .populate("user", "name email phone role")
      .populate("hostel", "name code")
      .populate("room", "roomNumber type floor")
      .populate("bed", "bedNumber status");

    if (!resident) {
      return res
        .status(404)
        .json({ success: false, data: null, message: "Resident not found" });
    }

    // Residents can only view their own profile
    if (
      req.user.role === "resident" &&
      resident.user._id.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ success: false, data: null, message: "Not authorized" });
    }

    res.json({ success: true, data: resident, message: "Resident fetched" });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
});

// Create resident profile
router.post(
  "/",
  protect,
  authorize("super_admin", "warden"),
  async (req, res) => {
    try {
      const resident = await Resident.create(req.body);
      res
        .status(201)
        .json({ success: true, data: resident, message: "Resident created" });
    } catch (err) {
      const status = err.code === 11000 ? 409 : 500;
      res
        .status(status)
        .json({ success: false, data: null, message: err.message });
    }
  }
);

// Update resident
router.put(
  "/:id",
  protect,
  authorize("super_admin", "warden"),
  async (req, res) => {
    try {
      const resident = await Resident.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!resident) {
        return res
          .status(404)
          .json({ success: false, data: null, message: "Resident not found" });
      }
      res.json({ success: true, data: resident, message: "Resident updated" });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, data: null, message: err.message });
    }
  }
);

// ──────────────────── Allocate room/bed to resident ────────────────────
router.post(
  "/:id/allocate",
  protect,
  authorize("super_admin", "warden"),
  async (req, res) => {
    try {
      const { hostel: hostelId, room: roomId, bed: bedId } = req.body;
      const resident = await Resident.findById(req.params.id);
      if (!resident) {
        return res
          .status(404)
          .json({ success: false, data: null, message: "Resident not found" });
      }

      // Validate bed availability
      const bed = await Bed.findById(bedId);
      if (!bed || bed.status !== "available") {
        return res
          .status(400)
          .json({ success: false, data: null, message: "Bed not available" });
      }

      // Update bed
      bed.status = "occupied";
      bed.resident = resident._id;
      await bed.save();

      // Update room count
      await Room.findByIdAndUpdate(roomId, { $inc: { occupiedBeds: 1 } });

      // Update hostel count
      await Hostel.findByIdAndUpdate(hostelId, { $inc: { occupiedCount: 1 } });

      // Update resident
      resident.hostel = hostelId;
      resident.room = roomId;
      resident.bed = bedId;
      resident.status = "active";
      resident.checkInDate = new Date();
      await resident.save();

      res.json({ success: true, data: resident, message: "Room allocated successfully" });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, data: null, message: err.message });
    }
  }
);

// ──────────────────── Deallocate (checkout) ────────────────────
router.post(
  "/:id/deallocate",
  protect,
  authorize("super_admin", "warden"),
  async (req, res) => {
    try {
      const resident = await Resident.findById(req.params.id);
      if (!resident) {
        return res
          .status(404)
          .json({ success: false, data: null, message: "Resident not found" });
      }

      if (resident.bed) {
        await Bed.findByIdAndUpdate(resident.bed, {
          status: "available",
          resident: null,
        });
      }
      if (resident.room) {
        await Room.findByIdAndUpdate(resident.room, {
          $inc: { occupiedBeds: -1 },
        });
      }
      if (resident.hostel) {
        await Hostel.findByIdAndUpdate(resident.hostel, {
          $inc: { occupiedCount: -1 },
        });
      }

      resident.status = "checked_out";
      resident.checkOutDate = new Date();
      resident.hostel = undefined;
      resident.room = undefined;
      resident.bed = undefined;
      await resident.save();

      res.json({ success: true, data: resident, message: "Resident checked out" });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, data: null, message: err.message });
    }
  }
);

// ══════════════════════════════════════════════════════════
//  APPLICATION WORKFLOW
// ══════════════════════════════════════════════════════════

// Submit application (residents)
router.post("/applications", protect, async (req, res) => {
  try {
    const application = await Application.create({
      ...req.body,
      applicant: req.user._id,
    });
    res
      .status(201)
      .json({ success: true, data: application, message: "Application submitted" });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
});

// List applications
router.get(
  "/applications",
  protect,
  authorize("super_admin", "warden"),
  async (_req, res) => {
    try {
      const applications = await Application.find()
        .populate("applicant", "name email")
        .populate("hostelPreference", "name")
        .populate("reviewedBy", "name")
        .sort("-createdAt");

      res.json({
        success: true,
        data: applications,
        message: "Applications fetched",
      });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, data: null, message: err.message });
    }
  }
);

// Review application (approve/reject)
router.put(
  "/applications/:id/review",
  protect,
  authorize("super_admin", "warden"),
  async (req, res) => {
    try {
      const { status, reviewNotes } = req.body;
      if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({
          success: false,
          data: null,
          message: "Status must be 'approved' or 'rejected'",
        });
      }

      const application = await Application.findByIdAndUpdate(
        req.params.id,
        {
          status,
          reviewNotes,
          reviewedBy: req.user._id,
          reviewedAt: new Date(),
        },
        { new: true }
      );

      if (!application) {
        return res
          .status(404)
          .json({ success: false, data: null, message: "Application not found" });
      }

      res.json({
        success: true,
        data: application,
        message: `Application ${status}`,
      });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, data: null, message: err.message });
    }
  }
);

export default router;
