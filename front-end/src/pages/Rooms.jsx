import { useState, useEffect } from 'react';
import { getRooms, createRoom, updateRoom, deleteRoom } from '../api';
import Modal from '../components/Modal';
import {
  BedDouble,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Layers,
  Sparkles,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldAlert
} from 'lucide-react';

const statusStyles = {
  available: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 shadow-[0_2px_8px_rgba(16,185,129,0.15)]',
    dot: 'bg-emerald-500',
    border: 'border-t-4 border-t-emerald-500',
    lightBg: 'from-emerald-50/50 to-white',
  },
  occupied: {
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200/80 shadow-[0_2px_8px_rgba(99,102,241,0.15)]',
    dot: 'bg-indigo-500',
    border: 'border-t-4 border-t-indigo-500',
    lightBg: 'from-indigo-50/50 to-white',
  },
  maintenance: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200/80 shadow-[0_2px_8px_rgba(245,158,11,0.15)]',
    dot: 'bg-amber-500',
    border: 'border-t-4 border-t-amber-500',
    lightBg: 'from-amber-50/50 to-white',
  },
  reserved: {
    badge: 'bg-purple-50 text-purple-700 border-purple-200/80 shadow-[0_2px_8px_rgba(168,85,247,0.15)]',
    dot: 'bg-purple-500',
    border: 'border-t-4 border-t-purple-500',
    lightBg: 'from-purple-50/50 to-white',
  },
};

const demoRooms = [
  { _id: '1', roomNumber: '101', floor: 1, type: 'single', capacity: 1, status: 'available', rent: 8000, block: 'Block A' },
  { _id: '2', roomNumber: '102', floor: 1, type: 'double', capacity: 2, status: 'occupied', rent: 12000, occupants: ['Ahmed Khan'], block: 'Block A' },
  { _id: '3', roomNumber: '103', floor: 1, type: 'triple', capacity: 3, status: 'occupied', rent: 15000, occupants: ['Usman Ali', 'Bilal Ahmed'], block: 'Block A' },
  { _id: '4', roomNumber: '104', floor: 1, type: 'single', capacity: 1, status: 'maintenance', rent: 8000, block: 'Block A' },
  { _id: '5', roomNumber: '201', floor: 2, type: 'double', capacity: 2, status: 'available', rent: 12000, block: 'Block B' },
  { _id: '6', roomNumber: '202', floor: 2, type: 'single', capacity: 1, status: 'reserved', rent: 9000, block: 'Block B' },
  { _id: '7', roomNumber: '203', floor: 2, type: 'double', capacity: 2, status: 'occupied', rent: 12000, occupants: ['Hamza Tariq', 'Ali Raza'], block: 'Block B' },
  { _id: '8', roomNumber: '204', floor: 2, type: 'triple', capacity: 3, status: 'available', rent: 15000, block: 'Block B' },
  { _id: '9', roomNumber: '301', floor: 3, type: 'single', capacity: 1, status: 'occupied', rent: 8500, occupants: ['Saad Malik'], block: 'Block C' },
  { _id: '10', roomNumber: '302', floor: 3, type: 'double', capacity: 2, status: 'available', rent: 13000, block: 'Block C' },
  { _id: '11', roomNumber: '303', floor: 3, type: 'single', capacity: 1, status: 'occupied', rent: 8500, occupants: ['Waqas Shah'], block: 'Block C' },
  { _id: '12', roomNumber: '304', floor: 3, type: 'triple', capacity: 3, status: 'maintenance', rent: 16000, block: 'Block C' },
];

const emptyForm = {
  roomNumber: '',
  floor: 1,
  type: 'single',
  capacity: 1,
  rent: 8000,
  status: 'available',
  block: 'Block A',
};

const getBlockName = (block) => {
  if (!block) return 'Block A';
  if (typeof block === 'object') return block.name || 'Block A';
  return String(block);
};

export default function Rooms() {
  const [rooms, setRooms] = useState(demoRooms);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    getRooms()
      .then((res) => {
        if (res.data?.data?.length) setRooms(res.data.data);
      })
      .catch(() => {});
  }, []);

  const safeRooms = Array.isArray(rooms) ? rooms : demoRooms;

  const filtered = safeRooms.filter((r) => {
    if (!r) return false;
    const blockStr = getBlockName(r.block).toLowerCase();
    const matchSearch =
      (r.roomNumber && r.roomNumber.toLowerCase().includes(search.toLowerCase())) ||
      blockStr.includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (room) => {
    setEditing(room);
    setForm({
      roomNumber: room.roomNumber,
      floor: room.floor,
      type: room.type,
      capacity: room.capacity,
      rent: room.rent,
      status: room.status,
      block: getBlockName(room.block),
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateRoom(editing._id, form);
        setRooms((prev) =>
          prev.map((r) => (r._id === editing._id ? { ...r, ...form } : r))
        );
      } else {
        const res = await createRoom(form);
        const newRoom = res.data?.data || { ...form, _id: Date.now().toString() };
        setRooms((prev) => [...prev, newRoom]);
      }
    } catch {
      if (editing) {
        setRooms((prev) =>
          prev.map((r) => (r._id === editing._id ? { ...r, ...form } : r))
        );
      } else {
        setRooms((prev) => [
          ...prev,
          { ...form, _id: Date.now().toString() },
        ]);
      }
    }
    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this room?')) return;
    try {
      await deleteRoom(id);
    } catch {
      // continue anyway
    }
    setRooms((prev) => prev.filter((r) => r._id !== id));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ['floor', 'capacity', 'rent'].includes(name) ? Number(value) : value,
    }));
  };

  const counts = {
    all: safeRooms.length,
    available: safeRooms.filter((r) => r.status === 'available').length,
    occupied: safeRooms.filter((r) => r.status === 'occupied').length,
    maintenance: safeRooms.filter((r) => r.status === 'maintenance').length,
    reserved: safeRooms.filter((r) => r.status === 'reserved').length,
  };

  return (
    <div className="space-y-6 pb-8">
      {/* 3D Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center shadow-[0_8px_16px_rgba(79,70,229,0.35)] transform-gpu hover:rotate-6 transition">
            <BedDouble size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              Rooms & Bed Allocation
              <span className="pill-3d bg-indigo-50 text-indigo-700 text-xs px-2.5 py-0.5 border border-indigo-200">
                3D Visualizer
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage hostel floor wings, bed occupancies, and room service status
            </p>
          </div>
        </div>

        <button
          onClick={openAdd}
          className="btn-3d btn-3d-indigo px-4 py-2.5 text-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={16} />
          Add New Room
        </button>
      </div>

      {/* 3D Metric Overview Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card-depth-3d p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Rooms</p>
            <p className="text-xl font-black text-slate-800 mt-1">{counts.all}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
            🏢
          </div>
        </div>

        <div className="card-depth-3d p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Available</p>
            <p className="text-xl font-black text-emerald-600 mt-1">{counts.available}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
            ✓
          </div>
        </div>

        <div className="card-depth-3d p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Occupied</p>
            <p className="text-xl font-black text-indigo-600 mt-1">{counts.occupied}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
            👥
          </div>
        </div>

        <div className="card-depth-3d p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Under Service</p>
            <p className="text-xl font-black text-amber-600 mt-1">{counts.maintenance}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
            🔧
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* 3D Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['all', 'available', 'occupied', 'maintenance', 'reserved'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`pill-3d px-3 py-1.5 text-xs capitalize cursor-pointer border transition ${
                filterStatus === s
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-[0_4px_12px_rgba(79,70,229,0.35)]'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {s} ({counts[s]})
            </button>
          ))}
        </div>

        {/* 3D Search Input */}
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search room number, block..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-xs"
          />
        </div>
      </div>

      {/* 3D Isometric Room Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((room) => {
          const style = statusStyles[room.status] || statusStyles.available;
          const occupantsCount = room.occupants?.length || (room.status === 'occupied' ? 1 : 0);
          return (
            <div
              key={room._id}
              className={`card-depth-3d bg-gradient-to-b ${style.lightBg} p-5 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-200 flex flex-col justify-between ${style.border}`}
            >
              {/* Top ambient highlight */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-white/80 to-transparent" />

              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-xl bg-white shadow-xs border border-slate-100 flex items-center justify-center text-slate-700 font-black text-sm">
                      {room.floor}F
                    </div>
                    <div>
                      <span className="text-lg font-black text-slate-800 tracking-tight">
                        Room {room.roomNumber}
                      </span>
                      <p className="text-[10px] text-slate-400 font-semibold">{getBlockName(room.block)}</p>
                    </div>
                  </div>
                  <span className={`pill-3d px-2.5 py-1 text-[11px] font-bold capitalize border ${style.badge}`}>
                    <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${style.dot}`} />
                    {room.status}
                  </span>
                </div>

                {/* 3D Isometric Bed Slots Layout Visualizer */}
                <div className="my-4 p-3 bg-white/80 backdrop-blur-xs rounded-xl border border-slate-200/80 shadow-inner">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold mb-2">
                    <span>Bed Slots ({occupantsCount}/{room.capacity})</span>
                    <span className="capitalize text-indigo-600">{room.type} Room</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {Array.from({ length: room.capacity }).map((_, idx) => {
                      const isOccupied = idx < occupantsCount;
                      return (
                        <div
                          key={idx}
                          className={`p-1.5 rounded-lg border text-center transition ${
                            isOccupied
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-xs'
                              : 'bg-slate-50 border-dashed border-slate-300 text-slate-400'
                          }`}
                        >
                          <BedDouble size={14} className="mx-auto" />
                          <span className="text-[9px] font-bold block mt-0.5">
                            {isOccupied ? 'Occupied' : 'Vacant'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Specs */}
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Monthly Rent:</span>
                    <span className="font-extrabold text-slate-800">
                      PKR {room.rent?.toLocaleString()}
                    </span>
                  </div>
                  {room.occupants?.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Assigned:</p>
                      <div className="flex flex-wrap gap-1">
                        {room.occupants.map((occ, i) => (
                          <span
                            key={i}
                            className="pill-3d bg-slate-100 text-slate-700 px-2 py-0.5 text-[10px] font-semibold border border-slate-200"
                          >
                            {occ}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 3D Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEdit(room)}
                  className="btn-3d btn-3d-slate px-2.5 py-1 text-[11px] flex items-center gap-1 font-semibold"
                >
                  <Edit2 size={12} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(room._id)}
                  className="btn-3d btn-3d-rose px-2.5 py-1 text-[11px] flex items-center gap-1 font-semibold"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="card-depth-3d p-12 text-center text-slate-400">
          <BedDouble size={48} className="mx-auto mb-3 opacity-40 text-indigo-400" />
          <p className="text-sm font-semibold">No rooms match your search or filter</p>
        </div>
      )}

      {/* 3D Add / Edit Room Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit Room ${editing.roomNumber}` : 'Add New Room (3D Builder)'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">Room Number</label>
              <input
                name="roomNumber"
                required
                value={form.roomNumber}
                onChange={handleChange}
                placeholder="e.g. 101"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">Floor Level</label>
              <input
                name="floor"
                type="number"
                min={1}
                required
                value={form.floor}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">Room Classification</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="single">Single Bed AC</option>
                <option value="double">Double Sharing</option>
                <option value="triple">Triple Dormitory</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">Bed Capacity</label>
              <input
                name="capacity"
                type="number"
                min={1}
                required
                value={form.capacity}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">Monthly Rent (PKR)</label>
              <input
                name="rent"
                type="number"
                min={0}
                required
                value={form.rent}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">Operational Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Under Maintenance</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn-3d btn-3d-slate px-4 py-2 text-xs"
            >
              Cancel
            </button>
            <button type="submit" className="btn-3d btn-3d-indigo px-5 py-2 text-xs">
              {editing ? 'Update Room' : 'Save Room'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
