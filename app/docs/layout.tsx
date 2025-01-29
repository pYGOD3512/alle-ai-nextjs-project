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

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [expandedGuides, setExpandedGuides] = useState<string[]>([]);

  // State to hold the headings
  const [headings, setHeadings] = useState<
    { id: string; title: string; level: number }[]
  >([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const newHeadings = Array.from(
        contentRef.current.querySelectorAll("h2, h3")
      ).map((heading) => {
        const textContent = heading.textContent || "";
        return {
          id:
            heading.id ||
            textContent.replace(/[^a-z0-9]+/gi, "-").toLowerCase() ||
            "",
          title: textContent,
          level: parseInt(heading.tagName.slice(1), 10),
        };
      });
      setHeadings(newHeadings);
    }
  }, [children]);

  useEffect(() => {
    const activeGuide = guides.find((guide) =>
      guide.sections.some((section) => section.href === pathname)
    );
    if (activeGuide && !expandedGuides.includes(activeGuide.id)) {
      setExpandedGuides((prev) => [...prev, activeGuide.id]);
    }
  }, [pathname]);

  const toggleGuide = (guideId: string) => {
    setExpandedGuides((prev) =>
      prev.includes(guideId)
        ? prev.filter((id) => id !== guideId)
        : [...prev, guideId]
    );
  };

  const isLinkActive = (href: string) => {
    return pathname === href;
  };

  const showThreeColumnLayout =
    pathname.startsWith("/docs/user-guides") ||
    pathname.startsWith("/docs/api");

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DocsHeader />
      {/* Main content */}
      {showThreeColumnLayout ? (
        <div className="mx-auto w-full max-w-[1400px] flex-1">
          <div className="flex-1 items-start lg:grid lg:grid-cols-[280px_minmax(0,1fr)_250px] lg:gap-8">
            {/* Enhanced Left Navigation */}
            <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r border-border/40 lg:sticky lg:block bg-background/95 backdrop-blur-sm">
              <ScrollArea className="h-full py-6 px-4">
                <div className="space-y-6">
                  {guides.map((guide) => (
                    <div key={guide.id} className="relative">
                      <button
                        onClick={() => toggleGuide(guide.id)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg p-2 text-sm font-medium transition-all duration-200",
                          guide.sections.some((section) =>
                            isLinkActive(section.href)
                          )
                            ? "text-foreground bg-accent/5"
                            : "text-foreground/90 hover:bg-accent/10"
                        )}
                      >
                        <span className="font-semibold">{guide.title}</span>
                        <ChevronRight
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            guide.sections.some((section) =>
                              isLinkActive(section.href)
                            )
                              ? "text-accent"
                              : "text-muted-foreground",
                            expandedGuides.includes(guide.id) ? "rotate-90" : ""
                          )}
                        />
                      </button>

                      <div
                        className={cn(
                          "mt-1 space-y-1 overflow-hidden transition-all duration-200",
                          expandedGuides.includes(guide.id)
                            ? "max-h-[500px] opacity-100"
                            : "max-h-0 opacity-0"
                        )}
                      >
                        {guide.sections.map((section) => (
                          <Link
                            key={section.id}
                            href={section.href}
                            className={cn(
                              "group flex items-center w-full rounded-md p-2 text-sm transition-all duration-200 ml-2",
                              "relative overflow-hidden",
                              isLinkActive(section.href)
                                ? "bg-accent text-white font-medium shadow-sm"
                                : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                            )}
                          >
                            <span className="relative z-10">
                              {section.title}
                            </span>
                            {!isLinkActive(section.href) && (
                              <span className="absolute inset-0 w-0 bg-accent/10 transition-all duration-300 group-hover:w-full" />
                            )}
                            {isLinkActive(section.href) && (
                              <span className="absolute left-0 top-0 h-full w-1 bg-accent" />
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </aside>

            {/* Main content area */}
            <main className="relative py-6">
              <ScrollArea className="h-[calc(100vh-3.5rem)]">
                <div ref={contentRef} className="px-8">
                  {children}
                </div>
              </ScrollArea>
            </main>

            {/* Table of contents */}
            <OnThisPage pathname={pathname} sections={headings} />
          </div>
        </div>
      ) : (
        <main className="flex-1">
          <div className="mx-auto max-w-4xl py-6 px-8 lg:py-8">{children}</div>
        </main>
      )}
    </div>
  );
}
