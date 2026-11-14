import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Mail, Lock, LogIn, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';
import Logo3D from '../components/Logo3D';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please verify credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@hms.com');
      setPassword('admin123');
    } else if (role === 'warden') {
      setEmail('warden@hms.com');
      setPassword('warden123');
    } else {
      setEmail('resident@hms.com');
      setPassword('resident123');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left: Decorative 3D Panel */}
      <div className="hidden flex-1 items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 lg:flex relative overflow-hidden">
        {/* Ambient 3D orbs */}
        <div className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

        <div className="max-w-md px-12 text-white relative z-10 space-y-6">
          <div className="flex items-center gap-4">
            <div className="logo-emblem-3d p-3.5 inline-block">
              <Building2 size={36} className="text-white drop-shadow" />
            </div>
            <div>
              <span className="pill-3d bg-white/20 text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 border border-white/20">
                ★ 3D NEXT-GEN ENGINE
              </span>
              <h2 className="text-2xl font-black text-white mt-1">Smart HMS Portal</h2>
            </div>
          </div>

          <h1 className="text-4xl font-black leading-tight tracking-tight text-white">
            Hostel Operations, <span className="text-indigo-400">Reimagined.</span>
          </h1>

          <p className="text-base text-indigo-200/90 leading-relaxed font-normal">
            Manage bed allocations, resident records, default fee billing gateways, and night roll-call security with automated SMS alerts.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-indigo-800/60 text-xs text-indigo-200">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Full Board Mess Menus</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
              <span>Biometric & Gate Passes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span>JazzCash & Bank Dues</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-400" />
              <span>3D Room Visualizer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Brand */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="h-10 w-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Building2 size={22} />
            </div>
            <span className="text-xl font-black text-slate-800">Smart HMS</span>
          </div>

          <div className="card-depth-3d p-8 bg-white space-y-6">
            <div>
              <span className="pill-3d bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase px-2 py-0.5 border border-indigo-200">
                Secure Access
              </span>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight mt-2">
                Welcome back
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Sign in to your hostel management account to continue
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-xs text-rose-700 font-bold">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@hms.com"
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-3d btn-3d-indigo w-full py-2.5 text-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <LogIn size={16} /> Sign In
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Logins */}
            <div className="pt-2 border-t border-slate-100">
              <p className="mb-2 text-center text-[10px] font-black uppercase tracking-wider text-slate-400">
                1-Click Demo Logins
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemo('admin')}
                  className="btn-3d btn-3d-slate py-1.5 text-xs text-indigo-700 font-bold"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('warden')}
                  className="btn-3d btn-3d-slate py-1.5 text-xs text-amber-700 font-bold"
                >
                  Warden
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('resident')}
                  className="btn-3d btn-3d-emerald py-1.5 text-xs font-bold"
                >
                  Resident
                </button>
              </div>
            </div>

            <p className="text-center text-xs text-slate-500">
              Need to register a new hostel account?{' '}
              <Link to="/signup" className="font-bold text-indigo-600 hover:text-indigo-700">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
