"use client";

import { Header } from "@/components/layout/Header";

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}