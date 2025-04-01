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
  const lastScrollPosition = useRef(0);

  // Store scroll position before any navigation
  useEffect(() => {
    const handleScroll = () => {
      lastScrollPosition.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle manual navigation (sidebar clicks)
  useEffect(() => {
    if (!pathname) return;

    const section = pathname.replace("/docs/api-reference/", "");
    if (section) {
      isManualNavigation.current = true;
      const element = document.querySelector(`[data-section="${section}"]`);
      if (element) {
        // Only update URL, no scrolling
        router.replace(`/docs/api-reference/${section}`, { scroll: false });
        // Restore previous scroll position
        window.scrollTo(0, lastScrollPosition.current);
      }

      const timer = setTimeout(() => {
        isManualNavigation.current = false;
      }, 100);

      return () => {
        clearTimeout(timer);
        isManualNavigation.current = false;
      };
    }
  }, [pathname, router]);

  // Set up intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualNavigation.current) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = entry.target.getAttribute("data-section");
            if (section) {
              // Store current position before route change
              const currentPosition = window.scrollY;
              // Update URL without triggering scroll
              router.replace(`/docs/api-reference/${section}`, {
                scroll: false,
              });
              // Immediately restore position
              window.scrollTo(0, currentPosition);
            }
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: "-100px 0px -100px 0px",
      }
    );

    document.querySelectorAll("[data-section]").forEach((section) => {
      observer.observe(section);
    });

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
