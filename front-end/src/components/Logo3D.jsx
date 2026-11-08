import { Building2, Shield, Crown, Hotel, Landmark } from 'lucide-react';
import { useBranding } from '../context/BrandingContext';

export default function Logo3D({ size = 'md', className = '' }) {
  const { branding } = useBranding();

  // Size mapping
  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-14 w-14 text-xl',
    xl: 'h-20 w-20 text-3xl',
  };

  const iconSizes = {
    sm: 18,
    md: 22,
    lg: 32,
    xl: 44,
  };

  const iconSize = iconSizes[size] || 22;

  const renderIcon = () => {
    switch (branding?.logoIcon) {
      case 'hotel':
        return <Hotel size={iconSize} className="text-white drop-shadow-md" />;
      case 'shield':
        return <Shield size={iconSize} className="text-white drop-shadow-md" />;
      case 'crown':
        return <Crown size={iconSize} className="text-amber-300 drop-shadow-md" />;
      case 'campus':
        return <Landmark size={iconSize} className="text-white drop-shadow-md" />;
      default:
        return <Building2 size={iconSize} className="text-white drop-shadow-md" />;
    }
  };

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-2xl overflow-hidden transition-all duration-300 transform hover:scale-105 ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
      style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 50%, #312e81 100%)',
        boxShadow:
          '0 8px 16px -2px rgba(79, 70, 229, 0.45), 0 3px 6px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.6)',
      }}
    >
      {/* 3D Glass Sheen Top Layer */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, transparent 60%)',
        }}
      />

      {/* Real Custom Logo or 3D Icon */}
      {branding?.logo ? (
        <img
          src={branding.logo}
          alt={branding.systemName}
          className="h-full w-full object-cover p-0.5"
        />
      ) : (
        <div className="relative z-10 flex items-center justify-center animate-float-3d">
          {renderIcon()}
        </div>
      )}

      {/* Subtle bottom bevel reflection */}
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-indigo-900/40" />
    </div>
  );
}
