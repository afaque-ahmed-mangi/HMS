import { useState } from 'react';
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  BedDouble,
  Search,
  Filter,
  GraduationCap,
  ShieldCheck,
  Check,
  Sparkles
} from 'lucide-react';
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
    <div className="space-y-6 pb-8">
      {/* 3D Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-[0_8px_16px_rgba(79,70,229,0.35)] transform-gpu hover:rotate-6 transition">
            <ClipboardList size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              Admission Applications
              <span className="pill-3d bg-indigo-50 text-indigo-700 text-xs px-2.5 py-0.5 border border-indigo-200">
                3D Admissions Funnel
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review online student applications, verify credentials, and allocate beds
            </p>
          </div>
        </div>
      </div>

      {/* 3D Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-depth-3d p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase font-bold text-slate-400">Total Pipeline</div>
            <div className="text-2xl font-black text-slate-800 mt-1">{applications.length}</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            📥
          </div>
        </div>

        <div className="card-depth-3d p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase font-bold text-amber-500">Under Review</div>
            <div className="text-2xl font-black text-amber-600 mt-1">
              {applications.filter((a) => a.status === 'under_review' || a.status === 'submitted').length}
            </div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            🔍
          </div>
        </div>

        <div className="card-depth-3d p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase font-bold text-emerald-500">Approved</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {applications.filter((a) => a.status === 'approved').length}
            </div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            ✓
          </div>
        </div>

        <div className="card-depth-3d p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase font-bold text-indigo-500">Beds Allocated</div>
            <div className="text-2xl font-black text-indigo-600 mt-1">
              {applications.filter((a) => a.status === 'allocated').length}
            </div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            🛏
          </div>
        </div>
      </div>

      {/* 3D Search & Stage Filter */}
      <div className="card-depth-3d p-3 rounded-2xl flex flex-wrap gap-3 items-center justify-between bg-slate-50/60">
        <div className="flex-1 min-w-[260px] relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search applicant name, college, or CNIC..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs font-semibold shadow-xs"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-white px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-xs"
        >
          <option value="all">All Admissions Stages</option>
          <option value="submitted">New Submitted</option>
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="allocated">Bed Allocated</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* 3D Applications Table */}
      <div className="card-depth-3d overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-100/70 text-slate-700 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-4">Applicant Profile</th>
                <th className="px-6 py-4">Institution & Program</th>
                <th className="px-6 py-4">Room Preference</th>
                <th className="px-6 py-4">Applied Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((a) => (
                <tr key={a._id} className="hover:bg-indigo-50/30 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{a.applicantName}</div>
                    <div className="text-xs text-slate-400 font-medium">
                      {a.email} • {a.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-700 text-xs">{a.institution}</div>
                    <div className="text-xs text-slate-400 font-medium">{a.degree}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="pill-3d px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-200">
                      {a.requestedRoomType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-medium">{a.submissionDate}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`pill-3d px-2.5 py-0.5 text-xs font-bold capitalize ${
                        a.status === 'allocated'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : a.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : a.status === 'under_review'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : a.status === 'rejected'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {a.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-1.5">
                    <button
                      onClick={() => setSelectedApp(a)}
                      className="btn-3d btn-3d-slate text-xs px-3 py-1 font-bold"
                    >
                      Review
                    </button>
                    {(a.status === 'under_review' || a.status === 'submitted') && (
                      <button
                        onClick={() => handleStatusChange(a._id, 'approved')}
                        className="btn-3d btn-3d-emerald text-xs px-3 py-1 font-bold"
                      >
                        ✓ Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3D Review Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Admission Application Dossier • ${selectedApp.applicantName}`}
        >
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-slate-50 to-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center justify-between">
              <div>
                <p className="text-base font-black text-slate-800">{selectedApp.applicantName}</p>
                <p className="text-xs text-slate-500 font-mono mt-0.5">CNIC: {selectedApp.cnic}</p>
                <p className="text-xs text-indigo-600 font-semibold">{selectedApp.institution} — {selectedApp.degree}</p>
              </div>
              <span className="pill-3d px-3 py-1 text-xs font-black uppercase bg-indigo-100 text-indigo-800 border border-indigo-200">
                {selectedApp.status.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3 rounded-xl border border-slate-200">
              <div>
                <p className="text-slate-400 font-medium">Student Mobile</p>
                <p className="font-bold text-slate-800">{selectedApp.phone}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Guardian Contact</p>
                <p className="font-bold text-slate-800">{selectedApp.guardianPhone}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Preferred Room</p>
                <p className="font-bold text-indigo-600">{selectedApp.requestedRoomType}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Applied Date</p>
                <p className="font-bold text-slate-800">{selectedApp.submissionDate}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => handleStatusChange(selectedApp._id, 'rejected')}
                className="btn-3d btn-3d-rose text-xs px-3.5 py-2 font-bold"
              >
                Reject Application
              </button>
              <div className="space-x-2">
                <button
                  onClick={() => handleStatusChange(selectedApp._id, 'under_review')}
                  className="btn-3d btn-3d-amber text-xs px-3.5 py-2 font-bold"
                >
                  Mark Under Review
                </button>
                <button
                  onClick={() => handleStatusChange(selectedApp._id, 'approved')}
                  className="btn-3d btn-3d-emerald text-xs px-4 py-2 font-bold"
                >
                  ✓ Approve & Offer Bed
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
