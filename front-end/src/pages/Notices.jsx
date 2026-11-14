import { useState } from 'react';
import {
  Bell,
  Plus,
  Pin,
  Calendar,
  Users,
  Send,
  Sparkles,
  Megaphone,
  ShieldCheck,
  Tag
} from 'lucide-react';
import Modal from '../components/Modal';

export default function Notices() {
  const [notices, setNotices] = useState([
    {
      _id: 'not-1',
      title: 'Hostel Curfew & Gate Timing Policy Update',
      body: 'All residents are reminded that main hostel gates will strictly lock at 10:00 PM on weekdays and 11:00 PM on weekends. Late returns without prior Warden approved gate pass will result in automatic disciplinary notification to guardians.',
      audience: 'All Residents',
      author: 'Warden Office',
      date: '2026-11-06',
      pinned: true,
      category: 'Policy',
    },
    {
      _id: 'not-2',
      title: 'Monthly Fee Due Date Reminder (November 2026)',
      body: 'Monthly room rent and mess charges invoices for November 2026 have been generated. The deadline for online payment via JazzCash/Easypaisa or bank transfer is November 10, 2026. Late surcharge of PKR 500 will apply after grace period.',
      audience: 'All Residents',
      author: 'Finance & Accounts',
      date: '2026-11-04',
      pinned: true,
      category: 'Finance',
    },
    {
      _id: 'not-3',
      title: 'Water Geyser Maintenance - Block A',
      body: 'Scheduled preventive maintenance of solar water geysers and backup electric boilers in Block A will be carried out this Saturday between 10:00 AM and 01:00 PM. Water supply will remain uninterrupted via cold tank.',
      audience: 'Block A Only',
      author: 'Maintenance Supervisor',
      date: '2026-11-02',
      pinned: false,
      category: 'Maintenance',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    body: '',
    audience: 'All Residents',
    category: 'General',
    pinned: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newNotice = {
      _id: 'not-' + Date.now(),
      ...form,
      author: 'Admin Office',
      date: new Date().toISOString().split('T')[0],
    };
    setNotices([newNotice, ...notices]);
    setIsModalOpen(false);
    setForm({
      title: '',
      body: '',
      audience: 'All Residents',
      category: 'General',
      pinned: false,
    });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* 3D Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center shadow-[0_8px_16px_rgba(168,85,247,0.35)] transform-gpu hover:rotate-6 transition">
            <Megaphone size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              Notice Board & Circulars
              <span className="pill-3d bg-purple-50 text-purple-700 text-xs px-2.5 py-0.5 border border-purple-200">
                3D Bulletin
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Publish official announcements, fee reminders, and block-wise circulars hostel-wide
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-3d btn-3d-purple text-xs px-4 py-2.5 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={16} /> Publish New Notice
        </button>
      </div>

      {/* 3D Notices Grid */}
      <div className="grid grid-cols-1 gap-5">
        {notices.map((n) => (
          <div
            key={n._id}
            className={`card-depth-3d p-6 relative overflow-hidden transition-all duration-200 group hover:-translate-y-1 ${
              n.pinned
                ? 'border-indigo-300 bg-gradient-to-r from-indigo-50/40 via-white to-purple-50/20'
                : 'bg-white'
            }`}
          >
            {/* 3D Top Reflection */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent" />

            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                {n.pinned && (
                  <span className="pill-3d bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-[10px] font-black uppercase px-2.5 py-0.5 shadow-xs border border-indigo-500">
                    <Pin size={11} className="mr-1 inline" /> Pinned Bulletin
                  </span>
                )}
                <span className="pill-3d bg-slate-100 text-slate-700 text-[11px] font-bold px-2.5 py-0.5 border border-slate-200">
                  {n.category}
                </span>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded-md border border-indigo-100">
                  Target: {n.audience}
                </span>
              </div>
              <div className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <Calendar size={13} className="text-slate-400" /> {n.date}
              </div>
            </div>

            <h2 className="text-lg font-black text-slate-800 tracking-tight mb-2 group-hover:text-indigo-600 transition">
              {n.title}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">{n.body}</p>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="font-medium">
                Issued By: <span className="font-bold text-slate-800">{n.author}</span>
              </div>
              <span className="pill-3d bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 font-bold text-[11px] flex items-center gap-1">
                <Send size={12} /> Broadcasted via App & SMS
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 3D Notice Creation Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Publish Official Hostel Notice"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Notice Headline *</label>
              <input
                type="text"
                required
                placeholder="e.g. Wi-Fi Router Upgrades in Block B"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience</label>
                <select
                  value={form.audience}
                  onChange={(e) => setForm({ ...form, audience: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="All Residents">All Hostel Residents</option>
                  <option value="Block A Only">Block A Only (Boys)</option>
                  <option value="Block B Only">Block B Only (Boys)</option>
                  <option value="Girls Wing">Girls Wing Only</option>
                  <option value="Fee Defaulters">Fee Defaulters</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="General">General Announcement</option>
                  <option value="Finance">Fee & Billing</option>
                  <option value="Policy">Hostel Rules & Security</option>
                  <option value="Maintenance">Maintenance & Outages</option>
                  <option value="Mess">Mess & Food</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Announcement Body *</label>
              <textarea
                rows={4}
                required
                placeholder="Write the full notice details here..."
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <input
                type="checkbox"
                id="pinNotice"
                checked={form.pinned}
                onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <label htmlFor="pinNotice" className="text-xs font-bold text-slate-700 cursor-pointer">
                Pin this notice to top of resident dashboard with 3D highlight
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="btn-3d btn-3d-slate px-4 py-2 text-xs"
              >
                Cancel
              </button>
              <button type="submit" className="btn-3d btn-3d-purple px-5 py-2 text-xs">
                Broadcast Notice
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
