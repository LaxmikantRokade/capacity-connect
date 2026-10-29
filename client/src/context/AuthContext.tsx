import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuthState } from '../types';
import { DEMO_USERS } from '../data/mockData';
import { api } from '../services/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemoRole: (role: UserRole) => void;
  register: (data: { name: string; email: string; password: string; role?: UserRole; departmentName?: string; jobRole?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check saved session or default to Rahul Sharma (Learner) for immediate rich exploration
    const savedUser = api.getCurrentUser();
    const savedToken = localStorage.getItem('cc_auth_token');

    if (savedUser) {
      setUser(savedUser);
      setToken(savedToken || 'demo-jwt-token');
    } else {
      // Default to demo learner
      const defaultUser = DEMO_USERS[0];
      setUser(defaultUser);
      setToken('demo-jwt-token-learner');
      api.setCurrentUser(defaultUser, 'demo-jwt-token-learner');
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // Check demo accounts first
      const matched = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.passwordText === password
      );

      if (matched) {
        setUser(matched);
        const demoToken = `demo-token-${matched.role.toLowerCase()}-${Date.now()}`;
        setToken(demoToken);
        api.setCurrentUser(matched, demoToken);
        setIsLoading(false);
        return { success: true };
      }

      // Check stored custom registered users
      const customUsersStr = localStorage.getItem('cc_registered_users');
      if (customUsersStr) {
        const customUsers = JSON.parse(customUsersStr);
        const customMatched = customUsers.find(
          (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (customMatched) {
          const { password: _, ...safeUser } = customMatched;
          setUser(safeUser);
          const t = `token-${safeUser.id}`;
          setToken(t);
          api.setCurrentUser(safeUser, t);
          setIsLoading(false);
          return { success: true };
        }
      }

      setIsLoading(false);
      return { success: false, error: 'Invalid email or password. You can also click any Quick Demo Role button below.' };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const loginAsDemoRole = (role: UserRole) => {
    const demo = DEMO_USERS.find((u) => u.role === role) || DEMO_USERS[0];
    setUser(demo);
    const demoToken = `demo-token-${demo.role.toLowerCase()}-${Date.now()}`;
    setToken(demoToken);
    api.setCurrentUser(demo, demoToken);
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    departmentName?: string;
    jobRole?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const newUser: User = {
        id: `user-custom-${Date.now()}`,
        name: data.name,
        email: data.email,
        role: data.role || 'LEARNER',
        departmentName: data.departmentName || 'General Administration',
        jobRole: data.jobRole || 'Officer Trainee',
        createdAt: new Date().toISOString(),
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}`,
      };

      const customUsersStr = localStorage.getItem('cc_registered_users');
      const customUsers = customUsersStr ? JSON.parse(customUsersStr) : [];
      customUsers.push({ ...newUser, password: data.password });
      localStorage.setItem('cc_registered_users', JSON.stringify(customUsers));

      setUser(newUser);
      const t = `token-${newUser.id}`;
      setToken(t);
      api.setCurrentUser(newUser, t);

      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    api.setCurrentUser(null);
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updatedData };
    setUser(updated);
    api.setCurrentUser(updated, token || undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginAsDemoRole,
        register,
        logout,
        updateProfile,
      }}
    >
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
