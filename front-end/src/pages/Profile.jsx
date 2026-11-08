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

  // Handle Real Image Selection from local device
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
      setAvatar(base64Image); // Instant real image preview!
      // Auto-save immediately so even an instant refresh (F5) keeps the picture!
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
    // Save to global auth state and localStorage
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
    <div className="max-w-3xl space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <UserCircle className="text-indigo-600" /> Account Profile & Settings
        </h1>
        <p className="text-slate-500 text-sm">
          Upload your real profile picture and manage your account details
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
        {/* Photo Upload & Preview Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-100">
          {/* Avatar Container with Real Image */}
          <div className="relative group">
            <div className="h-28 w-28 rounded-2xl overflow-hidden border-2 border-indigo-100 bg-slate-100 shadow-md flex items-center justify-center">
              {avatar ? (
                <img
                  src={avatar}
                  alt={name}
                  className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-bold text-4xl flex items-center justify-center">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Quick Camera Overlay Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition transform hover:scale-110"
              title="Upload Real Photo"
            >
              <Camera size={16} />
            </button>
          </div>

          {/* Photo Actions & Info */}
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-slate-800">{name}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase border border-indigo-200">
                {user?.role || 'Super Admin'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Upload a clear face photo. Supports PNG, JPG, or JPEG up to 5MB.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
              {/* Hidden File Input */}
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
                className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition"
              >
                <Upload size={14} /> Upload Picture
              </button>

              {avatar && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="inline-flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition"
                >
                  <Trash2 size={14} /> Remove Photo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
            {error}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address (Read Only)</label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg text-sm cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Mobile Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Assigned Hostel Campus</label>
              <input
                type="text"
                value={hostelBranch}
                onChange={(e) => setHostelBranch(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Password Security Section */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <KeyRound size={16} className="text-indigo-600" /> Security & Password Update
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Leave blank to keep unchanged"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Re-type new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {saved ? (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5 animate-pulse">
                <Check size={16} className="text-emerald-600" /> Profile and photo updated successfully!
              </span>
            ) : (
              <span className="text-xs text-slate-400">Your photo will be displayed across the hostel portal</span>
            )}
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
