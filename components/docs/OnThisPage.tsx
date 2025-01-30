"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { List } from "lucide-react";

interface TableOfContentsProps {
  sections: Array<{ id: string; title: string; level: number }>;
  pathname: string;
}

export function OnThisPage({ sections, pathname }: TableOfContentsProps) {
  const activeSection =
    sections.find((section) => section.id === window.location.hash.slice(1))
      ?.id ?? "";

  return (
    <aside className="hidden xl:sticky xl:top-14 xl:block xl:h-[calc(100vh-3.5rem)] xl:overflow-y-auto bg-background/90 p-4 rounded-lg">
      <div className="py-6 pl-4">
        <div className="flex mb-3 gap-2 items-center ">
          <List className="h-6 w-5" />
          <h4 className="text-sm font-medium text-foreground/80">
            On this page
          </h4>
        </div>

        <nav className="text-sm">
          <div className="space-y-1">
            {sections.map((section) => (
              <Link
                key={section.id}
                href={`${pathname}#${section.id}`}
                className={cn(
                  "block py-1.5 px-3 rounded-md transition-all hover:bg-accent/5 hover:text-accent-foreground",
                  "pl-" + (section.level - 1) * 4,
                  activeSection === section.id
                    ? "bg-accent text-white"
                    : "text-foreground/80"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState({}, "", `${pathname}#${section.id}`);
                  const element = document.getElementById(section.id);
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {section.title}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </aside>
  );
}
