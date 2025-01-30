"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSidebarStore } from "@/stores";

export default function MainPage() {
  const router = useRouter();
  const setCurrentPage = useSidebarStore((state) => state.setCurrentPage);

  useEffect(() => {
    setCurrentPage("chat");
    router.replace('/chat');
  }, [router, setCurrentPage]);

  return null;
}
