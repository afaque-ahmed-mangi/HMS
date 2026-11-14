import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  Mail,
  Lock,
  User,
  UserPlus,
  AlertCircle,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'resident',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left: 3D Decorative Panel */}
      <div className="hidden flex-1 items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 lg:flex relative overflow-hidden">
        <div className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

        <div className="max-w-md px-12 text-white relative z-10 space-y-6">
          <div className="flex items-center gap-4">
            <div className="logo-emblem-3d p-3.5 inline-block">
              <Building2 size={36} className="text-white drop-shadow" />
            </div>
            <div>
              <span className="pill-3d bg-white/20 text-white text-[10px] font-black uppercase px-2.5 py-0.5 border border-white/20">
                ★ 3D NEW REGISTRATION
              </span>
              <h2 className="text-2xl font-black text-white mt-1">Join Smart HMS</h2>
            </div>
          </div>

          <h1 className="text-4xl font-black leading-tight tracking-tight text-white">
            Digital Residence & <span className="text-indigo-400">Campus Access.</span>
          </h1>

          <p className="text-base text-indigo-200/90 leading-relaxed font-normal">
            Create your account to view assigned room inventory, track monthly fee statements with default instant pay, and request night curfew leaves.
          </p>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-xs text-indigo-100 space-y-2">
            <p className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-emerald-400" />
              Instant Role Verification
            </p>
            <p className="text-[11px] text-indigo-200">
              Students and resident accounts receive immediate access to the 3D room portal, mess menus, and notice board.
            </p>
          </div>
        </div>
      </div>

      {/* Right: Signup Form */}
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
                Register
              </span>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight mt-2">
                Create Account
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Fill in the details to register your resident profile
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
                <label className="mb-1 block text-xs font-bold text-slate-700">Full Name</label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Ali Raza"
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="resident@hms.com"
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Password</label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="password"
                      name="password"
                      required
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Confirm</label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Account Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="resident">Resident Student</option>
                  <option value="warden">Hostel Warden</option>
                  <option value="accountant">Accounts / Finance Staff</option>
                </select>
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
                    <UserPlus size={16} /> Create Account
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
