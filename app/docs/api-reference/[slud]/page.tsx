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

  // Sync scroll position with URL on page load/refresh
  useEffect(() => {
    const sectionFromUrl = pathname.replace("/docs/api-reference/", "");
    if (sectionFromUrl && sectionFromUrl !== "api-reference") {
      const element = document.querySelector(
        `[data-section="${sectionFromUrl}"]`
      );
      if (element) {
        element.scrollIntoView({ behavior: "instant" });
        currentSection.current = sectionFromUrl;
      }
    } else {
      currentSection.current = "introduction"; // Default to introduction
    }
  }, [pathname]);

  // Set up Intersection Observer
  useEffect(() => {
    let previousScrollY = window.scrollY;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualNavigation.current) return;

        const currentScrollY = window.scrollY;
        const isScrollingUp = currentScrollY < previousScrollY;
        previousScrollY = currentScrollY;

        let targetSection: string | null = null;
        let highestTop = Infinity;
        let lowestBottom = -Infinity;

        entries.forEach((entry) => {
          const section = entry.target.getAttribute("data-section");
          const rect = entry.target.getBoundingClientRect();
          const isVisible = entry.intersectionRatio > 0;

          if (!isVisible || !section) return;

          if (isScrollingUp) {
            // When scrolling up, prioritize the section we're entering from the bottom
            if (rect.bottom <= window.innerHeight && rect.bottom > 0) {
              if (rect.bottom > lowestBottom) {
                lowestBottom = rect.bottom;
                targetSection = section;
              }
            }
          } else {
            // When scrolling down, prioritize the section closest to the top
            if (rect.top >= 0 && rect.top < highestTop) {
              highestTop = rect.top;
              targetSection = section;
            }
          }
        });

        if (targetSection && targetSection !== currentSection.current) {
          currentSection.current = targetSection;
          router.replace(`/docs/api-reference/${targetSection}`, {
            scroll: false,
          });
        }
      },
      {
        threshold: [0], // Trigger as soon as any part of the section is visible
        rootMargin: "0px", // No offset
      }
    );

    document.querySelectorAll("[data-section]").forEach((section) => {
      observer.observe(section);
    });

    observerRef.current = observer;
    return () => observer.disconnect();
  }, [router]);

  // Handle manual navigation (e.g., sidebar clicks)
  useEffect(() => {
    if (!pathname) return;

    const section = pathname.replace("/docs/api-reference/", "");
    if (section && section !== currentSection.current) {
      isManualNavigation.current = true;
      const element = document.querySelector(`[data-section="${section}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        currentSection.current = section;
      }

      const timer = setTimeout(() => {
        isManualNavigation.current = false;
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

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
