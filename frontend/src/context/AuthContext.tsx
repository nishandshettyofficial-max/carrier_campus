import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, api } from '../api/client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUserSkills: (skills: string[]) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const initAuth = async () => {
    try {
      const token = localStorage.getItem('career_compass_token');
      if (token) {
        // Fetch current user from server
        const currentUser = await api.getMe(1);
        setUser(currentUser);
      } else {
        // Auto-login demo user for immediate workshop accessibility if nothing stored
        const res = await api.demoLogin();
        localStorage.setItem('career_compass_token', res.access_token);
        setUser(res.user);
      }
    } catch (err) {
      console.warn('Auth check error, logging in demo user:', err);
      try {
        const res = await api.demoLogin();
        localStorage.setItem('career_compass_token', res.access_token);
        setUser(res.user);
      } catch (e) {
        console.error('Failed to initialize demo user:', e);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      localStorage.setItem('career_compass_token', res.access_token);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async () => {
    setLoading(true);
    try {
      const res = await api.demoLogin();
      localStorage.setItem('career_compass_token', res.access_token);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: any) => {
    setLoading(true);
    try {
      const res = await api.signup(data);
      localStorage.setItem('career_compass_token', res.access_token);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('career_compass_token');
    setUser(null);
  };

  const refreshUser = async () => {
    if (!user) return;
    try {
      const updated = await api.getMe(user.id);
      setUser(updated);
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  const updateUserSkills = async (skills: string[]) => {
    if (!user) return;
    try {
      const updated = await api.updateProfile({ current_skills: skills }, user.id);
      setUser(updated);
    } catch (err) {
      console.error('Failed to update skills:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, demoLogin, signup, logout, refreshUser, updateUserSkills }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
