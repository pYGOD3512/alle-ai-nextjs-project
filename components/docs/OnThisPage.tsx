"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { List } from "lucide-react";
import { usePathname } from "next/navigation";

export function OnThisPage() {
  const [sections, setSections] = useState<Array<{ id: string; title: string }>>([]);
  const [activeSection, setActiveSection] = useState("");
  const currentPathname = usePathname();
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Extract h2 elements when pathname changes
  useEffect(() => {
    const fetchHeadings = () => {
      const h2Elements = document.querySelectorAll("h2");
      const newSections = Array.from(h2Elements)
        .filter((h2) => h2.id)
        .map((h2) => ({
          id: h2.id,
          title: h2.id.replace(/_/g, " "),
        }));

      h2Elements.forEach((h2) => {
        if (!h2.id) {
          console.warn("h2 element found without an ID:", h2.textContent);
        }
      });

      setSections(newSections);
      setActiveSection("");
    };

    fetchHeadings();

    const observer = new MutationObserver(fetchHeadings);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [currentPathname]);

  // Set up Intersection Observer for active section tracking
  useEffect(() => {
    if (!sections.length) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const options = {
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
      const element = document.getElementById(section.id);
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

  // Simplified scroll handler
  const handleButtonClick = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) {
      console.warn(`Element with ID ${sectionId} not found`);
      return;
    }

    // Get the header height - adjust this value based on your layout
    const headerHeight = 100; // 100px offset

    // Calculate the element's position relative to the viewport
    const elementPosition = element.getBoundingClientRect().top;
    
    // Add current scroll position to get absolute position
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

    // Perform the scroll
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });

    // Update active section and URL
    setActiveSection(sectionId);
    window.history.pushState({}, "", `#${sectionId}`);
  }, []); 

  // Handle initial hash
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && sections.length > 0) {
      handleButtonClick(hash);
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
            {sections.map((section) => (
              <button
                key={`${currentPathname}-${section.id}`}
                onClick={() => handleButtonClick(section.id)}
                className={cn(
                  "block w-full text-left py-1.5 px-3 rounded-md transition-all",
                  activeSection === section.id
                    ? "bg-muted-foreground text-white"
                    : "text-foreground/80 hover:bg-muted"
                )}
              >
                {section.title}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </aside>
  );
}