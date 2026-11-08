import { useState } from 'react';
import { UserPlus2, Clock, CheckCircle, AlertCircle, LogOut, Search, UserCheck } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <UserCheck className="text-indigo-600" /> Visitor Gate Register
          </h1>
          <p className="text-slate-500 text-sm">
            Gatekeeper logs for guest entry/exit, CNIC verification, and visiting hours
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-sm transition"
        >
          <UserPlus2 size={18} /> Log Guest Entry
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase font-bold text-slate-400">Guests Inside Campus</div>
            <div className="text-2xl font-bold text-indigo-600 mt-1">
              {visitors.filter((v) => v.status === 'inside').length}
            </div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Clock size={20} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase font-bold text-slate-400">Total Visits Today</div>
            <div className="text-2xl font-bold text-slate-800 mt-1">{visitors.length}</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
            <UserCheck size={20} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase font-bold text-slate-400">Visiting Hours</div>
            <div className="text-lg font-bold text-emerald-600 mt-1">04:00 PM – 09:00 PM</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle size={20} />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <input
          type="text"
          placeholder="Search visitor name, CNIC, or resident..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Visitor Profile</th>
                <th className="px-6 py-4">CNIC & Contact</th>
                <th className="px-6 py-4">Resident Visited</th>
                <th className="px-6 py-4">Purpose</th>
                <th className="px-6 py-4">Time In / Out</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((v) => (
                <tr key={v._id} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{v.visitorName}</div>
                    <div className="text-xs text-slate-400">Relation: {v.relation}</div>
                  </td>
                  <td className="px-6 py-4 space-y-0.5 text-xs font-mono">
                    <div className="text-slate-800">{v.visitorCnic}</div>
                    <div className="text-slate-500 font-sans">{v.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-indigo-700">{v.residentVisited}</td>
                  <td className="px-6 py-4 text-xs text-slate-600">{v.purpose}</td>
                  <td className="px-6 py-4 text-xs space-y-0.5">
                    <div className="text-slate-700">In: {v.timeIn}</div>
                    <div className="text-slate-400">
                      {v.timeOut ? `Out: ${v.timeOut}` : <span className="text-amber-600 font-semibold">Currently on Campus</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                        v.status === 'inside'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {v.status === 'inside' ? 'Inside' : 'Departed'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {v.status === 'inside' ? (
                      <button
                        onClick={() => handleCheckOut(v._id)}
                        className="inline-flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-lg font-medium transition"
                      >
                        <LogOut size={13} /> Mark Exit
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Register Visitor Entry at Gate"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Visitor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kamran Akmal"
                  value={form.visitorName}
                  onChange={(e) => setForm({ ...form, visitorName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Visitor CNIC *</label>
                <input
                  type="text"
                  required
                  placeholder="35201-xxxxxxx-x"
                  value={form.visitorCnic}
                  onChange={(e) => setForm({ ...form, visitorCnic: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="0300-xxxxxxx"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Relation to Student</label>
                <select
                  value={form.relation}
                  onChange={(e) => setForm({ ...form, relation: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                >
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Brother">Brother</option>
                  <option value="Uncle">Uncle</option>
                  <option value="Friend">Friend</option>
                  <option value="Courier / Delivery">Courier / Delivery</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Resident to Visit *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ali Raza (Room 101)"
                value={form.residentVisited}
                onChange={(e) => setForm({ ...form, residentVisited: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Purpose of Visit</label>
              <input
                type="text"
                required
                placeholder="e.g. Family meeting, handing over items"
                value={form.purpose}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition"
              >
                Log Entry & Generate Pass
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
