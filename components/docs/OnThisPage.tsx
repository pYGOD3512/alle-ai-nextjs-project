"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { List } from "lucide-react";
import { usePathname } from "next/navigation";

export function OnThisPage({ 
  usePassedData = false, 
  sections = [] 
}: { 
  usePassedData?: boolean; 
  sections?: Array<{ hash: string; title: string }> 
}) {
  const [dynamicSections, setDynamicSections] = useState<
    Array<{ id: string; title: string }>
  >([]);
  const [activeSection, setActiveSection] = useState("");
  const currentPathname = usePathname();
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Implementation 1: Dynamic DOM-based Heading Extraction
  // This runs only if usePassedData is false, fetching h2 elements from the page
  useEffect(() => {
    if (usePassedData) return; // Skip this if we're using passed data

    const fetchHeadings = () => {
      const h2Elements = document.querySelectorAll("h2");
      const newSections = Array.from(h2Elements)
        .filter((h2) => h2.id)
        .map((h2) => ({
          id: h2.id,
          title: h2.id.replace(/_/g, " "), // Convert ID to readable title
        }));

      h2Elements.forEach((h2) => {
        if (!h2.id) {
          console.warn("h2 element found without an ID:", h2.textContent);
        }
      });

      setDynamicSections(newSections);
      setActiveSection("");
    };

    fetchHeadings();

    const observer = new MutationObserver(fetchHeadings);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [currentPathname, usePassedData]);

  // Implementation 1: Intersection Observer for Dynamic Sections
  // Tracks which section is in view when using DOM-based data
  useEffect(() => {
    if (usePassedData || !dynamicSections.length) return;

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

    dynamicSections.forEach((section) => {
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
  }, [dynamicSections, usePassedData]);

  // Scroll Handler for Both Implementations
  // Handles scrolling to sections, works with either dynamic IDs or passed hashes
  const handleButtonClick = useCallback((targetId: string) => {
    const element = document.getElementById(targetId);
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

  // Implementation 2: Handle Passed Data
  // If usePassedData is true, use the sections prop directly without DOM scanning
  const sectionsToRender = usePassedData
    ? sections.map((section) => ({
        id: section.hash, // Use hash as the ID for scrolling
        title: section.title,
      }))
    : dynamicSections;

  // Handle Initial Hash for Both Implementations
  // Ensures the page scrolls to the correct section on load if there's a hash in the URL
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && sectionsToRender.length > 0) {
      const targetSection = sectionsToRender.find(
        (section) => section.id === hash
      );
      if (targetSection) {
        handleButtonClick(hash);
      }
    }
  }, [sectionsToRender, handleButtonClick]);

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
            {sectionsToRender.map((section) => (
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
