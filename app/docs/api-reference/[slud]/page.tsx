"use client";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  const pathname = usePathname();
  const router = useRouter();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isManualNavigation = useRef(false);
  const currentSection = useRef<string | null>(null);

  // Handle manual navigation (e.g., sidebar clicks) - unchanged from new code
  useEffect(() => {
    if (!pathname) return;

    const section = pathname.replace("/docs/api-reference/", "");
    if (section) {
      isManualNavigation.current = true;
      const element = document.querySelector(`[data-section="${section}"]`);
      if (element) {
        router.replace(`/docs/api-reference/${section}`, { scroll: false });
        currentSection.current = section;
      }

      const timer = setTimeout(() => {
        isManualNavigation.current = false;
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [pathname, router]);

  // Set up Intersection Observer with old code’s logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualNavigation.current) return;

        entries.forEach((entry) => {
          // Extracted from old code: check visibility with threshold
          if (entry.isIntersecting && entry.intersectionRatio >= 0.75) {
            const section = entry.target.getAttribute("data-section");
            if (section && section !== currentSection.current) {
              currentSection.current = section;
              // New code’s scroll preservation
              router.replace(`/docs/api-reference/${section}`, { scroll: false });
            }
          }
        });
      },
      {
        threshold: 0.75, // From old code: section must be 75% visible
        rootMargin: "-100px 0px", // From old code: stricter trigger zone
      }
    );

    document.querySelectorAll("[data-section]").forEach((section) => {
      observer.observe(section);
    });

    observerRef.current = observer;
    return () => observer.disconnect();
  }, [router]);

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