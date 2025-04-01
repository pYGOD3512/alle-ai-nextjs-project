"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { List } from "lucide-react";
import { usePathname } from "next/navigation";

interface Section {
  hash: string;
  title: string;
  baseUrl?: string;
}

interface OnThisPageProps {
  sections?: Section[];
}

export function OnThisPage({ sections = [] }: OnThisPageProps) {
  const [activeSection, setActiveSection] = useState<string>("");
  const currentPathname = usePathname();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const hasMounted = useRef(false);

  const scrollToInitialHash = useCallback(() => {
    if (!hasMounted.current) return; // Prevent running on initial render

    const hash = window.location.hash.replace("#", "");
    if (hash && sections.length > 0) {
      const targetSection = sections.find((section) => section.hash === hash);
      if (targetSection) {
        const element = document.getElementById(hash);
        if (element) {
          const headerHeight = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
          setActiveSection(hash);
          window.history.pushState({}, "", `#${hash}`);
        }
      }
    }
  }, [sections]);

  // Intersection Observer setup
  useEffect(() => {
    if (!sections.length) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: "-100px 0px 0px 0px",
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);

    sections.forEach((section) => {
      const element = document.getElementById(section.hash);
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [sections]);

  // Handle initial mount and hash scrolling
  useEffect(() => {
    hasMounted.current = true;
    scrollToInitialHash();
  }, [scrollToInitialHash]);

  const handleButtonClick = useCallback((targetId: string) => {
    const element = document.getElementById(targetId);
    if (!element) {
      console.warn(`Element with ID ${targetId} not found`);
      return;
    }

    const headerHeight = 100;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    setActiveSection(targetId);
    window.history.pushState({}, "", `#${targetId}`);
  }, []);

  return (
    <aside className="hidden xl:sticky xl:top-14 xl:block xl:h-[calc(100vh-3.5rem)] xl:overflow-y-auto bg-background/90 p-4 rounded-lg">
      <div className="py-6 pl-4">
        <div
          className="flex mb

-3 gap-2 items-center"
        >
          <List className="h-6 w-5" />
          <h4 className="text-sm font-medium text-foreground/80">
            On this page
          </h4>
        </div>

        <nav className="text-sm">
          <div className="space-y-1">
            {sections.length > 0 ? (
              sections.map((section) => (
                <button
                  key={section.hash}
                  onClick={() => handleButtonClick(section.hash)}
                  className={cn(
                    "block w-full text-left py-1.5 px-3 rounded-md transition-all",
                    activeSection === section.hash
                      ? "bg-muted-foreground text-white"
                      : "text-foreground/80 hover:bg-muted"
                  )}
                >
                  {section.title}
                </button>
              ))
            ) : (
              <p className="text-foreground/60 italic px-3" key="no-sections">
                No sections available
              </p>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
}
