"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ExternalLink, ChevronDown, ChevronRight } from "lucide-react";
import { tutorial, apiReference, guides } from "@/lib/constants/docs";
import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";

type SectionItem = {
  id: string;
  title: string;
  href?: string;
  sections?: SectionItem[];
};

export const SidebarNav = () => {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  // Memoized active path check
  const isActive = useCallback((path: string) => pathname === path, [pathname]);

  // Optimized toggle function
  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  }, []);

  // Auto-expand logic with memoization
  useEffect(() => {
    if (!pathname?.startsWith("/docs/api-reference")) return;

    const currentPath = pathname.replace("/docs/api-reference/", "");
    const newExpandedSections: Record<string, boolean> = {};

    apiReference.forEach((item) => {
      item.sections.forEach((section) => {
        if (section.sections?.some((sub) => currentPath.startsWith(sub.href))) {
          newExpandedSections[section.id] = true;
        }
      });
    });

    setExpandedSections((prev) => ({ ...prev, ...newExpandedSections }));
  }, [pathname]);

  // Unified click handler with memoization
  const handleReferenceClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, sectionHref?: string) => {
      e.preventDefault();
      if (!sectionHref) return;

      window.history.pushState(null, "", `/docs/api-reference/${sectionHref}`);
      const element = document.querySelector(`[data-section="${sectionHref}"]`);
      element?.scrollIntoView({ behavior: "instant" });
    },
    []
  );

  // Memoized render functions
  const renderNavItem = useCallback(
    (item: SectionItem, parentPath = "", isSupport = false) => {
      const fullPath = `${parentPath}/${item.id}`;
      const active = isActive(fullPath);

      if (isSupport) {
        return (
          <Link
            href={item.href || ""}
            target="_blank"
            className="group flex items-center w-3/4 rounded-md p-2 text-sm ml-2 hover:bg-accent/10 hover:text-foreground text-muted-foreground"
          >
            <span className="relative z-10">{item.title}</span>
            <ExternalLink className="ml-2 h-4 w-4 opacity-70" />
          </Link>
        );
      }

      return (
        <Link
          href={fullPath}
          onClick={(e) =>
            parentPath === "/docs/api-reference" &&
            handleReferenceClick(e, item.href || item.id)
          }
          className={cn(
            "group flex items-center w-3/4 rounded-md p-2 text-sm transition-all duration-200",
            "relative overflow-hidden",
            active
              ? "dark:bg-accent bg-gray-200 rounded-md text-black dark:text-white font-medium shadow-sm"
              : "text-muted-foreground dark:hover:bg-accent hover:text-foreground",
            parentPath === "/docs/user-guides" ? "py-2" : "",
            parentPath === "/docs/tutorials" ? "py-2 px-2" : ""
          )}
        >
          <span
            className={cn(
              "relative z-10",
              parentPath === "/docs/user-guides" ? "px-2" : ""
            )}
          >
            {item.title}
          </span>
        </Link>
      );
    },
    [isActive, handleReferenceClick]
  );

  const renderSection = useCallback(
    (section: SectionItem, parentPath = "") => {
      if (section.sections) {
        return (
          <div key={section.id}>
            <button
              onClick={() => toggleSection(section.id)}
              className="group flex items-center justify-between w-3/4 rounded-md p-2 text-sm ml-2 text-muted-foreground hover:text-foreground"
            >
              <span className="relative z-10">{section.title}</span>
              {expandedSections[section.id] ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            {expandedSections[section.id] && (
              <div key={`subsections-${section.id}`} className="ml-6 space-y-1">
                {section.sections.map((sub) => (
                  <React.Fragment key={`sub-${sub.id}`}>
                    {renderNavItem(sub, parentPath)}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        );
      }
      return <div key={section.id}>{renderNavItem(section, parentPath)}</div>;
    },
    [expandedSections, toggleSection, renderNavItem]
  );

  // Memoized content based on pathname
  const content = useMemo(() => {
    if (pathname?.startsWith("/docs/api-reference")) {
      return (
        <div>
          {apiReference.map((item) => (
            <div key={item.id} className="relative">
              <div className="flex w-full items-center justify-between rounded-lg p-2 text-sm font-medium transition-all duration-200">
                <span className="font-bold text-sm p-2">
                  {item.title.toUpperCase()}
                </span>
              </div>
              <div className="space-y-1">
                {item.sections.map((section) =>
                  renderSection(section, "/docs/api-reference")
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (pathname?.startsWith("/docs/user-guides")) {
      return (
        <div>
          {guides.map((items) => (
            <div key={items.title}>
              <span className="font-bold px-2 mb-3 text-xs">
                {items.title.toUpperCase()}
              </span>
              <div className="py-2">
                {items.sections.map((section) => (
                  <div key={section.id}>
                    {renderNavItem(
                      section,
                      "/docs/user-guides",
                      items.id === "support"
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (pathname?.startsWith("/docs/tutorials")) {
      return (
        <div>
          {tutorial.map((item) => (
            <div key={item.id}>
              <span className="font-bold px-2 mb-5">
                {item.title.toUpperCase()}
              </span>
              {item.sections.map((section) => (
                <div className="mb-2 mt-3" key={section.id}>
                  {renderNavItem(section, `/docs/tutorials/${item.id}`)}
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }

    return null;
  }, [pathname, renderSection, renderNavItem]);

  return (
    <ScrollArea className="h-full py-6 pl-4 pr-2">
      <div className="space-y-6">{content}</div>
    </ScrollArea>
  );
};
