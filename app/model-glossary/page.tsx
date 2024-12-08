"use client";
import { useEffect } from "react";
import { useSidebarStore } from "@/lib/constants";
import ModelGlossary from '@/components/features/model-glossary/ModelGlossary';


export default function ModelGlossaryPage() {
  const setCurrentPage = useSidebarStore((state) => state.setCurrentPage);


  useEffect(() => {
    setCurrentPage("model-glossary");
  }, [setCurrentPage]);

  return (
    <div>
      <ModelGlossary />
    </div>
  );
}
