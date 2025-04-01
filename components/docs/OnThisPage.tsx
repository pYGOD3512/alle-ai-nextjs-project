"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils"; // Assuming cn returns a string
import { List } from "lucide-react";
import { usePathname } from "next/navigation";

// Define the shape of a section
interface Section {
  hash: string; // Using 'id' instead of 'hash' for consistency, but can revert if needed
  title: string;
  baseUrl?: string;
}

// Define props type for the component
interface OnThisPageProps {
  sections?: Section[]; // Optional array of sections
}

export function OnThisPage({ sections = [] }: OnThisPageProps) {
  const [activeSection, setActiveSection] = useState<string>("");
  const currentPathname: string = usePathname();
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer to track active section
  useEffect(() => {
    if (!sections.length) return; // Skip if no sections provided

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: "-100px 0px 0px 0px",
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      options
    );

    sections.forEach((section: Section) => {
      const element: HTMLElement | null = document.getElementById(section.hash);
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

  // Scroll handler to navigate to sections
  const handleButtonClick = useCallback((targetId: string) => {
    const element: HTMLElement | null = document.getElementById(targetId);
    if (!element) {
      console.warn(`Element with ID ${targetId} not found`);
      return;
    }

    const headerHeight = 100; // Adjust based on your layout
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    setActiveSection(targetId);
    window.history.pushState({}, "", `#${targetId}`);
  }, []);

  // Handle initial hash from URL
  useEffect(() => {
    const hash: string = window.location.hash.replace("#", "");
    if (hash && sections.length > 0) {
      const targetSection: Section | undefined = sections.find(
        (section: Section) => section.hash === hash
      );
      if (targetSection) {
        handleButtonClick(hash);
      }
    }
  }, [sections, handleButtonClick]);

  return (
    <aside className="hidden xl:sticky xl:top-14 xl:block xl:h-[calc(100vh-3.5rem)] xl:overflow-y-auto bg-background/90 p-4 rounded-lg">
      <div className="py-6 pl-4">
        <div className="flex mb-3 gap-2 items-center">
          <List className="h-6 w-5" />
          <h4 className="text-sm font-medium text-foreground/80">
            On this page
          </h4>
        </div>

        <nav className="text-sm">
          <div className="space-y-1">
            {sections.length > 0 ? (
              sections.map((section: Section) => (
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
              <p className="text-foreground/60 italic px-3">
                No sections available
              </p>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
}
