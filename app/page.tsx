"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { LoadingScreen } from '@/components/features/auth/LoadingScreen';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     router.replace('/chat');
  //   } else {
  //     router.replace('/auth');
  //   }
  // }, [isAuthenticated, router]);

  useEffect(() => {
    router.replace('/chat');
  }, [router])

  // Return null instead of LoadingScreen to avoid client/server mismatch
  return null;
}