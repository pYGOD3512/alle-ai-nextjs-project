"use client";
import { useContentStore } from "@/stores";
import { Skeleton } from "@/components/features/image/skeleton";
import { Suspense } from "react";
import { Copy } from "lucide-react";
import { useState } from "react";
export default function ImageGenerationPage() {
  const { content } = useContentStore();
  const [copied, setCopied] = useState(false);

  // copy to clipboard
  const handleCopy = () => {
    setCopied(true);
    navigator.clipboard.writeText(content.image.input);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-around ">
          <span className="text-base">{content.image.input}</span>
          <div className="relative">
            <button
              onClick={handleCopy}
              className="flex items-center px-4 py-2 bg-background hover:bg-backgroundSecondary hover:border-violet-500 border border-transparent text-foreground rounded-md transition-all duration-200"
            >
              <Copy className="h-4 w-3" />
            </button>
            {copied && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm text-foreground animate-slide-up">
                Copied!
              </span>
            )}
          </div>
        </div>

        {/* test implementation 
        will handle with render component and suspense with skeleton
        */}
        <div className="mt-4 flex justify-center gap-6">
          <Skeleton className="w-80 h-80" />
          <Skeleton className="w-80 h-80" />
        </div>
      </div>
    </div>
  );
}
