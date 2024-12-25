"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { publicRoutes, privateRoutes } from './authTest';
import { usePageTitle } from '@/hooks/use-page-title';

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  
  usePageTitle();

  useEffect(() => {
    const matchRoute = (route: string): boolean => {
      if (route === pathname) return true;
      if (route.endsWith('/*') && pathname.startsWith(route.slice(0, -2))) return true;
      return false;
    };

    const isPublicRoute = publicRoutes.some(route => matchRoute(route));
    const isPrivateRoute = privateRoutes.some(route => matchRoute(route));

    if (!isPublicRoute && !isPrivateRoute) {
      router.replace('/');
    } else {
      setAuthorized(true);
    }
  }, [pathname, router]);

  // Show nothing while checking route
  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}