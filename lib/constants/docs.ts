interface GuideSection {
  id: string;
  title: string;
  href: string;
}

interface Guide {
  id?: string;
  title: string;
  href?: string;
  description?: string; 
  sections: GuideSection[];
}
const href = "/docs/user-guides";
// user guides
export const guides: Guide[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn the basics of using Alle-AI.",
    sections: [
      {
        id: "overview",
        title: "Platform Overview",
        href: href,
      },
      {
        id: "account-setup",
        title: "Account Setup & Login",
        href: href,
      },
      {
        id: "first-steps",
        title: "Your First Interaction",
        href: href,
      },
    ],
  },
  {
    id: "platform-usage",
    title: "How to Use the Platform",
    description: "Explore the core functionalities of Alle-AI.",
    sections: [
      {
        id: "text-generation",
        title: "Text Generation",
        href: href,
      },
      {
        id: "audio-generation",
        title: "Audio Generation",
        href: href,
      },
      {
        id: "video-generation",
        title: "Video Generation",
        href: href,
      },
      {
        id: "file-uploads",
        title: "Working with Files",
        href: href,
      },
      {
        id: "collaborations",
        title: "Collaborating with Others",
        href: href,
      },
    ],
  },
  {
    id: "models",
    title: "Supported Models",
    description: "Understand the different AI models available on Alle-AI.",
    sections: [
      {
        id: "premium-models",
        title: "Premium Models",
        href: href,
      },
      {
        id: "free-models",
        title: "Free Models",
        href: href,
      },
      {
        id: "model-comparison",
        title: "Comparing Models",
        href: href,
      },
    ],
  },
  {
    id: "pricing",
    title: "Pricing",
    description: "Learn about Alle-AI's pricing plans and options.",
    sections: [
      {
        id: "price-plans",
        title: "Alle-AI Pricing Plans",
        href: href,
      },
      {
        id: "billing-faq",
        title: "Billing FAQs",
        href: href,
      },
    ],
  },
  {
    id: "customization",
    title: "Customization & Control",
    description: "Master techniques to refine your AI interactions.",
    href: "/docs/user-guides/error-handling",
    sections: [
      {
        id: "prompt-engineering",
        title: "Prompt Engineering",
        href: href,
      },
      {
        id: "fine-tuning-inputs",
        title: "Fine-tuning Inputs",
        href: href,
      },
      {
        id: "settings-preferences",
        title: "Settings & Preferences",
        href: href,
      },
    ],
  },
  {
    id: "support",
    title: "Support & Resources",
    description: "Find help and resources to assist you with Alle-AI.",
    sections: [
      {
        id: "faq",
        title: "Frequently Asked Questions (FAQ)",
        href: href,
      },
      {
        id: "contact-us",
        title: "Contact Us",
        href: href,
      },
      {
        id: "community-forum",
        title: "Community Forum",
        href: href,
      },
    ],
  },
  {
    id: "updates",
    title: "Updates",
    description: "Stay informed about the latest features and improvements.",
    sections: [
      {
        id: "new-features",
        title: "New Features & Updates",
        href: href,
      },
      {
        id: "release-notes",
        title: "Release Notes",
        href: href,
      },
    ],
  },
];
