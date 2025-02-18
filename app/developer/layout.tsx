import { DeveloperHeader } from "@/components/features/developer/developer-header";

export default function DeveloperLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="flex flex-col pt-14 min-h-screen bg-background">
        <DeveloperHeader />
            {children}
      </div>
    );
  }