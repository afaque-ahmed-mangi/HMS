import { useState } from 'react';
import {
  CalendarCheck,
  ShieldCheck,
  Clock,
  Check,
  X,
  AlertTriangle,
  Plus,
  UserCheck,
  QrCode,
  Send,
  Calendar,
  Sparkles
} from 'lucide-react';
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
    { _id: '5', name: 'Saad Malik', room: '301', status: 'present', markedAt: '21:40' },
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
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              status: newStatus,
              markedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : item
      )
    );
  };

  const handleApprovePass = (id) => {
    setGatePasses((prev) =>
      prev.map((gp) => (gp._id === id ? { ...gp, status: 'approved', guardianNotified: true } : gp))
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

  const counts = {
    present: attendanceList.filter((a) => a.status === 'present').length,
    on_leave: attendanceList.filter((a) => a.status === 'on_leave').length,
    absent: attendanceList.filter((a) => a.status === 'absent').length,
    activePasses: gatePasses.filter((g) => g.status === 'approved').length,
  };

  return (
    <div className="space-y-6 pb-8">
      {/* 3D Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center shadow-[0_8px_16px_rgba(16,185,129,0.35)] transform-gpu hover:rotate-6 transition">
            <CalendarCheck size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              Attendance & Gate Passes
              <span className="pill-3d bg-emerald-50 text-emerald-700 text-xs px-2.5 py-0.5 border border-emerald-200">
                3D Curfew Log
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Night curfew roll-call, leave approvals, and student gate exit/entry tracking
            </p>
          </div>
        </div>

        {/* 3D Tab Switcher */}
        <div className="flex items-center p-1 bg-white rounded-2xl border border-slate-200/80 shadow-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`pill-3d px-4 py-2 text-xs font-bold transition ${
              activeTab === 'attendance'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-[0_4px_12px_rgba(79,70,229,0.35)]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Night Roll-Call
          </button>
          <button
            onClick={() => setActiveTab('gatepass')}
            className={`pill-3d px-4 py-2 text-xs font-bold transition ${
              activeTab === 'gatepass'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-[0_4px_12px_rgba(79,70,229,0.35)]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Gate Passes & Leaves
          </button>
        </div>
      </div>

      {/* 3D KPI Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card-depth-3d p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Present Tonight</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{counts.present}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            ✓
          </div>
        </div>

        <div className="card-depth-3d p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">On Official Leave</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{counts.on_leave}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            🌴
          </div>
        </div>

        <div className="card-depth-3d p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Curfew Absent</p>
            <p className="text-2xl font-black text-rose-600 mt-1">{counts.absent}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            ⚠
          </div>
        </div>

        <div className="card-depth-3d p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Approved Passes</p>
            <p className="text-2xl font-black text-indigo-600 mt-1">{counts.activePasses}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            🎫
          </div>
        </div>
      </div>

      {/* Tab 1: Night Roll Call */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="card-depth-3d p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 bg-slate-50/60">
            <div className="flex items-center gap-3">
              <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <Calendar size={15} className="text-indigo-600" />
                Roll-Call Date:
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="pill-3d bg-indigo-50 text-indigo-700 text-xs px-3 py-1 font-bold border border-indigo-200">
                Night Roll-Call Curfew: 22:00 PKT
              </span>
            </div>
          </div>

          <div className="card-depth-3d overflow-hidden">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-100/70 text-slate-700 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200/80">
                <tr>
                  <th className="px-6 py-4">Resident</th>
                  <th className="px-6 py-4">Room No</th>
                  <th className="px-6 py-4">Log Status</th>
                  <th className="px-6 py-4">Time / Remarks</th>
                  <th className="px-6 py-4 text-right">3D Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendanceList.map((item) => (
                  <tr key={item._id} className="hover:bg-indigo-50/30 transition">
                    <td className="px-6 py-4 font-bold text-slate-800">{item.name}</td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                        Room {item.room}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`pill-3d px-2.5 py-0.5 text-xs font-bold capitalize ${
                          item.status === 'present'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : item.status === 'on_leave'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                        }`}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-medium">{item.markedAt}</td>
                    <td className="px-6 py-4 text-right space-x-1.5">
                      <button
                        onClick={() => toggleStatus(item._id, 'present')}
                        className={`btn-3d text-xs px-2.5 py-1 ${
                          item.status === 'present' ? 'btn-3d-emerald ring-2 ring-emerald-300' : 'btn-3d-slate'
                        }`}
                      >
                        ✓ Present
                      </button>
                      <button
                        onClick={() => toggleStatus(item._id, 'on_leave')}
                        className={`btn-3d text-xs px-2.5 py-1 ${
                          item.status === 'on_leave' ? 'btn-3d-amber ring-2 ring-amber-300' : 'btn-3d-slate'
                        }`}
                      >
                        Leave
                      </button>
                      <button
                        onClick={() => toggleStatus(item._id, 'absent')}
                        className={`btn-3d text-xs px-2.5 py-1 ${
                          item.status === 'absent' ? 'btn-3d-rose ring-2 ring-rose-300' : 'btn-3d-slate'
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
          <div className="flex justify-between items-center">
            <p className="text-xs text-slate-500 font-medium">
              Real-time gatekeeper departures and guardian automated alerts
            </p>
            <button
              onClick={() => setIsPassModalOpen(true)}
              className="btn-3d btn-3d-indigo text-xs px-4 py-2 flex items-center gap-1.5"
            >
              <Plus size={15} /> Issue Gate Pass
            </button>
          </div>

          <div className="card-depth-3d overflow-hidden">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-100/70 text-slate-700 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200/80">
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
                  <tr key={gp._id} className="hover:bg-indigo-50/30 transition">
                    <td className="px-6 py-4 font-mono font-bold text-xs text-indigo-600">
                      <span className="bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                        {gp.passNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{gp.residentName}</div>
                      <div className="text-xs text-slate-400">Room {gp.room}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-700 font-semibold">{gp.reason}</td>
                    <td className="px-6 py-4 text-xs space-y-0.5">
                      <div className="text-slate-700 font-medium">Out: {gp.departureDate}</div>
                      <div className="text-slate-400">Return: {gp.expectedReturn}</div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {gp.guardianNotified ? (
                        <span className="pill-3d bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[11px] font-bold flex items-center gap-1 w-fit">
                          <Check size={12} /> Dispatched
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Unsent</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`pill-3d px-2.5 py-0.5 text-xs font-bold capitalize ${
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
                    <td className="px-6 py-4 text-right space-x-1.5">
                      {gp.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleApprovePass(gp._id)}
                            className="btn-3d btn-3d-emerald text-xs px-2.5 py-1"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectPass(gp._id)}
                            className="btn-3d btn-3d-rose text-xs px-2.5 py-1"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="pill-3d bg-slate-100 text-slate-600 text-xs px-2 py-0.5 font-bold border border-slate-200">
                          Verified
                        </span>
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
          title="Issue Student Gate Pass & Curfew Leave"
        >
          <form onSubmit={handleCreatePass} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Resident Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ali Raza"
                  value={passForm.residentName}
                  onChange={(e) => setPassForm({ ...passForm, residentName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Room No.</label>
                <input
                  type="text"
                  required
                  placeholder="101"
                  value={passForm.room}
                  onChange={(e) => setPassForm({ ...passForm, room: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Departure Time</label>
                <input
                  type="datetime-local"
                  required
                  value={passForm.departureDate}
                  onChange={(e) => setPassForm({ ...passForm, departureDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Expected Return Time</label>
                <input
                  type="datetime-local"
                  required
                  value={passForm.expectedReturn}
                  onChange={(e) => setPassForm({ ...passForm, expectedReturn: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Purpose / Travel Details</label>
              <textarea
                rows={2}
                required
                placeholder="State destination, emergency reason, or weekend home address"
                value={passForm.reason}
                onChange={(e) => setPassForm({ ...passForm, reason: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsPassModalOpen(false)}
                className="btn-3d btn-3d-slate px-4 py-2 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-3d btn-3d-indigo px-5 py-2 text-xs flex items-center gap-1.5"
              >
                <Send size={14} /> Issue Pass & Send SMS
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
