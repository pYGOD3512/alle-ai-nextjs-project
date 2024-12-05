"use client";
import { useEffect } from "react";
import { useSidebarStore } from "@/lib/constants";
export default function AudioGenerationPage() {
  const { isOpen } = useSidebarStore();
  const setCurrentPage = useSidebarStore((state) => state.setCurrentPage);


  useEffect(() => {
    setCurrentPage("audio");
  }, [setCurrentPage]);

  return (
    <div
      className={`flex flex-col h-[calc(100vh-3.5rem)] transition-all duration-300 text-medium text-center justify-center text-5xl ${
        isOpen ? "pl-60" : "pl-16"
      }`}
    >
      Audio Generation
    </div>
  );
}
