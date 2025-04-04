// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, ExternalLink, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SearchCommand } from "@/components/features/developer/search-command";
import { apiReference, guides, tutorial } from "@/lib/constants/docs";
import SearchModal from "../docSearchModal";

export function MobileNav() {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [isSearchOpen, setSearchOpen] = useState(false);

  const navItems = [
    { name: "Welcome", href: "/docs/getting-started", pageOne: "" },
    { name: "User Guide", href: "/docs/user-guides", pageOne: "quickstart" },
    {
      name: "API Reference",
      href: "/docs/api-reference",
      pageOne: "introduction",
    },
    { name: "Tutorials", href: "/docs/tutorials", pageOne: "using-platform" },
    { name: "Community", href: "/discord" },
  ];

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const toggleSearch = () => setSearchOpen((prev) => !prev);

  useEffect(() => {
    if (!pathname || !pathname.startsWith("/docs/api-reference")) return;
    const currentPath = pathname.replace("/docs/api-reference/", "");
    const activeSection = apiReference
      .flatMap((item) => item.sections)
      .filter((section) => section.sections)
      .find((section) =>
        section.sections.some((subsection) =>
          currentPath.startsWith(subsection.href)
        )
      );
    if (activeSection) {
      setExpandedSections((prev) => ({ ...prev, [activeSection.id]: true }));
    }
  }, [pathname]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  // Exact match for sidebar items
  const isActive = (path: string) => pathname === path;

  // Broader match for top-level nav items
  const isNavActive = (href: string) => pathname.startsWith(href);

  const handleReferenceClick = (e, sectionHref) => {
    e.preventDefault();
    router.push(`/docs/api-reference/${sectionHref}`, { scroll: false });
    setIsOpen(false);
  };

  const renderApiReference = () => (
    <div className="space-y-2">
      {apiReference.map((item) => (
        <div key={item.id}>
          <span className="font-bold text-sm px-4 py-2 block">
            {item.title.toUpperCase()}
          </span>
          {item.sections.map((section) => (
            <div key={section.id}>
              {section.sections ? (
                <div>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="flex items-center justify-between w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <span>{section.title}</span>
                    {expandedSections[section.id] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {expandedSections[section.id] && (
                    <div className="ml-4 space-y-1">
                      {section.sections.map((subsection) => (
                        <Link
                          href={`/docs/api-reference/${subsection.href}`}
                          key={subsection.id}
                          onClick={(e) =>
                            handleReferenceClick(e, subsection.href)
                          }
                          className={cn(
                            "block px-4 py-2 text-sm",
                            isActive(`/docs/api-reference/${subsection.href}`)
                              ? "bg-accent text-foreground font-medium"
                              : "text-muted-foreground hover:bg-accent/50"
                          )}
                        >
                          {subsection.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={`/docs/api-reference/${section.id}`}
                  onClick={(e) => handleReferenceClick(e, section.id)}
                  className={cn(
                    "block px-4 py-2 text-sm",
                    isActive(`/docs/api-reference/${section.id}`)
                      ? "bg-accent text-foreground font-medium"
                      : "text-muted-foreground hover:bg-accent/50"
                  )}
                >
                  {section.title}
                </Link>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const renderUserGuides = () => (
    <div className="space-y-2">
      {guides.map((item) => (
        <div key={item.id}>
          <span className="font-bold text-sm px-4 py-2 block">
            {item.title.toUpperCase()}
          </span>
          {item.sections.map((section) => (
            <Link
              key={section.id}
              href={
                item.id === "support"
                  ? section.href
                  : `/docs/user-guides/${section.id}`
              }
              target={item.id === "support" ? "_blank" : undefined}
              className={cn(
                "flex items-center px-4 py-2 text-sm",
                isActive(`/docs/user-guides/${section.id}`)
                  ? "bg-accent text-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent/50"
              )}
              onClick={() => setIsOpen(false)}
            >
              {section.title}
              {item.id === "support" && (
                <ExternalLink className="ml-2 h-4 w-4" />
              )}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );

  const renderTutorials = () => (
    <div className="space-y-2">
      {tutorial.map((item) => (
        <div key={item.id}>
          <span className="font-bold text-sm px-4 py-2 block">
            {item.title.toUpperCase()}
          </span>
          {item.sections.map((section) => (
            <Link
              key={section.id}
              href={`${item.href}/${section.id}`}
              className={cn(
                "block px-4 py-2 text-sm",
                isActive(`${item.href}/${section.id}`)
                  ? "bg-accent text-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent/50"
              )}
              onClick={() => setIsOpen(false)}
            >
              {section.title}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-sideBarBackground backdrop-blur">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <button onClick={toggleMenu} className="p-2">
              <Menu className="h-6 w-6" />
            </button>
            <Link href="/" className="flex items-center">
              <Image
                src={
                  resolvedTheme === "dark"
                    ? "/svgs/logo-desktop-full.png"
                    : "/svgs/logo-desktop-dark-full.png"
                }
                alt="Logo"
                height={32}
                width={32}
                className="h-8 w-auto"
              />
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <SearchCommand toggleModal={toggleSearch} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full h-[100vh] bg-sideBarBackground flex flex-col relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-foreground hover:text-muted-foreground z-50"
            >
              <X className="h-6 w-6" />
            </button>
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={`${item.href}/${item.pageOne}`}
                    className={cn(
                      "block px-4 py-2 text-sm",
                      isNavActive(item.href)
                        ? "bg-accent text-foreground font-medium"
                        : "text-muted-foreground hover:bg-accent/50"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {pathname.startsWith("/docs/api-reference") &&
                  renderApiReference()}
                {pathname.startsWith("/docs/user-guides") && renderUserGuides()}
                {pathname.startsWith("/docs/tutorials") && renderTutorials()}

                <div>
                  <Link
                    href="/playground"
                    className="block px-4 py-2 text-sm text-muted-foreground hover:bg-accent/50"
                    onClick={() => setIsOpen(false)}
                  >
                    Playground
                  </Link>
                  <Link
                    href="/api"
                    className="block px-4 py-2 text-sm text-muted-foreground hover:bg-accent/50"
                    onClick={() => setIsOpen(false)}
                  >
                    API
                  </Link>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      <SearchModal isOpen={isSearchOpen} onClose={toggleSearch} />
    </>
  );
}
