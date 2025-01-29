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
        href: "/aioew",
      },
      {
        id: "account-setup",
        title: "Account Setup & Login",
        href: "/account-setup",
      },
      {
        id: "first-steps",
        title: "Your First Interaction",
        href: "/first-steps",
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
        href: "/afdioa",
      },
      {
        id: "audio-generation",
        title: "Audio Generation",
        href: "/dao",
      },
      {
        id: "video-generation",
        title: "Video Generation",
        href: "/daiod",
      },
      {
        id: "file-uploads",
        title: "Working with Files",
        href: "/file-uploads",
      },
      {
        id: "collaborations",
        title: "Collaborating with Others",
        href: "/collaborations",
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
        href: "",
      },
      {
        id: "free-models",
        title: "Free Models",
        href: "/adaio",
      },
      {
        id: "model-comparison",
        title: "Comparing Models",
        href: "/model-comparison",
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
        href: "/ffda",
      },
      {
        id: "billing-faq",
        title: "Billing FAQs",
        href: "/billing-faq",
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
        href: "/ab",
      },
      {
        id: "fine-tuning-inputs",
        title: "Fine-tuning Inputs",
        href: "/cd",
      },
      {
        id: "settings-preferences",
        title: "Settings & Preferences",
        href: "/settings-preferences",
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
        href: "/faq",
      },
      {
        id: "contact-us",
        title: "Contact Us",
        href: "/contact-us",
      },
      {
        id: "community-forum",
        title: "Community Forum",
        href: "/community-forum",
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
        href: "/fb",
      },
      {
        id: "release-notes",
        title: "Release Notes",
        href: "/release-notes",
      },
    ],
  },
];
