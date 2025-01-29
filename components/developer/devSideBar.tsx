
import Link from "next/link";

type SidebarProps = {
  items: { title: string; slug: string }[];
};

const DevSidebar: React.FC<SidebarProps> = ({ items }) => {
  return (
    <aside className="w-64 h-screen bg-gray-100 p-4 border-r border-gray-300">
      <h2 className="text-lg font-semibold mb-4">User Guides</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/guides/${item.slug}`}
              className="text-blue-600 hover:underline"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default DevSidebar;
