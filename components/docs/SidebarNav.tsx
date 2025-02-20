"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ExternalLink, ChevronDown, ChevronRight } from "lucide-react";
import { tutorial, apiReference, guides } from "@/lib/constants/docs";
import { useState, useEffect } from "react";
import { useActiveSectionStore } from "@/stores/ui";
import { useRouter } from "next/navigation";

export const SidebarNav = () => {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const { activeSection } = useActiveSectionStore();
  const router = useRouter();

  useEffect(() => {
    // Keep the chat section expanded when in any of its subsections
    if (pathname.startsWith("/docs/api-reference/chat")) {
      setExpandedSections((prev) => ({
        ...prev,
        chat: true,
      }));
    }
  }, [pathname]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const isActive = (
    path: string,
    id?: string,
    isFirstItem?: number,
    subId?: string
  ) => {
    const isIntroduction = pathname === "/docs/api-reference/introduction";
    const isChat = pathname === "/docs/api-reference/chat";

    if (!id) {
      return pathname === path;
    }

    //   for id reference
    if (isIntroduction) {
      const hash = window.location.hash.substring(1); // Remove # prefix

      if (id === "introduction" && !hash) {
        return true;
      }
      return id === hash;
    }

    if (isChat) {
      const hash = window.location.hash.substring(1); // Remove # prefix
      console.log(hash);
      if (id === "chat" && !hash) {
        return true;
      }
      return id === hash;
    }
    //  for subsectioned items

    // For sections without subsections (like introduction)
    return pathname === path;
  };

  const handleReferenceClick = (
    sectionId: string,
    url: string,
    id?: string,
    isFirstItem?: number
  ) => {
    if (sectionId === "introduction") {
      router.replace("/docs/api-reference/introduction#introduction");
      return;
    }
    if (sectionId === "chat") {
      router.push("/docs/api-reference/chat");
      return;
    }
    if (sectionId === "image-generation") {
      router.push(url);
    }
    if (sectionId === "text-to-speech") {
      router.push("/docs/api-reference/audio");
    }
    if (sectionId === "text-video" || "video-generation") {
      router.replace("/docs/api-reference/video");
    }
    router.push(`${url}#${sectionId}`);
  };

  const renderApiReference = () => (
    <div>
      {apiReference.map((item) => (
        <div key={item.id} className="relative">
          <div className="flex w-full items-center justify-between rounded-lg p-2 text-sm font-medium transition-all duration-200">
            <span className="font-bold text-sm p-2">{`${item.title.toUpperCase()}`}</span>
          </div>

          <div className="space-y-1">
            {item.sections.map((section) => (
              <div key={section.id}>
                {section.sections ? (
                  <div>
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
                    {expandedSections[section.id] && section.sections && (
                      <div className="ml-6 space-y-1">
                        <div>
                          {section.sections.map((subsection, id) => (
                            <button
                              key={subsection.id}
                              onClick={() =>
                                handleReferenceClick(
                                  subsection.id,
                                  section.href
                                )
                              }
                              className={cn(
                                "group flex items-center w-3/4 rounded-md p-2 text-sm transition-all duration-200",
                                "relative overflow-hidden",
                                isActive(section.href, subsection.id)
                                  ? "dark:bg-accent bg-gray-200 rounded-md text-black dark:text-white font-medium shadow-sm"
                                  : "text-muted-foreground dark:hover:bg-accent hover:text-foreground"
                              )}
                            >
                              <span className="relative z-10">
                                {subsection.title}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : item.id === "reference" ? (
                  <button
                    onClick={() =>
                      handleReferenceClick(
                        section.id,
                        "/docs/api-reference/introduction"
                      )
                    }
                    className={cn(
                      "group flex items-center w-3/4 rounded-md p-2 text-sm transition-all duration-200 ml-2",
                      "relative overflow-hidden",
                      isActive("/docs/api-reference/introduction", section.id)
                        ? "dark:bg-accent bg-gray-200 rounded-md text-black dark:text-white font-medium shadow-sm"
                        : "text-muted-foreground dark:hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <span className="relative z-10">{section.title}</span>
                  </button>
                ) : (
                  <Link
                    scroll={false}
                    href={`/docs/api-reference/${section.id}`}
                    className={cn(
                      "group flex items-center w-3/4 rounded-md p-2 text-sm transition-all duration-200 ml-2",
                      "relative overflow-hidden",
                      isActive(`/docs/api-reference/${section.id}`)
                        ? "dark:bg-accent bg-gray-200 rounded-md text-black dark:text-white font-medium shadow-sm"
                        : "text-muted-foreground dark:hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <span className="relative z-10">{section.title}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderUserGuides = () => (
    <div>
      {guides.map((items) => (
        <div className="" key={items.title}>
          <span className="font-bold px-2 mb-3 text-xs">
            {`${items.title.toUpperCase()}`}
          </span>
          <div className="py-2">
            {items.sections.map((section) => {
              const isSupport = items.id === "support";
              return (
                <div key={section.id} id=" ">
                  {isSupport ? (
                    <Link
                      scroll={false}
                      href={section.href}
                      target="_blank"
                      className="group flex items-center w-3/4 rounded-md p-2 text-sm ml-2 hover:bg-accent/10 hover:text-foreground text-muted-foreground"
                    >
                      <span className="relative z-10">{section.title}</span>
                      <ExternalLink className="ml-2 h-4 w-4 opacity-70" />
                      <span className="absolute inset-0 w-0 bg-accent/10" />
                    </Link>
                  ) : (
                    <div className="mb-2">
                      <Link
                        scroll={false}
                        href={`/docs/user-guides/${section.id}`}
                        className={cn(
                          "group flex items-center w-3/4 rounded-md py-2 text-sm transition-all duration-200",
                          "relative overflow-hidden",
                          isActive(`/docs/user-guides/${section.id}`)
                            ? "dark:bg-accent bg-gray-200 rounded-md text-black dark:text-white font-medium shadow-sm"
                            : "text-muted-foreground dark:hover:bg-accent hover:text-foreground"
                        )}
                      >
                        <span className="px-2 text-sm">{section.title}</span>
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
  const renderTutorials = () => (
    <div>
      {tutorial.map((item) => (
        <div key={item.id}>
          <span className="font-bold px-2 mb-5 ">
            {`${item.title.toUpperCase()}`}
          </span>
          {item.sections.map((section) => (
            <div className="mb-2 mt-3" key={section.id}>
              <Link
                scroll={false}
                href={`${item.href}/${section.id}`}
                className={cn(
                  "group flex items-center w-3/4 rounded-md py-2 text-sm transition-all duration-200",
                  "relative overflow-hidden",
                  isActive(`${item.href}/${section.id}`)
                    ? "dark:bg-accent bg-gray-200 rounded-md text-black dark:text-white font-medium shadow-sm"
                    : "text-muted-foreground dark:hover:bg-accent hover:text-foreground"
                )}
              >
                <span className="px-2 text-sm">{section.title}</span>
              </Link>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
  return (
    <ScrollArea className="h-full py-6 pl-4 pr-2">
      <div className="space-y-6">
        {pathname.startsWith("/docs/api")
          ? renderApiReference()
          : pathname.startsWith("/docs/user-guides")
          ? renderUserGuides()
          : pathname.startsWith("/docs/tutorials")
          ? renderTutorials()
          : ""}
      </div>
    </ScrollArea>
  );
};
