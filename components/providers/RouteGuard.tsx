"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { publicRoutes, privateRoutes } from './authTest';
import { usePageTitle } from '@/hooks/use-page-title';
import { NotFoundPage } from '@/components/features/not-found/404';
import { useAuth } from './authTest';
import { LoadingScreen } from '@/components/features/auth/LoadingScreen';

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [isValidRoute, setIsValidRoute] = useState(true);
  const [isChecking, setIsChecking] = useState(true);
  const { isSubscribed, isAuthenticated } = useAuth();
  
  usePageTitle();

  useEffect(() => {
    const checkAuthorization = async () => {
      setIsChecking(true);
      
      const matchRoute = (route: string): boolean => {
        if (route === pathname) return true;
        if (route.endsWith('/*') && pathname.startsWith(route.slice(0, -2))) return true;
        return false;
      };

      const isPublicRoute = publicRoutes.some(route => matchRoute(route));
      const isPrivateRoute = privateRoutes.some(route => matchRoute(route));

      // Allow access to auth routes when not authenticated
      if (pathname.startsWith('/auth')) {
        if (isAuthenticated) {
          router.replace('/chat');
          setAuthorized(false);
        } else {
          setAuthorized(true);
        }
        setIsChecking(false);
        return;
      }

      // Check authentication for non-public routes
      if (!isAuthenticated && !isPublicRoute) {
        router.replace('/auth');
        setAuthorized(false);
        setIsChecking(false);
        return;
      }

      // Check subscription for private routes
      if (isPrivateRoute && !isSubscribed) {
        router.replace('/plans');
        setAuthorized(false);
        setIsChecking(false);
        return;
      }

      // Valid route and authorized
      setIsValidRoute(true);
      setAuthorized(true);
      setIsChecking(false);
    };

    // Add a minimum delay to prevent flash
    const minDelay = 1000; // 1 second minimum loading time
    const timer = setTimeout(() => {
      checkAuthorization();
    }, minDelay);

    return () => clearTimeout(timer);
  }, [pathname, router, isAuthenticated, isSubscribed]);

  // Only show loading screen during initial check
  if (isChecking) {
    return <LoadingScreen />;
  }

  // Show 404 for invalid routes
  if (!isValidRoute) {
    return (
      <NotFoundPage 
        title="Page Not Found"
        description="Oops! Looks like you've wandered off the beaten path. Let's get you back on track!"
        showHomeButton={true}
      />
    );
  }

  // Show the actual content for valid routes
  return authorized ? children : null;
}