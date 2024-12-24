"use client";

import '../globals.css';
import React from 'react';
import { Inter } from 'next/font/google';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import PlansArea from '@/components/features/plans/PlansArea';
import { usePathname } from 'next/navigation';

import { privateRoutes, publicRoutes, useAuth } from '@/components/providers/authTest';
import { MaintenancePage } from '@/components/features/maintenance/MaintenancePage';
import { NotFoundPage } from '@/components/features/not-found/404';

const inter = Inter({ subsets: ['latin'] });

const isMaintenance = false;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSubscribed } = useAuth();
  const pathname = usePathname();

  // Function to check if the current path matches any route
  const matchRoute = (route: string): boolean => {
    // Exact match
    if (route === pathname) return true;
    
    // Check if the pathname starts with the route (for nested routes)
    if (route.endsWith('/*') && pathname.startsWith(route.slice(0, -2))) return true;
    
    return false;
  };

  // Check if the current path matches any public or private route
  const isPublicRoute = publicRoutes.some(route => matchRoute(route));
  const isPrivateRoute = privateRoutes.some(route => matchRoute(route));

  // Handle maintenance mode first
  if (isMaintenance) {
    return (
      <MaintenancePage 
        type="error"
        title="System Error"
        description="We're experiencing technical difficulties. Our team has been notified and is working on a fix."
        showRefreshButton={false}
      />
    );
  }

  if (!isSubscribed && isPrivateRoute) {
    // Unsubscribed user trying to access private route
    return (
      <NotFoundPage 
        title="Oops! Page Not Found"
        description="It looks like the page you're looking for doesn't exist. Maybe try checking the URL"
        showHomeButton={true}
      />
    );
  }

  // Normal Layout
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
