import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats } from '../api';
import StatCard from '../components/StatCard';
import {
  BedDouble,
  Users,
  Receipt,
  AlertTriangle,
  CheckCircle,
  Clock,
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

// Fallback/demo data
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
    { _id: '2', message: 'Fee payment received from Usman Ali - PKR 15,000', time: '3 hours ago', type: 'payment' },
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
      .catch(() => {
        // Use demo data
      })
      .finally(() => setLoading(false));
  }, []);

  const roomPie = [
    { name: 'Occupied', value: stats.occupiedRooms },
    { name: 'Vacant', value: stats.vacantRooms },
    { name: 'Reserved', value: 0 },
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Overview of your hostel operations
        </p>
      </div>

      {/* Stat Cards */}
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
        {user?.role === 'admin' && (
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
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Revenue Bar Chart */}
        <div className="card-3d p-6 lg:col-span-2">
          <h3 className="mb-4 text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 inline-block" />
            Monthly Revenue Analytics (PKR)
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
              />
              <Tooltip
                formatter={(value) => [`PKR ${value.toLocaleString()}`, 'Revenue']}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                }}
              />
              <Bar dataKey="amount" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Room Status Pie */}
        <div className="card-3d p-6">
          <h3 className="mb-4 text-sm font-bold text-slate-800 flex items-center gap-2">
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

      {/* Recent Activity */}
      <div className="mt-6 card-3d p-6">
        <h3 className="mb-4 text-sm font-semibold text-slate-700">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {stats.recentActivities?.map((activity) => (
            <div
              key={activity._id}
              className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-slate-50"
            >
              <div className="mt-0.5">
                {activityIcons[activity.type] || (
                  <Clock size={16} className="text-slate-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-700">{activity.message}</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
