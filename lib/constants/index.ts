import {
  ALargeSmall,
  Settings,
  HelpCircle,
  User,
  MessageSquare,
  MessagesSquare,
  Video,
  Music,
  ImageIcon,
  Trash2,
  Pencil,
  Bell,
  Handshake,
  LogOut,
  Braces,
} from "lucide-react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  isOpen: boolean;
  currentPage: string;
  sectionIds: { [key: string]: string | null }; // Generalized section IDs
  toggle: () => void;
  setCurrentPage: (page: string) => void;
  setSectionId: (section: string, id: string | null) => void; // Setter for dynamic IDs
  setOpen: (value: boolean) => void;
}
// SIDEBAR & HEADER CONSTANTS ----- START

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isOpen: true,
      currentPage: "chat",
      sectionIds: {
        chatId: null,
        imageId: null,
        audioId: null,
        videoId: null,
      }, // Default section IDs
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      setCurrentPage: (page) => set({ currentPage: page }),
      setSectionId: (section, id) =>
        set((state) => ({
          sectionIds: {
            ...state.sectionIds,
            [section]: id, // Dynamically update the section ID
          },
        })),
      setOpen: (value) => set({ isOpen: value }),
    }),
    {
      name: "sidebar-storage",
      partialize: (state) => ({
        isOpen: state.isOpen,
        sectionIds: state.sectionIds,
      }),
    }
  )
);

export const models = [
  "GPT-4o",
  "Llama 3 70B Instruct",
  "Gemini 1.5 Pro",
  "Claude 3.5 Sonnet",
  "ChatGPT",
];

export const navItems = [
  {
    type: ALargeSmall,
    label: "Text size",
    interactionType: "modal",
    onClick: () => {
      // console.log("Opening Text Size Modal");
    },
  },
  {
    type: HelpCircle,
    label: "Help",
    interactionType: "function",
  },
  {
    type: MessagesSquare,
    label: "Feedback",
    interactionType: "modal",
    onClick: () => {
      // console.log("Opening Feedback Modal");
    },
  },
  {
    type: Bell,
    label: "Notifications",
    interactionType: "dropdown",
    dropdownItems: [
      {
        label: "All Notifications",
        icon: Bell,
        // onClick: () => console.log("All Notifications")
      },
    ]
  },
];

type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
};

export const notifications: Notification[] = [
  {
    id: '1',
    title: 'New Model Available',
    message: 'Claude 3 Opus is now available for all users',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    read: false,
  },
  {
    id: '2',
    title: 'Welcome!',
    message: 'Thanks for joining our AI platform. Take a tour to get started.',
    timestamp: new Date(Date.now() - 1000 * 60 * 24), // 1 day ago
    read: true,
  }
];

export const sidebarMenuItems = [
  { icon: MessageSquare, label: "Chat" ,href:"/" },
  { icon: ImageIcon, label: "Image Generation", href: "/image" },
  { icon: Music, label: "Audio Generation", beta: true, href: "/audio" },
  { icon: Video, label: "Video Generation", beta: true, href: "/video" },
];

export const chatHistory = [
  "Time to Build a Wall with Four",
  "Making $1 Million in 5 Days",
  "Future of Generative AI in",
  "Strategies to Improve Empl",
  "Making $1 Million in 5 Days",
  "Future of Generative AI in",
  "Strategies to Improve Emplo",
  "Making $1 Million in 5 Days",
  "Future of Generative AI in",
  "Strategies to Improve Emplo",
];

export const dropdownMenuItems = {
  historyDropdownMenuItems: [
    {
      label: "Rename",
      icon: Pencil,
    },
    {
      label: "Delete",
      className: "text-red-500",
      icon: Trash2,
    },
  ],
  chatDropdownMenuItems: [
    {
      label: "name",
      icon: "iocn",
    },
  ],
};

export const userMenuItems = [
  {
    label: 'Profile',
    icon: User,
    interactionType: 'modal',
    onClick: () => {
      // console.log('Opening Profile Modal');
    },
  },
  {
    label: 'Developer',
    icon: Braces,
    interactionType: 'link',
    href: 'https://alle-ai.com/developer',
  },
  {
    label: 'Refer',
    icon: Handshake,
    interactionType: 'modal',
    onClick: () => {
      // console.log('Opening Refer Modal');
    },
  },
  {
    label: 'Settings',
    icon: Settings,
    interactionType: 'modal',
    shortcut: 'Ctrl+K',
    onClick: () => {
      // console.log('Opening Settings Modal');
    },
  },
  {
    label: 'LogOut',
    icon: LogOut,
    interactionType: 'function',
    onClick: () => {
      // console.log('Logging out...');
    },
  },
];
// SIDEBAR & HEADER CONSTANTS ----- END


// CHAT AREA CONSTANTS ----- START

export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  responses?: {
    model: string;
    content: string;
    icon: string;
  }[];
}

export const CHAT_MODELS = [
  {
    id: "gpt4",
    name: "GPT-4o",
    icon: "/models/gpt-4o.png",
    provider: "OpenAI",
    type: "free",
    preview: "Making one million dollars in just five...",
  },
  {
    id: "claude",
    name: "Claude 3.5 Sonnet",
    icon: "/models/claude-3.png",
    provider: "Anthropic",
    type: "free",
    preview: "Making $1 million in just 5 days is...",
  },
  {
    id: "gemini",
    name: "Gemini 1.5 Pro",
    icon: "/models/gemini.png",
    provider: "Google",
    type: "plus",
    preview: "Making a million dollars in 5 days is...",
  },
  {
    id: "llama",
    name: "Llama 3 70B Instruct",
    icon: "/models/meta.png",
    provider: "Meta",
    type: "standard",
    preview: "The elusive goal of making $1 million in...",
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    icon: "/models/gpt-3-5.png",
    provider: "OpenAI",
    type: "plus",
    preview: "Making $1 million in just 5 days is an...",
  },
  {
    id: "sonar-large-32k-online",
    name: "Sonar Large 32k Online",
    icon: "/models/perplexity-ai.png",
    provider: "Perplexity AI",
    type: "plus",
    preview: "Making $1 million in just 5 days is an...",
  },
  {
    id: "claude3",
    name: "Claude 3 Opus",
    icon: "/models/claude-3.png",
    provider: "Anthropic",
    type: "free",
    preview: "Making $1 million in just 5 days is an...",
  },
];

export const IMAGE_MODELS = [
  {
    id: "dall-e-3",
    name: "DALL-E 3",
    icon: "/models/dall-e.png",
    provider: "OpenAI",
    type: "free",
    preview: "Create stunning, photorealistic images with OpenAI's latest model",
  },
  {
    id: "stable-diffusion",
    name: "Stable Diffusion",
    icon: "/models/stability-ai.png",
    provider: "Stability AI",
    type: "free",
    preview: "Create stunning, photorealistic images with OpenAI's latest model",
  },
  {
    id: "midjourney",
    name: "Midjourney",
    icon: "/models/midjourney.png",
    provider: "Midjourney",
    type: "free",
    preview: "Generate artistic and creative visuals with fine control",
  },
  {
    id: "titan-image-generator",
    name: "Titan Image Generator",
    icon: "/models/titan.png",
    provider: "Amazon",
    type: "plus",
    preview: "Generate artistic and creative visuals with fine control",
  },
];

export const AUDIO_MODELS = [
  {
    id: "whisper",
    name: "Whisper",
    icon: "/models/gpt-4.png",
    provider: "OpenAI",
    type: "free",
    preview: "State-of-the-art speech recognition and transcription",
  },
  {
    id: "musicgen",
    name: "MusicGen",
    icon: "/models/dream.png",
    provider: "musicgen",
    type: "free",
    preview: "Generate original music and sound effects",
  },
];

export const VIDEO_MODELS = [
  {
    id: "sora",
    name: "Sora",
    icon: "/models/gpt-4.png",
    provider: "OpenAI",
    type: "free",
    preview: "Create realistic and imaginative videos with OpenAI's latest",
  },
  {
    id: "runway",
    name: "Runway Gen-2",
    icon: "/models/runway.png",
    provider: "runaway",
    selected: 'true',
    type: "free",
    preview: "Professional video generation and editing capabilities",
  },
];

export const initialMessages = [
  {
    id: "1",
    content: "How do I make 1 million dollars in 5 days?",
    sender: "user",
    timestamp: new Date(),
    responses: [
      {
        model: "GPT-4o",
        content:
          `
          SQL injection: Occurs when a user can input malicious SQL code into a web application, allowing them to execute unauthorized commands on the database.
          Cross-site scripting (XSS): Allows attackers to inject malicious scripts into a web page, which can be used to steal user information, redirect traffic, or launch other attacks.
          Input forgery: Occurs when an attacker can manipulate the input validation process to bypass security checks, such as changing a numerical input field to a text field.`,
        icon: "/models/gpt-4o.png",
      },
      {
        model: "Claude 3.5 Sonnet",
        content:
          `
          Weak passwords: Users often create passwords that are easy to guess or crack, allowing attackers to gain unauthorized access to accounts.
          Unprotected login pages: Login pages may not be sufficiently protected against brute force attacks or password sniffing techniques.
          Insufficient authorization: Users may be granted access to resources or functionality that they should not have, allowing them to perform unauthorized actions.`,
        icon: "/models/claude-3.png",
      },
      {
        model: "Gemini 1.5 Pro",
        content:
          `
          Default configurations: Web applications may be installed with default settings that are insecure, such as weak passwords or unpatched software.
          Unpatched software: Web application software often requires regular updates to patch security vulnerabilities. Failure to apply these updates can leave the application vulnerable to attack.
          Insecure server configurations: Web servers may be misconfigured, exposing sensitive data or allowing attackers to gain unauthorized access.`,
        icon: "/models/gemini.png",
      },
      {
        model: "Llama 3 70B Instruct",
        content:
          `
          Cross-site request forgery (CSRF): Occurs when an attacker can trick a user into submitting a request that they do not intend to, such as transferring funds or changing account settings.
          Insecure direct object references (IDOR): Occurs when an attacker can guess or manipulate the URL of a web page to access sensitive information that they should not have access to.
          Broken object-level authorization: Similar to IDOR, this vulnerability occurs when an attacker can bypass authorization checks to access objects that they should not have access to.`,
        icon: "/models/meta.png",
      },
      {
        model: "ChatGPT",
        content: `
        Outdated software: Web applications that are not kept up to date with the latest security patches may be vulnerable to known exploits.
          Third-party libraries: Web applications often use third-party libraries, which can introduce vulnerabilities if not properly reviewed and updated.
          Exploit kits: Attackers may use exploit kits to automate the process of exploiting common vulnerabilities.`,
        icon: "/models/gpt-3-5.png",
      },
    ],
  },
];

// CHAT AREA CONSTANTS ----- END