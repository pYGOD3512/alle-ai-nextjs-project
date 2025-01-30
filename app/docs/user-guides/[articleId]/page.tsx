"use client";
import { guides } from "@/lib/constants/docs";
import { usePathname } from "next/navigation";
import DynamicFaq from "@/components/faq/DynamicFaq";
interface Section {
  id: string;
  href: string;
}

interface Guide {
  id: string;
  title: string;
  description: string;
  sections: Section[];
}

export default function Page() {
  const pathname = usePathname();

  const getTitle = (): { title: string; des: string; param?: string } => {
    for (const item of guides as Guide[]) {
      for (const secs of item.sections) {
        if (pathname === `${secs.href}/${secs.id}`) {
          return { title: item.title, des: item.description, param: secs.id };
        }
      }
    }
    return {
      title: "Page Not Found",
      des: "No description available.",
      param: "none",
    };
  };

  const { title, des, param } = getTitle();

  return (
    <div className="flex flex-col ml-20">
      <h1 className="font-semibold text-xl mb-3 text-muted-foreground">
        {title}
      </h1>
      <div className="text-2xl font-bold mb-5">{des}</div>
      <DynamicFaq faqName={param} />
    </div>
  );
}
