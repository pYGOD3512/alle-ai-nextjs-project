"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/authTest';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // If authenticated, show the chat interface
    if (isAuthenticated) {
      router.push('/chat');
    } else {
      // If not authenticated, redirect to login
      router.push('/auth');
    }
  }, [isAuthenticated]);

  // You could show a loading state here while the redirect happens
  return null;
}