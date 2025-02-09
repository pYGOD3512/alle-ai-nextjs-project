"use client";

import PlansArea from "@/components/features/plans/PlansArea";
import { HelpButton } from "@/components/HelpButton";
import { Header } from "@/components/layout/Header";
// import { useAuthCheck } from "@/hooks/use-auth-check";
import { LoadingScreen } from "@/components/features/auth/LoadingScreen";

export default function PlansPage() {
  // const { isLoading, shouldRender } = useAuthCheck();

  // if (isLoading) {
  //   return <LoadingScreen />;
  // }

  // if (!shouldRender) {
  //   return null;
  // }

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
