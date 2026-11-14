import { useState } from 'react';
import {
  Utensils,
  Calendar,
  Clock,
  DollarSign,
  Check,
  Plus,
  AlertCircle,
  Coffee,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';
import Modal from '../components/Modal';

export default function Mess() {
  const [weeklyMenu, setWeeklyMenu] = useState([
    { day: 'Monday', breakfast: 'Halwa Puri / Omelette & Paratha', lunch: 'Daal Chawal & Salad', dinner: 'Chicken Biryani & Raita' },
    { day: 'Tuesday', breakfast: 'Boiled Eggs, Toast & Chai', lunch: 'Aloo Palak & Roti', dinner: 'Chicken Qorma & Naan' },
    { day: 'Wednesday', breakfast: 'Aloo Paratha & Yogurt', lunch: 'Lobia Masala & Zeera Rice', dinner: 'Kabab Karahi & Roti' },
    { day: 'Thursday', breakfast: 'French Toast & Milk Tea', lunch: 'Mix Vegetable & Roti', dinner: 'Chicken Pulao & Shami Kabab' },
    { day: 'Friday', breakfast: 'Chana Paratha & Pickle', lunch: 'Special Chicken Haleem & Naan', dinner: 'Beef Nihari & Kulcha' },
    { day: 'Saturday', breakfast: 'Egg Bhurji & Paratha', lunch: 'Daal Mash & Tandoori Roti', dinner: 'Chicken Karahi & Naan' },
    { day: 'Sunday', breakfast: 'Nihari / Special Halwa Puri', lunch: 'Chicken Macaroni & Salad', dinner: 'Mutton Pulao / Sweet Kheer' },
  ]);

  const [mealSkippingRequests, setMealSkippingRequests] = useState([
    { _id: 'skip-1', resident: 'Ali Raza', room: '101', date: '2026-11-09', meal: 'Dinner', status: 'approved' },
    { _id: 'skip-2', resident: 'Hamza Tariq', room: '102', date: '2026-11-08', meal: 'Lunch & Dinner', status: 'approved' },
    { _id: 'skip-3', resident: 'Bilal Ahmed', room: '204', date: '2026-11-10', meal: 'Breakfast', status: 'pending' },
  ]);

  const [isSkipModalOpen, setIsSkipModalOpen] = useState(false);
  const [skipForm, setSkipForm] = useState({
    resident: '',
    room: '',
    date: new Date().toISOString().split('T')[0],
    meal: 'Dinner',
  });

  const handleSkipSubmit = (e) => {
    e.preventDefault();
    setMealSkippingRequests([
      ...mealSkippingRequests,
      { _id: 'skip-' + Date.now(), ...skipForm, status: 'approved' },
    ]);
    setIsSkipModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* 3D Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-400 text-white flex items-center justify-center shadow-[0_8px_16px_rgba(245,158,11,0.35)] transform-gpu hover:rotate-6 transition">
            <Utensils size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              Mess & Dining Management
              <span className="pill-3d bg-amber-50 text-amber-700 text-xs px-2.5 py-0.5 border border-amber-200">
                3D Full Board
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Weekly meal schedules, resident meal skipping requests, and kitchen headcounts
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsSkipModalOpen(true)}
          className="btn-3d btn-3d-amber text-xs px-4 py-2.5 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={16} /> Request Meal Skip (Deduction)
        </button>
      </div>

      {/* 3D KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-depth-3d p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Coffee size={13} className="text-amber-500" /> Breakfast
            </div>
            <div className="text-2xl font-black text-slate-800 mt-1">118 / 125</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">7 skipping</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            ☕
          </div>
        </div>

        <div className="card-depth-3d p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Sun size={13} className="text-orange-500" /> Lunch
            </div>
            <div className="text-2xl font-black text-slate-800 mt-1">104 / 125</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">21 skipping</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
            🍲
          </div>
        </div>

        <div className="card-depth-3d p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Moon size={13} className="text-indigo-500" /> Dinner
            </div>
            <div className="text-2xl font-black text-indigo-600 mt-1">122 / 125</div>
            <div className="text-[11px] text-slate-400 font-semibold mt-0.5">Biryani Special</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            🍗
          </div>
        </div>

        <div className="card-depth-3d p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase font-bold text-slate-400">Monthly Mess Head</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">PKR 8,500</div>
            <div className="text-[11px] text-slate-400 font-semibold mt-0.5">All 3 meals daily</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            💳
          </div>
        </div>
      </div>

      {/* 3D Weekly Menu */}
      <div className="card-depth-3d overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <h2 className="font-extrabold text-slate-800 flex items-center gap-2 text-sm">
            <Calendar size={18} className="text-indigo-600" /> Weekly Standard Mess Menu
          </h2>
          <span className="pill-3d bg-indigo-50 text-indigo-700 text-xs px-3 py-1 font-bold border border-indigo-200">
            Standard Full Board
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-100/70 text-slate-700 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-4">Day</th>
                <th className="px-6 py-4">Breakfast (07:30 – 09:30 AM)</th>
                <th className="px-6 py-4">Lunch (01:00 – 02:30 PM)</th>
                <th className="px-6 py-4">Dinner (07:30 – 09:30 PM)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {weeklyMenu.map((m) => (
                <tr key={m.day} className="hover:bg-indigo-50/30 transition">
                  <td className="px-6 py-4 font-black text-indigo-700">
                    <span className="pill-3d bg-indigo-50 px-2.5 py-1 text-xs border border-indigo-200">
                      {m.day}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-700 font-medium">{m.breakfast}</td>
                  <td className="px-6 py-4 text-xs text-slate-700 font-medium">{m.lunch}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-800">{m.dinner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3D Meal Skipping Requests Table */}
      <div className="card-depth-3d overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/60">
          <h2 className="font-extrabold text-slate-800 text-sm">
            Recent Meal Skipping / Bill Adjustment Requests
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-100/70 text-slate-700 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-4">Resident</th>
                <th className="px-6 py-4">Room</th>
                <th className="px-6 py-4">Skip Date</th>
                <th className="px-6 py-4">Skipped Meal(s)</th>
                <th className="px-6 py-4">Credit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mealSkippingRequests.map((r) => (
                <tr key={r._id} className="hover:bg-indigo-50/30 transition">
                  <td className="px-6 py-4 font-bold text-slate-800">{r.resident}</td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      Room {r.room}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600 font-medium">{r.date}</td>
                  <td className="px-6 py-4 font-bold text-xs text-slate-800">{r.meal}</td>
                  <td className="px-6 py-4">
                    <span className="pill-3d px-2.5 py-0.5 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      PKR 150 Deducted in Invoice
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3D Skip Modal */}
      {isSkipModalOpen && (
        <Modal
          isOpen={isSkipModalOpen}
          onClose={() => setIsSkipModalOpen(false)}
          title="Submit Meal Skipping Request (Credit Adjustment)"
        >
          <form onSubmit={handleSkipSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Resident Name</label>
                <input
                  type="text"
                  required
                  placeholder="Ali Raza"
                  value={skipForm.resident}
                  onChange={(e) => setSkipForm({ ...skipForm, resident: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Room No.</label>
                <input
                  type="text"
                  required
                  placeholder="101"
                  value={skipForm.room}
                  onChange={(e) => setSkipForm({ ...skipForm, room: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date of Skip</label>
                <input
                  type="date"
                  required
                  value={skipForm.date}
                  onChange={(e) => setSkipForm({ ...skipForm, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Meal to Skip</label>
                <select
                  value={skipForm.meal}
                  onChange={(e) => setSkipForm({ ...skipForm, meal: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Breakfast">Breakfast only (Rs. 80)</option>
                  <option value="Lunch">Lunch only (Rs. 150)</option>
                  <option value="Dinner">Dinner only (Rs. 200)</option>
                  <option value="Full Day (All 3 meals)">Full Day All 3 Meals (Rs. 430)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsSkipModalOpen(false)}
                className="btn-3d btn-3d-slate px-4 py-2 text-xs"
              >
                Cancel
              </button>
              <button type="submit" className="btn-3d btn-3d-amber px-5 py-2 text-xs">
                Submit Request
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
