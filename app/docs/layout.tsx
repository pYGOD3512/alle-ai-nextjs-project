"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SearchCommand } from "@/components/features/developer/search-command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { guides } from "@/lib/constants/docs";




export default function Layout({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("");
  const defaultPath = "/docs/guides/initial-setup";

  const navItems = [
    { name: "Welcome", href: "/docs/getting-started" },
    { name: "User Guide", href: "/docs/user-guides" },
    { name: "API Reference", href: "/docs/api" },
    { name: "Changelog", href: "/changelog" },
    { name: "System Status", href: "/status" },
    { name: "FAQ", href: "/faq" },
    { name: "Discussions", href: "/discussions" },
  ];

  // Only show the three-column layout for guides and API pages
  const showThreeColumnLayout = pathname.startsWith('/docs/user-guides') || pathname.startsWith('/docs/api');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-8 max-w-[1400px] mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={resolvedTheme === "dark" ? "/svgs/logo-desktop-full.png" : "/svgs/logo-desktop-dark-full.png"}
              alt="Logo"
              height={32}
              width={32}
              className="h-8 w-auto"
            />
          </Link>

          {/* Navigation - centered */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`transition-colors hover:text-foreground/80 ${
                  pathname.startsWith(item.href) 
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            <SearchCommand />
            <ThemeToggle />
            <Link
              href="/playground"
              className="inline-flex items-center justify-center rounded-md bg-[#2DD4BF] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2DD4BF]/90"
            >
              Playground
            </Link>
            {/* API Button */}
            <Link
              href="/api"
              className="inline-flex items-center justify-center rounded-md bg-[#2DD4BF] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2DD4BF]/90"
            >
              API
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      {showThreeColumnLayout ? (
        <div className="mx-auto w-full max-w-[1400px] flex-1">
          <div className="flex-1 items-start lg:grid lg:grid-cols-[280px_minmax(0,1fr)_250px] lg:gap-8">
            {/* Left Navigation */}
            <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r border-border/40 lg:sticky lg:block">
              <div className="h-full py-6 pl-8 pr-4">
                <h2 className="font-medium mb-4">Guides</h2>
                <nav className="space-y-1">
                  {guides.map((item) => (
                    <Link
                      key={item.id}
                      href={item.id}
                      className={cn(
                        "block py-2 text-sm transition-all rounded-md",
                        pathname === item.href
                          ? "bg-blue-50 text-blue-700 font-medium dark:bg-blue-900/30 dark:text-blue-200"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                      )}
                    >
                      {item.title}
                    </Link>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main content area */}
            <main className="relative py-6">
              <ScrollArea className="h-[calc(100vh-3.5rem)]">
                <div className="px-8">
                  {children}
                </div>
              </ScrollArea>
            </main>

            {/* Right sidebar - Table of contents */}
            <aside className="hidden xl:sticky xl:top-14 xl:block xl:h-[calc(100vh-3.5rem)] xl:overflow-y-auto">
              <div className="py-6 pl-4">
                <h4 className="mb-3 text-sm font-medium">On this page</h4>
                <nav className="text-sm">
                  <div className="space-y-1">
                    {guides.find(g => (pathname === g.href || pathname === "/docs/guides"))?.content?.sections.map((section) => (
                      <Link 
                        key={section.id}
                        href={`#${section.id}`}
                        className={cn(
                          "block py-1.5 px-3 rounded-md transition-all",
                          activeSection === section.id
                            ? "bg-blue-50 text-blue-700 font-medium dark:bg-blue-900/30 dark:text-blue-200"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                        )}
                      >
                        {section.title}
                      </Link>
                    ))}
                  </div>
                </nav>
              </div>
            </aside>
          </div>
        </div>
      ) : (
        // Regular single-column layout for home and other pages
        <main className="flex-1">
          <div className="mx-auto max-w-4xl py-6 px-8 lg:py-8">
            {children}
          </div>
        </main>
      )}
    </div>
  );
}
