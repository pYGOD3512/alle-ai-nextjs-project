"use client";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { List } from "lucide-react";
import Link from "next/link";
interface TableOfContentsProps {
  sections: Array<{ id: string; title: string; level: number }>;
  pathname: string;
}

export function OnThisPage({ sections, pathname }: TableOfContentsProps) {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    // Use Intersection Observer for more precise detection of active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-50px 0px -50% 0px", threshold: 0.1 } // Adjust rootMargin and threshold as needed
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    // Cleanup on component unmount
    return () => observer.disconnect();
  }, [sections]);

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
                key={section.id}
                href={`#${section.id}`}
                className={cn(
                  "block py-1.5 px-3 rounded-md transition-all hover:bg-accent/5 hover:text-accent-foreground",
                  "pl-" + (section.level - 1) * 4,
                  activeSection === section.id
                    ? "dark:bg-accent bg-gray-200  rounded-md text-black  dark:text-white"
                    : "text-foreground/80"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState({}, "", `#${section.id}`);
                  const element = document.getElementById(section.id);
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                    setActiveSection(section.id); 

                  }
                }}
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
