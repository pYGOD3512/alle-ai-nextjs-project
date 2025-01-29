// app/components/OnThisPage.tsx
"use client";

import { useEffect, useState } from "react";

type TocItem = {
  id: string;
  text: string;
};

const OnThisPage: React.FC = () => {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);

  useEffect(() => {
    // Find all h2 and h3 elements in the page
    const headings = Array.from(document.querySelectorAll("h2, h3"));
    const toc = headings.map((heading) => ({
      id: heading.id,
      text: heading.textContent || "",
    }));
    setTocItems(toc);
  }, []);

  return (
    <aside className="w-64 bg-gray-50 p-4 border-l border-gray-300">
      <h2 className="text-lg font-semibold mb-4">On This Page</h2>
      <ul className="space-y-2">
        {tocItems.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className="text-blue-600 hover:underline">
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default OnThisPage;
