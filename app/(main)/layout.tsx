"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { MainLayoutClient } from '@/components/MainLayoutClient';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Handle browser back button
    const handlePopState = () => {
      // If we're navigating away from a conversation page
      if (pathname.includes('/res/')) {
        // Determine the parent route
        let parentRoute = "/chat";
        if (pathname.startsWith("/image")) {
          parentRoute = "/image";
        } else if (pathname.startsWith("/audio")) {
          parentRoute = "/audio";
        } else if (pathname.startsWith("/video")) {
          parentRoute = "/video";
        }
        
        // Redirect to parent route
        router.replace(parentRoute);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [pathname, router]);

  return <MainLayoutClient>{children}</MainLayoutClient>;
}
