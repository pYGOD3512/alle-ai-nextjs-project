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
  const lastScrollPosition = useRef(0);

  // Minimal scroll position tracking
  useEffect(() => {
    const handleScroll = () => {
      lastScrollPosition.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle initial load
  useEffect(() => {
    if (!pathname) return;

    const section =
      pathname.replace("/docs/api-reference/", "") || "introduction";
    const element = document.querySelector(`[data-section="${section}"]`);
    if (element && section !== currentSection.current) {
      currentSection.current = section;
      // Disable any smooth scrolling
      element.scrollIntoView({ behavior: "instant" });
    }
  }, [pathname]);

  // Handle manual navigation
  useEffect(() => {
    if (!pathname) return;

    const section = pathname.replace("/docs/api-reference/", "");
    if (section) {
      isManualNavigation.current = true;
      const element = document.querySelector(`[data-section="${section}"]`);
      if (element) {
        currentSection.current = section;
       
        window.history.replaceState(null, "", `/docs/api-reference/${section}`);
      }

      const timer = setTimeout(() => {
        isManualNavigation.current = false;
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Intersection Observer logics
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualNavigation.current) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.75) {
            const section = entry.target.getAttribute("data-section");
            if (section && section !== currentSection.current) {
              const currentScroll = lastScrollPosition.current;
              currentSection.current = section;

              window.history.replaceState(
                null,
                "",
                `/docs/api-reference/${section}`
              );

              window.scrollTo(0, currentScroll);
            }
          }
        });
      },
      {
        threshold: 0.75,
        rootMargin: "-100px 0px",
      }
    );

    document.querySelectorAll("[data-section]").forEach((section) => {
      observer.observe(section);
    });

    observerRef.current = observer;
    return () => observer.disconnect();
  }, []);

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
