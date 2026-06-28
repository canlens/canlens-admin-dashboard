import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin } from '../services/googleSheetsApi.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('canlens_admin_token'));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = Boolean(token);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiLogin(email, password);
      localStorage.setItem('canlens_admin_token', result.token);
      setToken(result.token);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('canlens_admin_token');
    setToken(null);
    setError(null);
  }, []);

  const value = {
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
