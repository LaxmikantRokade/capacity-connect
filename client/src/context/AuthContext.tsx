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
      const res = await api.login(email, password);
      if (res.success && res.user) {
        setUser(res.user);
        setToken(res.token || 'auth-token');
        setIsLoading(false);
        return { success: true };
      }
      setIsLoading(false);
      return { success: false, error: res.error || 'Invalid email or password' };
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
      const res = await api.register(data);
      if (res.success && res.user) {
        setUser(res.user);
        setToken(res.token || 'auth-token');
        setIsLoading(false);
        return { success: true };
      }
      setIsLoading(false);
      return { success: false, error: res.error || 'Registration failed' };
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
