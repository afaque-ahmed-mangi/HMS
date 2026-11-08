import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getMe, updateProfile } from '../api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('hms_token');
    const storedUser = localStorage.getItem('hms_user');

    if (token && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const persistentAvatar =
          (parsed.email && localStorage.getItem('hms_avatar_' + parsed.email)) ||
          parsed.avatar ||
          null;

        parsed.avatar = persistentAvatar;
        setUser(parsed);

        // Verify token with backend and merge
        getMe()
          .then((res) => {
            const u = res.data.data || res.data.user;
            const finalAvatar = u.avatar || persistentAvatar;
            const merged = { ...parsed, ...u, avatar: finalAvatar };

            setUser(merged);
            localStorage.setItem('hms_user', JSON.stringify(merged));
            if (finalAvatar && merged.email) {
              localStorage.setItem('hms_avatar_' + merged.email, finalAvatar);
            }
          })
          .catch(() => {
            // Token expired or invalid
            localStorage.removeItem('hms_token');
            localStorage.removeItem('hms_user');
            setUser(null);
          })
          .finally(() => setLoading(false));
      } catch (e) {
        setUser(null);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    const { token, user: u } = res.data.data || res.data;

    // Check if user previously had an avatar saved locally
    const persistentAvatar =
      u.avatar || (u.email && localStorage.getItem('hms_avatar_' + u.email)) || null;
    const userWithAvatar = { ...u, avatar: persistentAvatar };

    localStorage.setItem('hms_token', token);
    localStorage.setItem('hms_user', JSON.stringify(userWithAvatar));
    setUser(userWithAvatar);
    return userWithAvatar;
  };

  const register = async (data) => {
    const res = await registerUser(data);
    const { token, user: u } = res.data.data || res.data;
    localStorage.setItem('hms_token', token);
    localStorage.setItem('hms_user', JSON.stringify(u));
    setUser(u);
    return u;
  };

  const updateUser = async (updatedFields) => {
    // 1. Immediately update local state & localStorage so UI updates instantly
    setUser((prev) => {
      const merged = { ...prev, ...updatedFields };
      localStorage.setItem('hms_user', JSON.stringify(merged));
      if (merged.email) {
        if (merged.avatar) {
          localStorage.setItem('hms_avatar_' + merged.email, merged.avatar);
        } else {
          localStorage.removeItem('hms_avatar_' + merged.email);
        }
      }
      return merged;
    });

    // 2. Persist to backend MongoDB
    try {
      await updateProfile(updatedFields);
    } catch (err) {
      console.warn('Backend updateProfile:', err.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('hms_token');
    localStorage.removeItem('hms_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
