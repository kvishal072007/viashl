import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api, setAuthToken } from '../services/api';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  switchUser: (user: User) => Promise<void>;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  loading: boolean;
}

const defaultUser: User = {
  id: 'usr-1',
  name: 'Vishal',
  email: 'kvishal072007@gmail.com',
  password: 'Revathi85',
  role: 'ADMIN',
  department: 'State Environmental Oversight & Clearances Directorate',
  organization: 'SEIAA Tamil Nadu & Environment, Climate Change and Forests Dept',
  avatarUrl: '/vishal_profile.jpg',
};

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  users: [defaultUser],
  switchUser: async () => {},
  login: async () => ({ success: true }),
  logout: () => {},
  updateProfile: async () => true,
  loading: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start with null so user sees the Login Page first
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([defaultUser]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const demoUsers = await api.getDemoUsers();
        if (demoUsers && demoUsers.length > 0) {
          setUsers(demoUsers);
        }
      } catch (err) {
        // fallback
      }
    };
    fetchUsers();
  }, []);

  const switchUser = async (user: User) => {
    setLoading(true);
    try {
      const res = await api.login(user.email, user.password || 'vishal123');
      if (res.token) {
        setAuthToken(res.token);
      }
      setCurrentUser(user);
      localStorage.setItem('envirotrack_user', JSON.stringify(user));
    } catch (err) {
      setCurrentUser(user);
      localStorage.setItem('envirotrack_user', JSON.stringify(user));
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password?: string) => {
    setLoading(true);
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = password || '';

    try {
      const res = await api.login(cleanEmail, cleanPass);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        localStorage.setItem('envirotrack_user', JSON.stringify(res.user));
        return { success: true };
      }
      return { success: false, error: res.error || 'Authentication failed' };
    } catch (err: any) {
      // Local strict fallback validation
      if (cleanEmail === 'kvishal072007@gmail.com' && cleanPass === 'Revathi85') {
        setCurrentUser(defaultUser);
        localStorage.setItem('envirotrack_user', JSON.stringify(defaultUser));
        return { success: true };
      }

      if (cleanEmail !== 'kvishal072007@gmail.com') {
        return { success: false, error: 'Invalid email address. Authorized email: kvishal072007@gmail.com' };
      }

      return { success: false, error: 'Invalid password. Please enter the correct password.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('envirotrack_user');
    localStorage.removeItem('envirotrack_token');
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await api.updateProfile({ ...data, id: currentUser?.id || 'usr-1' });
      if (res.success && res.user) {
        setCurrentUser(res.user);
        localStorage.setItem('envirotrack_user', JSON.stringify(res.user));
        setUsers((prev) => prev.map((u) => (u.id === res.user.id ? res.user : u)));
        return true;
      }
      return false;
    } catch (err) {
      if (currentUser) {
        const updated = { ...currentUser, ...data };
        setCurrentUser(updated);
        localStorage.setItem('envirotrack_user', JSON.stringify(updated));
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
        return true;
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, users, switchUser, login, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
