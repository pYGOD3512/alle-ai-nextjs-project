"use client"

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores';
import { LoadingScreen } from './LoadingScreen';

interface RouteGuardProps {
  children: ReactNode;
}

const publicRoutes = ['/', '/auth', '/model-glossary', '/privacy-policy', '/terms-of-service', '/collection', '/release-notes'];

export function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { token } = useAuthStore();

  useEffect(() => {
    // Skip check for public routes
    if (publicRoutes.includes(pathname)) {
      return;
    }

    // If no token, redirect to auth
    if (!token) {
      router.replace('/auth');
    }
  }, [pathname, token]);

  return <>{children}</>;
}