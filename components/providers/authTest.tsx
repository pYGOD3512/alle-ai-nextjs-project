"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isSubscribed: boolean;
  isAuthenticated: boolean;
  setIsSubscribed: (value: boolean) => void;
  setIsAuthenticated: (value: boolean) => void;
  // Optional: you might want to combine these into a single login/logout function
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Move these to a separate config file if you want to use them elsewhere
export const publicRoutes = ['/', '/auth', '/plans', '/pricing', '/login', '/register', '/model-glossary', '/privacy-policy', '/terms-of-service'];
export const privateRoutes = ['/chat', '/image', '/video', '/audio', '/text', '/changelog'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Optional: Combine authentication state changes into single functions
  const login = () => {
    setIsAuthenticated(true);
    // You might want to check subscription status here as well
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsSubscribed(false);
  };

  return (
    <AuthContext.Provider value={{ 
      isSubscribed, 
      isAuthenticated,
      setIsSubscribed,
      setIsAuthenticated,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}