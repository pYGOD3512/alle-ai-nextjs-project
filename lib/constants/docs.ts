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

// api reference base url
const hrefApi = "/docs/api-reference";
// api reference guides
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
        id: "prompts-inputs",
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
      {
        id: "advance-concepts",
        title: "Advanced Guides",
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

// main api reference
interface endPointProps {
  id: string;
  keywords: [];
  title: string;
  href: string;
}
interface sectionProps {
  id: string;
  title: string;
  href: string;
  sections?: endPointProps[];
}
interface apiREfprops {
  title: string;
  sections: sectionProps[];
  id: string;
}

export const apiReference: apiREfprops[] = [
  {
    title: "API Reference",
    id: "reference",
    sections: [
      {
        id: "introduction",
        title: "Introduction",
        href: "",
      },
      {
        id: "authentication",
        title: "Authentication",
        href: "",
      },
      {
        id: "streaming",
        title: "Streaming",
        href: "",
      },
      {
        id: "sdk",
        title: "SDK & Libraries",
        href: "",
      },
    ],
  },
  {
    title: "Endpoints",
    id: "endpoints",
    sections: [
      {
        id: "chat",
        title: "Chat",
        href: "/docs/api-reference",
        sections: [
          {
            id: "chat",
            title: "Completion",
            keywords: [],
            href: `${hrefApi}/chat`,
          },
          {
            id: "search",
            title: "Search",
            keywords: [],
            href: `${hrefApi}/search`,
          },
          {
            id: "comparison",
            title: "Comparison",
            keywords: [],
            href: `${hrefApi}/comparison`,
          },
          {
            id: "summary",
            title: "Summary",
            keywords: [],
            href: `${hrefApi}/summary`,
          },
          {
            id: "combination",
            title: "Combination",
            keywords: [],
            href: `${hrefApi}/combination`,
          },
        ],
      },
      {
        id: "image-generation",
        title: "Image Generation",
        href: "",
        sections: [
          {
            id: "single-image",
            title: "Single Image Generation",
            keywords: [],
            href: "",
          },
          {
            id: "batch-processing",
            title: "Batch Processing",
            keywords: [],
            href: "",
          },
          {
            id: "inpainting",
            title: "Inpainting & Editing",
            keywords: [],
            href: "",
          },
        ],
      },
      {
        id: "video-generation",
        title: "Video Generation",
        href: "",
        sections: [
          {
            id: "short-videos",
            title: "Short Videos",
            keywords: [],
            href: "",
          },
          {
            id: "high-resolution",
            title: "High-Resolution Generation",
            keywords: [],
            href: "",
          },
        ],
      },
      {
        id: "audio-generation",
        title: "Audio Generation",
        href: "",
        sections: [
          {
            id: "text-to-speech",
            title: "Text-to-Speech",
            keywords: [],
            href: "",
          },
          {
            id: "music-generation",
            title: "Music Generation",
            keywords: [],
            href: "",
          },
          {
            id: "voice-cloning",
            title: "Voice Cloning",
            keywords: [],
            href: "",
          },
        ],
      },
      {
        id: "multi-modal",
        title: "Multi-Modal Processing",
        href: "",
        sections: [
          {
            id: "text-to-image",
            title: "Text to Image",
            keywords: [],
            href: "",
          },
          {
            id: "text-to-video",
            title: "Text to Video",
            keywords: [],
            href: "",
          },
          {
            id: "image-to-text",
            title: "Image to Text",
            keywords: [],
            href: "",
          },
          {
            id: "speech-to-text",
            title: "Speech to Text",
            keywords: [],
            href: "",
          },
        ],
      },
    ],
  },
  {
    id: "files",
    title: "Files",
    sections: [
      {
        id: "upload",
        title: "Upload",
        href: "",
      },
      {
        id: "management",
        title: "File Management",
        href: "",
      },
      {
        id: "storage",
        title: "Storage & Retrieval",
        href: "",
      },
    ],
  },
  {
    id: "analytics",
    title: "Analytics & Monitoring",
    sections: [
      {
        id: "usage-metrics",
        title: "Usage Metrics",
        href: "",
      },
      {
        id: "performance-monitoring",
        title: "Performance Monitoring",
        href: "",
      },
      {
        id: "logs",
        title: "API Logs",
        href: "",
      },
    ],
  },
];

export const apiEndPoints = [
  "chat",
  "search",
  "comparison",
  "summary",
  "combination",
];
