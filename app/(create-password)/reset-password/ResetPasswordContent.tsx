"use client";

import { useSearchParams } from 'next/navigation';
import { ResetPasswordForm } from '@/components/features/auth/ResetPasswordForm';
import Image from "next/image";
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  
  const email = searchParams.get('fiankobea');
  const token = searchParams.get('kofi');
  const userImage = searchParams.get('image');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const logoSrc = resolvedTheme === 'dark' ? '/svgs/logo-desktop-full.png' : '/svgs/logo-desktop-dark-full.png';

  if (!email || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-2">Invalid Reset Link</h1>
          <p className="text-muted-foreground">This password reset link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-[400px] space-y-8">
        {/* Logo */}
        <div className="flex items-center justify-center">
          <Image
            src={logoSrc}
            alt="alle-ai"
            width={120}
            height={120}
          />
        </div>

        {/* User Profile Section - Simplified */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center space-y-4"
        >
          <Avatar className="h-24 w-24 ring-2 ring-offset-2 ring-offset-background ring-border">
            <AvatarImage src={userImage || ''} alt="Profile" />
            <AvatarFallback className="text-2xl">
              {email.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-xl font-semibold">Reset Your Password</h2>
            <p className="text-sm text-muted-foreground mt-1">{email}</p>
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-backgroundColorSecondary rounded-lg p-6 shadow-lg border border-borderColorPrimary"
        >
          <ResetPasswordForm email={email} token={token} />
        </motion.div>

        {/* Security Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="text-center text-sm text-muted-foreground"
        >
          For your security, this password reset link will expire in 60 minutes.
        </motion.p>
      </div>
    </div>
  );
}