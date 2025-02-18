import Link from "next/link";
import {
  ArrowRight,
  PlayCircle,
  Code2,
  HelpCircle,
  Activity,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface DocCard {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

const docCards: DocCard[] = [
  {
    title: "Quickstart",
    description: "Start using the API in minutes",
    href: "/docs/guides",
    icon: PlayCircle,
  },
  {
    title: "API Reference",
    description: "Integrate the API into your workflows",
    href: "/docs/api",
    icon: Code2,
  },
  {
    title: "Help",
    description: "Frequently asked questions about the API",
    href: "/faq",
    icon: HelpCircle,
  },
  {
    title: "System Status",
    description: "Track the status of our services including the API",
    href: "https://alle-ai.instatus.com/",
    icon: Activity,
  },
];

function DocCard({ title, description, href, icon: Icon }: DocCard) {
  return (
    <Link
      href={href}
      target="_blank"
      className="group flex items-start gap-4 rounded-xl border border-borderColorPrimary p-6 transition-all bg-background  "
    >
      <div className="rounded-lg bg-slate-100 text-black dark:bg-accent dark:text-white p-3">
        <Icon className="h-6 w-6 " />
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}

export default function Docs() {
  return (
    <div className="flex flex-col items-center min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-24 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl font-bold tracking-tight mb-6">
          Welcome to Alle-AI
        </h1>
        <p className="text-xl text-muted-foreground max-w-[750px] mb-8">
          Power your products with unparalleled real-time, web-wide research and
          Q&A capabilities.
        </p>
        <Link
          href="/guides"
          className="inline-flex items-center justify-center rounded-lg  px-6 py-3 text-sm font-medium bg-black text-white dark:bg-white  hover:bg-zinc-800 dark:hover:bg-slate-200 dark:text-black hover:scale-105"
        >
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </section>

      {/* Documentation Section */}
      <section className="w-full max-w-[1400px] px-4 pb-24">
        <h2 className="text-3xl font-bold text-center mb-12">
          Explore the docs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {docCards.map((card) => (
            <DocCard key={card.href} {...card} />
          ))}
        </div>
      </section>
    </div>
  );
}
