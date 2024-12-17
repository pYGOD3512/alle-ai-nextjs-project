"use client";

import { useSidebarStore } from "@/lib/constants";
import { useEffect } from "react";
import RenderPageContent from "@/components/RenderPageContent";


export default function ImageGenerationPage() {
  const { isOpen } = useSidebarStore();
  const setCurrentPage = useSidebarStore((state) => state.setCurrentPage);

  useEffect(() => {
    setCurrentPage("image");
    document.title = "Alle-AI";

  }, [setCurrentPage]);

  
  return ;
}
