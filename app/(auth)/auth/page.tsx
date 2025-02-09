"use client";

import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { LoginForm } from "@/components/features/auth/LoginForm";
import { RegisterForm } from "@/components/features/auth/RegisterForm";
import { ForgotPasswordForm } from "@/components/features/auth/ForgotPasswordForm";
import { ResetPasswordSuccess } from "@/components/features/auth/ResetPasswordSuccess";
import { VerificationCodeForm } from "@/components/features/auth/VerificationCodeForm";
import { useTheme } from 'next-themes';
import { useAuth } from '@/components/providers/AuthProvider';
import { useAuthStore } from '@/stores';
import { authApi } from "@/lib/api/auth";

type AuthMode = 'login' | 'register' | 'forgot-password' | 'reset-success' | 'verify-email';

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [resetEmail, setResetEmail] = useState<string>("");
  const [email, setEmail] = useState("");
  const { token } = useAuthStore();
  const { theme, resolvedTheme } = useTheme();
  const router = useRouter();

  const handleForgotPassword = () => {
    setAuthMode('forgot-password');
  };

  const handleResetSuccess = (email: string) => {
    setResetEmail(email);
    setAuthMode('reset-success');
  };

  const handleVerification = (email: string) => {
    setEmail(email);
    setAuthMode('verify-email');
  };

  const handleRegister = (email: string) => {
    setEmail(email);
    setAuthMode('verify-email');
  };

  const renderAuthContent = () => {
    switch (authMode) {
      case 'login':
        return <LoginForm 
          onSwitchMode={() => setAuthMode('register')} 
          onForgotPassword={handleForgotPassword}
          onVerify={handleVerification}
        />;
      case 'register':
        return <RegisterForm 
          onSwitchMode={() => setAuthMode('login')}
          onRegister={handleRegister}
        />;
      case 'forgot-password':
        return <ForgotPasswordForm 
          onSwitchMode={() => setAuthMode('login')}
          onSuccess={handleResetSuccess}
        />;
      case 'reset-success':
        return <ResetPasswordSuccess 
          onBackToLogin={() => setAuthMode('login')} 
          email={resetEmail}
        />;
      case 'verify-email':
        return (
          <VerificationCodeForm
            email={email}
            onSuccess={() => {
              // Handle successful verification
              // Maybe redirect to dashboard or show success message
            }}
            onBackToLogin={() => setAuthMode('login')}
          />
        );
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      console.log('checking auth on entry point');
      // If there's no token, allow access to auth page
      if (!token) return;

      try {
        const response = await authApi.getUser();
        
        // Handle routing based on server response
        switch (response.data.to) {
          case 'verify-email':
            // If email needs verification, show verification form
            setEmail(response.data.user.email);
            setAuthMode('verify-email');
            break;
          case 'plans':
            router.replace('/plans');
            break;
          case 'chat':
          default:
            router.replace('/chat');
            break;
        }
      } catch (error) {
        // If token is invalid, clear auth state
        useAuthStore.getState().clearAuth();
        // Stay on auth page
      }
    };

    checkAuth();
  }, [token, router]);

  // Add useEffect to handle mounting
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Modify the logo section
  const logoSrc = mounted && resolvedTheme === 'dark' 
    ? "/svgs/logo-desktop-full.png" 
    : "/svgs/logo-desktop-dark-full.png";

  return (
    <div className="max-w-md mx-auto">
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <Image
          src={logoSrc}
          alt="alle-ai"
          width={120}
          height={120}
        />
      </div>

      {/* Heading */}
      <h1 className="text-center text-lg font-semibold mb-6">
        Your All-in-One AI Platform
      </h1>

      {/* Auth form container */}
      <div>
        <h2 className="text-muted-foreground mb-6 text-center">
          {authMode === 'login' && 'Login to your account'}
          {authMode === 'register' && 'Create new account'}
          {authMode === 'forgot-password' && 'Reset your password'}
          {authMode === 'reset-success' && 'Check your email'}
          {authMode === 'verify-email' && 'Verify your email'}
        </h2>
        
        <AnimatePresence mode="wait">
          {renderAuthContent()}
        </AnimatePresence>
      </div>
    </div>
  );
}