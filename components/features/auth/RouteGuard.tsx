"use client"

import { useEffect, ReactNode, useState, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores';
import { LoadingScreen } from './LoadingScreen';
import { authApi, User } from '@/lib/api/auth';
import { useConversationStore } from '@/stores/models';


interface RouteGuardProps {
  children: ReactNode;
}

const authRoutes = ['/', '/auth', '/plans'];
const publicRoutes = ['/model-glossary', '/privacy-policy', '/terms-of-service', '/collection', '/release-notes', '/reset-password', '/'];

// Create a separate component for the route guard logic
function RouteGuardInner({ children }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { token, setAuth, clearAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [canRender, setCanRender] = useState(false);
  const { setConversationId, setPromptId, setGenerationType } = useConversationStore();

  useEffect(() => {
    const checkAuth = async () => {
      const callback = searchParams.get('callback');
      const tokenFromUrl = searchParams.get('token');
  
      if (callback === 'google' && tokenFromUrl) {
        setAuth({} as User, tokenFromUrl);
  
        try {
          const response = await authApi.getUser();
          setAuth(response.data.user, tokenFromUrl, response.plan);
  
          if (!response.plan) {
            router.push('/plans');
          } else {
            router.push('/chat');
          }
        } catch (error) {

          clearAuth();
        } finally {
          setIsLoading(false);
        }
  
        return;
      }
      
      setIsChecking(true);
      setCanRender(false);

      // Special case: If we're on the auth page with verify-email mode
      if (pathname === '/auth' && searchParams.get('mode') === 'verify-email') {
        setCanRender(true);
        setIsChecking(false);
        return;
      }

      // Get stored return URL
      const returnUrl = sessionStorage.getItem('returnUrl');
      console.log('returnUrl', returnUrl);

      // CASE 1: No token - only allow access to auth routes and public routes
      if (!token) {
        if (!authRoutes.includes(pathname) && !publicRoutes.includes(pathname)) {
          // Save current path before redirecting to auth
          if (pathname !== '/auth') {
            sessionStorage.setItem('returnUrl', pathname);
          }
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
            // Check for return URL when redirecting from auth
            if (returnUrl && pathname === '/auth') {
              sessionStorage.removeItem('returnUrl');
              setGenerationType('load');
              router.replace(returnUrl);
              return;
            }
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
          if (pathname !== '/auth') {
            sessionStorage.setItem('returnUrl', pathname);
          }
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

  if (isLoading || isChecking) {
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