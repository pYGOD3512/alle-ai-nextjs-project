"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useContentStore } from "@/stores";
import { useSidebarStore } from "@/lib/constants";
import RenderPageContent from "@/components/RenderPageContent";
export default function ImageGenerationPage() {
  const { content } = useContentStore();
  const { isOpen } = useSidebarStore();
  return (
    <RenderPageContent>
      image generation page
    </RenderPageContent>
  );
}
