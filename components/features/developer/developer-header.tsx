"use client";

import { Button } from "@/components/ui/button";
import { Settings, ExternalLink } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { FeedbackModal } from "@/components/ui/modals";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/developer" },
  { label: "Workbench", href: "/developer/workbench" },
  { label: "Settings", href: "/developer/settings/profile" },
];

export function DeveloperHeader() {
  const pathname = usePathname();

  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  return (
  <>
    <header className="fixed top-0 left-0 right-0 bg-backgroundSecondary/95 backdrop-blur-lg supports-[backdrop-filter]:bg-backgroundSecondary/60 z-50">
      <div className="flex h-14 items-center justify-between px-4 mx-2">
        {/* Left: Logo Section */}
        <div className="w-[200px]">
          <Link href="/developer" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Company Logo"
              width={100}
              height={100}
              className="dark:invert"
            />
          </Link>
        </div>

        {/* Center: Navigation */}
        <nav className="flex items-center justify-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-foreground ${
                pathname === item.href 
                  ? "text-foreground" 
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-4 w-[200px]">
          <ThemeToggle />
          <Link 
            href="/docs" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Docs
          </Link>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={()=> {setFeedbackModalOpen(true)}}
          >
            Feedback
          </Button>
        </div>
      </div>
    </header>
    <FeedbackModal 
    isOpen={feedbackModalOpen} 
    onClose={() => setFeedbackModalOpen(false)} 
  />
  </>
  );
}