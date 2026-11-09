// src/context/AuthContext.jsx
// Context quản lý trạng thái đăng nhập toàn ứng dụng
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getUserProfile } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (u) => {
    if (!u) {
      setProfile(null);
      return;
    }
    try {
      const p = await getUserProfile(u.uid);
      setProfile(p);
    } catch {
      setProfile(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      await fetchProfile(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const refreshUser = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      const updatedUser = { ...auth.currentUser };
      // Copy relevant fields or trigger re-render
      setUser(auth.currentUser);
      await fetchProfile(auth.currentUser);
      return auth.currentUser;
    }
    return null;
  };

  const isAdmin = Boolean(profile?.role === 'Quản trị viên' || profile?.role === 'admin');

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
