import { X } from 'lucide-react';

export default function Modal({ open, isOpen, onClose, title, children, size = 'md' }) {
  const isVisible = open ?? isOpen;
  if (!isVisible) return null;

  const sizeMap = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 3D Backdrop with blur */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />
      <div
        className={`relative z-10 w-full ${sizeMap[size]} max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-[0_25px_60px_-15px_rgba(15,23,42,0.35)] border border-slate-200/80 transform-gpu animate-in fade-in zoom-in-95 duration-200`}
      >
        {/* 3D Top Specular Highlight */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent rounded-t-2xl" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/70">
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 transition"
          >
            <X size={18} />
          </button>
        </div>
        {/* Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
