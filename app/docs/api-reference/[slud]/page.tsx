"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";

// pages
import ApiIntroduction from "@/components/docs/api-reference/introduction";

import ApiAudioGenerationDocs from "@/components/docs/api-reference/audioGenerations";
import ApiImageGenerationDocs from "@/components/docs/api-reference/imageGenerations";
import ApiVideoGenerationDocs from "@/components/docs/api-reference/videoGenerations";
import ApiTextGenerationDocs from "@/components/docs/api-reference/chat";

export default function Page() {
  const pathname = usePathname();
  const router = useRouter();
  const currentSection = pathname.replace("/docs/api-reference/", "");
  const [activeSection, setActiveSection] = useState(currentSection);

  useEffect(() => {
    // Initial scroll to section from URL
    const element = document.querySelector(`[data-section="${currentSection}"]`);
    if (element) {
      element.scrollIntoView({ block: "start" });
    }
  }, [currentSection]);

  useEffect(() => {
    // Set up intersection observer with more strict settings
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.75) {
            const section = entry.target.getAttribute("data-section");
            if (section && section !== activeSection) {
              setActiveSection(section);
              router.push(`/docs/api-reference/${section}`, { scroll: false });
            }
          }
        });
      },
      {
        threshold: 0.75, // Increased threshold - section must be more visible
        rootMargin: "-100px 0px" // Increased margin to prevent early triggers
      }
    );

    // Observe all sections
    const sections = document.querySelectorAll("[data-section]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [activeSection, router]);

  return (
    <div className="space-y-32 ml-10"> {/* Added more vertical spacing between sections */}
      {/* stacking up pages here  */}
      <section data-section="introduction" className="min-h-[80vh]"> {/* Increased minimum height */}
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
