// @ts-nocheck
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
import { ExternalLink } from "lucide-react";
import { userGuides } from "@/lib/constants/docs";

const hheading = [
  {
    id: "Random test",
    href: "",
  },
  {
    id: "Random heading 2 ",
    href: "",
  },
  {
    id: "test heading 3",
    href: "",
  },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<
    { id: string; title: string; level: number }[]
  >([]);

  const isLinkActive = (href: string) => pathname === href;

  const showThreeColumnLayout =
    pathname.startsWith("/docs/user") || pathname.startsWith("/docs/api");

  // Sidebar Navigation Component
  const SidebarNav = () => (
    <ScrollArea className="h-full py-6 pl-4 pr-2">
      <div className="space-y-6">
        {pathname.startsWith("/docs/api") ? (
          <div>
            {/* Developer guides here */}
            {guides.map((guide) => (
              <div key={guide.id} className="relative">
                <div className="flex w-full items-center justify-between rounded-lg p-2 text-sm font-medium transition-all duration-200">
                  <span className="font-bold text-sm p-2">{`${guide.title.toUpperCase()}`}</span>
                </div>

                {/*  render sections */}
                <div className=" space-y-1">
                  {guide.sections.map((section) => {
                    const isSupportSection = guide.id === "support";

                    return (
                      <div key={section.id}>
                        {isSupportSection ? (
                          <Link
                          scroll={false}
                            href={section.href}
                            target="_blank"
                            className="group flex items-center w-3/4 rounded-md p-2 text-sm  ml-2 hover:bg-accent/10 hover:text-foreground text-muted-foreground"
                          >
                            <span className="relative z-10">
                              {section.title}
                            </span>
                            <ExternalLink className="ml-2 h-4 w-4 opacity-70 " />
                            <span className="absolute inset-0 w-0 bg-accent/10 " />
                          </Link>
                        ) : (
                          <Link
                          scroll={false}
                            href={`/docs/api-reference/${section.id}`}
                            className={cn(
                              "group flex items-center w-3/4 rounded-md p-2 text-sm transition-all duration-200 ml-2",
                              "relative overflow-hidden ",
                              isLinkActive(`/docs/api-reference/${section.id}`)
                                ? "dark:bg-accent bg-gray-200 rounded-md text-black dark:text-white font-medium shadow-sm"
                                : "text-muted-foreground dark:hover:bg-accent hover:text-foreground"
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
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // User guides here
          <div>
            {userGuides.map((items) => (
              <div className="" key={items.title}>
                <span className="font-bold px-2 mb-3 text-xs ">
                  {`${items.title.toUpperCase()}`}
                </span>
                <div className="py-2">
                  {items.section.map((section) => {
                    const isSupport = items.id === "support";
                    return (
                      <div key={section.id} id=" ">
                        {isSupport ? (
                          <Link
                          scroll={false}
                            href={section.href}
                            target="_blank"
                            className="group flex items-center w-3/4  rounded-md p-2 text-sm  ml-2 hover:bg-accent/10 hover:text-foreground text-muted-foreground"
                          >
                            <span className="relative z-10">
                              {section.title}
                            </span>
                            <ExternalLink className="ml-2 h-4 w-4 opacity-70  " />
                            <span className="absolute inset-0 w-0 bg-accent/10  " />
                          </Link>
                        ) : (
                          <div className="mb-2 ">
                            <Link
                            scroll={false}
                              href={`/docs/user-guides/${section.id}`}
                              className={cn(
                                "group flex items-center w-3/4 rounded-md py-2 text-sm transition-all duration-200 ",
                                "relative overflow-hidden",
                                isLinkActive(`/docs/user-guides/${section.id}`)
                                  ? "dark:bg-accent bg-gray-200 rounded-md text-black dark:text-white font-medium shadow-sm"
                                  : "text-muted-foreground dark:hover:bg-accent hover:text-foreground"
                              )}
                            >
                              <span className="px-2 text-sm">
                                {section.title}{" "}
                              </span>
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
        )}
      </div>
    </ScrollArea>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DocsHeader />

      {showThreeColumnLayout ? (
        <div className="flex-1 flex">
          {/* Left Sidebar */}
          <aside className="hidden lg:block w-[280px] shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] bg-sideBarBackground border-r border-border/40">
            <SidebarNav />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 relative">
            <div className="h-[calc(100vh-3.5rem)] overflow-y-auto">
              <div className="max-w-4xl mx-auto px-6 py-6" >
                {children}
              </div>
            </div>
          </main>

          {/* Right Sidebar - On This Page */}
          <aside className="hidden xl:block w-[250px] shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] bg-background/90 border-l border-border/40">
            <div className="h-full p-4">
              <OnThisPage pathname={pathname} sections={hheading} />
            </div>
          </aside>
        </div>
      ) : (
        <main className="flex-1">
          <div className="mx-auto max-w-4xl py-6 px-8 lg:py-8">{children}</div>
        </main>
      )}
    </div>
  );
}
