"use client";

import '../globals.css';
import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { HelpButton } from '@/components/HelpButton';
import PlansArea from '@/components/features/plans/PlansArea';
import { useAuth } from '@/components/providers/authTest';
import { MaintenancePage } from '@/components/features/maintenance/MaintenancePage';
import * as Frigade from '@frigade/react';

const isMaintenance = false;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSubscribed } = useAuth();

  const onRefresh = () => {
    window.location.reload();
  }

  // Handle maintenance mode first
  if (isMaintenance) {
    return (
      <MaintenancePage 
        type="outage"
        title="Service Unavailable"
        description="Our service is currently undergoing maintenance. We apologize for the inconvenience."
        estimatedTime="in approximately 24 hours"
        showRefreshButton={true}
        onRefresh={onRefresh}
      />
    );
  }

  return (
    <>
      {isSubscribed ? (
        <Frigade.Provider
        apiKey="api_public_BGpQR8HxE4b3kuNSLcZycUQmi5rGQbd4bjowqjRRtYoZ7ODc37Cspa9vTpRcelti"
        userId="my-user-id">
          <Frigade.Tour
            flowId="flow_Nx0Q4Shx" 
          />
          <div className="h-screen flex overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col h-full relative">
              <Header />
              <div className="flex-1 overflow-auto">
                {children}
              </div>
              <HelpButton />
            </main>
          </div>
          </Frigade.Provider>
      ) : (
        <div className="h-screen flex overflow-hidden">
          <main className="flex-1 flex flex-col h-full relative">
            <Header />
            <PlansArea />
            <HelpButton />
          </main>
        </div>
      )}
    </>
  );
}
