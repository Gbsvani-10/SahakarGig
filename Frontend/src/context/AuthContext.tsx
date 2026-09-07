import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/authService';
import { MOCK_USERS } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, pass: string, requestedRole?: UserRole) => Promise<void>;
  loginAs: (role: UserRole) => Promise<void>;
  register: (userData: Partial<User> & { password?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('sahakar_auth_token'));
  const [role, setRole] = useState<UserRole>('guest');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('sahakar_auth_token');
      const savedRole = (localStorage.getItem('sahakar_user_role') as UserRole) || null;

      if (savedToken && savedRole && MOCK_USERS[savedRole]) {
        setUser(MOCK_USERS[savedRole]);
        setRole(savedRole);
        setToken(savedToken);
      } else {
        // Default to demo customer for immediate interactive experience if none set
        const defaultUser = MOCK_USERS.customer;
        setUser(defaultUser);
        setRole('customer');
        const demoToken = 'jwt-demo-customer-initial';
        setToken(demoToken);
        localStorage.setItem('sahakar_auth_token', demoToken);
        localStorage.setItem('sahakar_user_role', 'customer');
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (identifier: string, pass: string, requestedRole?: UserRole) => {
    setIsLoading(true);
    try {
      const res = await authService.login(identifier, pass, requestedRole);
      setUser(res.user);
      setRole(res.user.role);
      setToken(res.token);
      localStorage.setItem('sahakar_auth_token', res.token);
      localStorage.setItem('sahakar_user_role', res.user.role);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAs = async (targetRole: UserRole) => {
    setIsLoading(true);
    try {
      const res = await authService.loginAs(targetRole);
      setUser(res.user);
      setRole(res.user.role);
      setToken(res.token);
      localStorage.setItem('sahakar_auth_token', res.token);
      localStorage.setItem('sahakar_user_role', res.user.role);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User> & { password?: string }) => {
    setIsLoading(true);
    try {
      const res = await authService.register(userData);
      setUser(res.user);
      setRole(res.user.role);
      setToken(res.token);
      localStorage.setItem('sahakar_auth_token', res.token);
      localStorage.setItem('sahakar_user_role', res.user.role);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setRole('guest');
    setToken(null);
    localStorage.removeItem('sahakar_auth_token');
    localStorage.removeItem('sahakar_user_role');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isAuthenticated: !!user && role !== 'guest',
        isLoading,
        login,
        loginAs,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
