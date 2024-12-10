"use client";
import { useEffect } from "react";
import { useSidebarStore } from "@/lib/constants";
import { AudioArea } from "@/components/features/audio/AudioArea";
export default function AudioGenerationPage() {
  const { isOpen } = useSidebarStore();
  const setCurrentPage = useSidebarStore((state) => state.setCurrentPage);


  useEffect(() => {
    setCurrentPage("audio");
  }, [setCurrentPage]);

  return <AudioArea />
}
