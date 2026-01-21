import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { User } from '../types/api';

export const useAuth = () => {
  const [user,    setUser]    = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);


  useEffect(() => {
    const init = async () => {
      if (apiService.isAuthenticated()) {
        setLoading(true);
        try {
          const profile = await apiService.getProfile();
          setUser(profile);
        } catch {
          apiService.clearToken();           
        } finally {
          setLoading(false);
        }
      }
    };
    init();
  }, []);

  /* ───── Login ───── */
  const login = async (email: string, passwort: string) => {
    setError(null);
    setLoading(true);
    try {
      await apiService.login({ email, passwort });
      const profile = await apiService.getProfile();
      setUser(profile);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login fehlgeschlagen');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /* ───── Registrierung ───── */
  const register = async (vorname: string, nachname: string, email: string, passwort: string) => {
    setError(null);
    setLoading(true);
    try {
      await apiService.register({ vorname, nachname, email, passwort });
      const profile = await apiService.getProfile();
      setUser(profile);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registrierung fehlgeschlagen');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /* ───── Logout ───── */
  const logout = () => {
    apiService.clearToken();
    setUser(null);
    setError(null);
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };
};
