// @ts-nocheck
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { guides } from "@/lib/constants/docs";
import { ChevronRight } from "lucide-react";
import { DocsHeader } from "@/components/docs/docsHeader";
import { OnThisPage } from "@/components/docs/OnThisPage";
import { ExternalLink } from "lucide-react";
import { userGuides } from "@/lib/constants/docs";
import { SidebarNav } from "@/components/docs/SidebarNav";

const hheading = [
  {
    id: "Random test",
    href: "",
  },
  {
    id: "Random heading 2 ",
    href: "",
  },
  {
    id: "test heading 3",
    href: "",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<
    { id: string; title: string; level: number }[]
  >([]);

  const isLinkActive = (href: string) => pathname === href;

  // Check for three-column layout (user guides)
  const isThreeColumnLayout = pathname.startsWith("/docs/user-guides/");

  // Check for two-column layout (API reference)
  const isTwoColumnLayout = pathname.startsWith("/docs/api-reference/");

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DocsHeader />
      {isThreeColumnLayout ? (
        // Three-column layout for user guides
        <div className="flex-1 flex">
          <aside className="hidden lg:block w-[280px] shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] bg-sideBarBackground border-r border-border/40">
            <SidebarNav />
          </aside>
          <main className="flex-1 min-w-0 relative">
            <div className="h-[calc(100vh-3.5rem)] overflow-y-auto">
              <div className="max-w-4xl mx-auto px-6 py-6">{children}</div>
            </div>
          </main>
          <aside className="hidden xl:block w-[250px] shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] bg-background/90 border-l border-border/40">
            <div className="h-full p-4">
              <OnThisPage pathname={pathname} sections={hheading} />
            </div>
          </aside>
        </div>
      ) : isTwoColumnLayout ? (
        // Two-column layout for API reference
        <div className="flex-1 flex">
          <aside className="hidden lg:block w-[280px] shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] bg-sideBarBackground border-r border-border/40">
            <SidebarNav />
          </aside>
          <main className="flex-1 min-w-0 relative">
            <div className="h-[calc(100vh-3.5rem)] overflow-y-auto">
              <div className="w-full px-6 py-6">
                {" "}
                {/* Removed max-w-4xl and mx-auto to allow full width */}
                {children}
              </div>
            </div>
          </main>
        </div>
      ) : (
        // Default single-column layout for other pages
        <main className="flex-1">
          <div className="mx-auto max-w-4xl py-6 px-8 lg:py-8">{children}</div>
        </main>
      )}
    </div>
  );
}
