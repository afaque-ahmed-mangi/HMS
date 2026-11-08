import { useState, useEffect } from 'react';
import { getResidents, createResident, updateResident, deleteResident, getRooms } from '../api';
import Modal from '../components/Modal';
import {
  Users,
  UserPlus,
  Phone,
  Mail,
  BedDouble,
  Trash2,
  Edit,
  User,
  GraduationCap,
  Shield,
  FileText,
  Upload,
  CheckCircle,
  Building,
  HeartPulse,
} from 'lucide-react';

export default function Residents() {
  const [residents, setResidents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Form Tab State: 'personal' | 'academic' | 'guardian' | 'allocation' | 'documents'
  const [activeTab, setActiveTab] = useState('personal');

  const initialForm = {
    // 1. Personal Tab
    name: '',
    email: '',
    phone: '',
    cnic: '',
    dob: '',
    gender: 'Male',
    bloodGroup: 'B+',
    medicalNotes: '',

    // 2. Academic / Institution Tab
    institution: '',
    department: '',
    degree: 'BS Computer Science',
    rollNumber: '',
    semester: '4th Semester',
    city: 'Lahore',

    // 3. Guardian & Emergency Tab
    guardianName: '',
    guardianRelation: 'Father',
    guardianPhone: '',
    guardianCnic: '',
    emergencyContact: '',
    permanentAddress: '',

    // 4. Room & Bed Allocation Tab
    hostel: 'Sunrise Main Hostel',
    block: 'Block A',
    roomType: 'Double Sharing',
    roomId: '',
    roomNo: '101',
    bedNo: 'Bed 1',
    admissionDate: new Date().toISOString().split('T')[0],
    securityDeposit: '20000',
    status: 'active',

    // 5. Documents Tab
    cnicUploaded: true,
    studentIdUploaded: true,
    photoUploaded: true,
    admissionLetterUploaded: false,
  };

  const [form, setForm] = useState(initialForm);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resRes, resRooms] = await Promise.allSettled([getResidents(), getRooms()]);
      if (resRes.status === 'fulfilled' && resRes.value?.data?.data && resRes.value.data.data.length > 0) {
        setResidents(resRes.value.data.data);
      } else {
        // Full rich demo data matching architecture proposal
        setResidents([
          {
            _id: '1',
            name: 'Ali Raza',
            email: 'ali.raza@example.com',
            phone: '0300-1234567',
            cnic: '35201-1234567-1',
            institution: 'FAST-NUCES Lahore',
            degree: 'BS Computer Science',
            rollNumber: '22L-4589',
            guardianName: 'Muhammad Raza',
            guardianPhone: '0300-7654321',
            guardianRelation: 'Father',
            permanentAddress: 'House 42, Model Town, Gujranwala',
            room: { roomNumber: '101', block: 'Block A', bed: 'Bed 1' },
            status: 'active',
            joinedDate: '2026-01-10',
          },
          {
            _id: '2',
            name: 'Hamza Tariq',
            email: 'hamza.tariq@example.com',
            phone: '0312-9876543',
            cnic: '35202-7654321-3',
            institution: 'PUCIT New Campus',
            degree: 'BS Software Engineering',
            rollNumber: 'BCSF21M012',
            guardianName: 'Tariq Mehmood',
            guardianPhone: '0313-1122334',
            guardianRelation: 'Father',
            permanentAddress: 'Street 5, Satellite Town, Rawalpindi',
            room: { roomNumber: '102', block: 'Block A', bed: 'Bed 2' },
            status: 'active',
            joinedDate: '2026-02-01',
          },
          {
            _id: '3',
            name: 'Zainab Bibi',
            email: 'zainab@example.com',
            phone: '0333-5566778',
            cnic: '35201-9988776-2',
            institution: 'KEMU Medical College',
            degree: 'MBBS 3rd Year',
            rollNumber: 'KM-2023-88',
            guardianName: 'Abdul Rehman',
            guardianPhone: '0334-9988776',
            guardianRelation: 'Father',
            permanentAddress: 'Gulberg Greens, Islamabad',
            room: { roomNumber: '201', block: 'Block B (Girls)', bed: 'Bed 1' },
            status: 'active',
            joinedDate: '2026-02-15',
          },
          {
            _id: '4',
            name: 'Bilal Ahmed',
            email: 'bilal.ahmed@example.com',
            phone: '0321-4433221',
            cnic: '38403-1289345-5',
            institution: 'UET Lahore',
            degree: 'BSc Electrical Eng',
            rollNumber: '2022-EE-104',
            guardianName: 'Ahmed Din',
            guardianPhone: '0321-9988112',
            guardianRelation: 'Father',
            permanentAddress: 'Chak 45, Sargodha',
            room: { roomNumber: '204', block: 'Block A', bed: 'Bed 2' },
            status: 'active',
            joinedDate: '2026-03-01',
          },
        ]);
      }

      if (resRooms.status === 'fulfilled' && resRooms.value?.data?.data) {
        setRooms(resRooms.value.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (resident = null) => {
    setActiveTab('personal');
    if (resident) {
      setSelectedResident(resident);
      setForm({
        ...initialForm,
        name: resident.name || '',
        email: resident.email || '',
        phone: resident.phone || '',
        cnic: resident.cnic || '',
        institution: resident.institution || 'FAST-NUCES Lahore',
        degree: resident.degree || 'BS Computer Science',
        rollNumber: resident.rollNumber || '',
        guardianName: resident.guardianName || '',
        guardianPhone: resident.guardianPhone || '',
        guardianRelation: resident.guardianRelation || 'Father',
        permanentAddress: resident.permanentAddress || '',
        roomNo: resident.room?.roomNumber || '101',
        block: resident.room?.block || 'Block A',
        bedNo: resident.room?.bed || 'Bed 1',
        status: resident.status || 'active',
      });
    } else {
      setSelectedResident(null);
      setForm(initialForm);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedResident) {
        await updateResident(selectedResident._id, form);
      } else {
        await createResident(form);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      // Local fallback save
      if (selectedResident) {
        setResidents((prev) =>
          prev.map((r) =>
            r._id === selectedResident._id
              ? {
                  ...r,
                  ...form,
                  room: { roomNumber: form.roomNo, block: form.block, bed: form.bedNo },
                }
              : r
          )
        );
      } else {
        const newRes = {
          _id: 'res-' + Date.now(),
          ...form,
          room: { roomNumber: form.roomNo, block: form.block, bed: form.bedNo },
          joinedDate: new Date().toISOString().split('T')[0],
        };
        setResidents([newRes, ...residents]);
      }
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this resident?')) return;
    try {
      await deleteResident(id);
      fetchData();
    } catch (err) {
      setResidents((prev) => prev.filter((r) => r._id !== id));
    }
  };

  const filtered = residents.filter((r) => {
    const matchSearch =
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.phone?.includes(search) ||
      r.cnic?.includes(search) ||
      r.institution?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-indigo-600" /> Residents Directory
          </h1>
          <p className="text-slate-500 text-sm">
            Complete student lifecycle: Application, admission, bed allocation, and profile records
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-sm transition"
        >
          <UserPlus size={18} /> Add New Resident
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex-1 min-w-[260px]">
          <input
            type="text"
            placeholder="Search by name, CNIC, phone, university..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Residents</option>
            <option value="pending">Under Review</option>
            <option value="checked-out">Checked Out</option>
          </select>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Student Profile</th>
                <th className="px-6 py-4">Institution / College</th>
                <th className="px-6 py-4">CNIC & Contact</th>
                <th className="px-6 py-4">Room & Bed</th>
                <th className="px-6 py-4">Guardian Details</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => (
                <tr key={r._id} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center">
                        {r.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{r.name}</div>
                        <div className="text-xs text-slate-400">{r.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800 text-xs flex items-center gap-1">
                      <GraduationCap size={13} className="text-indigo-600" /> {r.institution || 'University'}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {r.degree || 'Degree'} {r.rollNumber ? `• ${r.rollNumber}` : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 space-y-1">
                    <div className="text-xs font-mono font-medium text-slate-700">{r.cnic || 'N/A'}</div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Phone size={12} /> {r.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-medium text-xs">
                      <BedDouble size={14} />
                      {r.room
                        ? `Room ${r.room.roomNumber || '101'} - ${r.room.block || 'Block A'} (${r.room.bed || 'Bed 1'})`
                        : 'Unassigned'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <div className="font-semibold text-slate-700">{r.guardianName || 'N/A'}</div>
                    <div className="text-slate-400">{r.guardianPhone || ''}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                        r.status === 'active'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : r.status === 'pending'
                          ? 'bg-amber-50 text-amber-600 border border-amber-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {r.status || 'active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-1">
                    <button
                      onClick={() => handleOpenModal(r)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-indigo-600 transition"
                      title="Edit Resident"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-slate-600 hover:text-red-600 transition"
                      title="Delete Resident"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    No residents found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-Tab Add/Edit Resident Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedResident ? `Edit Resident - ${selectedResident.name}` : 'Resident Admission & Registration'}
        >
          <div className="space-y-5">
            {/* Modal Tabs Header */}
            <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('personal')}
                className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                  activeTab === 'personal'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <User size={15} /> 1. Personal Info
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('academic')}
                className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                  activeTab === 'academic'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <GraduationCap size={15} /> 2. Academic / University
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('guardian')}
                className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                  activeTab === 'guardian'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Shield size={15} /> 3. Guardian & Emergency
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('allocation')}
                className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                  activeTab === 'allocation'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <BedDouble size={15} /> 4. Room & Bed Allocation
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('documents')}
                className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                  activeTab === 'documents'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <FileText size={15} /> 5. Document Uploads
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* TAB 1: PERSONAL INFO */}
              {activeTab === 'personal' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ali Raza"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="ali.raza@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Mobile Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="0300-1234567"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">CNIC / B-Form Number *</label>
                      <input
                        type="text"
                        required
                        placeholder="35201-1234567-1"
                        value={form.cnic}
                        onChange={(e) => setForm({ ...form, cnic: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={form.dob}
                        onChange={(e) => setForm({ ...form, dob: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Gender</label>
                      <select
                        value={form.gender}
                        onChange={(e) => setForm({ ...form, gender: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Blood Group</label>
                      <select
                        value={form.bloodGroup}
                        onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Medical Notes / Allergies (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Asthmatic, Dust allergy, None"
                      value={form.medicalNotes}
                      onChange={(e) => setForm({ ...form, medicalNotes: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: ACADEMIC / INSTITUTION */}
              {activeTab === 'academic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">University / College *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. FAST-NUCES, UET, LUMS, PUCIT"
                        value={form.institution}
                        onChange={(e) => setForm({ ...form, institution: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Department / Faculty</label>
                      <input
                        type="text"
                        placeholder="e.g. Computer Science & IT"
                        value={form.department}
                        onChange={(e) => setForm({ ...form, department: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Degree Program</label>
                      <input
                        type="text"
                        placeholder="e.g. BS Computer Science, BBA, MBBS"
                        value={form.degree}
                        onChange={(e) => setForm({ ...form, degree: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Student Roll / Reg No.</label>
                      <input
                        type="text"
                        placeholder="e.g. 22L-4589"
                        value={form.rollNumber}
                        onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Current Semester / Year</label>
                      <select
                        value={form.semester}
                        onChange={(e) => setForm({ ...form, semester: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      >
                        <option value="1st Semester">1st Semester</option>
                        <option value="2nd Semester">2nd Semester</option>
                        <option value="3rd Semester">3rd Semester</option>
                        <option value="4th Semester">4th Semester</option>
                        <option value="5th Semester">5th Semester</option>
                        <option value="6th Semester">6th Semester</option>
                        <option value="7th Semester">7th Semester</option>
                        <option value="8th Semester">8th Semester</option>
                        <option value="Postgraduate">Postgraduate</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Home Town / City</label>
                      <input
                        type="text"
                        placeholder="e.g. Faisalabad, Gujranwala, Multan"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: GUARDIAN & EMERGENCY */}
              {activeTab === 'guardian' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Guardian Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Muhammad Raza"
                        value={form.guardianName}
                        onChange={(e) => setForm({ ...form, guardianName: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Relationship</label>
                      <select
                        value={form.guardianRelation}
                        onChange={(e) => setForm({ ...form, guardianRelation: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      >
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Brother">Brother</option>
                        <option value="Uncle">Uncle</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Guardian Phone *</label>
                      <input
                        type="tel"
                        required
                        placeholder="0300-7654321"
                        value={form.guardianPhone}
                        onChange={(e) => setForm({ ...form, guardianPhone: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Guardian CNIC</label>
                      <input
                        type="text"
                        placeholder="35201-xxxxxxx-x"
                        value={form.guardianCnic}
                        onChange={(e) => setForm({ ...form, guardianCnic: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Alternative Emergency Contact
                      </label>
                      <input
                        type="tel"
                        placeholder="0312-xxxxxxx"
                        value={form.emergencyContact}
                        onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Permanent Home Address *</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="House No, Street, Mohallah / Sector, Tehsil & District"
                      value={form.permanentAddress}
                      onChange={(e) => setForm({ ...form, permanentAddress: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: ROOM & BED ALLOCATION */}
              {activeTab === 'allocation' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Hostel Branch</label>
                      <select
                        value={form.hostel}
                        onChange={(e) => setForm({ ...form, hostel: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      >
                        <option value="Sunrise Main Hostel">Sunrise Main Hostel</option>
                        <option value="Sunrise Girls Wing">Sunrise Girls Wing</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Hostel Block</label>
                      <select
                        value={form.block}
                        onChange={(e) => setForm({ ...form, block: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      >
                        <option value="Block A">Block A (Boys - Ground Floor)</option>
                        <option value="Block B">Block B (Boys - 1st Floor)</option>
                        <option value="Block C">Block C (Girls Wing)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Room Type</label>
                      <select
                        value={form.roomType}
                        onChange={(e) => setForm({ ...form, roomType: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      >
                        <option value="Single Room (AC Attached)">Single Room (AC Attached)</option>
                        <option value="Double Sharing">Double Sharing</option>
                        <option value="Triple Sharing">Triple Sharing</option>
                        <option value="Dormitory (4 Bed)">Dormitory (4 Bed)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Room Number *</label>
                      <input
                        type="text"
                        required
                        placeholder="101"
                        value={form.roomNo}
                        onChange={(e) => setForm({ ...form, roomNo: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Bed Number</label>
                      <select
                        value={form.bedNo}
                        onChange={(e) => setForm({ ...form, bedNo: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      >
                        <option value="Bed 1">Bed 1 (Window Side)</option>
                        <option value="Bed 2">Bed 2 (Door Side)</option>
                        <option value="Bed 3">Bed 3</option>
                        <option value="Bed 4">Bed 4</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Admission Date</label>
                      <input
                        type="date"
                        value={form.admissionDate}
                        onChange={(e) => setForm({ ...form, admissionDate: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Refundable Security Deposit (PKR)
                      </label>
                      <input
                        type="number"
                        value={form.securityDeposit}
                        onChange={(e) => setForm({ ...form, securityDeposit: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Resident Lifecycle Status</label>
                      <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      >
                        <option value="active">Active (Checked In)</option>
                        <option value="pending">Under Review / Applied</option>
                        <option value="checked-out">Checked Out / Alumni</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: DOCUMENT UPLOADS */}
              {activeTab === 'documents' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500">
                    Hostel policies require verified identity documents before check-in. Upload or verify files below:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-dashed border-slate-300 rounded-xl p-4 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <FileText size={20} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-700">CNIC / B-Form Front & Back</div>
                          <div className="text-[11px] text-emerald-600 flex items-center gap-1 mt-0.5">
                            <CheckCircle size={12} /> Document Verified (PDF)
                          </div>
                        </div>
                      </div>
                      <Upload size={16} className="text-slate-400" />
                    </div>

                    <div className="border border-dashed border-slate-300 rounded-xl p-4 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <GraduationCap size={20} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-700">Student ID Card / Fee Slip</div>
                          <div className="text-[11px] text-emerald-600 flex items-center gap-1 mt-0.5">
                            <CheckCircle size={12} /> Verified (JPG, 2.1 MB)
                          </div>
                        </div>
                      </div>
                      <Upload size={16} className="text-slate-400" />
                    </div>

                    <div className="border border-dashed border-slate-300 rounded-xl p-4 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <User size={20} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-700">Passport Size Photograph</div>
                          <div className="text-[11px] text-emerald-600 flex items-center gap-1 mt-0.5">
                            <CheckCircle size={12} /> Uploaded (PNG)
                          </div>
                        </div>
                      </div>
                      <Upload size={16} className="text-slate-400" />
                    </div>

                    <div className="border border-dashed border-slate-300 rounded-xl p-4 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                          <Shield size={20} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-700">Guardian Undertaking Form</div>
                          <div className="text-[11px] text-amber-600 flex items-center gap-1 mt-0.5">
                            Pending Signed Copy
                          </div>
                        </div>
                      </div>
                      <Upload size={16} className="text-slate-400" />
                    </div>
                  </div>
                </div>
              )}

              {/* Form Navigation & Submit Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex gap-2">
                  {activeTab !== 'personal' && (
                    <button
                      type="button"
                      onClick={() => {
                        const tabs = ['personal', 'academic', 'guardian', 'allocation', 'documents'];
                        const idx = tabs.indexOf(activeTab);
                        if (idx > 0) setActiveTab(tabs[idx - 1]);
                      }}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                    >
                      ← Previous Tab
                    </button>
                  )}
                  {activeTab !== 'documents' && (
                    <button
                      type="button"
                      onClick={() => {
                        const tabs = ['personal', 'academic', 'guardian', 'allocation', 'documents'];
                        const idx = tabs.indexOf(activeTab);
                        if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1]);
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition"
                    >
                      Next Tab →
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-sm font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition shadow-sm"
                  >
                    {selectedResident ? 'Save Changes' : 'Confirm Admission'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}
