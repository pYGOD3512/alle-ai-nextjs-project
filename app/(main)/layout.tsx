"use client";

import '../globals.css';
import React from 'react';
import { Inter } from 'next/font/google';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import PlansArea from '@/components/features/plans/PlansArea';

import { useAuth } from '@/components/providers/authTest';
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

  return (
  <>
    {isSubscribed ? (
    <div className="h-screen flex overflow-hidden">
      {isMaintenance ? '' : <Sidebar />}
      <main className="flex-1 flex flex-col h-full relative">
        {isMaintenance ? (
          <>
          {/* For maintenance */}
          {/* <MaintenancePage 
            type="maintenance"
            title="System Upgrade in Progress"
            description="We're making things better! Our team is implementing exciting new features and improvements."
            estimatedTime="24 hours"
            showRefreshButton={false}
          /> */}

          {/* For system error */}
          {/* <MaintenancePage 
            type="error"
            title="System Error"
            description="We're experiencing technical difficulties. Our team has been notified and is working on a fix."
            showRefreshButton={false}
          /> */}

          {/* For service outage */}
          {/* <MaintenancePage 
            type="outage"
            title="Service Unavailable"
            description="Our services are currently unavailable due to an unexpected outage."
            estimatedTime="1 hour"
            showRefreshButton={false}
          /> */}

          {/* <NotFoundPage 
            title="Page Not Found"
            description="Oops! Looks like you've wandered off the beaten path. Let's get you back on track!"
          /> */}

          </>
        ) : (
          <>
            <Header />
            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </>
        )}
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
