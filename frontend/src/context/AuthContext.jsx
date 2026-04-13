import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getProfile().then(({ data }) => {
      if (data && data.user) setUser(data.user);
    }).finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (username, password) => {
    const { data, error } = await authService.signin(username, password);
    if (error) return { error };
    if (data && data.user) setUser(data.user);
    return { data };
  }, []);

  const signup = useCallback(async (formData) => {
    const { data, error } = await authService.signup(formData);
    if (error) return { error };
    return { data };
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
