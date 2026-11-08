import { useState } from 'react';
import { Wrench, Plus, CheckCircle, Clock, AlertTriangle, MessageSquare, Star } from 'lucide-react';
import Modal from '../components/Modal';

export default function Complaints() {
  const [complaints, setComplaints] = useState([
    {
      _id: 'cmp-1',
      ticketNo: 'TKT-2026-081',
      resident: 'Ali Raza',
      room: '101 (Block A)',
      category: 'Electrical',
      title: 'AC unit cooling low & fan rattling',
      priority: 'high',
      status: 'in_progress',
      assignedTo: 'Electrician (Muhammad Shafiq)',
      createdDate: '2026-11-07',
    },
    {
      _id: 'cmp-2',
      ticketNo: 'TKT-2026-082',
      resident: 'Zainab Bibi',
      room: '201 (Block B)',
      category: 'Plumbing',
      title: 'Bathroom tap water leakage',
      priority: 'medium',
      status: 'open',
      assignedTo: 'Plumber (TBD)',
      createdDate: '2026-11-08',
    },
    {
      _id: 'cmp-3',
      ticketNo: 'TKT-2026-079',
      resident: 'Hamza Tariq',
      room: '102 (Block A)',
      category: 'Wi-Fi / Internet',
      title: 'Wi-Fi signal weak on 1st floor corridor',
      priority: 'low',
      status: 'resolved',
      assignedTo: 'IT Support (Adeel)',
      createdDate: '2026-11-05',
      rating: 5,
    },
    {
      _id: 'cmp-4',
      ticketNo: 'TKT-2026-075',
      resident: 'Bilal Ahmed',
      room: '204 (Block A)',
      category: 'Carpentry',
      title: 'Wardrobe door hinge broken',
      priority: 'medium',
      status: 'closed',
      assignedTo: 'Hostel Maintenance Staff',
      createdDate: '2026-11-02',
      rating: 4,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({
    resident: '',
    room: '',
    category: 'Electrical',
    title: '',
    priority: 'medium',
    assignedTo: 'Duty Maintenance Staff',
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const newTkt = {
      _id: 'cmp-' + Date.now(),
      ticketNo: 'TKT-2026-' + Math.floor(100 + Math.random() * 900),
      ...form,
      status: 'open',
      createdDate: new Date().toISOString().split('T')[0],
    };
    setComplaints([newTkt, ...complaints]);
    setIsModalOpen(false);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setComplaints((prev) =>
      prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
    );
  };

  const filtered = complaints.filter((c) => filter === 'all' || c.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Wrench className="text-indigo-600" /> Maintenance & Complaints
          </h1>
          <p className="text-slate-500 text-sm">
            Track student service requests, assign staff technicians, and verify turnaround times
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-sm transition"
        >
          <Plus size={18} /> Raise Maintenance Ticket
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-xs uppercase font-bold text-slate-400">Total Tickets</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{complaints.length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-xs uppercase font-bold text-amber-500">Open & In Progress</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {complaints.filter((c) => c.status === 'open' || c.status === 'in_progress').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-xs uppercase font-bold text-emerald-500">Resolved / Closed</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {complaints.filter((c) => c.status === 'resolved' || c.status === 'closed').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-xs uppercase font-bold text-indigo-500">Avg Resolution Time</div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">4.2 hrs</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'open', 'in_progress', 'resolved', 'closed'].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
              filter === st
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Ticket #</th>
                <th className="px-6 py-4">Resident & Room</th>
                <th className="px-6 py-4">Category & Issue</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Assigned Staff</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => (
                <tr key={c._id} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4 font-mono font-bold text-xs text-indigo-600">{c.ticketNo}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{c.resident}</div>
                    <div className="text-xs text-slate-400">Room {c.room}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 mb-1">
                      {c.category}
                    </span>
                    <div className="text-xs text-slate-800 font-medium">{c.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                        c.priority === 'high'
                          ? 'bg-rose-50 text-rose-600'
                          : c.priority === 'medium'
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {c.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600 font-medium">{c.assignedTo}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                        c.status === 'resolved' || c.status === 'closed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : c.status === 'in_progress'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {c.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-1">
                    {c.status === 'open' && (
                      <button
                        onClick={() => handleUpdateStatus(c._id, 'in_progress')}
                        className="text-xs bg-indigo-600 text-white px-2.5 py-1 rounded-lg font-semibold hover:bg-indigo-700"
                      >
                        Start Work
                      </button>
                    )}
                    {c.status === 'in_progress' && (
                      <button
                        onClick={() => handleUpdateStatus(c._id, 'resolved')}
                        className="text-xs bg-emerald-600 text-white px-2.5 py-1 rounded-lg font-semibold hover:bg-emerald-700"
                      >
                        Resolve
                      </button>
                    )}
                    {c.status === 'resolved' && (
                      <span className="text-xs text-emerald-600 font-semibold flex items-center justify-end gap-1">
                        <CheckCircle size={14} /> Closed
                      </span>
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
          title="Raise Maintenance Ticket / Complaint"
        >
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Resident Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ali Raza"
                  value={form.resident}
                  onChange={(e) => setForm({ ...form, resident: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Room No & Block</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 101 (Block A)"
                  value={form.room}
                  onChange={(e) => setForm({ ...form, room: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                >
                  <option value="Electrical">Electrical (Lights, AC, Fan)</option>
                  <option value="Plumbing">Plumbing (Washroom, Leakage, Tap)</option>
                  <option value="Carpentry">Carpentry (Bed, Desk, Cupboard)</option>
                  <option value="Wi-Fi / Internet">Wi-Fi & Internet</option>
                  <option value="Cleanliness">Cleanliness & Janitorial</option>
                  <option value="Other">Other Issues</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Urgency Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                >
                  <option value="low">Low (Within 48h)</option>
                  <option value="medium">Medium (Within 24h)</option>
                  <option value="high">High Emergency (Immediate)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Issue Description</label>
              <textarea
                rows={3}
                required
                placeholder="Explain the issue in detail..."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
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
                Submit Ticket
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
