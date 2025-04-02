"use client";
import { useState } from "react";
import { OnThisPage } from "@/components/docs/OnThisPage";
import { ChevronDown, ChevronUp } from "lucide-react";
import ArticleFeedback from "@/components/docs/articleFeedback";
import DocsFooter from "@/components/docs/simpleFooterDocs";
type FAQItem = {
  id: string;
  question: string;
  answer: {
    description: string;
    points?: string[];
    note?: string;
  };
};

const FAQ_DATA: FAQItem[] = [
  {
    id: "1",
    question:
      "Why am I seeing error messages for features I previously used without issues?",
    answer: {
      description:
        "If you're now seeing error messages for features like search_domain_filter, related_questions, images, or structured_outputs that previously worked, please note these features have always been reserved for Tier 3 users and above.",
      points: [
        "We recently added clearer error messaging to prevent confusion around feature access",
        "This is not due to any change in access permissions, but rather improved transparency",
        "For structured_outputs, schemas weren't previously enforced by the API",
        "Similar results may still be possible using improved prompting techniques",
      ],
      note: "We're happy to help advise on alternative approaches if you need support.",
    },
  },
  {
    id: "2",
    question: "How do I file a bug report and what happens afterward?",
    answer: {
      description:
        "To file a bug report, please use our GitHub repository and share the issue link with us via email at contact@alle-ai.com",
      points: [
        "We appreciate your patience as we review reports",
        "Response times may vary based on current volume",
        "We track all reported issues internally",
      ],
    },
  },
  {
    id: "3",
    question: "How can I track my spend/usage per API key?",
    answer: {
      description:
        "You can monitor your API usage through the dashboard in your account settings:",
      points: [
        "Detailed usage metrics are available in real-time",
        "Set up usage alerts to prevent unexpected charges",
        "Export usage data for your records",
      ],
    },
  },
  {
    id: "4",
    question: "What's the best way to stay up to date with API updates?",
    answer: {
      description: "We recommend these methods to stay informed:",
      points: [
        "Subscribe to our API changelog",
        "Join our developer Discord community",
        "Follow our GitHub repository",
        "Check the status page for incidents",
      ],
    },
  },
  {
    id: "5",
    question:
      "Will user data submitted through the API be used for model training?",
    answer: {
      description: "We take data privacy seriously:",
      points: [
        "API data is not used for model training by default",
        "Enterprise plans can opt for complete data isolation",
        "All data is encrypted in transit and at rest",
      ],
      note: "See our privacy policy for detailed information.",
    },
  },
  {
    id: "6",
    question: "Does the API currently support web browsing?",
    answer: {
      description: "Our API offers different levels of web access:",
      points: [
        "Basic models have limited web access",
        "Pro models include enhanced browsing capabilities",
        "You can control web access through parameters",
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
      <div className=" w-full">
        <section className="min-h-[100vh] space-y-6">
          {/* tesst data */}
          <div className="max-w-3xl pl-5 ">
            <div className=" mb-10">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Frequently Asked Questions
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Find answers to common questions about our API
              </p>
            </div>

            <div className="space-y-4">
              {FAQ_DATA.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  <button
                    className="w-full p-5 text-left flex justify-between items-center bg-gray-50 dark:bg-accent hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={expandedItems[item.id]}
                    aria-controls={`faq-${item.id}`}
                  >
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {item.question}
                    </h2>
                    {expandedItems[item.id] ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 shrink-0" />
                    )}
                  </button>

                  <div
                    id={`faq-${item.id}`}
                    className={`px-5 pb-5 pt-3 bg-background ${
                      expandedItems[item.id] ? "block" : "hidden"
                    }`}
                  >
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {item.answer.description}
                    </p>

                    {item.answer.points && (
                      <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                        {item.answer.points.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    )}

                    {item.answer.note && (
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <p className="text-gray-700 dark:text-gray-300 italic">
                          {item.answer.note}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* break lines  */}
            <div>
              <ArticleFeedback />
            </div>
          </div>
          {/* break line */}
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
