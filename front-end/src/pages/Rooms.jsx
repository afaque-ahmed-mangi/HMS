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
} from 'lucide-react';

const statusColors = {
  available: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  occupied: 'bg-blue-100 text-blue-700 border-blue-200',
  maintenance: 'bg-amber-100 text-amber-700 border-amber-200',
  reserved: 'bg-orange-100 text-orange-700 border-orange-200',
};

const statusDot = {
  available: 'bg-emerald-500',
  occupied: 'bg-blue-500',
  maintenance: 'bg-amber-500',
  reserved: 'bg-orange-500',
};

const demoRooms = [
  { _id: '1', roomNumber: '101', floor: 1, type: 'single', capacity: 1, status: 'available', rent: 8000 },
  { _id: '2', roomNumber: '102', floor: 1, type: 'double', capacity: 2, status: 'occupied', rent: 12000, occupants: ['Ahmed Khan'] },
  { _id: '3', roomNumber: '103', floor: 1, type: 'triple', capacity: 3, status: 'occupied', rent: 15000, occupants: ['Usman Ali', 'Bilal Ahmed'] },
  { _id: '4', roomNumber: '104', floor: 1, type: 'single', capacity: 1, status: 'maintenance', rent: 8000 },
  { _id: '5', roomNumber: '201', floor: 2, type: 'double', capacity: 2, status: 'available', rent: 12000 },
  { _id: '6', roomNumber: '202', floor: 2, type: 'single', capacity: 1, status: 'reserved', rent: 9000 },
  { _id: '7', roomNumber: '203', floor: 2, type: 'double', capacity: 2, status: 'occupied', rent: 12000, occupants: ['Hamza Tariq', 'Ali Raza'] },
  { _id: '8', roomNumber: '204', floor: 2, type: 'triple', capacity: 3, status: 'available', rent: 15000 },
  { _id: '9', roomNumber: '301', floor: 3, type: 'single', capacity: 1, status: 'occupied', rent: 8500, occupants: ['Saad Malik'] },
  { _id: '10', roomNumber: '302', floor: 3, type: 'double', capacity: 2, status: 'available', rent: 13000 },
  { _id: '11', roomNumber: '303', floor: 3, type: 'single', capacity: 1, status: 'occupied', rent: 8500, occupants: ['Waqas Shah'] },
  { _id: '12', roomNumber: '304', floor: 3, type: 'triple', capacity: 3, status: 'maintenance', rent: 16000 },
];

const emptyForm = {
  roomNumber: '',
  floor: 1,
  type: 'single',
  capacity: 1,
  rent: 8000,
  status: 'available',
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

  const filtered = rooms.filter((r) => {
    const matchSearch = r.roomNumber.toLowerCase().includes(search.toLowerCase());
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
      // Fallback: just update local state
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
    all: rooms.length,
    available: rooms.filter((r) => r.status === 'available').length,
    occupied: rooms.filter((r) => r.status === 'occupied').length,
    maintenance: rooms.filter((r) => r.status === 'maintenance').length,
    reserved: rooms.filter((r) => r.status === 'reserved').length,
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Rooms</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage hostel rooms and their status
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          <Plus size={16} />
          Add Room
        </button>
      </div>

      {/* Filter pills */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {['all', 'available', 'occupied', 'maintenance', 'reserved'].map(
          (s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                filterStatus === s
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s} ({counts[s]})
            </button>
          )
        )}
      </div>

      {/* Search */}
      <div className="relative mb-4 sm:max-w-xs">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Search room number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {/* Room Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((room) => (
          <div
            key={room._id}
            className={`group relative rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${
              statusColors[room.status]
                ? `border-l-4 ${statusColors[room.status].split(' ')[2] || 'border-slate-200'}`
                : 'border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <BedDouble size={20} className="text-slate-400" />
                <span className="text-lg font-bold text-slate-800">
                  Room {room.roomNumber}
                </span>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                  statusColors[room.status] || 'bg-slate-100 text-slate-600'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    statusDot[room.status] || 'bg-slate-400'
                  }`}
                />
                {room.status}
              </span>
            </div>

            <div className="mt-3 space-y-1 text-sm text-slate-600">
              <p>
                <span className="text-slate-400">Floor:</span> {room.floor}
              </p>
              <p>
                <span className="text-slate-400">Type:</span>{' '}
                <span className="capitalize">{room.type}</span>
              </p>
              <p>
                <span className="text-slate-400">Capacity:</span>{' '}
                {room.capacity}
              </p>
              <p>
                <span className="text-slate-400">Rent:</span> PKR{' '}
                {room.rent?.toLocaleString()}
              </p>
            </div>

            {room.occupants?.length > 0 && (
              <div className="mt-3 border-t border-slate-100 pt-3">
                <p className="text-xs font-medium text-slate-400">
                  Occupants:
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {room.occupants.map((o, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                    >
                      {o}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => openEdit(room)}
                className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
              >
                <Edit2 size={13} />
                Edit
              </button>
              <button
                onClick={() => handleDelete(room._id)}
                className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                <Trash2 size={13} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-12 text-center text-slate-400">
          <BedDouble size={48} className="mx-auto mb-3 opacity-40" />
          <p>No rooms found</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Room' : 'Add New Room'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Room Number
              </label>
              <input
                name="roomNumber"
                required
                value={form.roomNumber}
                onChange={handleChange}
                placeholder="e.g. 101"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Floor
              </label>
              <input
                name="floor"
                type="number"
                min={1}
                required
                value={form.floor}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Type
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="triple">Triple</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Capacity
              </label>
              <input
                name="capacity"
                type="number"
                min={1}
                required
                value={form.capacity}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Rent (PKR)
              </label>
              <input
                name="rent"
                type="number"
                min={0}
                required
                value={form.rent}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              {editing ? 'Update Room' : 'Add Room'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
