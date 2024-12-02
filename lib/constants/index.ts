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
  toggle: () => void;
  setCurrentPage: (page: string) => void;
}

// SIDEBAR & HEADER CONSTANTS ----- START

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isOpen: true,
      currentPage: "Chat",
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      setCurrentPage: (page) => set({ currentPage: page }),
    }),
    {
      name: "sidebar-storage",
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
      console.log("Opening Text Size Modal");
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
      console.log("Opening Feedback Modal");
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
        onClick: () => console.log("All Notifications")
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
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
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
      console.log('Opening Profile Modal');
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
      console.log('Opening Refer Modal');
    },
  },
  {
    label: 'Settings',
    icon: Settings,
    interactionType: 'modal',
    onClick: () => {
      console.log('Opening Settings Modal');
    },
  },
  {
    label: 'LogOut',
    icon: LogOut,
    interactionType: 'function',
    onClick: () => {
      console.log('Logging out...');
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
    preview: "Making one million dollars in just five...",
  },
  {
    id: "claude",
    name: "Claude 3.5 Sonnet",
    icon: "/models/claude-3.png",
    preview: "Making $1 million in just 5 days is...",
  },
  {
    id: "gemini",
    name: "Gemini 1.5 Pro",
    icon: "/models/gemini.png",
    preview: "Making a million dollars in 5 days is...",
  },
  {
    id: "llama",
    name: "Llama 3 70B Instruct",
    icon: "/models/meta.png",
    preview: "The elusive goal of making $1 million in...",
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    icon: "/models/gpt-3-5.png",
    preview: "Making $1 million in just 5 days is an...",
  },
];

export const IMAGE_MODELS = [
  {
    id: "dall-e-3",
    name: "DALL-E 3",
    icon: "/models/dall-e.png",
    preview: "Create stunning, photorealistic images with OpenAI's latest model",
  },
  {
    id: "midjourney",
    name: "Midjourney",
    icon: "/models/midjourney.png",
    preview: "Generate artistic and creative visuals with fine control",
  },
];

export const AUDIO_MODELS = [
  {
    id: "whisper",
    name: "Whisper",
    icon: "/models/palm-2.png",
    preview: "State-of-the-art speech recognition and transcription",
  },
  {
    id: "musicgen",
    name: "MusicGen",
    icon: "/models/dream.png",
    preview: "Generate original music and sound effects",
  },
];

export const VIDEO_MODELS = [
  {
    id: "sora",
    name: "Sora",
    icon: "/models/sora.webp",
    preview: "Create realistic and imaginative videos with OpenAI's latest",
  },
  {
    id: "runway",
    name: "Runway Gen-2",
    icon: "/models/runway.png",
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
          "Making one million dollars in just five days is an extremely ambitious goal...",
        icon: "/models/gpt-4o.png",
      },
      {
        model: "Claude 3.5 Sonnet",
        content:
          "Making $1 million in just 5 days requires careful consideration...",
        icon: "/models/claude-3.png",
      },
      {
        model: "Gemini 1.5 Pro",
        content:
          "While achieving this goal is challenging, here are some potential approaches...",
        icon: "/models/gemini.png",
      },
      {
        model: "Llama 3 70B Instruct",
        content:
          "This is a complex goal that requires analyzing multiple factors...",
        icon: "/models/meta.png",
      },
      {
        model: "ChatGPT",
        content: `Generative AI, powered by advanced machine learning algorithms, has emerged as a transformative technology with immense potential to shape various industries and applications. Here's an overview of its potential future`,
        icon: "/models/gpt-3-5.png",
      },
    ],
  },
];

// CHAT AREA CONSTANTS ----- END