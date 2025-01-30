"use client";

import { useAuth } from '@/components/providers/authTest';
import { MaintenancePage } from '@/components/features/maintenance/MaintenancePage';
import * as Frigade from '@frigade/react';
import { useSidebarStore } from "@/stores";
import { usePathname } from 'next/navigation';
import { FooterText } from '@/components/FooterText';

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const { isSubscribed } = useAuth();
  const { isOpen } = useSidebarStore();
  const pathname = usePathname();

  const onRefresh = () => {
    window.location.reload();
  }

  return (
    <Frigade.Provider
      apiKey="api_public_BGpQR8HxE4b3kuNSLcZycUQmi5rGQbd4bjowqjRRtYoZ7ODc37Cspa9vTpRcelti"
      userId="my-user-id">
      <Frigade.Tour flowId="flow_Nx0Q4Shx" />
      {children}
      {pathname === "/" && (
        <FooterText 
          className={`fixed bottom-0 ${isOpen ? "right-[39%]" : "right-[45%]"} h-6 transition-all duration-300`}
        />
      )}
    </Frigade.Provider>
  );
}