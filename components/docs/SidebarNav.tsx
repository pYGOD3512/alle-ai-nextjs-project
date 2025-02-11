// @ts-nocheck
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { guides, userGuides } from "@/lib/constants/docs";

export const SidebarNav = () => {
  const pathname = usePathname();

  const isLinkActive = (href: string) => pathname === href;

  return (
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
};
