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
// import { useAuthCheck } from "@/hooks/use-auth-check";
import { LoadingScreen } from '@/components/features/auth/LoadingScreen';

type AuthMode = 'login' | 'register' | 'forgot-password' | 'reset-success' | 'verify-email';

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [resetEmail, setResetEmail] = useState<string>("");
  const [email, setEmail] = useState("");
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const router = useRouter();

  // Use the hook with a callback for verification
  // const { isLoading, shouldRender } = useAuthCheck({
  //   onVerifyEmail: (email) => {
  //     setEmail(email);
  //     setAuthMode('verify-email');
  //   }
  // });

  useEffect(() => {
    setMounted(true);

    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    const emailParam = params.get('email');

    // Set auth mode and email if provided in URL
    if (mode === 'verify-email' && emailParam) {
      setAuthMode('verify-email');
      setEmail(emailParam);
    }
  }, []);

  // Show loading screen while checking auth
  // if (isLoading) {
  //   return <LoadingScreen />;
  // }

  // Don't render if we shouldn't (e.g., user is authenticated)
  // if (!shouldRender) {
  //   return null;
  // }

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