"use client";

import { useState } from "react";
import { languages } from "@/lib/constants";
import Link from "next/link";
import { useTheme } from "next-themes";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Input } from "@/components/ui/input";
import { ScrollText, Search, Globe, Home, Router } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col ">
      <header className=" w-full  px-4 sm:px-6 lg:px-8 py-6 ">
        <div className="flex flex-col">
          {/* navigation items */}
          <div className="flex justify-around items-center mb-4  ">
            <Link href={"/"}>
              <Image
                src={
                  resolvedTheme === "dark"
                    ? "/svgs/logo-desktop-full.png"
                    : "/svgs/logo-desktop-dark-full.png"
                }
                alt="all-ai"
                height={150}
                width={150}
              />
            </Link>

            <div className="right-10 flex items-center gap-5 text-sm">
              <Link href={"/docs/developer-guides"} target="_blank" >API Docs</Link>
              <Link href={"/release-notes"}>Release Notes</Link>
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/10 transition-colors">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">
                    {selectedLanguage.code.toUpperCase()}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => setSelectedLanguage(lang)}
                      className="flex items-center gap-2"
                    >
                      <span className="text-sm font-medium">{lang.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({lang.code.toUpperCase()})
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {/* header content  */}
          {pathname === "/collection" ? (
            <div className="text-center mt-5">
              <h1 className="text-4xl font-bold mb-3 ">Help Center</h1>
              <p className="text-muted-foreground text-lg mb-8">
                Advice and answers from the Alle AI Team
              </p>
            </div>
          ) : (
            ""
          )}

          {/* Search bar  */}
          <div className="w-full max-w-2xl mx-auto relative group transition-all duration-200">
            <div
              className="relative rounded-md shadow-sm hover:shadow-lg 
    ring-1 ring-gray-200 dark:ring-gray-700
    hover:ring-gray-300 dark:hover:ring-gray-600 
    transition-all duration-200"
            >
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 
      text-gray-400 dark:text-gray-500 
      group-hover:text-gray-600 dark:group-hover:text-gray-400 
      transition-colors duration-200"
              />
              <Input
                placeholder="Search for articles..."
                className="w-full pl-10 h-12 rounded-md border-0 
        bg-white dark:bg-[#212121]
        text-gray-900 dark:text-gray-100
        placeholder-gray-400 dark:placeholder-gray-500
        ring-offset-background
        focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700
        focus-visible:outline-none focus:border-transparent
        hover:bg-gray-50 dark:hover:bg-[#2c2c2c]
        transition-all duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
