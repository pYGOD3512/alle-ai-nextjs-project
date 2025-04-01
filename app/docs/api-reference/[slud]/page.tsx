"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

import ApiIntroduction from "@/components/docs/api-reference/introduction";
import ApiAudioGenerationDocs from "@/components/docs/api-reference/audioGenerations";
import ApiImageGenerationDocs from "@/components/docs/api-reference/imageGenerations";
import ApiVideoGenerationDocs from "@/components/docs/api-reference/videoGenerations";
import ApiTextGenerationDocs from "@/components/docs/api-reference/chat";

type SectionName =
  | "introduction"
  | "text-generation"
  | "image-generation"
  | "audio-generation"
  | "video-generation";

export default function Page() {
  const pathname: string = usePathname();
  const router = useRouter();
  const currentSection: SectionName = (pathname.replace(
    "/docs/api-reference/",
    ""
  ) || "introduction") as SectionName;
  const [activeSection, setActiveSection] =
    useState<SectionName>(currentSection);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Intersection Observer for section tracking
  useEffect(() => {
    // Debounce function to limit route updates
    const debounceRouteUpdate = (section: SectionName) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (section !== activeSection) {
          setActiveSection(section);
          router.replace(`/docs/api-reference/${section}`, { scroll: false }); // Silent URL update
        }
      }, 150); // 150ms debounce
    };

    // Set up observer once
    observerRef.current = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const section = entry.target.getAttribute(
              "data-section"
            ) as SectionName | null;
            if (section) {
              debounceRouteUpdate(section);
            }
          }
        });
      },
      {
        threshold: 0.6, 
        rootMargin: "-150px 0px -150px 0px", // Adjusted for smoother transitions
      }
    );

    // Observe all sections
    const sections: NodeListOf<HTMLElement> =
      document.querySelectorAll("[data-section]");
    sections.forEach((section: HTMLElement) =>
      observerRef.current?.observe(section)
    );

    // Cleanup
    return () => {
      if (observerRef.current) {
        sections.forEach((section: HTMLElement) =>
          observerRef.current?.unobserve(section)
        );
        observerRef.current.disconnect();
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []); // Run only on mount

  return (
    <div className="space-y-32 ml-10">
      <section data-section="introduction" className="min-h-[80vh]">
        <ApiIntroduction />
      </section>
      <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10 mt-5" />

      <section data-section="text-generation" className="min-h-[80vh]">
        <ApiTextGenerationDocs />
      </section>
      <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10 mt-5" />

      <section data-section="image-generation" className="min-h-[80vh]">
        <ApiImageGenerationDocs />
      </section>
      <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10 mt-5" />

      <section data-section="audio-generation" className="min-h-[80vh]">
        <ApiAudioGenerationDocs />
      </section>
      <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10 mt-5" />

      <section data-section="video-generation" className="min-h-[80vh]">
        <ApiVideoGenerationDocs />
      </section>
    </div>
  );
}
