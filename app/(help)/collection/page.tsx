"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { ScrollText, Search, Globe, Home, Router } from "lucide-react";
import { helpCategories } from "./constants";
import { IconComponent } from "@/components/IconComponent";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react";
import { languages } from "@/lib/constants"
import { ThemeToggle } from "@/components/ui/theme-toggle";


export default function CollectionPage() {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="py-12">
      <div className="text-center mb-12 relative">
        <div className="absolute right-4 top-0 flex items-center gap-2">
        <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/10 transition-colors">
              <Globe className="h-4 w-4" />
              <span className="text-sm">{selectedLanguage.code.toUpperCase()}</span>
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
          <Link
            href={'/'}
            className="p-2 rounded-lg hover:bg-primary/10"
          >
            <Home />
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-4">Help Center</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Advice and answers from the Alle AI Team
        </p>
        
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search for articles..." 
            className="pl-10 h-12 bg-background focus-visible:outline-none focus:border-borderColorPrimary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(helpCategories).map(([slug, category]) => (
            <Link
              key={category.id}
              href={`/collection/${slug}`}
              className="group p-6 rounded-lg border border-borderColorPrimary hover:shadow-md transition-all"
            >
              <div className="gap-4">
                <div className="py-3 rounded-lg">
                  <IconComponent name={category.iconName} className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold mb-2 group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {category.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {category.sections.reduce((acc, section) => acc + section.articles.length, 0)} {category.sections.reduce((acc, section) => acc + section.articles.length, 0) < 2 ? "article": "articles"}
                  </p>
                </div>
              </div>
            </Link>
        ))}
        <Link
            href={`/release-notes`}
            className="group p-6 rounded-lg border border-borderColorPrimary hover:shadow-md transition-all"
            >
            <div className="gap-4">
              <div className="py-3 rounded-lg">
                <ScrollText className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold mb-2 group-hover:text-primary transition-colors">
                  Relesase notes
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  See all releases on Alle-AI
                </p>
                <p className="text-xs text-muted-foreground">
                  
                </p>
              </div>
            </div>
            </Link>
      </div>
    </div>
  );
}