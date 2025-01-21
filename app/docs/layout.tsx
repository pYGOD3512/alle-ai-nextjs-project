"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { BookText, Code, History, Search } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();

  // Categories data for header
  const categories = [
    {
      name: "Developer Guides",
      icon: <BookText className="w-5 h-5" />,
      href: "#",
    },
    { name: "API Reference", icon: <Code className="w-5 h-5" />, href: "#" },
    { name: "Changelogs", icon: <History className="w-5 h-5" />, href: "#" },
  ];

  // Random sidebar data
  const sidebarLinks = [
    { name: "Overview", href: "#" },
    { name: "Getting Started", href: "#" },
    
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* header desktop */}
      <header className="flex flex-col justify-between p-4 w-full bg-gray-100 dark:bg-black">
        {/* Logo and Navigation */}
        <div className="flex justify-between items-center">
          <Link href={"/"}>
            <Image
              src={
                resolvedTheme === "dark"
                  ? "/svgs/logo-desktop-full.png"
                  : "/svgs/logo-desktop-dark-full.png"
              }
              alt="all-ai"
              height={80}
              width={110}
              className="h-auto"
            />
          </Link>
          {/* Search Bar */}
          <div className="flex items-center w-full max-w-md mx-4">
            <button
              onClick={() => {
                // will implement modal here
              }}
              className="flex items-center justify-between w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
            >
              <Search className="w-5 h-5 dark:text-gray-300 text-gray-600" />
              <span className="text-sm dark:text-gray-300 text-gray-600">
                Search
              </span>
            </button>
          </div>
          {/* nav links */}
          <div className="flex gap-5 items-center font-medium text-base">
            <Link
              className=" font-medium transition duration-200 
    text-gray-600 dark:text-gray-300 hover:text-gray-800 
    dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 
    rounded-lg px-2 py-1"
              href={"/collection"}
            >
              Help Center
            </Link>
            <Link
              href={"/"}
              className="px-6 py-2 text-sm font-semibold text-blue-500 border border-blue-500 rounded-full hover:bg-blue-500 hover:text-white flex items-center justify-center gap-2 transition duration-200"
            >
              Go to ALLE-AI
            </Link>
            <ThemeToggle />
          </div>
        </div>
        {/* categories section */}
        <div className="flex gap-3 mt-8">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="flex items-center gap-2 dark:text-gray-400 dark:hover:text-white text-sm font-medium transition duration-200"
            >
              {category.icon}
              {category.name}
            </Link>
          ))}
        </div>
      </header>

      {/* sidebar and main content section */}
      <div className="flex flex-1 w-full h-full">
        {/* sidebar section */}
        <div className="w-64 h-full  p-4 overflow-auto">
          {/* Sidebar content */}
          <div className="flex flex-col gap-4">
            {sidebarLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* main content */}
        <main className="flex-1 w-full px-4 py-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
