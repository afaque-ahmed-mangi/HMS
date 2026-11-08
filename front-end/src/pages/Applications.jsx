import { useState } from 'react';
import { ClipboardList, CheckCircle2, XCircle, Clock, User, BedDouble, Search, Filter } from 'lucide-react';
import Modal from '../components/Modal';

export default function Applications() {
  const [applications, setApplications] = useState([
    {
      _id: 'app-1',
      applicantName: 'Muhammad Danyal',
      email: 'danyal@gmail.com',
      phone: '0304-1122334',
      institution: 'FAST-NUCES Lahore',
      degree: 'BS Artificial Intelligence',
      requestedRoomType: 'Double Sharing (AC)',
      submissionDate: '2026-11-06',
      status: 'under_review',
      cnic: '35202-9988771-1',
      guardianPhone: '0300-8877665',
    },
    {
      _id: 'app-2',
      applicantName: 'Khadija Fatima',
      email: 'khadija.f@gmail.com',
      phone: '0331-5566778',
      institution: 'KEMU Medical College',
      degree: 'MBBS 2nd Year',
      requestedRoomType: 'Single Room',
      submissionDate: '2026-11-07',
      status: 'submitted',
      cnic: '35201-1122334-4',
      guardianPhone: '0333-4455667',
    },
    {
      _id: 'app-3',
      applicantName: 'Saad Aslam',
      email: 'saad.a@gmail.com',
      phone: '0321-7788990',
      institution: 'LUMS',
      degree: 'BSc Economics',
      requestedRoomType: 'Triple Sharing',
      submissionDate: '2026-11-04',
      status: 'approved',
      cnic: '38403-4455667-3',
      guardianPhone: '0321-1122334',
    },
    {
      _id: 'app-4',
      applicantName: 'Zohaib Hassan',
      email: 'zohaib.h@gmail.com',
      phone: '0315-9988112',
      institution: 'UET Lahore',
      degree: 'BSc Mechanical Eng',
      requestedRoomType: 'Double Sharing',
      submissionDate: '2026-10-30',
      status: 'allocated',
      cnic: '35202-6677889-9',
      guardianPhone: '0315-2233445',
    },
  ]);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);

  const handleStatusChange = (id, newStatus) => {
    setApplications((prev) =>
      prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a))
    );
    if (selectedApp?._id === id) {
      setSelectedApp((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const filtered = applications.filter((a) => {
    const matchSearch =
      a.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      a.institution.toLowerCase().includes(search.toLowerCase()) ||
      a.cnic.includes(search);
    const matchFilter = filter === 'all' || a.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList className="text-indigo-600" /> Admission Applications
          </h1>
          <p className="text-slate-500 text-sm">
            Review online student applications, verify documents, and allocate beds
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-xs uppercase font-bold text-slate-400">Total Applied</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{applications.length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-xs uppercase font-bold text-amber-500">Under Review</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {applications.filter((a) => a.status === 'under_review' || a.status === 'submitted').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-xs uppercase font-bold text-emerald-500">Approved</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {applications.filter((a) => a.status === 'approved').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-xs uppercase font-bold text-indigo-500">Bed Allocated</div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">
            {applications.filter((a) => a.status === 'allocated').length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex-1 min-w-[260px]">
          <input
            type="text"
            placeholder="Search by student name, CNIC, college..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="all">All Stages</option>
          <option value="submitted">New Submitted</option>
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="allocated">Allocated</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Institution & Program</th>
                <th className="px-6 py-4">Room Preference</th>
                <th className="px-6 py-4">Applied Date</th>
                <th className="px-6 py-4">Workflow Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((a) => (
                <tr key={a._id} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{a.applicantName}</div>
                    <div className="text-xs text-slate-400">{a.email} • {a.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-700 text-xs">{a.institution}</div>
                    <div className="text-xs text-slate-400">{a.degree}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-medium text-xs">
                      {a.requestedRoomType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">{a.submissionDate}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                        a.status === 'allocated'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : a.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : a.status === 'under_review'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : a.status === 'rejected'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {a.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedApp(a)}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-medium transition"
                    >
                      Review
                    </button>
                    {a.status === 'under_review' || a.status === 'submitted' ? (
                      <button
                        onClick={() => handleStatusChange(a._id, 'approved')}
                        className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-medium transition shadow-xs"
                      >
                        Approve
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Admission Application - ${selectedApp.applicantName}`}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl">
              <div>
                <span className="text-slate-400">CNIC / ID:</span>
                <div className="font-semibold text-slate-700 mt-0.5">{selectedApp.cnic}</div>
              </div>
              <div>
                <span className="text-slate-400">Phone:</span>
                <div className="font-semibold text-slate-700 mt-0.5">{selectedApp.phone}</div>
              </div>
              <div>
                <span className="text-slate-400">University:</span>
                <div className="font-semibold text-slate-700 mt-0.5">{selectedApp.institution}</div>
              </div>
              <div>
                <span className="text-slate-400">Guardian Phone:</span>
                <div className="font-semibold text-slate-700 mt-0.5">{selectedApp.guardianPhone}</div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Change Application Stage:</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleStatusChange(selectedApp._id, 'under_review')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    selectedApp.status === 'under_review' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Under Review
                </button>
                <button
                  onClick={() => handleStatusChange(selectedApp._id, 'approved')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    selectedApp.status === 'approved' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Approve Application
                </button>
                <button
                  onClick={() => handleStatusChange(selectedApp._id, 'allocated')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    selectedApp.status === 'allocated' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Allocate Room & Bed
                </button>
                <button
                  onClick={() => handleStatusChange(selectedApp._id, 'rejected')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    selectedApp.status === 'rejected' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Reject
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
