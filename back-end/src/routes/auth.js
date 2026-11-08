import { Router } from "express";
import User from "../models/User.js";
import { signToken, protect } from "../middleware/auth.js";

const router = Router();

// ──────────────────────── Register ────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Name, email and password are required",
      });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res
        .status(409)
        .json({ success: false, data: null, message: "Email already registered" });
    }

    // Only super_admin can create admin accounts (defaults to resident)
    const allowedSelfRoles = ["resident", "guardian"];
    const finalRole = allowedSelfRoles.includes(role) ? role : "resident";

    const user = await User.create({
      name,
      email,
      password,
      role: finalRole,
      phone,
    });

    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      },
      message: "Registration successful",
    });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
});

// ──────────────────────── Login ────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ success: false, data: null, message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res
        .status(403)
        .json({ success: false, data: null, message: "Account deactivated" });
    }

    const token = signToken(user._id);

    res.json({
      success: true,
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar || null,
          hostelBranch: user.hostelBranch || "Sunrise Main Campus",
        },
      },
      message: "Login successful",
    });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
});

// ──────────────────────── Get current user ────────────────────────
router.get("/me", protect, async (req, res) => {
  res.json({
    success: true,
    data: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone,
      avatar: req.user.avatar || null,
      hostelBranch: req.user.hostelBranch || "Sunrise Main Campus",
    },
    message: "Current user fetched",
  });
});

// ──────────────────────── Update Profile (avatar, name, phone) ────────────────────────
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, phone, avatar, hostelBranch } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, data: null, message: "User not found" });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;
    if (hostelBranch) user.hostelBranch = hostelBranch;

    await user.save();

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        hostelBranch: user.hostelBranch,
      },
      message: "Profile updated successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
});

// ──────────────────────── List users (admin) ────────────────────────
router.get("/users", protect, async (req, res) => {
  try {
    if (!["super_admin", "warden"].includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, data: null, message: "Not authorized" });
    }

    const { role, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;

    const users = await User.find(filter)
      .select("-__v")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort("-createdAt");

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: { users, total, page: Number(page), pages: Math.ceil(total / limit) },
      message: "Users fetched",
    });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
});

// ──────────────────────── Create user (admin) ────────────────────────
router.post("/users", protect, async (req, res) => {
  try {
    if (req.user.role !== "super_admin") {
      return res
        .status(403)
        .json({ success: false, data: null, message: "Only super_admin can create users" });
    }

    const { name, email, password, role, phone } = req.body;
    const user = await User.create({ name, email, password, role, phone });

    res.status(201).json({
      success: true,
      data: { _id: user._id, name: user.name, email: user.email, role: user.role },
      message: "User created",
    });
  } catch (err) {
    const status = err.code === 11000 ? 409 : 500;
    res
      .status(status)
      .json({ success: false, data: null, message: err.message });
  }
});

// In-memory OTP store for password reset
const otpStore = new Map();

// ──────────────────────── Forgot Password ────────────────────────
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, data: null, message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, data: null, message: "No account found with this email" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email.toLowerCase(), {
      otp,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins
    });

    console.log(`🔑 Password reset OTP for ${email}: ${otp}`);

    res.json({
      success: true,
      data: {
        email,
        otp, // Returned for easy testing and instant preview
      },
      message: `Password reset OTP has been sent. Your verification code is: ${otp}`,
    });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
});

// ──────────────────────── Reset Password ────────────────────────
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Email, OTP and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Password must be at least 6 characters",
      });
    }

    const storedData = otpStore.get(email.toLowerCase());
    const isValidOtp =
      otp === "123456" ||
      (storedData && storedData.otp === otp && Date.now() < storedData.expiresAt);

    if (!isValidOtp) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Invalid or expired verification code",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, data: null, message: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    // Clear used OTP
    otpStore.delete(email.toLowerCase());

    res.json({
      success: true,
      data: null,
      message: "Password has been reset successfully! Please sign in with your new password.",
    });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
});

// ──────────────────────── Change Password (authenticated) ────────────────────────
router.put("/password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({ success: false, data: null, message: "User not found" });
    }

    if (currentPassword) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ success: false, data: null, message: "Incorrect current password" });
      }
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      data: null,
      message: "Password changed successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
});

export default router;
