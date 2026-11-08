import { useState } from 'react';
import { CalendarCheck, ShieldCheck, Clock, Check, X, AlertTriangle, Plus, UserCheck } from 'lucide-react';
import Modal from '../components/Modal';

export default function Attendance() {
  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance' | 'gatepass'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Attendance Records
  const [attendanceList, setAttendanceList] = useState([
    { _id: '1', name: 'Ali Raza', room: '101', status: 'present', markedAt: '21:30' },
    { _id: '2', name: 'Hamza Tariq', room: '102', status: 'present', markedAt: '21:15' },
    { _id: '3', name: 'Zainab Bibi', room: '201', status: 'on_leave', markedAt: 'Gate Pass #GP-88' },
    { _id: '4', name: 'Bilal Ahmed', room: '204', status: 'absent', markedAt: 'Late Return Alert' },
  ]);

  // Gate Passes / Leave Requests
  const [gatePasses, setGatePasses] = useState([
    {
      _id: 'gp-1',
      passNumber: 'GP-2026-104',
      residentName: 'Ali Raza',
      room: '101',
      departureDate: '2026-11-09 18:00',
      expectedReturn: '2026-11-11 20:00',
      reason: 'Weekend Home Visit (Gujranwala)',
      status: 'approved',
      guardianNotified: true,
    },
    {
      _id: 'gp-2',
      passNumber: 'GP-2026-105',
      residentName: 'Hamza Tariq',
      room: '102',
      departureDate: '2026-11-08 19:30',
      expectedReturn: '2026-11-08 22:30',
      reason: 'University Group Study (Library)',
      status: 'approved',
      guardianNotified: false,
    },
    {
      _id: 'gp-3',
      passNumber: 'GP-2026-106',
      residentName: 'Bilal Ahmed',
      room: '204',
      departureDate: '2026-11-08 20:00',
      expectedReturn: '2026-11-08 22:00',
      reason: 'Medical Pharmacy Visit',
      status: 'pending',
      guardianNotified: true,
    },
  ]);

  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [passForm, setPassForm] = useState({
    residentName: '',
    room: '',
    departureDate: '',
    expectedReturn: '',
    reason: '',
  });

  const toggleStatus = (id, newStatus) => {
    setAttendanceList((prev) =>
      prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
    );
  };

  const handleApprovePass = (id) => {
    setGatePasses((prev) =>
      prev.map((gp) => (gp._id === id ? { ...gp, status: 'approved' } : gp))
    );
  };

  const handleRejectPass = (id) => {
    setGatePasses((prev) =>
      prev.map((gp) => (gp._id === id ? { ...gp, status: 'rejected' } : gp))
    );
  };

  const handleCreatePass = (e) => {
    e.preventDefault();
    const newPass = {
      _id: 'gp-' + Date.now(),
      passNumber: 'GP-2026-' + Math.floor(100 + Math.random() * 900),
      ...passForm,
      status: 'approved',
      guardianNotified: true,
    };
    setGatePasses([newPass, ...gatePasses]);
    setIsPassModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarCheck className="text-indigo-600" /> Attendance & Gate Passes
          </h1>
          <p className="text-slate-500 text-sm">
            Night curfew roll-call, leave approvals, and student gate exit/entry tracking
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'attendance'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Night Roll-Call
          </button>
          <button
            onClick={() => setActiveTab('gatepass')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'gatepass'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Gate Passes & Leaves
          </button>
        </div>
      </div>

      {/* Tab 1: Night Roll Call */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-600">Select Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />
                Present: {attendanceList.filter((a) => a.status === 'present').length}
              </span>
              <span className="flex items-center gap-1.5 text-amber-600">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500 inline-block" />
                On Leave: {attendanceList.filter((a) => a.status === 'on_leave').length}
              </span>
              <span className="flex items-center gap-1.5 text-rose-600">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500 inline-block" />
                Absent: {attendanceList.filter((a) => a.status === 'absent').length}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Resident</th>
                  <th className="px-6 py-4">Room No</th>
                  <th className="px-6 py-4">Log Status</th>
                  <th className="px-6 py-4">Time / Remarks</th>
                  <th className="px-6 py-4 text-right">Mark Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendanceList.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 font-semibold text-slate-800">{item.name}</td>
                    <td className="px-6 py-4 font-mono text-xs text-indigo-600 font-bold">Room {item.room}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                          item.status === 'present'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : item.status === 'on_leave'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{item.markedAt}</td>
                    <td className="px-6 py-4 text-right space-x-1.5">
                      <button
                        onClick={() => toggleStatus(item._id, 'present')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          item.status === 'present'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => toggleStatus(item._id, 'on_leave')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          item.status === 'on_leave'
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                        }`}
                      >
                        Leave
                      </button>
                      <button
                        onClick={() => toggleStatus(item._id, 'absent')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          item.status === 'absent'
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                        }`}
                      >
                        Absent
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Gate Passes */}
      {activeTab === 'gatepass' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setIsPassModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition"
            >
              <Plus size={16} /> Issue Gate Pass
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Pass #</th>
                  <th className="px-6 py-4">Resident</th>
                  <th className="px-6 py-4">Purpose / Destination</th>
                  <th className="px-6 py-4">Departure & Return</th>
                  <th className="px-6 py-4">Guardian SMS</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {gatePasses.map((gp) => (
                  <tr key={gp._id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 font-mono font-bold text-xs text-indigo-600">{gp.passNumber}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{gp.residentName}</div>
                      <div className="text-xs text-slate-400">Room {gp.room}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-700 font-medium">{gp.reason}</td>
                    <td className="px-6 py-4 text-xs space-y-0.5">
                      <div className="text-slate-600">Out: {gp.departureDate}</div>
                      <div className="text-slate-400">Expected: {gp.expectedReturn}</div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {gp.guardianNotified ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <Check size={14} /> Sent
                        </span>
                      ) : (
                        <span className="text-slate-400">Not Sent</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                          gp.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : gp.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {gp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1">
                      {gp.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleApprovePass(gp._id)}
                            className="text-xs bg-emerald-600 text-white px-2.5 py-1 rounded-lg font-semibold hover:bg-emerald-700 transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectPass(gp._id)}
                            className="text-xs bg-rose-600 text-white px-2.5 py-1 rounded-lg font-semibold hover:bg-rose-700 transition"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400">Verified</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for new Gate Pass */}
      {isPassModalOpen && (
        <Modal
          isOpen={isPassModalOpen}
          onClose={() => setIsPassModalOpen(false)}
          title="Issue Student Gate Pass / Leave Request"
        >
          <form onSubmit={handleCreatePass} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Resident Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ali Raza"
                  value={passForm.residentName}
                  onChange={(e) => setPassForm({ ...passForm, residentName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Room No.</label>
                <input
                  type="text"
                  required
                  placeholder="101"
                  value={passForm.room}
                  onChange={(e) => setPassForm({ ...passForm, room: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Departure Time</label>
                <input
                  type="datetime-local"
                  required
                  value={passForm.departureDate}
                  onChange={(e) => setPassForm({ ...passForm, departureDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Expected Return Time</label>
                <input
                  type="datetime-local"
                  required
                  value={passForm.expectedReturn}
                  onChange={(e) => setPassForm({ ...passForm, expectedReturn: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Purpose / Travel Details</label>
              <textarea
                rows={2}
                required
                placeholder="State destination, emergency reason, or weekend home address"
                value={passForm.reason}
                onChange={(e) => setPassForm({ ...passForm, reason: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsPassModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition"
              >
                Issue Pass & Notify Guardian
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
