"use client";

import '@/app/globals.css';
import React, { useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { HelpButton } from '@/components/HelpButton';
import { MaintenancePage } from '@/components/features/maintenance/MaintenancePage';
import * as Frigade from '@frigade/react';
import { FooterText } from '@/components/FooterText';
import { useSidebarStore } from "@/stores";
import { usePathname } from 'next/navigation';
import { usePageTitle } from '@/hooks/use-page-title';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"



const isMaintenance = false;

export function MainLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen } = useSidebarStore();
  const pathname = usePathname();
  usePageTitle(); 


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
    <div className="h-screen flex overflow-hidden">
        {/* <SidebarProvider> */}
       {/* <AppSidebar /> */}
        <Sidebar />
        <main className="flex-1 flex flex-col h-full relative">
          {/* <SidebarTrigger /> */}
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
    {/* </SidebarProvider> */}
      </div>
  );
}