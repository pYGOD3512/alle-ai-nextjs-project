import React from "react";
import Link from "next/link";
interface FooterProps {
  className?: string;
}

interface FooterLink {
  label: string;
  href: string;
  icon: string; // Emoji or icon identifier
}

const footerLinks: FooterLink[] = [
  {
    label: "Need help? Contact Support.",
    href: "#",
    icon: "?",
  },
  {
    label: "Join our early access program.",
    href: "#",
    icon: "🚀",
  },
  {
    label: "Check out our changelog.",
    href: "#",
    icon: "📋",
  },
  {
    label: "Questions? Contact Sales.",
    href: "#",
    icon: "?",
  },
];

const DocsFooter: React.FC<FooterProps> = ({ className = "" }) => {
  return (
    <footer
      className={`border-t border-gray-200 dark:border-zinc-800 py-8 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-around items-start gap-3">
          {/* Left Side: Links */}
          <div className="flex flex-col gap-3">
            {footerLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <span className="w-5 h-5 rounded-full border border-gray-400 dark:border-gray-600 flex items-center justify-center">
                  <span className="text-xs">{link.icon}</span>
                </span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side: Subscription Placeholder */}
          <div className="w-full md:w-1/3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Sign up for developer updates:
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button className="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md text-gray-600 dark:text-gray-400 bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800">
                Sign up
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              You can unsubscribe at any time.{" "}
              <a
                href="#"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Read our privacy policy.
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DocsFooter;
