import { useState, useRef } from 'react';
import { useBranding } from '../context/BrandingContext';
import Modal from './Modal';
import Logo3D from './Logo3D';
import {
  Upload,
  Sparkles,
  Building2,
  Shield,
  Crown,
  Hotel,
  Landmark,
  Trash2,
  Check,
  Palette,
} from 'lucide-react';

export default function LogoSettingsModal({ isOpen, onClose }) {
  const { branding, updateBranding, resetBranding } = useBranding();

  const [systemName, setSystemName] = useState(branding.systemName);
  const [tagline, setTagline] = useState(branding.tagline);
  const [logoIcon, setLogoIcon] = useState(branding.logoIcon || 'building');
  const [customLogo, setCustomLogo] = useState(branding.logo || null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose a valid image file (PNG, JPG, SVG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5 MB');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      setCustomLogo(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCustomLogo = () => {
    setCustomLogo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateBranding({
      systemName,
      tagline,
      logo: customLogo,
      logoIcon,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  const iconOptions = [
    { id: 'building', label: 'Hostel Tower', icon: Building2 },
    { id: 'hotel', label: 'Luxury Hotel', icon: Hotel },
    { id: 'shield', label: 'Secure Guard', icon: Shield },
    { id: 'crown', label: 'Executive Wing', icon: Crown },
    { id: 'campus', label: 'University Hall', icon: Landmark },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Customize System Logo & 3D Branding">
      <form onSubmit={handleSave} className="space-y-6">
        {/* Live 3D Logo Preview Banner */}
        <div
          className="p-5 rounded-2xl flex items-center gap-4 text-white relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)',
            boxShadow: '0 12px 24px -4px rgba(49, 46, 129, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}
        >
          {/* 3D Preview Logo */}
          <div className="relative group">
            <div
              className="h-16 w-16 rounded-2xl overflow-hidden flex items-center justify-center p-1"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
                boxShadow:
                  '0 8px 16px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.6)',
              }}
            >
              {customLogo ? (
                <img src={customLogo} alt="Logo Preview" className="h-full w-full object-contain rounded-xl" />
              ) : (
                <Building2 size={32} className="text-white drop-shadow-md animate-float-3d" />
              )}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-indigo-300 flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-300" /> Live 3D Brand Preview
            </div>
            <h3 className="text-xl font-extrabold text-white tracking-wide mt-0.5">
              {systemName || 'Smart HMS'}
            </h3>
            <p className="text-xs text-indigo-200">{tagline || 'Hostel Management Platform'}</p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        {/* Section 1: Upload Real Logo Image */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700">
            Option A: Upload Real Custom Logo Image
          </label>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition"
            >
              <Upload size={14} /> Upload Custom Logo File
            </button>
            {customLogo && (
              <button
                type="button"
                onClick={handleRemoveCustomLogo}
                className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl font-semibold transition"
              >
                <Trash2 size={14} /> Remove Custom Logo
              </button>
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            Recommended: PNG with transparent background or high-res JPG square logo.
          </p>
        </div>

        {/* Section 2: Choose 3D Icon Preset */}
        {!customLogo && (
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700">
              Option B: Or Select a 3D Emblem Icon
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {iconOptions.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setLogoIcon(id)}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                    logoIcon === id
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 font-bold shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <Icon size={20} className={logoIcon === id ? 'text-indigo-600' : 'text-slate-500'} />
                  <span className="text-[11px]">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Name & Tagline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Hostel / System Name
            </label>
            <input
              type="text"
              required
              value={systemName}
              onChange={(e) => setSystemName(e.target.value)}
              placeholder="e.g. Sunrise Luxury Hostel"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Premium Living for Students"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={resetBranding}
            className="text-xs text-slate-400 hover:text-slate-600 font-medium"
          >
            Reset to Default
          </button>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <Check size={14} /> Saved & Applied!
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition shadow-sm"
            >
              Apply 3D Brand Logo
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
