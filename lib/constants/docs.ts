interface GuideSection {
  id: string;
  title: string;
  href: string;
}

interface Guide {
  id?: string;
  title: string;
  href?: string;
  sections: GuideSection[];
}

// user guides
export const guides: Guide[] = [
  {
    id: "getting-started",
    title: "Overview",
    sections: [
      {
        id: "overview",
        title: "Overview",
        href: "/aioew",
      },
    ],
  },
  {
    id: "platform-usage",
    title: "How to Use the Platform",
    sections: [
      {
        id: "chat",
        title: "Text Generation",
        href: "/afdioa",
      },
      {
        id: "audio",
        title: "Audio Generation",
        href: "/dao",
      },
      {
        id: "video",
        title: "Video Generation",
        href: "/daiod",
      },
    ],
  },
  {
    id: "models",
    title: "Supported Models",
    sections: [
      {
        id: "Premium Models",
        title: "Premium Models",
        href: "",
      },
      {
        id: "Free Models",
        title: "Free Models",
        href: "/adaio",
      },
    ],
  },
  {
    id: "Pricing",
    title: "Pricing",
    sections: [
      {
        id: "pricing",
        title: "Alle-AI pricing",
        href: "/ffda",
      },
    ],
  },
  {
    id: "custom",
    title: "Customization & Control",
    href: "/docs/user-guides/error-handling",
    sections: [
      {
        id: "prompt",
        title: "Prompt Engineering",
        href: "/ab",
      },
      {
        id: "inputs",
        title: "Fine Tunning Inputs",
        href: "/cd",
      },
    ],
  },
  {
    id: "updates",
    title: "Updates",
    sections: [
      {
        id: "new-features",
        title: "New Features & Updates",
        href: "/fb",
      },
    ],
  },
];
