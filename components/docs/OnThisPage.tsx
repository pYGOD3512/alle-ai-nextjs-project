"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { List } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface TableOfContentsProps {
  sections: Array<{ id: string; title: string; level: number }>;
  pathname: string;
}

export function OnThisPage({ sections, pathname }: TableOfContentsProps) {
  const [activeSection, setActiveSection] = useState("");
  const currentPathname = usePathname();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const headingsRef = useRef<{ [key: string]: DOMRect }>({});

  // // Reset state on route change
  // useEffect(() => {
  //   setActiveSection("");
  //   return () => {
  //     if (timeoutRef.current) {
  //       clearTimeout(timeoutRef.current);
  //     }
  //   };
  // }, [currentPathname]);

  // Calculate heading positions
  const updateHeadingPositions = useCallback(() => {
    const positions: { [key: string]: DOMRect } = {};
    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        positions[id] = element.getBoundingClientRect();
      }
    });
    headingsRef.current = positions;
  }, [sections]);

  // Determine active section based on scroll position
  const determineActiveSection = useCallback(() => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const positions = headingsRef.current;

    // Find the section closest to the top of the viewport
    let closestSection = "";
    let closestDistance = Infinity;

    Object.entries(positions).forEach(([id, rect]) => {
      const element = document.getElementById(id);
      if (element) {
        const distance = Math.abs(element.getBoundingClientRect().top);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestSection = id;
        }
      }
    });

    if (closestSection && closestSection !== activeSection) {
      setActiveSection(closestSection);
    }
  }, [activeSection]);

  // Handle scroll events with debouncing
  useEffect(() => {
    const handleScroll = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        determineActiveSection();
      }, 100);
    };

    // Initial positioning
    timeoutRef.current = setTimeout(() => {
      updateHeadingPositions();
      determineActiveSection();
    }, 100);

    // Update positions on scroll
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Update positions on resize
    window.addEventListener("resize", updateHeadingPositions);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateHeadingPositions);
    };
  }, [determineActiveSection, updateHeadingPositions]);

  const handleLinkClick = useCallback(
    (e: React.MouseEvent, sectionId: string) => {
      e.preventDefault();
      const element = document.getElementById(sectionId);
      if (element) {
        window.history.pushState({}, "", `#${sectionId}`);
        const offset =
          element.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({
          top: offset,
          behavior: "smooth",
        });
        setActiveSection(sectionId);
      }
    },
    []
  );

  // Handle initial hash in URL
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      timeoutRef.current = setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const offset =
            element.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({
            top: offset,
            behavior: "smooth",
          });
          setActiveSection(hash);
        }
      }, 100);
    }
  }, [currentPathname]);

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
            {sections.map((section) => (
              <Link
                key={`${currentPathname}-${section.id}`}
                href={`#${section.id}`}
                className={cn(
                  "block py-1.5 px-3 rounded-md transition-all",
                  "pl-" + (section.level - 1) * 4,
                  activeSection === section.id
                    ? "dark:bg-muted-foreground rounded-md text-black dark:text-white"
                    : "text-foreground/80"
                )}
                onClick={(e) => handleLinkClick(e, section.id)}
              >
                {section.title}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </aside>
  );
}
