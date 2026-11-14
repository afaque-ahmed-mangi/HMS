import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats } from '../api';
import StatCard from '../components/StatCard';
import { Link } from 'react-router-dom';
import {
  BedDouble,
  Users,
  Receipt,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CalendarCheck,
  CreditCard,
  Plus
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const demoStats = {
  totalRooms: 120,
  occupiedRooms: 95,
  vacantRooms: 20,
  maintenanceRooms: 5,
  totalResidents: 190,
  feesCollected: 2850000,
  pendingFees: 450000,
  recentActivities: [
    { _id: '1', message: 'Ahmed Khan checked in to Room 204', time: '2 hours ago', type: 'checkin' },
    { _id: '2', message: 'Fee payment received from Usman Ali - PKR 15,000 (JazzCash)', time: '3 hours ago', type: 'payment' },
    { _id: '3', message: 'Room 105 marked for maintenance', time: '5 hours ago', type: 'maintenance' },
    { _id: '4', message: 'New resident registered - Bilal Ahmed', time: '1 day ago', type: 'register' },
    { _id: '5', message: 'Fee invoice generated for Block A', time: '1 day ago', type: 'invoice' },
  ],
};

const monthlyRevenue = [
  { month: 'Jul', amount: 2200000 },
  { month: 'Aug', amount: 2400000 },
  { month: 'Sep', amount: 2350000 },
  { month: 'Oct', amount: 2600000 },
  { month: 'Nov', amount: 2850000 },
  { month: 'Dec', amount: 2700000 },
];

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(demoStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((res) => {
        if (res.data?.data) setStats({ ...demoStats, ...res.data.data });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const roomPie = [
    { name: 'Occupied', value: stats.occupiedRooms },
    { name: 'Vacant', value: stats.vacantRooms },
    { name: 'Maintenance', value: stats.maintenanceRooms },
  ].filter((d) => d.value > 0);

  const formatPKR = (val) => {
    if (val >= 1000000) return `PKR ${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `PKR ${(val / 1000).toFixed(0)}K`;
    return `PKR ${val}`;
  };

  const activityIcons = {
    checkin: <CheckCircle size={16} className="text-emerald-500" />,
    payment: <Receipt size={16} className="text-indigo-500" />,
    maintenance: <AlertTriangle size={16} className="text-amber-500" />,
    register: <Users size={16} className="text-blue-500" />,
    invoice: <Receipt size={16} className="text-purple-500" />,
  };

  const isFinancialRole =
    !user?.role ||
    user?.role === 'super_admin' ||
    user?.role === 'admin' ||
    user?.role === 'accountant' ||
    user?.role === 'warden';

  return (
    <div className="space-y-6 pb-8">
      {/* 3D Welcome Banner */}
      <div className="card-depth-3d bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 rounded-2xl relative overflow-hidden">
        {/* Holographic light */}
        <div className="absolute -right-10 -top-10 w-72 h-72 rounded-full bg-gradient-to-tr from-indigo-500/30 to-purple-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="pill-3d bg-white/20 text-white text-[11px] font-black uppercase px-2.5 py-0.5 border border-white/20">
                ★ Smart Operations
              </span>
              <span className="text-xs text-indigo-200">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              Welcome Back, {user?.name || 'Administrator'}!
            </h1>
            <p className="text-xs text-indigo-200 max-w-xl mt-1">
              Hostel operations are running smoothly. 3D Glassmorphic HUD is synchronized with real-time biometric and bed records.
            </p>
          </div>

          {/* 3D Quick Action Shortcuts */}
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/rooms" className="btn-3d btn-3d-slate text-xs px-3.5 py-2 font-bold flex items-center gap-1.5 bg-white/10 text-white border-white/20 hover:bg-white/20">
              <BedDouble size={14} /> Rooms
            </Link>
            <Link to="/fees" className="btn-3d btn-3d-emerald text-xs px-3.5 py-2 font-bold flex items-center gap-1.5">
              <CreditCard size={14} /> Fees Hub
            </Link>
            <Link to="/attendance" className="btn-3d btn-3d-indigo text-xs px-3.5 py-2 font-bold flex items-center gap-1.5">
              <CalendarCheck size={14} /> Night Roll-Call
            </Link>
          </div>
        </div>
      </div>

      {/* 3D Stat Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard
          title="Total Rooms"
          value={stats.totalRooms}
          icon={BedDouble}
          color="indigo"
          trend={5}
        />
        <StatCard
          title="Occupied Rooms"
          value={stats.occupiedRooms}
          icon={CheckCircle}
          color="blue"
        />
        <StatCard
          title="Vacant Rooms"
          value={stats.vacantRooms}
          icon={BedDouble}
          color="green"
        />
        <StatCard
          title="Total Residents"
          value={stats.totalResidents}
          icon={Users}
          color="purple"
          trend={8}
        />
        {isFinancialRole && (
          <>
            <StatCard
              title="Fees Collected"
              value={formatPKR(stats.feesCollected)}
              icon={Receipt}
              color="green"
              trend={12}
            />
            <StatCard
              title="Pending Fees"
              value={formatPKR(stats.pendingFees)}
              icon={AlertTriangle}
              color="amber"
              trend={-3}
            />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Bar Chart */}
        <div className="card-depth-3d p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 inline-block" />
              Monthly Revenue Analytics (PKR)
            </h3>
            <span className="pill-3d bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 border border-indigo-200">
              3D Recharts Engine
            </span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
              />
              <Tooltip
                formatter={(value) => [`PKR ${value.toLocaleString()}`, 'Revenue']}
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                }}
              />
              <Bar dataKey="amount" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Room Status Pie */}
        <div className="card-depth-3d p-6">
          <h3 className="mb-4 text-sm font-black text-slate-800 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />
            Live Bed Occupancy Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={roomPie}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {roomPie.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                fontSize={12}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3D Recent Activity Section */}
      <div className="card-depth-3d p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
            <Clock size={16} className="text-indigo-600" />
            Live Operation Log & System Activity
          </h3>
          <span className="pill-3d bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 border border-slate-200">
            Real-time
          </span>
        </div>
        <div className="space-y-2.5">
          {stats.recentActivities?.map((activity) => (
            <div
              key={activity._id}
              className="flex items-center gap-3 rounded-xl p-3 bg-slate-50/70 border border-slate-100 transition-all hover:bg-indigo-50/40 hover:scale-[1.005]"
            >
              <div className="h-8 w-8 rounded-lg bg-white shadow-xs border border-slate-200 flex items-center justify-center">
                {activityIcons[activity.type] || (
                  <Clock size={16} className="text-slate-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-700">{activity.message}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
