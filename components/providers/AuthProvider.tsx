"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authApi } from '@/lib/api/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores';
import { LoadingScreen } from '../features/auth/LoadingScreen';

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
    token: string;
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
export const authRoutes = ['/login', '/register', '/auth'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { 
    setAuth, 
    clearAuth, 
    isLoading,
    token,
    setVerificationStatus,
    setPlanStatus,
    setLoading
  } = useAuthStore();

  // Define protected routes that require authentication
  const protectedRoutes = ['/chat', '/plans', '/settings', '/billing'];
  
  useEffect(() => {
    const initAuth = async () => {
      try {
        // If no token and on protected route, redirect to home
        if (!token) {
          if (!publicRoutes.includes(pathname)) {
            router.replace('/');
          }
          setLoading(false);
          return;
        }

        // Check auth status
        const userData = await authApi.getUser();
        
        if (userData.status) {
          // Update auth store with user data
          setAuth(userData.data.user, token);
          setVerificationStatus(userData.data.is_verified);
          setPlanStatus(userData.plan);

          // Handle routing based on auth state
          if (authRoutes.includes(pathname)) {
            // If on auth routes but authenticated, redirect appropriately
            if (!userData.data.is_verified) {
              if (pathname !== '/auth') {
                router.replace('/auth');
              }
            } else if (!userData.plan) {
              if (pathname !== '/plans') {
                router.replace('/plans');
              }
            } else {
              router.replace('/chat');
            }
            return;
          }

          // Handle protected routes access
          if (protectedRoutes.includes(pathname)) {
            if (!userData.data.is_verified) {
              router.replace('/auth');
              return;
            }
            if (!userData.plan && pathname !== '/plans') {
              router.replace('/plans');
              return;
            }
          }
        } else {
          // Invalid or expired token
          clearAuth();
          if (!publicRoutes.includes(pathname)) {
            router.replace('/');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        clearAuth();
        if (!publicRoutes.includes(pathname)) {
          router.replace('/');
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [pathname]);

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response: LoginResponse = await authApi.login({ email, password });
      setAuth(response.data.user, response.data.token);
      console.log(response.data, 'response.data');
      if (response.data.to === 'chat') {
        router.push('/chat');
      }
      
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
      setAuth(response.data.user, response.data.token);
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      clearAuth();
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
        const currentToken = useAuthStore.getState().token;
        if (!currentToken) {
          throw new Error('No authentication token found');
        }
        setAuth(response.data.user, currentToken);
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

  if (isLoading) {
    return <LoadingScreen />; // Or your loading component
  }

  return (
    <AuthContext.Provider value={{
      user: useAuthStore.getState().user,
      isLoading,
      isAuthenticated: useAuthStore.getState().isAuthenticated,
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