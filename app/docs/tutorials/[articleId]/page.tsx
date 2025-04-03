// @ts-nocheck
"use client";
import { tutorial } from "@/lib/constants/docs";
import { usePathname } from "next/navigation";
import DynamicFaq from "@/components/faq/DynamicFaq";

interface Section {
  id: string;
  href: string;
}

interface Guide {
  id: string;
  title: string;
  description?: string;
  section: Section[];
}

export default function Page() {
  const pathname = usePathname();

  const getTitle = (): { title: string; des: string; param?: string } => {
    for (const item of tutorial as Guide[]) {
      for (const secs of item.sections) {
        if (pathname === `/docs/tutorials/${secs.id}`) {
          return { title: secs.title, param: secs.id, des: secs.description };
        }
      }
    }
    return {
      title: "Page Not Found",
      des: "No description available.",
      param: "none",
    };
  };

  const { title, param, des } = getTitle();

  return (
    <div>
      <h2 className="text-sm font-bold text-muted-foreground mb-3">Guides</h2>
      <h3 className="text-3xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground mb-5">{des} </p>
      <div className="">
        <DynamicFaq faqName={param} />
      </div>
    </div>
  );
}
