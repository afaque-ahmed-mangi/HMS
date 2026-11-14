import { useState } from 'react';
import {
  Wrench,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  MessageSquare,
  Star,
  Zap,
  Droplet,
  Wifi,
  Hammer,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import Modal from '../components/Modal';

export default function Complaints() {
  const [complaints, setComplaints] = useState([
    {
      _id: 'cmp-1',
      ticketNo: 'TKT-2026-081',
      resident: 'Ali Raza',
      room: '101 (Block A)',
      category: 'Electrical',
      title: 'AC unit cooling low & fan rattling sound',
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
      title: 'Bathroom tap water leakage & low pressure',
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
      title: 'Wardrobe door hinge broken & lock stuck',
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

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Electrical':
        return <Zap size={14} className="text-amber-500" />;
      case 'Plumbing':
        return <Droplet size={14} className="text-blue-500" />;
      case 'Wi-Fi / Internet':
        return <Wifi size={14} className="text-indigo-500" />;
      default:
        return <Hammer size={14} className="text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* 3D Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-[0_8px_16px_rgba(245,158,11,0.35)] transform-gpu hover:rotate-6 transition">
            <Wrench size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              Maintenance & Complaints
              <span className="pill-3d bg-amber-50 text-amber-700 text-xs px-2.5 py-0.5 border border-amber-200">
                3D Ticket Hub
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Track student service requests, assign staff technicians, and verify turnaround times
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-3d btn-3d-indigo text-xs px-4 py-2.5 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={16} /> Raise Ticket
        </button>
      </div>

      {/* 3D Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-depth-3d p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase font-bold text-slate-400">Total Logged</div>
            <div className="text-2xl font-black text-slate-800 mt-1">{complaints.length}</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            📋
          </div>
        </div>

        <div className="card-depth-3d p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase font-bold text-amber-500">In Progress</div>
            <div className="text-2xl font-black text-amber-600 mt-1">
              {complaints.filter((c) => c.status === 'open' || c.status === 'in_progress').length}
            </div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            ⚡
          </div>
        </div>

        <div className="card-depth-3d p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase font-bold text-emerald-500">Resolved</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {complaints.filter((c) => c.status === 'resolved' || c.status === 'closed').length}
            </div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            ✓
          </div>
        </div>

        <div className="card-depth-3d p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase font-bold text-indigo-500">Avg SLA Speed</div>
            <div className="text-2xl font-black text-indigo-600 mt-1">3.8 hrs</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            ⏱
          </div>
        </div>
      </div>

      {/* 3D Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {['all', 'open', 'in_progress', 'resolved', 'closed'].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`pill-3d px-3 py-1.5 text-xs capitalize cursor-pointer border transition ${
              filter === st
                ? 'bg-indigo-600 text-white border-indigo-700 shadow-[0_4px_12px_rgba(79,70,229,0.35)]'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* 3D Complaints Table */}
      <div className="card-depth-3d overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-100/70 text-slate-700 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200/80">
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
                <tr key={c._id} className="hover:bg-indigo-50/30 transition">
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {c.ticketNo}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{c.resident}</div>
                    <div className="text-xs text-slate-400 font-medium">{c.room}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 mb-1">
                      {getCategoryIcon(c.category)}
                      <span className="text-[11px] font-bold text-slate-700">{c.category}</span>
                    </div>
                    <div className="text-xs text-slate-800 font-medium max-w-xs">{c.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`pill-3d px-2.5 py-0.5 text-[10px] font-extrabold uppercase border ${
                        c.priority === 'high'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : c.priority === 'medium'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {c.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600 font-semibold">{c.assignedTo}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`pill-3d px-2.5 py-0.5 text-xs font-bold capitalize ${
                        c.status === 'resolved' || c.status === 'closed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : c.status === 'in_progress'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                      }`}
                    >
                      {c.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-1.5">
                    {c.status === 'open' && (
                      <button
                        onClick={() => handleUpdateStatus(c._id, 'in_progress')}
                        className="btn-3d btn-3d-indigo text-xs px-2.5 py-1"
                      >
                        Start Work
                      </button>
                    )}
                    {c.status === 'in_progress' && (
                      <button
                        onClick={() => handleUpdateStatus(c._id, 'resolved')}
                        className="btn-3d btn-3d-emerald text-xs px-2.5 py-1"
                      >
                        ✓ Resolve
                      </button>
                    )}
                    {(c.status === 'resolved' || c.status === 'closed') && (
                      <span className="text-xs text-emerald-600 font-bold flex items-center justify-end gap-1">
                        <CheckCircle size={15} /> Fixed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3D Ticket Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Raise Maintenance Ticket / Complaint"
        >
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Resident Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ali Raza"
                  value={form.resident}
                  onChange={(e) => setForm({ ...form, resident: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Room No & Block</label>
                <input
                  type="text"
                  required
                  placeholder="101 (Block A)"
                  value={form.room}
                  onChange={(e) => setForm({ ...form, room: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Electrical">Electrical (Fan / AC / Lights)</option>
                  <option value="Plumbing">Plumbing (Washroom / Taps)</option>
                  <option value="Wi-Fi / Internet">Wi-Fi & Network</option>
                  <option value="Carpentry">Carpentry & Furniture</option>
                  <option value="Cleanliness">Janitorial & Cleaning</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="low">Low (General)</option>
                  <option value="medium">Medium (Standard 24h)</option>
                  <option value="high">High (Urgent / Immediate)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Issue Description</label>
              <textarea
                rows={3}
                required
                placeholder="State the exact issue, symptoms, and urgency"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
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
                Submit Ticket
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
