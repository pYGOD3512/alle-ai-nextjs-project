"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/authTest';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/chat');
    } else {
      router.replace('/auth');
    }
  }, [isAuthenticated, router]);

  // Return null instead of LoadingScreen to avoid client/server mismatch
  return null;
}