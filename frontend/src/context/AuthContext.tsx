import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, api, getStoredUser, saveStoredUser } from '../api/client';
import { DEMO_USER } from '../api/mockData';

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
        const currentUser = await api.getMe(1);
        setUser(currentUser);
      } else {
        // Auto-initialize demo profile for immediate workshop accessibility
        const res = await api.demoLogin();
        localStorage.setItem('career_compass_token', res.access_token);
        setUser(res.user);
      }
    } catch (err) {
      console.warn('Auth initialization fallback:', err);
      const fallbackUser = getStoredUser() || DEMO_USER;
      localStorage.setItem('career_compass_token', 'token-user-1');
      saveStoredUser(fallbackUser);
      setUser(fallbackUser);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const isDemo = !email || email.trim() === 'demo@careercompass.ai' || email.includes('demo');
    const existing = getStoredUser();
    const resolvedUser: User = isDemo ? DEMO_USER : {
      ...DEMO_USER,
      email: email,
      full_name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ') || 'Student User'
    };

    localStorage.setItem('career_compass_token', `token-${resolvedUser.id}`);
    saveStoredUser(resolvedUser);
    setUser(resolvedUser);
    setLoading(false);

    // Sync with backend in background
    api.login({ email, password }).then((res) => {
      if (res?.user) {
        saveStoredUser(res.user);
        setUser(res.user);
      }
    }).catch((e) => {
      console.warn('Background login sync:', e);
    });
  };

  const demoLogin = async () => {
    // Instant zero-lag activation
    localStorage.setItem('career_compass_token', 'token-user-1');
    saveStoredUser(DEMO_USER);
    setUser(DEMO_USER);
    setLoading(false);

    // Background sync with backend
    api.demoLogin().then((res) => {
      if (res?.user) {
        saveStoredUser(res.user);
        setUser(res.user);
      }
    }).catch((e) => {
      console.warn('Background demo sync:', e);
    });
  };

  const signup = async (data: any) => {
    const newUser: User = {
      id: Date.now(),
      email: data.email,
      full_name: data.full_name || 'Student Candidate',
      degree: data.degree || 'B.Tech / Bachelor Degree',
      year_of_study: data.year_of_study || 'Final Year (2026)',
      career_goal: data.career_goal || 'Data Scientist',
      experience_level: 'Entry Level / Fresher',
      current_skills: ['Python', 'SQL', 'Git'],
      created_at: new Date().toISOString()
    };

    localStorage.setItem('career_compass_token', `token-${newUser.id}`);
    saveStoredUser(newUser);
    setUser(newUser);
    setLoading(false);

    // Background sync with backend
    api.signup(data).then((res) => {
      if (res?.user) {
        saveStoredUser(res.user);
        setUser(res.user);
      }
    }).catch((e) => {
      console.warn('Background signup sync:', e);
    });
  };

  const logout = () => {
    localStorage.removeItem('career_compass_token');
    localStorage.removeItem('career_compass_user');
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
      const localUpdated: User = { ...user, current_skills: skills };
      saveStoredUser(localUpdated);
      setUser(localUpdated);
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
