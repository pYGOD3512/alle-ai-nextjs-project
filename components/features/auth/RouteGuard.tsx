"use client"

import { useEffect, ReactNode, useState, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores';
import { LoadingScreen } from './LoadingScreen';
import { authApi } from '@/lib/api/auth';

interface RouteGuardProps {
  children: ReactNode;
}

const authRoutes = ['/', '/auth', '/plans'];
const publicRoutes = ['/model-glossary', '/privacy-policy', '/terms-of-service', '/collection', '/release-notes'];

// Create a separate component for the route guard logic
function RouteGuardInner({ children }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { token, setAuth, clearAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setIsChecking(true);
      setCanRender(false);

      // Special case: If we're on the auth page with verify-email mode
      if (pathname === '/auth' && searchParams.get('mode') === 'verify-email') {
        setCanRender(true);
        setIsChecking(false);
        return;
      }

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

      // CASE 2: Has token and trying to access auth routes or /plans
      if (token && (authRoutes.includes(pathname))) {
        try {
          const response = await authApi.getUser();
          setAuth(response.data.user, token, response.plan);

          if (response.data.to === 'verify-email') {
            router.replace(`/auth?mode=verify-email&email=${response.data.user.email}`);
            return;
          } else if (response.data.to === 'chat' && response.plan) {
            router.replace('/chat');
            return;
          } else if (!response.plan) {
            // Only allow rendering plans page if user needs to select a plan
            if (pathname === '/plans') {
              setCanRender(true);
              setIsChecking(false);
              return;
            }
            router.replace('/plans');
            return;
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
  }, [pathname, token, searchParams]);

  // Show loading screen for authenticated users accessing auth routes or plans
  if (isChecking && token && (authRoutes.includes(pathname)) && 
      !(pathname === '/auth' && searchParams.get('mode') === 'verify-email')) {
    return <LoadingScreen />;
  }

  // Don't render anything until we've confirmed the user can access the route
  if (!canRender) {
    return null;
  }

  return <>{children}</>;
}

// Main component wrapped in Suspense
export function RouteGuard({ children }: RouteGuardProps) {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <RouteGuardInner>{children}</RouteGuardInner>
    </Suspense>
  );
}