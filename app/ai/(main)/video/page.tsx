"use client"
import { useEffect } from "react";
import { useSidebarStore } from "@/stores";
import VideoArea from "@/components/features/video/VideoArea";
export default function VideoGenerationPage() {
  const { isOpen } = useSidebarStore();
  const setCurrentPage = useSidebarStore((state) => state.setCurrentPage);


  useEffect(() => {
    setCurrentPage("video");
  }, [setCurrentPage]);


  return <VideoArea />
}
