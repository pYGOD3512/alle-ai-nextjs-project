"use client";

import { useSidebarStore } from "@/stores";
import { useEffect } from "react";

export default function ChatPage() {
  const setCurrentPage = useSidebarStore((state) => state.setCurrentPage);

  useEffect(() => {
    setCurrentPage("chat");
  }, [setCurrentPage]);

  return null;
}