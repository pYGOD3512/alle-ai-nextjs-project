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
  email_verified_at?: string | null;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { 
    setAuth, 
    clearAuth, 
    isLoading,
    token,
    setLoading
  } = useAuthStore();

  // Define route groups
  const publicRoutes = ['/', '/model-glossary', '/privacy-policy', '/terms-of-service', '/collection'];
  const authPage = '/auth';

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      
      try {
        console.log('trying')
        // Only redirect to auth page if no token and trying to access protected route
        // if (!token && !publicRoutes.includes(pathname) && pathname !== authPage) {
        //   router.replace(authPage);
        //   return;
        // }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [pathname]);

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await authApi.login({ email, password });
      
      // Always set the basic auth state
      setAuth(response.data.user, response.data.token);
      
      // Handle routing based on response
      if (!response.data.user.email_verified_at) {
        // User needs to verify email
        return response;
      }

      // User is verified, check where to redirect
      if (response.data.to === 'chat') {
        router.push('/chat');
      } else if (response.data.to === 'plans') {
        router.push('/plans');
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
      const response = await authApi.register(data);
      
      // Set initial auth state
      setAuth(response.data.user, response.data.token);
      
      // New registrations always need verification
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

  // Show loading screen only during auth operations
  if (isLoading) {
    return <LoadingScreen />;
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