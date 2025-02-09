// api guides

interface searchParams {
  section_id: string;
  keywords: string[];
  title: string;
  description?: string;
}
interface GuideSection {
  id: string;
  title: string;
  href: string;
  description?: string;
  searchParams?: searchParams[];
}

interface Guide {
  id?: string;
  title: string;
  href?: string;
  description?: string;
  sections: GuideSection[];
}

interface userGuides {
  id?: string;
  title: string;
  section: GuideSection[];
}

const href = "/docs/api";
// user guides
export const guides: Guide[] = [
  {
    id: "get-started",
    title: "Get Started",
    description: "Learn the basics of using Alle-AI",
    sections: [
      {
        id: "quickstart",
        title: "Quickstart",
        href: href,
        description: "Learn how to make your first API request.",
      },
      {
        id: "pricing",
        title: "Pricing",
        href: href,
      },
      {
        id: "models",
        title: "Models",
        href: href,
      },
    ],
  },
  {
    id: "platform-usage",
    title: "Capabilities",
    description: "Explore the core functionalities of Alle-AI",
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
        id: "image-generation",
        title: "Image Generation",
        href: href,
      },
      {
        id: "video-generation",
        title: "Video Generation",
        href: href,
      },

      {
        id: "file-uploads",
        title: "Attachments",
        href: href,
      },
    ],
  },
  {
    id: "resources",
    title: "Resources",
    description: "",
    sections: [
      {
        id: "libraries",
        title: "Libraries",
        href: "",
      },
      {
        id: "prompts",
        title: "Prompt examples",
        href: "",
      },
      {
        id: "limits",
        title: "Rate limits",
        href: "",
      },
      {
        id: "error-codes",
        title: "Error codes",
        href: "",
      },
    ],
  },

  {
    id: "support",
    title: "Help & Support  ",
    description: "Find help and resources to assist you with Alle-AI",
    sections: [
      {
        id: "faq",
        title: "FAQ",
        href: "/collection",
      },
      {
        id: "contact-us",
        title: "Contact Us",
        href: "/contact-us",
      },
      {
        id: "model_glossary",
        title: "Model Glossary",
        href: "/model-glossary",
      },
      {
        id: "changelog",
        title: "changelog",
        href: "/changelog",
      },
    ],
  },
  {
    id: "updates",
    title: "Updates",
    description: "Stay informed about the latest features and improvements",
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

// user guides

export const userGuides: userGuides[] = [
  {
    title: "Get Started",
    id: "get-started",
    section: [
      {
        id: "overview",
        href: "/docs/user-guides",
        title: "Platform overview",
        searchParams: [
          {
            section_id: "get_started",
            keywords: ["get started", "Alle AI"],
            title: "Getting Started",
          },
          {
            section_id: "capabilities",
            keywords: [
              "audio generation",
              "text generation",
              "video generation",
              "audio generation",
            ],
            title: "Platform Capabilities",
            description: "A summary of our platform Overview",
          },
          {
            section_id: "quick_start",
            keywords: [],
            title: "Quick Start",
            description: "Set up Everything",
          },
        ],
      },
    ],
  },
  {
    title: "Using the Platform",
    id: "using-platform",
    section: [
      {
        id: "chat",
        title: "Text generation",
        href: "",
        searchParams: [],
      },
      {
        id: "image",
        title: "Image generation",
        href: "",
        searchParams: [],
      },
      {
        id: "audio",
        title: "Audio generation",
        href: "",
        searchParams: [],
      },
      {
        id: "video",
        title: "Video generation",
        href: "",
        searchParams: [],
      },
    ],
  },
  {
    title: "Interactions ",
    id: "chat-interactions",
    section: [
      {
        id: "history",
        title: "Managing Chat History",
        href: "",
      },
      {
        id: "prompts",
        title: "Using Prompts Effectively",
        href: "",
      },
    ],
  },
  {
    title: "Help and support",
    id: "support",
    section: [
      {
        id: "faq",
        title: "FAQ",
        href: "/collection",
      },
      {
        id: "contact-us",
        title: "Contact Us",
        href: "/contact-us",
      },
      {
        id: "model_glossary",
        title: "Model Glossary",
        href: "/model-glossary",
      },
    ],
  },
  {
    id: "devs",
    title: "Developer Guides",
    section: [
      {
        id: "api-ref",
        title: "API Reference",
        href: "",
      },
      {
        id: "api-limt",
        title: "Rate Limits",
        href: "",
      },
    ],
  },
];
