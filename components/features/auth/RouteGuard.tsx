"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores';
import { LoadingScreen } from '@/components/features/auth/LoadingScreen';

export const publicRoutes = ['/', '/auth', '/login', '/register', '/model-glossary', '/privacy-policy', '/terms-of-service', '/loading'];
export const authRoutes = ['/login', '/register', '/auth'];
export const planRoutes = ['/plans', '/pricing'];

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { 
    token,
    isLoading,
    isAuthenticated,
    isVerified,
    hasPlan,
    checkAuth,
    setLoading 
  } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    const guardRoute = async () => {
      try {
        // Only set loading if component is still mounted
        if (mounted) setLoading(true);

        // If no token and trying to access protected route
        if (!token) {
          if (!publicRoutes.includes(pathname)) {
            router.replace('/');
          }
          return;
        }

        // Check authentication status
        await checkAuth();

        if (!mounted) return;

        // Route guard logic for authenticated users
        if (isAuthenticated) {
          if (authRoutes.includes(pathname)) {
            router.replace('/chat');
            return;
          }

          if (!isVerified && pathname !== '/auth') {
            router.replace('/auth');
            return;
          }

          if (isVerified && !hasPlan && !planRoutes.includes(pathname)) {
            router.replace('/plans');
            return;
          }
        } else if (!publicRoutes.includes(pathname)) {
          router.replace('/');
        }
      } catch (error) {
        console.error('Route guard error:', error);
        if (!publicRoutes.includes(pathname)) {
          router.replace('/');
        }
      } finally {
        // Only set loading false if component is still mounted
        if (mounted) setLoading(false);
      }
    };

    guardRoute();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      mounted = false;
    };
  }, [pathname]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}