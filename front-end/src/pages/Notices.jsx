import { useState } from 'react';
import { Bell, Plus, Pin, Calendar, Users, Send } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Bell className="text-indigo-600" /> Notice Board & Announcements
          </h1>
          <p className="text-slate-500 text-sm">
            Publish official announcements, fee reminders, and block-wise circulars
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-sm transition"
        >
          <Plus size={18} /> Publish New Notice
        </button>
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 gap-4">
        {notices.map((n) => (
          <div
            key={n._id}
            className={`bg-white rounded-2xl shadow-sm border p-6 transition ${
              n.pinned ? 'border-indigo-200 bg-gradient-to-r from-indigo-50/30 to-white' : 'border-slate-100'
            }`}
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                {n.pinned && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full">
                    <Pin size={12} /> Pinned Circular
                  </span>
                )}
                <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  {n.category}
                </span>
                <span className="text-xs text-indigo-600 font-medium">Audience: {n.audience}</span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar size={13} /> {n.date}
              </div>
            </div>

            <h2 className="text-lg font-bold text-slate-800 mb-2">{n.title}</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{n.body}</p>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div>Issued By: <span className="font-semibold text-slate-700">{n.author}</span></div>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <Send size={12} /> Sent via In-App & SMS Portal
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Publish Official Hostel Notice"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Notice Headline *</label>
              <input
                type="text"
                required
                placeholder="e.g. Wi-Fi Router Upgrades in Block B"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Target Audience</label>
                <select
                  value={form.audience}
                  onChange={(e) => setForm({ ...form, audience: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                >
                  <option value="All Residents">All Hostel Residents</option>
                  <option value="Block A Only">Block A Only (Boys)</option>
                  <option value="Block B Only">Block B Only (Boys)</option>
                  <option value="Girls Wing">Girls Wing Only</option>
                  <option value="Fee Defaulters">Fee Defaulters</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
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
              <label className="block text-xs font-semibold text-slate-600 mb-1">Announcement Body *</label>
              <textarea
                rows={4}
                required
                placeholder="Write the notice details here..."
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="pinNotice"
                checked={form.pinned}
                onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="pinNotice" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Pin this notice to top of resident dashboard
              </label>
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
                Broadcast Notice
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
