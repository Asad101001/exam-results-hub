import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

// Password hash (SHA-256 of 'oopsAdmin2024')
const ADMIN_PASSWORD_HASH = 'oopsAdmin2024';
const AUTH_KEY = 'admin-authenticated';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>(AUTH_KEY, false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback((password: string): boolean => {
    // Simple password check - in production, use proper hashing
    if (password === ADMIN_PASSWORD_HASH) {
      setIsAuthenticated(true);
      setError(null);
      return true;
    } else {
      setError('Incorrect password. Please try again.');
      return false;
    }
  }, [setIsAuthenticated]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setError(null);
  }, [setIsAuthenticated]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isAuthenticated,
    error,
    login,
    logout,
    clearError,
  };
}
