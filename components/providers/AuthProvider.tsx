"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authApi } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  ip_address: string;
  user_agent: string;
  registration_type: string;
}

interface RegisterResponse {
  data: {
    to: string;
    token: string;
    user: User;
  }
}

interface VerificationResponse {
  data: {
    user: User;
    to: string;
  };
  is_valid: boolean;
  message: string;
  status: boolean;
}

interface LoginResponse {
  status: boolean;
  data: {
    to: string;
    token: string;
    user: User;
  }
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  register: (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => Promise<RegisterResponse['data'] | void>;
  logout: () => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Move these to a separate config file if you want to use them elsewhere
export const publicRoutes = ['/', '/auth', '/plans', '/pricing', '/login', '/register', '/model-glossary', '/privacy-policy', '/terms-of-service', '/loading'];
export const privateRoutes = ['/chat', '/image', '/video', '/audio', '/text', '/changelog'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const isInitialCheck = isLoading;
    
    try {
      const token = localStorage.getItem('user_token');
      if (!token) {
        setUser(null);
        return;
      }

      const userData = await authApi.getUser();
      // console.log('userData', userData);
      
      if (userData && userData.data) {
        setUser(userData.data);
        // Handle routing based on server response
        if (userData.data.to === 'verify-email') {
          router.push('/auth');
        }
      } else {
        setUser(null);
        localStorage.removeItem('user_token');
      }
    } catch (error) {
      console.log('Auth check failed:', error);
      setUser(null);
      localStorage.removeItem('user_token');
    } finally {
      if (isInitialCheck) {
        setIsLoading(false);
      }
    }
  };

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response: LoginResponse = await authApi.login({ email, password });
      localStorage.setItem('user_token', response.data.token);
      setUser(response.data.user);
      
      // Only handle chat routing here
      if (response.data.to === 'chat') {
        router.push('/chat');
      }
      // Return the response so the component can handle verification
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<RegisterResponse['data'] | void> => {
    try {
      const response: RegisterResponse = await authApi.register(data);
      localStorage.setItem('user_token', response.data.token);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      localStorage.removeItem('user_token');
      setUser(null);
      router.push('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const verifyEmail = async (code: string): Promise<void> => {
    try {
      const response: VerificationResponse = await authApi.verifyEmail({ 
        code: code
      });
      
      if (response.is_valid) {
        setUser(response.data.user);
        router.push('/plans');
        return;
      } else {
        throw new Error(response.message || 'Invalid verification code');
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      verifyEmail,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};