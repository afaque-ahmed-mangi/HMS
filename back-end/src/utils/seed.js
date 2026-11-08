import User from "../models/User.js";
import Hostel from "../models/Hostel.js";
import Block from "../models/Block.js";
import Room from "../models/Room.js";
import Bed from "../models/Bed.js";
import Resident from "../models/Resident.js";
import FeeHead from "../models/FeeHead.js";

/**
 * Seeds demo data only when the database is empty (first run / in-memory).
 */
export const seedDatabase = async () => {
  const userCount = await User.countDocuments();
  if (userCount > 0) {
    console.log("ℹ️  Database already seeded – skipping");
    return;
  }

  console.log("🌱 Seeding demo data …");

  // ────────────────────── Users ──────────────────────
  const admin = await User.create({
    name: "Super Admin",
    email: "admin@hms.com",
    password: "admin123",
    role: "super_admin",
    phone: "9000000001",
  });

  const warden = await User.create({
    name: "John Warden",
    email: "warden@hms.com",
    password: "warden123",
    role: "warden",
    phone: "9000000002",
  });

  const accountant = await User.create({
    name: "Sarah Finance",
    email: "accountant@hms.com",
    password: "account123",
    role: "accountant",
    phone: "9000000003",
  });

  const resUser1 = await User.create({
    name: "Alice Resident",
    email: "alice@hms.com",
    password: "alice123",
    role: "resident",
    phone: "9000000004",
  });

  const demoResident = await User.create({
    name: "Demo Resident",
    email: "resident@hms.com",
    password: "resident123",
    role: "resident",
    phone: "9000000099",
  });

  const resUser2 = await User.create({
    name: "Bob Resident",
    email: "bob@hms.com",
    password: "bob123",
    role: "resident",
    phone: "9000000005",
  });

  const guardian = await User.create({
    name: "Mr. Guardian",
    email: "guardian@hms.com",
    password: "guardian123",
    role: "guardian",
    phone: "9000000006",
  });

  // ────────────────────── Hostel ──────────────────────
  const hostel = await Hostel.create({
    name: "Sunrise Hostel",
    code: "SRH",
    type: "co-ed",
    address: "123 University Road, Campus Area",
    warden: warden._id,
    totalCapacity: 8,
    occupiedCount: 2,
  });

  // ────────────────────── Blocks ──────────────────────
  const blockA = await Block.create({
    name: "Block A",
    hostel: hostel._id,
    floorsCount: 2,
  });

  const blockB = await Block.create({
    name: "Block B",
    hostel: hostel._id,
    floorsCount: 2,
  });

  // ────────────────────── Rooms & Beds ──────────────────────
  const room101 = await Room.create({
    roomNumber: "A-101",
    block: blockA._id,
    hostel: hostel._id,
    floor: 1,
    type: "double",
    capacity: 2,
    occupiedBeds: 1,
    amenities: ["WiFi", "AC", "Attached Bathroom"],
  });

  const room102 = await Room.create({
    roomNumber: "A-102",
    block: blockA._id,
    hostel: hostel._id,
    floor: 1,
    type: "double",
    capacity: 2,
    occupiedBeds: 1,
    amenities: ["WiFi", "Fan"],
  });

  const room201 = await Room.create({
    roomNumber: "B-201",
    block: blockB._id,
    hostel: hostel._id,
    floor: 2,
    type: "triple",
    capacity: 3,
    occupiedBeds: 0,
    amenities: ["WiFi", "Fan", "Balcony"],
  });

  const room202 = await Room.create({
    roomNumber: "B-202",
    block: blockB._id,
    hostel: hostel._id,
    floor: 2,
    type: "single",
    capacity: 1,
    occupiedBeds: 0,
    amenities: ["WiFi", "AC", "Attached Bathroom", "Study Desk"],
  });

  // Beds for room A-101
  const bed101_1 = await Bed.create({
    bedNumber: "A-101-B1",
    room: room101._id,
    status: "occupied",
  });
  await Bed.create({
    bedNumber: "A-101-B2",
    room: room101._id,
    status: "available",
  });

  // Beds for room A-102
  const bed102_1 = await Bed.create({
    bedNumber: "A-102-B1",
    room: room102._id,
    status: "occupied",
  });
  await Bed.create({
    bedNumber: "A-102-B2",
    room: room102._id,
    status: "available",
  });

  // Beds for room B-201
  await Bed.create({ bedNumber: "B-201-B1", room: room201._id, status: "available" });
  await Bed.create({ bedNumber: "B-201-B2", room: room201._id, status: "available" });
  await Bed.create({ bedNumber: "B-201-B3", room: room201._id, status: "available" });

  // Bed for room B-202
  await Bed.create({ bedNumber: "B-202-B1", room: room202._id, status: "available" });

  // ────────────────────── Residents ──────────────────────
  const resident1 = await Resident.create({
    user: resUser1._id,
    registrationNumber: "RES-2024-001",
    dateOfBirth: new Date("2002-05-15"),
    gender: "female",
    bloodGroup: "A+",
    permanentAddress: "456 Elm Street, Hometown",
    guardianName: "Mr. Guardian",
    guardianPhone: "9000000006",
    guardianRelation: "Father",
    guardian: guardian._id,
    hostel: hostel._id,
    room: room101._id,
    bed: bed101_1._id,
    checkInDate: new Date("2024-08-01"),
    status: "active",
  });

  // Link bed to resident
  bed101_1.resident = resident1._id;
  await bed101_1.save();

  const resident2 = await Resident.create({
    user: resUser2._id,
    registrationNumber: "RES-2024-002",
    dateOfBirth: new Date("2001-11-20"),
    gender: "male",
    bloodGroup: "O+",
    permanentAddress: "789 Oak Avenue, Other City",
    guardianName: "Mrs. Smith",
    guardianPhone: "9000000007",
    guardianRelation: "Mother",
    hostel: hostel._id,
    room: room102._id,
    bed: bed102_1._id,
    checkInDate: new Date("2024-08-01"),
    status: "active",
  });

  bed102_1.resident = resident2._id;
  await bed102_1.save();

  // ────────────────────── Fee Heads ──────────────────────
  await FeeHead.create([
    {
      name: "Room Rent",
      description: "Monthly room rental charge",
      amount: 5000,
      frequency: "monthly",
    },
    {
      name: "Mess Fee",
      description: "Monthly mess / food charge",
      amount: 3500,
      frequency: "monthly",
    },
    {
      name: "Security Deposit",
      description: "One-time refundable security deposit",
      amount: 10000,
      frequency: "one_time",
    },
    {
      name: "Maintenance Fee",
      description: "Quarterly hostel maintenance charge",
      amount: 2000,
      frequency: "quarterly",
    },
  ]);

  console.log("✅ Demo data seeded successfully");
  console.log("   ──────────────────────────────────────");
  console.log("   Admin:      admin@hms.com     / admin123");
  console.log("   Warden:     warden@hms.com    / warden123");
  console.log("   Accountant: accountant@hms.com / account123");
  console.log("   Resident 1: alice@hms.com     / alice123");
  console.log("   Resident 2: bob@hms.com       / bob123");
  console.log("   Guardian:   guardian@hms.com   / guardian123");
  console.log("   ──────────────────────────────────────");
};
