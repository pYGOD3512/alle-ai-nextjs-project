"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { helpCategories } from "./constants";
import { IconComponent } from "@/components/IconComponent";

export default function CollectionPage() {
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Help Center</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Advice and answers from the Alle AI Team
        </p>
        
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search for articles..." 
            className="pl-10 h-12 bg-background focus-visible:outline-none focus:border-borderColorPrimary"
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
      </div>
    </div>
  );
}