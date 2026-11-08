import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBranding } from '../context/BrandingContext';
import Logo3D from './Logo3D';
import LogoSettingsModal from './LogoSettingsModal';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  BedDouble,
  CalendarCheck,
  UserCheck,
  Utensils,
  Wrench,
  Bell,
  Receipt,
  FileSpreadsheet,
  UserCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Palette,
  Sparkles,
} from 'lucide-react';

const adminLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/applications', label: 'Applications', icon: ClipboardList },
  { to: '/residents', label: 'Residents', icon: Users },
  { to: '/rooms', label: 'Rooms & Beds', icon: BedDouble },
  { to: '/attendance', label: 'Attendance & Gate', icon: CalendarCheck },
  { to: '/visitors', label: 'Visitors Log', icon: UserCheck },
  { to: '/mess', label: 'Mess & Dining', icon: Utensils },
  { to: '/complaints', label: 'Maintenance', icon: Wrench },
  { to: '/notices', label: 'Notice Board', icon: Bell },
  { to: '/fees', label: 'Fee & Billing', icon: Receipt },
  { to: '/reports', label: 'Audit Reports', icon: FileSpreadsheet },
  { to: '/profile', label: 'Profile', icon: UserCircle },
];

const residentLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/rooms', label: 'My Room', icon: BedDouble },
  { to: '/attendance', label: 'Gate Pass / Leave', icon: CalendarCheck },
  { to: '/mess', label: 'Mess Menu', icon: Utensils },
  { to: '/complaints', label: 'Complaints', icon: Wrench },
  { to: '/notices', label: 'Notice Board', icon: Bell },
  { to: '/fees', label: 'My Fees', icon: Receipt },
  { to: '/profile', label: 'Profile', icon: UserCircle },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const { branding } = useBranding();
  const navigate = useNavigate();
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  const isStaff = ['admin', 'super_admin', 'warden', 'accountant'].includes(user?.role);
  const links = isStaff ? adminLinks : residentLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen flex-col bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white shadow-2xl transition-all duration-300 border-r border-indigo-900/40 ${
          collapsed ? 'w-[74px]' : 'w-64'
        }`}
        style={{
          boxShadow: '4px 0 25px rgba(15, 23, 42, 0.45)',
        }}
      >
        {/* Brand Header with 3D Logo & Edit Badge */}
        <div className="flex h-18 shrink-0 items-center justify-between border-b border-indigo-800/40 px-3.5">
          <div
            onClick={() => isStaff && setIsLogoModalOpen(true)}
            className={`flex items-center gap-3 transition cursor-pointer group ${
              isStaff ? 'hover:opacity-95' : ''
            }`}
            title={isStaff ? 'Click to change Logo & 3D Brand settings' : ''}
          >
            {/* 3D Logo */}
            <div className="relative">
              <Logo3D size={collapsed ? 'sm' : 'md'} />
              {isStaff && !collapsed && (
                <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-xs">
                  <Palette size={9} />
                </div>
              )}
            </div>

            {!collapsed && (
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-extrabold tracking-wide text-white truncate group-hover:text-indigo-200 transition">
                    {branding?.systemName || 'Smart HMS'}
                  </span>
                </div>
                <span className="block text-[10px] text-indigo-300/80 font-medium truncate">
                  {branding?.tagline || 'Hostel Management'}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-xl p-1.5 text-indigo-300 hover:bg-white/10 hover:text-white transition"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Change Logo Quick Action Pill for Staff */}
        {isStaff && !collapsed && (
          <div className="px-3 pt-2.5">
            <button
              onClick={() => setIsLogoModalOpen(true)}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 text-indigo-200 hover:text-white hover:bg-indigo-500/30 text-[11px] font-semibold transition"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles size={12} className="text-amber-300" />
                <span>Customize Logo & Look</span>
              </span>
              <span className="text-[10px] bg-indigo-400/30 text-indigo-200 px-1.5 py-0.5 rounded">
                Admin
              </span>
            </button>
          </div>
        )}

        {/* Nav Links - 3D Beveled on Active */}
        <nav className="my-2 flex-1 space-y-1 px-3 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-900">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/40 transform translate-x-1'
                    : 'text-indigo-200/75 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={17} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User Footer with 3D Profile Frame */}
        <div className="border-t border-indigo-900/60 p-3 shrink-0 bg-slate-950/40">
          {!collapsed && (
            <div className="mb-2.5 flex items-center gap-2.5 px-1.5">
              <div
                className="h-9 w-9 rounded-full overflow-hidden shrink-0 border-2 border-indigo-400/40 flex items-center justify-center font-bold text-xs text-white"
                style={{
                  background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                }}
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user?.name} className="h-full w-full object-cover" />
                ) : (
                  user?.name?.charAt(0)?.toUpperCase() || 'A'
                )}
              </div>
              <div className="truncate">
                <div className="truncate text-xs font-bold text-white">{user?.name || 'Administrator'}</div>
                <div className="truncate text-[10px] text-indigo-300 capitalize font-medium">
                  {user?.role?.replace('_', ' ') || 'Super Admin'}
                </div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 hover:text-rose-100 transition"
          >
            <LogOut size={16} className="shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Logo Customization Modal */}
      {isLogoModalOpen && (
        <LogoSettingsModal
          isOpen={isLogoModalOpen}
          onClose={() => setIsLogoModalOpen(false)}
        />
      )}
    </>
  );
}
