"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SearchCommand } from "@/components/features/developer/search-command";
import { usePathname } from "next/navigation";

export function DocsHeader() {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-sideBarBackground backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-8 max-w-[1400px] mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
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

        {/* Navigation - centered */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={`${item.href}/${item.pageOne}`}
              className={`transition-colors hover:text-foreground/80 ${
                pathname.startsWith(item.href)
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right side items */}
        <div className="flex items-center space-x-4">
          <SearchCommand />
          <ThemeToggle />
          <Link
            href="/playground"
            className="inline-flex items-center hover:bg-gray-900 justify-center dark:hover:bg-slate-200 rounded-md bg-black  dark:bg-white dark:text-black px-4 py-2 text-sm font-medium text-white transition-colors "
          >
            Playground
          </Link>
          <Link
            href="/api"
            className="inline-flex items-center justify-center rounded-md hover:bg-gray-900 dark:hover:bg-slate-200 bg-black  dark:bg-white dark:text-black px-4 py-2 text-sm font-medium text-white transition-colors "
          >
            API
          </Link>
        </div>
      </div>
    </header>
  );
}
