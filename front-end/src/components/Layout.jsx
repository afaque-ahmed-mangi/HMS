import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { useBranding } from '../context/BrandingContext';
import { Bell, Menu, Sparkles } from 'lucide-react';

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const { branding } = useBranding();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - hidden on mobile unless open */}
      <div className={`hidden lg:block`}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>
      {mobileOpen && (
        <div className="lg:hidden">
          <Sidebar collapsed={false} setCollapsed={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div
        className={`transition-all duration-300 ${
          collapsed ? 'lg:ml-[72px]' : 'lg:ml-64'
        }`}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md sm:px-6">
          <button
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} />
          </button>

          <div className="hidden lg:flex items-center gap-3">
            <div className="badge-3d px-3 py-1 rounded-xl text-xs font-bold text-indigo-700 flex items-center gap-1.5 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              {branding?.systemName || 'Smart HMS'}
            </div>
            <span className="text-xs text-slate-300">•</span>
            <h2 className="text-xs font-semibold text-slate-500">
              Welcome back, <span className="text-slate-800 font-bold">{user?.name || 'User'}</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100">
              <Bell size={20} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full overflow-hidden bg-indigo-100 text-sm font-semibold text-indigo-600 border border-indigo-200">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user?.name} className="h-full w-full object-cover" />
                ) : (
                  user?.name?.charAt(0)?.toUpperCase() || 'U'
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-slate-700">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs capitalize text-slate-400">
                  {user?.role || 'admin'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
