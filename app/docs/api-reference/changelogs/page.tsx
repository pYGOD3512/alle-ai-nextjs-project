"use client";
import { OnThisPage } from "@/components/docs/OnThisPage";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import ArticleFeedback from "@/components/docs/articleFeedback";
import DocsFooter from "@/components/docs/simpleFooterDocs";
type ChangelogItem = {
  id: string;
  title: string;
  date: string;
  content: {
    description?: string;
    highlights?: string[];
    upcoming?: string[];
    notes?: string[];
  };
};

const CHANGELOG_DATA: ChangelogItem[] = [
  {
    id: "1",
    title: "Dark Mode Support Released",
    date: "April 2025",
    content: {
      description:
        "We've added dark mode support across all platforms based on popular user requests.",
      highlights: [
        "Automatic system theme detection",
        "Manual toggle in user settings",
        "Reduced eye strain in low-light environments",
      ],
      upcoming: [
        "Scheduled dark/light mode switching",
        "Per-device theme preferences",
      ],
    },
  },
  {
    id: "2",
    title: "Performance Improvements",
    date: "March 2025",
    content: {
      description:
        "Significant performance optimizations have been implemented in this release.",
      highlights: [
        "30% faster page load times",
        "Reduced memory usage by 20%",
        "Optimized database queries",
      ],
      notes: [
        "Some older devices may need to clear cache for full benefits",
        "First load might be slightly slower due to new caching mechanism",
      ],
    },
  },
  {
    id: "3",
    title: "New Dashboard Layout",
    date: "February 2025",
    content: {
      description:
        "Completely redesigned dashboard with improved navigation and customization options.",
      highlights: [
        "Drag-and-drop widget system",
        "Customizable quick actions",
        "Improved mobile responsiveness",
      ],
    },
  },
  {
    id: "4",
    title: "API Version 2.0 Released",
    date: "January 2025",
    content: {
      description:
        "Our new API brings better performance, more features, and improved documentation.",
      highlights: [
        "GraphQL support added",
        "Rate limiting improvements",
        "Webhook verification",
      ],
      notes: [
        "API v1 will be deprecated on June 30, 2025",
        "Migration guide available in documentation",
      ],
    },
  },
];
export default function Page() {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <main className="flex gap-2 px-4">
      <div className="w-full">
        <section className="min-h-[80vh] space-y-6">
          {/* test data  */}
          <div className="max-w-3xl pl-5 ">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
              Changelog
            </h1>

            <div className="space-y-4">
              {CHANGELOG_DATA.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  <button
                    className="w-full p-5 text-left flex justify-between items-center bg-gray-50 dark:bg-accent hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={expandedItems[item.id]}
                    aria-controls={`content-${item.id}`}
                  >
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        {item.title}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {item.date}
                      </p>
                    </div>
                    {expandedItems[item.id] ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    )}
                  </button>

                  <div
                    id={`content-${item.id}`}
                    className={`px-5 pb-5 pt-3 bg-background ${
                      expandedItems[item.id] ? "block" : "hidden"
                    }`}
                  >
                    {item.content.description && (
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        {item.content.description}
                      </p>
                    )}

                    {item.content.highlights && (
                      <div className="mb-4">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                          Highlights
                        </h3>
                        <ul className="list-disc pl-5 space-y-1.5 text-gray-700 dark:text-gray-300">
                          {item.content.highlights.map((highlight, index) => (
                            <li key={index}>{highlight}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {item.content.upcoming && (
                      <div className="mb-4">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                          Coming soon
                        </h3>
                        <ul className="list-disc pl-5 space-y-1.5 text-gray-700 dark:text-gray-300">
                          {item.content.upcoming.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {item.content.notes && (
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                          Notes
                        </h3>
                        <ul className="list-disc pl-5 space-y-1.5 text-gray-700 dark:text-gray-300">
                          {item.content.notes.map((note, index) => (
                            <li key={index}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* break line  */}
          <div>
            <ArticleFeedback />
          </div>
          <div>
            <DocsFooter />
          </div>
        </section>
      </div>
      {/* table of contents */}
      {/* <aside className="hidden lg:block w-1/4 sticky">
      
      </aside> */}
    </main>
  );
}
