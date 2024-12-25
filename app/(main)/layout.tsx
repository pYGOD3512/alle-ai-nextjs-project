"use client";

import '../globals.css';
import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import PlansArea from '@/components/features/plans/PlansArea';
import { usePathname, useRouter } from 'next/navigation';
import { privateRoutes, useAuth } from '@/components/providers/authTest';
import { MaintenancePage } from '@/components/features/maintenance/MaintenancePage';
import { useEffect } from 'react';

const isMaintenance = false;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSubscribed } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const matchRoute = (route: string): boolean => {
    if (route === pathname) return true;
    if (route.endsWith('/*') && pathname.startsWith(route.slice(0, -2))) return true;
    return false;
  };

  const isPrivateRoute = privateRoutes.some(route => matchRoute(route));

  // Handle maintenance mode first
  if (isMaintenance) {
    return (
      <MaintenancePage 
        type="outage"
        title="Service Unavailable"
        description="Our service is currently undergoing maintenance. We apologize for the inconvenience."
        showRefreshButton={true}
      />
    );
  }

  // Redirect unsubscribed users trying to access private routes
  useEffect(() => {
    if (!isSubscribed && isPrivateRoute) {
      router.replace('/');
    }
  }, [isSubscribed, isPrivateRoute, router]);

  return (
    <>
      {isSubscribed ? (
        <div className="h-screen flex overflow-hidden">
          <Sidebar />
          <main className="flex-1 flex flex-col h-full relative">
            <Header />
            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </main>
        </div>
      ) : (
        <div className="h-screen flex overflow-hidden">
          <main className="flex-1 flex flex-col h-full relative">
            <Header />
            <PlansArea />
          </main>
        </div>
      )}
    </>
  );
}
