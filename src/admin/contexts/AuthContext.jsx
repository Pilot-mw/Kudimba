import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, setToken, getToken, removeToken } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('auth/me/');
      setUser(res.data);
    } catch {
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = async (username, password) => {
    const res = await api.post('auth/login/', { username, password });
    setToken(res.data.token || res.data.key || res.data.access);
    await fetchMe();
    return res.data;
  };

  const logout = () => {
    removeToken();
    setUser(null);
    window.location.href = '/admin/login';
  };

  const isAdmin = user?.role === 'admin' || user?.is_superuser;
  const isEditor = user?.role === 'editor' || isAdmin;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, fetchMe, isAdmin, isEditor }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
