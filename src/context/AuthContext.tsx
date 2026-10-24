import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types/user';
import { api } from '../lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  openLogin: () => void;
  openRegister: () => void;
  isOrdersModalOpen: boolean;
  setIsOrdersModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('vram_vault_token') || null;
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('vram_vault_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);

  // Sync token to API helper
  useEffect(() => {
    if (token) {
      api.setAuthToken(token);
    } else {
      api.setAuthToken(null);
    }
  }, [token]);

  // Check current profile on mount if token exists
  useEffect(() => {
    if (token && !user) {
      api.getMe()
        .then((userData) => {
          setUser(userData);
          localStorage.setItem('vram_vault_user', JSON.stringify(userData));
        })
        .catch(() => {
          logout();
        });
    }
  }, [token]);

  const login = async (credentials: { email: string; password: string }) => {
    const res: AuthResponse = await api.login(credentials);
    setToken(res.token);
    setUser(res);
    localStorage.setItem('vram_vault_token', res.token);
    localStorage.setItem('vram_vault_user', JSON.stringify(res));
    setIsAuthModalOpen(false);
  };

  const register = async (userData: { name: string; email: string; password: string }) => {
    const res: AuthResponse = await api.register(userData);
    setToken(res.token);
    setUser(res);
    localStorage.setItem('vram_vault_token', res.token);
    localStorage.setItem('vram_vault_user', JSON.stringify(res));
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('vram_vault_token');
    localStorage.removeItem('vram_vault_user');
    api.setAuthToken(null);
  };

  const openLogin = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const openRegister = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openLogin,
        openRegister,
        isOrdersModalOpen,
        setIsOrdersModalOpen,
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
