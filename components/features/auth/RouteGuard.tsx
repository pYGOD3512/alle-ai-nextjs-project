"use client"

import { useEffect, ReactNode, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores';
import { LoadingScreen } from './LoadingScreen';
import { authApi } from '@/lib/api/auth';

interface RouteGuardProps {
  children: ReactNode;
}

const authRoutes = ['/', '/auth', '/plans'];
const publicRoutes = ['/model-glossary', '/privacy-policy', '/terms-of-service', '/collection', '/release-notes'];

export function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, setAuth, clearAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Reset states on route change
      setIsChecking(true);
      setCanRender(false);

      // CASE 1: No token - only allow access to auth routes and public routes
      if (!token) {
        if (!authRoutes.includes(pathname) && !publicRoutes.includes(pathname)) {
          router.replace('/auth');
          return;
        }
        setCanRender(true);
        setIsChecking(false);
        return;
      }

      // CASE 2: Has token and trying to access auth routes
      if (token && authRoutes.includes(pathname)) {
        try {
          const response = await authApi.getUser();
          setAuth(response.data.user, token, response.plan);

          if (response.data.to === 'chat' && response.plan) {
            router.replace('/chat');
            return;
          } else if (!response.plan){
            router.replace('/plans')
          }
        } catch (error) {
          clearAuth();
          router.replace('/auth');
          return;
        }
      }

      // CASE 3: Has token and accessing protected/public routes
      setCanRender(true);
      setIsChecking(false);
    };

    checkAuth();
  }, [pathname, token]);

  // Show loading screen when authenticated user tries to access auth routes
  if (isChecking && token && authRoutes.includes(pathname)) {
    return <LoadingScreen />;
  }

  // Don't render anything until we've confirmed the user can access the route
  if (!canRender) {
    return null;
  }

  // Render children only after we've confirmed access is allowed
  return <>{children}</>;
}