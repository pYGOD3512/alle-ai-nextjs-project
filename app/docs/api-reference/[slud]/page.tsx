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
    console.log(currentSection);
    const element = document.getElementById(currentSection as string);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  }, [currentSection]);
  return (
    <div>
      {/* stacking up pages here  */}

      {/* api introduction */}
      <section className="min-h-screen">
        <ApiIntroduction />
      </section>
      <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10 mt-5" />

      <section className="min-h-screen mb-10">
        <ApiTextGenerationDocs />
      </section>
      <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10 mt-5" />

      <section className="min-h-screen mb-10">
        <ApiImageGenerationDocs />
      </section>
      <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10 mt-5" />

      <section className="min-h-screen mb-10">
        <ApiAudioGenerationDocs />
      </section>
      <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10 mt-5" />

      <section className="min-h-screen mb-10">
        <ApiVideoGenerationDocs />
      </section>
    </div>
  );
}
