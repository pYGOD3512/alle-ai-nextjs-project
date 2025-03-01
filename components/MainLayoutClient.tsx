"use client";

import '@/app/globals.css';
import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { HelpButton } from '@/components/HelpButton';
import { MaintenancePage } from '@/components/features/maintenance/MaintenancePage';
import * as Frigade from '@frigade/react';
import { FooterText } from '@/components/FooterText';
import { useSidebarStore } from "@/stores";
import { usePathname } from 'next/navigation';

const isMaintenance = false;

export function MainLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen } = useSidebarStore();
  const pathname = usePathname();

  if (isMaintenance) {
    return (
      <MaintenancePage 
        type="outage"
        title="Service Unavailable"
        description="Our service is currently undergoing maintenance."
        estimatedTime="in approximately 24 hours"
        showRefreshButton={true}
        onRefresh={() => window.location.reload()}
      />
    );
  }

  return (
    // <Frigade.Provider
    //   apiKey="api_public_BGpQR8HxE4b3kuNSLcZycUQmi5rGQbd4bjowqjRRtYoZ7ODc37Cspa9vTpRcelti"
    //   userId="my-user-id">
    //   <Frigade.Tour flowId="flow_Nx0Q4Shx" />
      <div className="h-screen flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col h-full relative">
          <Header />
          <div className="flex-1 overflow-auto">
            {children}
          </div>
          <HelpButton />
          {pathname === "/chat" && (
            <FooterText 
              className={`fixed bottom-0 ${isOpen ? "right-[38%]" : "right-[28%] sm:right-[32%] md:right-[36%] lg:right-[42%]"} h-6 transition-all duration-300`}
            />
          )}
        </main>
      </div>
    // </Frigade.Provider>
  );
}