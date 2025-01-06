"use client";

import { ChevronRight, Clock, ThumbsUp, ThumbsDown, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { HelpCategory, Article } from "@/lib/types";
import { useState } from "react";
import { IconComponent } from "@/components/IconComponent";

type FeedbackType = 'helpful' | 'not-helpful' | null;

export function ArticleContent({ 
  category, 
  article,
  categorySlug 
}: { 
  category: HelpCategory;
  article: Article;
  categorySlug: string;
}) {
  const [feedbackGiven, setFeedbackGiven] = useState<FeedbackType>(null);

  const handleFeedback = (type: FeedbackType) => {
    setFeedbackGiven(type);
  };

  // Get all articles from all sections for related articles
  const allArticles = category.sections.flatMap(section => section.articles);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Back to Category */}
          <Link 
            href={`/collection/${categorySlug}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to {category.title}
          </Link>

          {/* Article Header */}
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
              <p className="text-lg text-muted-foreground mb-4">
                {article.description}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{article.readingTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <IconComponent name={category.iconName} className="h-4 w-4" />
                  <span>{category.title}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          {/* Content sections with enhanced styling */}
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
              <p className="text-base leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do 
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </section>

            {/* Code example with enhanced styling */}
            <section className="rounded-xl overflow-hidden">
              <div className="bg-zinc-800 p-3 text-white text-sm">
                <span className="text-zinc-400">Javascript</span>
              </div>
              <div className="bg-zinc-900 p-4">
                <pre className="text-sm text-white">
                  <code>
                    {`// Example code
const example = "Hello World";
console.log(example);`}
                  </code>
                </pre>
              </div>
            </section>

            {/* Steps with enhanced styling */}
            <section className="space-y-4">
              <h3 className="text-xl font-semibold">Steps to follow:</h3>
              <ol className="space-y-4">
                {[1, 2, 3].map((step) => (
                  <li key={step} className="flex gap-4">
                    <div className="flex-none">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium">
                        {step}
                      </span>
                    </div>
                    <div className="flex-1 pt-1">
                      <p>Step {step} instruction goes here with detailed explanation.</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Notes with enhanced styling */}
            <div className="rounded-xl border border-yellow-500/20 overflow-hidden">
              <div className="bg-yellow-500/10 p-4 flex items-start gap-3">
                <div className="p-2 rounded-full bg-yellow-500/20">
                  <IconComponent name="AlertTriangle" className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-600 dark:text-yellow-500 mb-2">
                    Important Note
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Important information or warnings can go here with additional context and details.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="mt-16 pt-8 border-t">
            <h3 className="text-lg font-semibold mb-4">Was this article helpful?</h3>
            <div className="flex items-center gap-4">
              <Button
                variant={feedbackGiven === 'helpful' ? 'default' : 'outline'}
                className="flex items-center gap-2 select-none"
                onClick={() => handleFeedback('helpful')}
                disabled={feedbackGiven !== null}
              >
                <ThumbsUp className="h-4 w-4" />
                Yes, it helped
              </Button>
              <Button
                variant={feedbackGiven === 'not-helpful' ? 'default' : 'outline'}
                className="flex items-center gap-2 select-none"
                onClick={() => handleFeedback('not-helpful')}
                disabled={feedbackGiven !== null}
              >
                <ThumbsDown className="h-4 w-4" />
                No, I need more help
              </Button>
            </div>
            {feedbackGiven && (
              <div className="mt-4 p-4 rounded-lg bg-primary/5 text-sm text-muted-foreground">
                Thank you for your feedback! We'll use this to improve our documentation.
              </div>
            )}
          </div>

          {/* Related Articles */}
          <div className="mt-16">
            <h3 className="text-lg font-semibold mb-6">Related Articles</h3>
            <div className="grid gap-4">
              {allArticles
                .filter((a: Article) => a.id !== article.id)
                .slice(0, 3)
                .map((relatedArticle: Article) => (
                  <Link
                    key={relatedArticle.id}
                    href={`/collection/${categorySlug}/${relatedArticle.id}`}
                    className="group p-4 rounded-xl border bg-backgroundSecondary hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-medium mb-2 group-hover:text-primary transition-colors">
                          {relatedArticle.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {relatedArticle.description}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}