import { animate } from "framer-motion";
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
  Heart,
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

interface ContentType {
  input: string;
  voice: string;
  attachment: string;
}

interface ContentState {
  chat: ContentType;
  image: ContentType;
  audio: ContentType;
  video: ContentType;
}

interface ContentStore {
  content: ContentState;
  setContent: (
    type: keyof ContentState,
    key: keyof ContentType,
    value: string
  ) => void;
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

interface SelectedModelsStore {
  selectedModels: {
    chat: string[];
    image: string[];
    audio: string[];
    video: string[];
  };
  tempSelectedModels: string[]; // Here I'm using the tempSelectedModels to store the selected models before the user saves them.
  setTempSelectedModels: (models: string[]) => void;
  saveSelectedModels: (type: "chat" | "image" | "audio" | "video") => void;
  getSelectedModelNames: (
    type: "chat" | "image" | "audio" | "video"
  ) => string[];
}

export const useSelectedModelsStore = create<SelectedModelsStore>()(
  persist(
    (set, get) => ({
      selectedModels: {
        chat: [],
        image: [],
        audio: [],
        video: [],
      },
      tempSelectedModels: [],
      setTempSelectedModels: (models) => set({ tempSelectedModels: models }),
      saveSelectedModels: (type) =>
        set((state) => ({
          selectedModels: {
            ...state.selectedModels,
            [type]: state.tempSelectedModels,
          },
          tempSelectedModels: [], // So here we empty the tempSelectedModels
        })),
      getSelectedModelNames: (type) => {
        const state = get();
        const modelList =
          type === "chat"
            ? CHAT_MODELS
            : type === "image"
            ? IMAGE_MODELS
            : type === "audio"
            ? AUDIO_MODELS
            : VIDEO_MODELS;

        return state.selectedModels[type]
          .map((id) => modelList.find((model) => model.id === id)?.name ?? "")
          .filter((name) => name !== "");
      },
    }),
    {
      name: "selected-models-storage",
    }
  )
);

interface ImageResponse {
  modelId: string;
  liked: boolean;
  imageUrl: string;
}

interface GeneratedImagesStore {
  images: ImageResponse[];
  lastPrompt: string | null;
  setImages: (images: ImageResponse[]) => void;
  updateImage: (modelId: string, updates: Partial<ImageResponse>) => void;
  setLastPrompt: (prompt: string) => void;
  clearImages: () => void;
}

export const useGeneratedImagesStore = create<GeneratedImagesStore>()(
  persist(
    (set, get) => ({
      images: [],
      lastPrompt: null,
      setImages: (images) => set({ images }),
      updateImage: (modelId, updates) =>
        set((state) => ({
          images: state.images.map((img) =>
            img.modelId === modelId ? { ...img, ...updates } : img
          ),
        })),
      setLastPrompt: (prompt) => set({ lastPrompt: prompt }),
      clearImages: () => set({ images: [], lastPrompt: null }),
    }),
    {
      name: "generated-images-storage",
    }
  )
);

interface AudioResponse {
  modelId: string;
  content: string;
  audioUrl: string;
  liked?: boolean;
}

interface GeneratedAudioStore {
  responses: AudioResponse[];
  lastPrompt: string | null;
  setResponses: (responses: AudioResponse[]) => void;
  updateResponse: (modelId: string, updates: Partial<AudioResponse>) => void;
  setLastPrompt: (prompt: string) => void;
  clearResponses: () => void;
}

export const useGeneratedAudioStore = create<GeneratedAudioStore>()(
  persist(
    (set) => ({
      responses: [],
      lastPrompt: null,
      setResponses: (responses) => set({ responses }),
      updateResponse: (modelId, updates) =>
        set((state) => ({
          responses: state.responses.map((res) =>
            res.modelId === modelId ? { ...res, ...updates } : res
          ),
        })),
      setLastPrompt: (prompt) => set({ lastPrompt: prompt }),
      clearResponses: () => set({ responses: [], lastPrompt: null }),
    }),
    {
      name: "generated-audio-storage",
    }
  )
);

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
    ],
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
    id: "1",
    title: "New Model Available",
    message: "Claude 3 Opus is now available for all users",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    read: false,
  },
  {
    id: "2",
    title: "Welcome!",
    message: "Thanks for joining our AI platform. Take a tour to get started.",
    timestamp: new Date(Date.now() - 1000 * 60 * 24), // 1 day ago
    read: true,
  },
];

export const sidebarMenuItems = [
  { icon: MessageSquare, label: "Chat", href: "/" },
  { icon: ImageIcon, label: "Image Generation", href: "/image" },
  { icon: Music, label: "Audio Generation", beta: true, href: "/audio" },
  { icon: Video, label: "Video Generation", beta: true, href: "/video" },
];

export const chatHistory = [
  "Time to Build a Wall with Four: Key Insights on Effective Barrier Construction and Team Collaboration",
  "Making $1 Million in 5 Days: Proven Strategies for Rapid Wealth Creation in a Short Timeframe",
  "The Future of Generative AI in Business: How AI is Transforming Industries and Creating New Opportunities",
  "Strategies to Improve Employee Productivity: Effective Methods to Enhance Workplace Efficiency and Focus",
  "Making $1 Million in 5 Days: A Guide to Quick Financial Success and Smart Investment Approaches",
  "The Future of Generative AI in Healthcare: Exploring AI's Potential in Revolutionizing Medical Practices",
  "Strategies to Improve Employee Retention: Tips for Keeping Top Talent Engaged and Motivated Long-Term",
  "Making $1 Million in 5 Days: Actionable Insights from Entrepreneurs Who Have Achieved Quick Financial Growth",
  "The Future of Generative AI in Education: How AI is Shaping the Future of Learning and Personalized Teaching",
  "Strategies to Improve Employee Engagement: Techniques to Build Stronger Connections and Motivation at Work",
  "The Future of Generative AI in Business: How AI is Transforming Industries and Creating New Opportunities",
  "Strategies to Improve Employee Productivity: Effective Methods to Enhance Workplace Efficiency and Focus",
  "Making $1 Million in 5 Days: A Guide to Quick Financial Success and Smart Investment Approaches",
  "The Future of Generative AI in Healthcare: Exploring AI's Potential in Revolutionizing Medical Practices",
  "Strategies to Improve Employee Retention: Tips for Keeping Top Talent Engaged and Motivated Long-Term",
];

export const imageHistory = [
  "Sunset over mountain landscape",
  "Futuristic city skyline",
  "Abstract geometric patterns",
  "Cyberpunk character portrait",
  "Magical forest scene",
  "Underwater coral reef",
  "Space station interior",
  "Medieval castle at dawn",
  "Neon-lit street market",
  "Steampunk machinery",
];

export const audioHistory = [
  "Epic orchestral soundtrack",
  "Ambient nature sounds",
  "Lo-fi beats composition",
  "Jazz piano improvisation",
  "Electronic dance track",
  "Acoustic guitar melody",
  "Cinematic sound effects",
  "Meditation background music",
  "Synthwave composition",
  "Vocal harmony arrangement",
];

export const videoHistory = [
  "Product showcase animation",
  "Nature documentary clip",
  "Character animation test",
  "Particle effects demo",
  "Architectural walkthrough",
  "Logo reveal animation",
  "Sci-fi scene rendering",
  "Motion graphics intro",
  "3D environment flythrough",
  "Special effects compilation",
];

interface HistoryItem {
  id: string;
  title: string;
  createdAt: Date;
  type: "chat" | "image" | "audio" | "video";
  animate?: boolean;
}

interface HistoryStore {
  history: HistoryItem[];
  addHistory: (item: Omit<HistoryItem, "id" | "createdAt">) => void;
  removeHistory: (id: string) => void;
  renameHistory: (id: string, newTitle: string) => void;
  getHistoryByType: (type: HistoryItem["type"]) => HistoryItem[];
  removeAnimate: (id?: string) => void;
}

// So I'm using the state manager to handle the static history for each page.
export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set, get) => ({
      history: [
        ...chatHistory.map((title, index) => ({
          id: `chat-${index}`,
          title,
          createdAt: new Date(Date.now() - index * 1000 * 60 * 60),
          type: "chat" as const,
          animate: false,
        })),
        ...imageHistory.map((title, index) => ({
          id: `image-${index}`,
          title,
          createdAt: new Date(Date.now() - index * 1000 * 60 * 60),
          type: "image" as const,
          animate: false,
        })),
        ...audioHistory.map((title, index) => ({
          id: `audio-${index}`,
          title,
          createdAt: new Date(Date.now() - index * 1000 * 60 * 60),
          type: "audio" as const,
          animate: false,
        })),
        ...videoHistory.map((title, index) => ({
          id: `video-${index}`,
          title,
          createdAt: new Date(Date.now() - index * 1000 * 60 * 60),
          type: "video" as const,
          animate: false,
        })),
      ],
      addHistory: (item) =>
        set((state) => ({
          history: [
            {
              ...item,
              id: `${item.type}-${Date.now()}`,
              createdAt: new Date(),
              animate: true,
            },
            ...state.history,
          ],
        })),
      removeAnimate: () => {
        set((state) => ({
          history: state.history.map((item) =>
            item.animate ? { ...item, animate: false } : item
          ),
        }));
      },
      removeHistory: (id) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        })),
      renameHistory: (id, newTitle) =>
        set((state) => ({
          history: state.history.map((item) =>
            item.id === id ? { ...item, title: newTitle } : item
          ),
        })),
      getHistoryByType: (type) => {
        return get().history.filter((item) => item.type === type);
      },
    }),

    {
      name: "history-storage",
    }
  )
);

export const userMenuItems = [
  {
    label: "Profile",
    icon: User,
    interactionType: "modal",
    onClick: () => {
      // console.log('Opening Profile Modal');
    },
  },
  {
    label: "Developer",
    icon: Braces,
    interactionType: "link",
    href: "https://alle-ai.com/developer",
  },
  {
    label: "Refer",
    icon: Handshake,
    interactionType: "modal",
    onClick: () => {
      // console.log('Opening Refer Modal');
    },
  },
  {
    label: "Album",
    icon: Heart,
    interactionType: "modal",
    onClick: () => {
      // console.log('Opening Refer Modal');
    },
  },
  {
    label: "Settings",
    icon: Settings,
    interactionType: "modal",
    shortcut: "Ctrl+K",
    onClick: () => {
      // console.log('Opening Settings Modal');
    },
  },
  {
    label: "LogOut",
    icon: LogOut,
    interactionType: "function",
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
    preview:
      "Create stunning, photorealistic images with OpenAI's latest model",
  },
  {
    id: "stable-diffusion",
    name: "Stable Diffusion",
    icon: "/models/stability-ai.png",
    provider: "Stability AI",
    type: "free",
    preview:
      "Create stunning, photorealistic images with OpenAI's latest model",
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
    selected: "true",
    type: "free",
    preview: "Professional video generation and editing capabilities",
  },
  {
    id: "luma",
    name: "Luma AI",
    icon: "/models/luma.png",
    provider: "Dream Machine",
    selected: "true",
    type: "free",
    preview: "Professional video generation and editing capabilities",
  },
  {
    id: "kling",
    name: "Kling AI",
    icon: "/models/kling.png",
    provider: "Kuaishou Technology",
    type: "free",
    preview: "Create realistic and imaginative videos with OpenAI's latest",
  },
  {
    id: "animate-diff",
    name: "Animate Diff",
    icon: "/models/stability-ai.png",
    provider: "Stability AI",
    type: "free",
    preview: "Create realistic and imaginative videos with OpenAI's latest",
  },
];

export const initialMessages = [
  {
    id: "1",

    sender: "user",
    timestamp: new Date(),
    responses: [
      {
        model: "GPT-4o",
        content: `
          SQL injection: Occurs when a user can input malicious SQL code into a web application, allowing them to execute unauthorized commands on the database.
          Cross-site scripting (XSS): Allows attackers to inject malicious scripts into a web page, which can be used to steal user information, redirect traffic, or launch other attacks.
          Input forgery: Occurs when an attacker can manipulate the input validation process to bypass security checks, such as changing a numerical input field to a text field.`,
        icon: "/models/gpt-4o.png",
      },
      {
        model: "Claude 3.5 Sonnet",
        content: `
          Weak passwords: Users often create passwords that are easy to guess or crack, allowing attackers to gain unauthorized access to accounts.
          Unprotected login pages: Login pages may not be sufficiently protected against brute force attacks or password sniffing techniques.
          Insufficient authorization: Users may be granted access to resources or functionality that they should not have, allowing them to perform unauthorized actions.`,
        icon: "/models/claude-3.png",
      },
      {
        model: "Gemini 1.5 Pro",
        content: `
          Default configurations: Web applications may be installed with default settings that are insecure, such as weak passwords or unpatched software.
          Unpatched software: Web application software often requires regular updates to patch security vulnerabilities. Failure to apply these updates can leave the application vulnerable to attack.
          Insecure server configurations: Web servers may be misconfigured, exposing sensitive data or allowing attackers to gain unauthorized access.`,
        icon: "/models/gemini.png",
      },
      {
        model: "Llama 3 70B Instruct",
        content: `
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

// NAVIGATION CONTENT DATA MANAGEMENTS --- STARTS
// NAVIGATION CONTENT DATA MANAGEMENTS --- ENDS

// SOCIAL MEDIA SHARE --- START

export const socialMediaOptions = [
  {
    name: "X",
    icon: "/svgs/x-transparent.svg",
    color: "bg-[#0088cc]/10",
    hoverColor: "hover:bg-[#0088cc]/20",
    textColor: "text-black",
    handler: (url: string) =>
      `https://x.com/intent/tweet?url=${encodeURIComponent(url)}`,
  },
  {
    name: "Facebook",
    icon: "/svgs/facebook.svg",
    color: "bg-[#4267B2]/10",
    hoverColor: "hover:bg-[#4267B2]/20",
    textColor: "text-[#4267B2]",
    handler: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "Reddit",
    icon: "/svgs/reddit.svg",
    color: "bg-[#FF4500]/10",
    hoverColor: "hover:bg-[#FF4500]/20",
    textColor: "text-[#FF4500]",
    handler: (url: string) =>
      `https://reddit.com/submit?url=${encodeURIComponent(url)}`,
  },
  {
    name: "Discord",
    icon: "/svgs/discord.svg",
    color: "bg-[#5865F2]/10",
    hoverColor: "hover:bg-[#5865F2]/20",
    textColor: "text-[#5865F2]",
    handler: (url: string) => `https://discord.com/channels/@me`,
  },
  {
    name: "WhatsApp",
    icon: "/svgs/whatsapp.svg",
    color: "bg-[#25D366]/10",
    hoverColor: "hover:bg-[#25D366]/20",
    textColor: "text-[#25D366]",
    handler: (url: string) => `https://wa.me/?text=${encodeURIComponent(url)}`,
  },
  {
    name: "Telegram",
    icon: "/svgs/telegram.svg",
    color: "bg-[#0088cc]/10",
    hoverColor: "hover:bg-[#0088cc]/20",
    textColor: "text-[#0088cc]",
    handler: (url: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}`,
  },
];

// SOCIAL MEDIA SHARE --- END

export interface LikedMediaItem {
  id: string;
  type: "image" | "video" | "audio";
  url: string;
  modelName: string;
  modelIcon: string;
  modelId: string;
  prompt: string;
  timestamp: Date;
  liked: boolean;
}

interface LikedMediaStore {
  likedMedia: LikedMediaItem[];
  addLikedMedia: (item: Omit<LikedMediaItem, "id" | "timestamp">) => void;
  removeLikedMedia: (id: string) => void;
  getLikedMediaByType: (
    type: "all" | "image" | "video" | "audio"
  ) => LikedMediaItem[];
}

export const useLikedMediaStore = create<LikedMediaStore>()(
  persist(
    (set, get) => ({
      likedMedia: [],
      addLikedMedia: (item) =>
        set((state) => ({
          likedMedia: [
            {
              ...item,
              id: `${item.type}-${Date.now()}`,
              timestamp: new Date(),
            },
            ...state.likedMedia,
          ],
        })),
      removeLikedMedia: (id) =>
        set((state) => ({
          likedMedia: state.likedMedia.filter((item) => item.id !== id),
        })),
      getLikedMediaByType: (type) => {
        const media = get().likedMedia;
        if (type === "all") return media;
        return media.filter((item) => item.type === type);
      },
    }),
    {
      name: "liked-media-storage",
    }
  )
);
