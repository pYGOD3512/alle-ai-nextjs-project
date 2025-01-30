"use client";

import PlansArea from "@/components/features/plans/PlansArea";
import { HelpButton } from "@/components/HelpButton";
import { Header } from "@/components/layout/Header";

export default function PlansPage() {

  return (
    <div className="h-screen flex overflow-hidden">
        <main className="flex-1 flex flex-col h-full relative">
        <Header />
        <PlansArea />
        <HelpButton />
        </main>
    </div>
  );
}
