import { useState } from 'react';
import { Utensils, Calendar, Clock, DollarSign, Check, Plus, AlertCircle } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Utensils className="text-indigo-600" /> Mess & Dining Management
          </h1>
          <p className="text-slate-500 text-sm">
            Weekly meal schedules, resident meal skipping requests, and kitchen counts
          </p>
        </div>
        <button
          onClick={() => setIsSkipModalOpen(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-sm transition"
        >
          <Plus size={18} /> Request Meal Skip (Deduction)
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-xs uppercase font-bold text-slate-400">Today's Breakfast Count</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">118 / 125</div>
          <div className="text-xs text-emerald-600 mt-1">7 skipped</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-xs uppercase font-bold text-slate-400">Today's Lunch Count</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">104 / 125</div>
          <div className="text-xs text-emerald-600 mt-1">21 skipped</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-xs uppercase font-bold text-slate-400">Today's Dinner Expected</div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">122 / 125</div>
          <div className="text-xs text-slate-400 mt-1">Chicken Biryani & Raita</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-xs uppercase font-bold text-slate-400">Monthly Mess Fee Head</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">PKR 8,500</div>
          <div className="text-xs text-slate-400 mt-1">Includes 3 meals daily</div>
        </div>
      </div>

      {/* Weekly Menu Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <Calendar size={18} className="text-indigo-600" /> Weekly Standard Menu
          </h2>
          <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-semibold">
            Standard Full Board
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Day</th>
                <th className="px-6 py-4">Breakfast (07:30 – 09:30 AM)</th>
                <th className="px-6 py-4">Lunch (01:00 – 02:30 PM)</th>
                <th className="px-6 py-4">Dinner (07:30 – 09:30 PM)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {weeklyMenu.map((m) => (
                <tr key={m.day} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4 font-bold text-indigo-700">{m.day}</td>
                  <td className="px-6 py-4 text-xs text-slate-700">{m.breakfast}</td>
                  <td className="px-6 py-4 text-xs text-slate-700">{m.lunch}</td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-800">{m.dinner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Meal Skipping Requests */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">Recent Meal Skipping / Bill Adjustment Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs border-b border-slate-100">
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
                <tr key={r._id} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4 font-semibold text-slate-800">{r.resident}</td>
                  <td className="px-6 py-4 font-mono text-xs">Room {r.room}</td>
                  <td className="px-6 py-4 text-xs text-slate-600">{r.date}</td>
                  <td className="px-6 py-4 font-medium text-xs text-indigo-600">{r.meal}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      PKR 150 Deducted in Invoice
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isSkipModalOpen && (
        <Modal
          isOpen={isSkipModalOpen}
          onClose={() => setIsSkipModalOpen(false)}
          title="Submit Meal Skipping Request (Credit Adjustment)"
        >
          <form onSubmit={handleSkipSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Resident Name</label>
                <input
                  type="text"
                  required
                  placeholder="Ali Raza"
                  value={skipForm.resident}
                  onChange={(e) => setSkipForm({ ...skipForm, resident: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Room No.</label>
                <input
                  type="text"
                  required
                  placeholder="101"
                  value={skipForm.room}
                  onChange={(e) => setSkipForm({ ...skipForm, room: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Date of Skip</label>
                <input
                  type="date"
                  required
                  value={skipForm.date}
                  onChange={(e) => setSkipForm({ ...skipForm, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Meal to Skip</label>
                <select
                  value={skipForm.meal}
                  onChange={(e) => setSkipForm({ ...skipForm, meal: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                >
                  <option value="Breakfast">Breakfast only (Rs. 80)</option>
                  <option value="Lunch">Lunch only (Rs. 150)</option>
                  <option value="Dinner">Dinner only (Rs. 200)</option>
                  <option value="Full Day (All 3 meals)">Full Day All 3 Meals (Rs. 430)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsSkipModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition"
              >
                Submit Request
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
