"use client"
import { useSidebarStore } from "@/lib/constants";
export default function RenderPageContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebarStore();
  return (
    <div
      className={`flex flex-col h-[calc(100vh-3.5rem)] transition-all duration-300 ${
        isOpen ? "pl-60" : "pl-16"
      }`}
    >
        {children}
    </div>
  );
}