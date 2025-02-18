"use client";
import { usePathname } from "next/navigation";
import { apiReference } from "@/lib/constants/docs";
import DynamicFaq from "@/components/faq/DynamicFaq";
interface Section {
  id: string;
  href: string;
  title: string;
  description: string;
}

interface Guide {
  id: string;
  title: string;
  description?: string;
  sections: Section[];
}

export default function Page() {
  const pathname = usePathname();

  const getTitle = (): { title: string; des: string; param?: string } => {
    for (const item of apiReference as Guide[]) {
      for (const secs of item.sections) {
        if (pathname.startsWith(`/docs/api-reference/${secs.id}`)) {
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

  const { title, param ,des } = getTitle();

  return (
    <div className="w-full ml-6 ">
      <div className="mb-8">
        {param === "quickstart" ? (
          <div>
            <h1 className="text-3xl font-bold mb-3" id="developer_quickstart">
              Developer Quickstart
            </h1>
            <p className="text-muted-foreground text-lg font-bold"> {des} </p>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold mb-3"> {title} </h1>
          </div>
        )}
      </div>

      <DynamicFaq faqName={param} />
    </div>
  );
}
