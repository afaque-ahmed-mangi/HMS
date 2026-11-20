import Room from "../models/Room.js";
import FeeHead from "../models/FeeHead.js";
import Hostel from "../models/Hostel.js";

/**
 * Gathers relevant hotel/hostel data from MongoDB to feed the AI prompt as context.
 * If the database query encounters an issue or is empty, it returns default safe verified policies.
 */
export async function getHotelContext() {
  try {
    // 1. Fetch Hostels
    const hostels = await Hostel.find({ isActive: true }).lean().catch(() => []);

    // 2. Fetch Rooms with available capacity
    const rooms = await Room.find({ isActive: true })
      .populate("block", "name")
      .populate("hostel", "name type")
      .lean()
      .catch(() => []);

    // 3. Fetch Fee Structure / Prices
    const feeHeads = await FeeHead.find({ isActive: true }).lean().catch(() => []);

    // Aggregate Room Availability by type
    const roomSummary = {};
    let totalAvailableBeds = 0;

    for (const room of rooms) {
      const freeBeds = Math.max(0, (room.capacity || 0) - (room.occupiedBeds || 0));
      totalAvailableBeds += freeBeds;
      const typeKey = room.type || "standard";

      if (!roomSummary[typeKey]) {
        roomSummary[typeKey] = {
          totalRooms: 0,
          availableBeds: 0,
          amenities: new Set(),
          sampleRooms: []
        };
      }

      roomSummary[typeKey].totalRooms += 1;
      roomSummary[typeKey].availableBeds += freeBeds;
      if (room.amenities && Array.isArray(room.amenities)) {
        room.amenities.forEach((a) => roomSummary[typeKey].amenities.add(a));
      }
      if (freeBeds > 0 && roomSummary[typeKey].sampleRooms.length < 3) {
        roomSummary[typeKey].sampleRooms.push(room.roomNumber);
      }
    }

    // Format Context Text
    let contextText = "=== LIVE HOTEL & HOSTEL INVENTORY ===\n";

    // Hostels section
    if (hostels.length > 0) {
      contextText += "\nHostel Buildings:\n";
      hostels.forEach((h) => {
        contextText += `- ${h.name} (${h.type} hostel, Code: ${h.code}, Address: ${h.address || "Main Campus"})\n`;
      });
    }

    // Room types and availability
    contextText += `\nTotal Vacant Beds: ${totalAvailableBeds}\n`;
    contextText += "Room Types & Status:\n";
    if (Object.keys(roomSummary).length > 0) {
      for (const [type, data] of Object.entries(roomSummary)) {
        const amenitiesList = Array.from(data.amenities).join(", ") || "Standard furniture, lighting, fan";
        contextText += `- ${type.toUpperCase()}: ${data.availableBeds} beds currently available across ${data.totalRooms} rooms. Amenities: [${amenitiesList}].\n`;
      }
    } else {
      contextText += "- Single, Double, and Triple occupancy rooms available upon inquiry at the front desk.\n";
    }

    // Pricing / Fee Heads & City Rates
    contextText += "\nOfficial Fee Structure & City-Wise Rates (All in Rs.):\n";
    contextText += "- JAMSHORO CAMPUS: Base Double Room: Rs. 12,000/month | Single Deluxe: Rs. 16,000/month | Triple Sharing: Rs. 9,500/month | Quad Dormitory: Rs. 7,500/month.\n";
    contextText += "- HYDERABAD CAMPUS: Double Sharing: Rs. 14,000/month | Single Deluxe: Rs. 18,000/month | Triple: Rs. 11,000/month.\n";
    contextText += "- KARACHI CAMPUS: Double Sharing: Rs. 18,000/month | Single Deluxe: Rs. 24,000/month | Triple: Rs. 14,000/month.\n";
    contextText += "- ISLAMABAD CAMPUS: Double Sharing: Rs. 20,000/month | Single Deluxe: Rs. 26,000/month | Triple: Rs. 15,000/month.\n";
    contextText += "- LAHORE CAMPUS: Double Sharing: Rs. 16,000/month | Single Deluxe: Rs. 22,000/month | Triple: Rs. 12,500/month.\n";

    if (feeHeads.length > 0) {
      contextText += "\nStandard Central Fee Heads:\n";
      feeHeads.forEach((f) => {
        contextText += `- ${f.name}: Rs. ${f.amount} (${f.frequency}). ${f.description || ""}\n`;
      });
    } else {
      contextText += "- Standard Room: Rs. 12,000/month in Jamshoro. Contact front desk for latest fee schedule.\n";
    }

    // Hotel Policies & FAQ
    contextText += `
=== OFFICIAL HOTEL/HOSTEL POLICIES & FAQ ===
- Check-in Time: 12:00 PM | Check-out Time: 11:00 AM
- Night Gate Curfew: 10:00 PM strictly for resident safety.
- Visiting Hours: 4:00 PM to 9:00 PM daily in designated common lounges.
- Internet: High-speed Wi-Fi (HMS-Guest) is complimentary in all rooms.
- Meals / Dining: Mess hall serves Breakfast (7:30-9:30 AM), Lunch (12:30-2:30 PM), Dinner (7:30-9:30 PM).
- Booking & Cancellation Rule: Bookings cannot be directly made or canceled via chat. Guests must submit an application online or visit the Front Desk / Warden office in person.
- Contact: Front desk phone: +1 (555) 019-2834 | Email: frontdesk@hms-hostel.local | Office: Ground Floor Admin Block.
`;

    return contextText;
  } catch (err) {
    console.error("Error generating hotel context:", err);
    return `
=== VERIFIED HOTEL POLICIES ===
- Night Curfew: 10:00 PM
- Visiting Hours: 4:00 PM - 9:00 PM
- Front Desk Contact: frontdesk@hms-hostel.local or Front Desk Ground Floor
- Direct booking via chat is disabled; please visit the front desk to reserve or modify a room.
`;
  }
}
