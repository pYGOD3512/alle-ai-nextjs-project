// @ts-nocheck
"use client";

import { useState, useEffect, useRef } from "react";
import { languages } from "@/lib/constants";
import Link from "next/link";
import { useTheme } from "next-themes";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Input } from "@/components/ui/input";
import { ScrollText, Search, Globe, Home, Router } from "lucide-react";
import Providers from "@/components/ProgressBar";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { helpCategories } from "./constants";



interface SearchResult {
  categoryKey?: string;
  categoryTitle: string;
  articleTitle: string;
  articleDescription?: string;
  readingTime?: string;
  articleId: string;
  categoryId: string;
  matchedKeywords?: string[];
}

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
   
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearching(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
 
    if (query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const searchTerms = query.toLowerCase().trim().split(/\s+/);
    const results: SearchResult[] = [];

    Object.entries(helpCategories).forEach(([categoryKey, category]) => {
      category.sections.forEach((section) => {
        section.articles.forEach((article) => {
          const keywords = article.keywords || [];
          const matchedKeywords = keywords.filter((keyword) =>
            searchTerms.some((term) => keyword.toLowerCase().includes(term))
          );

          const titleMatch = article.title
            .toLowerCase()
            .includes(query.toLowerCase());
          const descriptionMatch = article.description
            ?.toLowerCase()
            .includes(query.toLowerCase());
          const hasKeywordMatch = matchedKeywords.length > 0;

          if (titleMatch || descriptionMatch || hasKeywordMatch) {
            results.push({
              categoryKey: categoryKey,
              categoryTitle: category.title,
              articleTitle: article.title,
              articleDescription: article.description,
              readingTime: article.readingTime,
              articleId: article.id,
              categoryId: category.id,
              matchedKeywords: hasKeywordMatch ? matchedKeywords : undefined,
            });
          }
        });
      });
    });

    results.sort((a, b) => {
      if (a.articleTitle.toLowerCase() === query.toLowerCase()) return -1;
      if (b.articleTitle.toLowerCase() === query.toLowerCase()) return 1;

      const aKeywords = a.matchedKeywords?.length || 0;
      const bKeywords = b.matchedKeywords?.length || 0;
      if (aKeywords !== bKeywords) return bKeywords - aKeywords;

      const aTitleMatch = a.articleTitle
        .toLowerCase()
        .includes(query.toLowerCase());
      const bTitleMatch = b.articleTitle
        .toLowerCase()
        .includes(query.toLowerCase());
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;

      return 0;
    });

    setSearchResults(results.slice(0, 10));
    setIsSearching(true);
  };

  const handleSearchResultClick = (result: SearchResult) => {
    //  navigation/action logic
    if (result.categoryKey === "getting-started") {
      router.push("/hub/getting-started");
    } else router.push(`/collection/${result.categoryKey}/${result.articleId}`);

    setIsSearching(false);
    setSearchQuery("");
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <>
    
      <div className="min-h-screen flex flex-col">
        <header className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col">
            <div className="flex justify-around items-center mb-4">
              <Link href={"/collection"}>
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
                <Link href={"/docs/developer-guides"} target="_blank">
                  API Docs
                </Link>
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

            {pathname === "/collection" ? (
              <div className="text-center mt-5">
                <h1 className="text-4xl font-bold mb-3">Help Center</h1>
                <p className="text-muted-foreground text-lg mb-8">
                  Advice and answers from the Alle AI Team
                </p>
              </div>
            ) : null}

            <div
              className="w-full max-w-2xl mx-auto relative group transition-all duration-200"
              ref={searchRef}
            >
              <div className="relative rounded-md shadow-sm hover:shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-gray-300 dark:hover:ring-gray-600 transition-all duration-200">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-200" />
                <Input
                  placeholder="Search for articles..."
                  className="w-full pl-10 h-12 rounded-md border-0 bg-white dark:bg-[#212121] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ring-offset-background focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 focus-visible:outline-none focus:border-transparent hover:bg-gray-50 dark:hover:bg-[#2c2c2c] transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => setIsSearching(true)}
                />
              </div>

              {isSearching && searchQuery.length >= 2 && (
                <div className="absolute w-full mt-2 bg-white dark:bg-[#212121] rounded-md shadow-lg ring-1 ring-black ring-opacity-5 max-h-[60vh] overflow-y-auto z-50">
                  {searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((result, index) => (
                        <div
                          key={`${result.categoryId}-${result.articleId}-${index}`}
                          className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer border-b last:border-b-0 border-gray-100 dark:border-gray-800"
                          onClick={() => handleSearchResultClick(result)}
                          role="button"
                          tabIndex={0}
                        >
                          <div className="text-xs text-gray-500 mb-1">
                            {result.categoryTitle}
                          </div>
                          <div className="text-sm font-medium">
                            {result.articleTitle}
                          </div>
                          {result.articleDescription && (
                            <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {result.articleDescription}
                            </div>
                          )}
                          {result.matchedKeywords &&
                            result.matchedKeywords.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {result.matchedKeywords.map((keyword, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full"
                                  >
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            )}
                          {result.readingTime && (
                            <div className="text-xs text-gray-400 mt-1">
                              {result.readingTime}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      No results found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Providers>{children}</Providers>
        </main>
      </div>
    </>
  );
}
