import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { changePassword } from '../api';
import {
  UserCircle,
  Mail,
  Shield,
  KeyRound,
  Check,
  Camera,
  Upload,
  Trash2,
  Phone,
  Building,
  Sparkles,
  QrCode,
  ShieldCheck
} from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || 'Administrator');
  const [email] = useState(user?.email || 'admin@hms.com');
  const [phone, setPhone] = useState(user?.phone || '0300-1234567');
  const [hostelBranch, setHostelBranch] = useState(user?.hostelBranch || 'Sunrise Main Campus');
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (PNG, JPG, JPEG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5 MB');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Image = event.target?.result;
      setAvatar(base64Image);
      updateUser({ avatar: base64Image });
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatar(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    updateUser({ avatar: null });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (newPassword) {
      if (newPassword.length < 6) {
        setError('New password must be at least 6 characters');
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      try {
        await changePassword({ newPassword });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to update password');
        return;
      }
    }

    setError('');
    updateUser({
      name,
      phone,
      hostelBranch,
      avatar,
    });

    setSaved(true);
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSaved(false), 3500);
  };

  return (
    <div className="max-w-4xl space-y-7 pb-10">
      {/* 3D Header */}
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center shadow-[0_8px_16px_rgba(79,70,229,0.35)] transform-gpu hover:rotate-6 transition">
          <UserCircle size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Account Profile & Identity
            <span className="pill-3d bg-indigo-50 text-indigo-700 text-xs px-2.5 py-0.5 border border-indigo-200">
              3D ID Card
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your personal profile, credentials, and digital hostel identification badge
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 3D Holographic Identity Card */}
        <div className="lg:col-span-5">
          <div className="card-depth-3d bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 shadow-[0_20px_35px_rgba(79,70,229,0.25)] border border-indigo-700/60">
            {/* Holographic light reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 opacity-50 pointer-events-none" />
            <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between border-b border-indigo-700/60 pb-3">
                <span className="pill-3d bg-white/20 text-white text-[10px] font-black uppercase px-2 py-0.5 backdrop-blur-md border border-white/20">
                  SMART HMS ID
                </span>
                <span className="text-xs font-mono font-bold text-indigo-200">
                  ID: #{user?._id?.slice(-6) || 'HMS-991'}
                </span>
              </div>

              {/* Avatar in 3D frame */}
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-2xl overflow-hidden border-2 border-indigo-300/60 shadow-[0_8px_16px_rgba(0,0,0,0.3)] bg-indigo-950 flex items-center justify-center relative">
                  {avatar ? (
                    <img src={avatar} alt={name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-2xl font-black text-indigo-300">
                      {name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-white">{name}</h3>
                  <span className="pill-3d bg-emerald-500/30 text-emerald-200 text-[10px] font-bold px-2 py-0.5 border border-emerald-400/40 uppercase">
                    {user?.role || 'Super Admin'}
                  </span>
                  <p className="text-xs text-indigo-200 mt-1 font-mono">{phone}</p>
                </div>
              </div>

              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs text-xs space-y-1">
                <div className="flex items-center justify-between text-indigo-200">
                  <span>Campus Wing:</span>
                  <span className="text-white font-bold">{hostelBranch}</span>
                </div>
                <div className="flex items-center justify-between text-indigo-200">
                  <span>Registered Email:</span>
                  <span className="text-white font-bold truncate max-w-[150px]">{email}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-indigo-300">
                <span>Verified Biometric & Roll</span>
                <QrCode size={20} className="text-white/80" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Settings Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="card-depth-3d p-6 space-y-5 bg-white">
            {/* Photo Upload Row */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-3d btn-3d-indigo text-xs px-3.5 py-2 flex items-center gap-1.5 font-bold"
              >
                <Camera size={14} /> Upload New Photo
              </button>
              {avatar && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="btn-3d btn-3d-rose text-xs px-3 py-2 flex items-center gap-1.5 font-bold"
                >
                  <Trash2 size={13} /> Remove
                </button>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Display Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address (Read-only)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-xl text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hostel Campus Branch</label>
                  <input
                    type="text"
                    value={hostelBranch}
                    onChange={(e) => setHostelBranch(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Password Section */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <KeyRound size={15} className="text-indigo-600" /> Security Credentials
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
                    <input
                      type="password"
                      placeholder="Leave blank to keep"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      placeholder="Re-type new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                {saved ? (
                  <span className="text-xs text-emerald-600 font-extrabold flex items-center gap-1.5">
                    <Check size={16} /> Profile saved successfully!
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">All changes take effect immediately</span>
                )}
                <button type="submit" className="btn-3d btn-3d-indigo text-xs px-5 py-2.5">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
