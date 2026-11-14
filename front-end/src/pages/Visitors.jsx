import { useState } from 'react';
import {
  UserPlus2,
  Clock,
  CheckCircle,
  AlertCircle,
  LogOut,
  Search,
  UserCheck,
  Shield,
  Smartphone,
  Sparkles
} from 'lucide-react';
import Modal from '../components/Modal';

export default function Visitors() {
  const [visitors, setVisitors] = useState([
    {
      _id: 'vis-1',
      visitorName: 'Kamran Akmal',
      visitorCnic: '35201-8899776-5',
      phone: '0300-4455667',
      residentVisited: 'Ali Raza (Room 101)',
      relation: 'Cousin',
      purpose: 'Delivering books & winter clothes',
      timeIn: '2026-11-08 14:30',
      timeOut: null,
      status: 'inside',
    },
    {
      _id: 'vis-2',
      visitorName: 'Tariq Mehmood',
      visitorCnic: '35202-3344556-1',
      phone: '0313-1122334',
      residentVisited: 'Hamza Tariq (Room 102)',
      relation: 'Father',
      purpose: 'Meeting son during visiting hours',
      timeIn: '2026-11-08 11:00',
      timeOut: '2026-11-08 13:15',
      status: 'checked_out',
    },
    {
      _id: 'vis-3',
      visitorName: 'Rashid Khan',
      visitorCnic: '38403-9988112-7',
      phone: '0321-7788443',
      residentVisited: 'Bilal Ahmed (Room 204)',
      relation: 'Friend',
      purpose: 'Academic project discussion',
      timeIn: '2026-11-08 15:45',
      timeOut: null,
      status: 'inside',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    visitorName: '',
    visitorCnic: '',
    phone: '',
    residentVisited: '',
    relation: 'Friend',
    purpose: '',
  });

  const handleCheckOut = (id) => {
    const timeOutStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setVisitors((prev) =>
      prev.map((v) =>
        v._id === id
          ? { ...v, status: 'checked_out', timeOut: new Date().toISOString().split('T')[0] + ' ' + timeOutStr }
          : v
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const timeInStr =
      new Date().toISOString().split('T')[0] +
      ' ' +
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newVisitor = {
      _id: 'vis-' + Date.now(),
      ...form,
      timeIn: timeInStr,
      timeOut: null,
      status: 'inside',
    };
    setVisitors([newVisitor, ...visitors]);
    setIsModalOpen(false);
    setForm({
      visitorName: '',
      visitorCnic: '',
      phone: '',
      residentVisited: '',
      relation: 'Friend',
      purpose: '',
    });
  };

  const filtered = visitors.filter(
    (v) =>
      v.visitorName.toLowerCase().includes(search.toLowerCase()) ||
      v.visitorCnic.includes(search) ||
      v.residentVisited.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-8">
      {/* 3D Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-[0_8px_16px_rgba(59,130,246,0.35)] transform-gpu hover:rotate-6 transition">
            <UserCheck size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              Visitor Gate Register
              <span className="pill-3d bg-blue-50 text-blue-700 text-xs px-2.5 py-0.5 border border-blue-200">
                3D Security Guard
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Gatekeeper logs for guest entry/exit, CNIC verification, and visiting hours compliance
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-3d btn-3d-indigo text-xs px-4 py-2.5 flex items-center gap-2 self-start sm:self-auto"
        >
          <UserPlus2 size={16} /> Log Guest Entry
        </button>
      </div>

      {/* 3D KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-depth-3d p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase font-bold text-amber-500 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping inline-block" />
              Guests Inside Campus
            </div>
            <div className="text-2xl font-black text-amber-600 mt-1">
              {visitors.filter((v) => v.status === 'inside').length} Visitors
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Currently on hostel grounds</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            🚪
          </div>
        </div>

        <div className="card-depth-3d p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase font-bold text-slate-400">Total Visits Today</div>
            <div className="text-2xl font-black text-slate-800 mt-1">{visitors.length}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">All CNIC verified</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            🛂
          </div>
        </div>

        <div className="card-depth-3d p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase font-bold text-emerald-600">Visiting Hours Window</div>
            <div className="text-lg font-black text-emerald-700 mt-1">04:00 PM – 09:00 PM</div>
            <p className="text-[11px] text-emerald-600 mt-0.5 font-semibold">Active & Open</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            🕒
          </div>
        </div>
      </div>

      {/* 3D Search & Filter */}
      <div className="card-depth-3d p-3 rounded-2xl flex items-center gap-3 bg-slate-50/60">
        <Search size={16} className="text-slate-400 ml-2" />
        <input
          type="text"
          placeholder="Quick search by guest name, CNIC number, or visited resident..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-xs"
        />
      </div>

      {/* 3D Visitors Table */}
      <div className="card-depth-3d overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-100/70 text-slate-700 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-4">Visitor Profile</th>
                <th className="px-6 py-4">CNIC & Contact</th>
                <th className="px-6 py-4">Resident Visited</th>
                <th className="px-6 py-4">Purpose</th>
                <th className="px-6 py-4">Time In / Out</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Gatekeeper Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((v) => (
                <tr key={v._id} className="hover:bg-indigo-50/30 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{v.visitorName}</div>
                    <div className="text-xs text-slate-400">Relation: {v.relation}</div>
                  </td>
                  <td className="px-6 py-4 space-y-0.5 text-xs font-mono">
                    <div className="font-bold text-slate-800">{v.visitorCnic}</div>
                    <div className="text-slate-500 font-sans">{v.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-indigo-700">{v.residentVisited}</td>
                  <td className="px-6 py-4 text-xs text-slate-600 font-medium">{v.purpose}</td>
                  <td className="px-6 py-4 text-xs space-y-0.5">
                    <div className="text-slate-700 font-medium">In: {v.timeIn}</div>
                    <div className="text-slate-400">
                      {v.timeOut ? (
                        `Out: ${v.timeOut}`
                      ) : (
                        <span className="text-amber-600 font-bold">Currently inside</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`pill-3d px-2.5 py-0.5 text-xs font-bold capitalize ${
                        v.status === 'inside'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {v.status === 'inside' ? 'Inside Campus' : 'Departed'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {v.status === 'inside' ? (
                      <button
                        onClick={() => handleCheckOut(v._id)}
                        className="btn-3d btn-3d-slate text-xs px-3 py-1 inline-flex items-center gap-1 font-bold"
                      >
                        <LogOut size={13} /> Mark Exit
                      </button>
                    ) : (
                      <span className="pill-3d bg-slate-100 text-slate-500 text-xs px-2.5 py-0.5 font-bold border border-slate-200">
                        Completed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3D Entry Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Gatekeeper Visitor Check-in (CNIC Verified)"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Visitor Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Kamran Akmal"
                  value={form.visitorName}
                  onChange={(e) => setForm({ ...form, visitorName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Visitor CNIC Number</label>
                <input
                  type="text"
                  required
                  placeholder="35201-XXXXXXX-X"
                  value={form.visitorCnic}
                  onChange={(e) => setForm({ ...form, visitorCnic: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Contact Phone</label>
                <input
                  type="tel"
                  required
                  placeholder="0300-1234567"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Relationship with Student</label>
                <select
                  value={form.relation}
                  onChange={(e) => setForm({ ...form, relation: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Brother">Brother</option>
                  <option value="Guardian">Official Guardian</option>
                  <option value="Friend">Friend / Classmate</option>
                  <option value="Courier / Delivery">Delivery / Courier</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Resident Student Visited (Name & Room)</label>
              <input
                type="text"
                required
                placeholder="e.g. Ali Raza (Room 101)"
                value={form.residentVisited}
                onChange={(e) => setForm({ ...form, residentVisited: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Purpose of Visit</label>
              <textarea
                rows={2}
                required
                placeholder="State reason for visit, e.g. meeting family, delivering parcels"
                value={form.purpose}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="btn-3d btn-3d-slate px-4 py-2 text-xs"
              >
                Cancel
              </button>
              <button type="submit" className="btn-3d btn-3d-indigo px-5 py-2 text-xs">
                Log Entry & Print Pass
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
