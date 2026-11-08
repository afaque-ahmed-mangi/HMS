import { createContext, useContext, useState, useEffect } from 'react';

const BrandingContext = createContext(null);

const DEFAULT_BRANDING = {
  systemName: 'Smart HMS',
  tagline: 'Hostel Management Platform',
  logo: null, // Custom base64 image or null (uses 3D icon)
  logoIcon: 'building', // 'building' | 'hotel' | 'shield' | 'crown' | 'campus'
};

export const useBranding = () => {
  const ctx = useContext(BrandingContext);
  if (!ctx) throw new Error('useBranding must be used within BrandingProvider');
  return ctx;
};

export function BrandingProvider({ children }) {
  const [branding, setBranding] = useState(() => {
    try {
      const stored = localStorage.getItem('hms_branding');
      return stored ? JSON.parse(stored) : DEFAULT_BRANDING;
    } catch {
      return DEFAULT_BRANDING;
    }
  });

  const updateBranding = (newValues) => {
    setBranding((prev) => {
      const updated = { ...prev, ...newValues };
      localStorage.setItem('hms_branding', JSON.stringify(updated));
      return updated;
    });
  };

  const resetBranding = () => {
    localStorage.removeItem('hms_branding');
    setBranding(DEFAULT_BRANDING);
  };

  return (
    <BrandingContext.Provider value={{ branding, updateBranding, resetBranding }}>
      {children}
    </BrandingContext.Provider>
  );
}

export default BrandingContext;
