// src/context/AuthContext.jsx
// Context quản lý trạng thái đăng nhập toàn ứng dụng
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getUserProfile } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (u) => {
    if (!u) {
      setProfile(null);
      return null;
    }
    try {
      const p = await getUserProfile(u.uid);
      if (p?.status === 'locked') {
        await signOut(auth);
        setUser(null);
        setProfile(null);
        return { locked: true };
      }
      setProfile(p);
      return p;
    } catch {
      setProfile(null);
      return null;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      const p = await fetchProfile(firebaseUser);
      if (!p?.locked) {
        setUser(firebaseUser);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [fetchProfile]);

  const refreshUser = useCallback(async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      setUser(auth.currentUser);
      await fetchProfile(auth.currentUser);
      return auth.currentUser;
    }
    return null;
  }, [fetchProfile]);

  const isAdmin = Boolean(profile?.role === 'Quản trị viên' || profile?.role === 'admin');
  const canSyncGmail = Boolean(isAdmin || profile?.canSyncGmail === true);

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, canSyncGmail, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
