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
  Bell,
  Handshake,
  LogOut,
  Braces,
  Heart,
} from "lucide-react";


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
    shortcut: "⌘ + K",
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
    id: "chatgpt-3-5-turbo",
    name: "ChatGPT 3.5",
    icon: "/models/gpt-3-5.png",
    provider: "OpenAI",
    type: "plus",
    preview: "Making $1 million in just 5 days is an...",
  },
  {
    id: "gpt4",
    name: "GPT-4o",
    icon: "/models/gpt-4o.png",
    provider: "OpenAI",
    type: "free",
    preview: "Making one million dollars in just five...",
  },
  {
    id: "gemini-1-5-pro",
    name: "Gemini 1.5 Pro",
    icon: "/models/gemini.png",
    provider: "Google",
    type: "plus",
    preview: "Making a million dollars in 5 days is...",
  },
  {
    id: "llama-3-70b-instruct",
    name: "Llama 3 70B Instruct",
    icon: "/models/meta.png",
    provider: "Meta",
    type: "standard",
    preview: "The elusive goal of making $1 million in...",
  },
  {
    id: "llama-3-1-405b-instruct",
    name: "Llama 3.1 405B Instruct",
    icon: "/models/meta.png",
    provider: "Meta",
    type: "free",
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
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    icon: "/models/gpt-4o.png",
    provider: "OpenAI",
    type: "free",
    preview: "Making $1 million in just 5 days is an...",
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    icon: "/models/claude-3.png",
    provider: "Anthropic",
    type: "free",
    preview: "Making $1 million in just 5 days is...",
  },
  {
    id: "yi-large",
    name: "Yi-Large",
    icon: "/models/yi.png",
    provider: "01.AI",
    type: "free",
    preview: "Making $1 million in just 5 days is an...",
  },
  {
    id: "gemini-1-0-pro",
    name: "Gemini 1.0 Pro",
    icon: "/models/gemini.png",
    provider: "Google",
    type: "free",
    preview: "Making $1 million in just 5 days is an...",
  },
  {
    id: "llama-3-1-8b-instruct",
    name: "Llama 3.1 8B Instruct",
    icon: "/models/meta.png",
    provider: "Meta",
    type: "free",
    preview: "Making $1 million in just 5 days is an...",
  },
  {
    id: "llama-3-1-70b-instruct",
    name: "Llama 3.1 70B Instruct",
    icon: "/models/meta.png",
    provider: "Meta",
    type: "free",
    preview: "Making $1 million in just 5 days is an...",
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    icon: "/models/claude-3.png",
    provider: "Anthropic",
    type: "free",
    preview: "Making $1 million in just 5 days is an...",
  },
  {
    id: "sonar-small-32k-online",
    name: "Sonar Small 32k Online",
    icon: "/models/perplexity-ai.png",
    provider: "Perplexity AI",
    type: "free",
    preview: "Making $1 million in just 5 days is an...",
  },
  {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet",
    icon: "/models/claude-3.png",
    provider: "Anthropic",
    type: "free",
    preview: "Making $1 million in just 5 days is an...",
  },
  {
    id: "claude-3-hiaku",
    name: "Claude 3 Hiaku",
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

export const MODEL_RESPONSES: { [key: string]: string } = {
  "chatgpt-3-5-turbo": "Making $1 million in 5 days is extremely challenging. Here's a realistic perspective: Start with identifying high-value opportunities, leverage existing networks, and focus on scalable solutions. However, remember that sustainable wealth building typically takes more time.",
  
  "gpt4": "While making $1 million in 5 days is an ambitious goal, let's break this down strategically: 1) Identify existing assets that can be leveraged 2) Look for high-return investment opportunities 3) Consider business acquisitions or mergers. However, I must emphasize that such rapid wealth creation carries significant risks.",
  
  "gemini-1-5-pro": "From a practical standpoint, generating $1 million in 5 days would require: 1. Exceptional market timing 2. Significant initial capital 3. High-risk opportunities. Consider more sustainable approaches to wealth building that align with your resources and risk tolerance.",
  
  "llama-3-70b-instruct": "The goal of making $1 million in 5 days requires careful consideration. Here's my analysis: First, evaluate your current resources. Second, identify potential high-return opportunities. Third, understand the associated risks. Remember, sustainable wealth building typically requires more time.",
  
  "claude-3-5-sonnet": "Let me provide a balanced perspective on making $1 million in 5 days. While technically possible, it would require: 1) Substantial initial capital 2) Extremely favorable market conditions 3) High-risk tolerance. Consider focusing on more sustainable long-term wealth building strategies.",

  "sonar-large-32k-online": "Making $1 million in 5 days is extremely challenging. Here's a realistic perspective: Start with identifying high-value opportunities, leverage existing networks, and focus on scalable solutions. However, remember that sustainable wealth building typically takes more time.",

  "gpt-4o-mini": "While making $1 million in 5 days is an ambitious goal, let's break this down strategically: 1) Identify existing assets that can be leveraged 2) Look for high-return investment opportunities 3) Consider business acquisitions or mergers. However, I must emphasize that such rapid wealth creation carries significant risks.",

  "claude-3-opus": "Let me provide a balanced perspective on making $1 million in 5 days. While technically possible, it would require: 1) Substantial initial capital 2) Extremely favorable market conditions 3) High-risk tolerance. Consider focusing on more sustainable long-term wealth building strategies.",

  "yi-large": "The goal of making $1 million in 5 days requires careful consideration. Here's my analysis: First, evaluate your current resources. Second, identify potential high-return opportunities. Third, understand the associated risks. Remember, sustainable wealth building typically requires more time.",

  "gemini-1-0-pro": "From a practical standpoint, generating $1 million in 5 days would require: 1. Exceptional market timing 2. Significant initial capital 3. High-risk opportunities. Consider more sustainable approaches to wealth building that align with your resources and risk tolerance.",
};

export const initialMessages: Message[] = [];

export const socialMediaOptions = [
  {
    name: 'X',
    icon: '/svgs/x-transparent.svg',
    color: 'bg-[#0088cc]/10',
    hoverColor: 'hover:bg-[#0088cc]/20',
    textColor: 'text-black',
    handler: (url: string) => `https://x.com/intent/tweet?url=${encodeURIComponent(url)}`
  },
  {
    name: 'Facebook',
    icon: '/svgs/facebook.svg',
    color: 'bg-[#4267B2]/10',
    hoverColor: 'hover:bg-[#4267B2]/20',
    textColor: 'text-[#4267B2]',
    handler: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  },
  {
    name: 'Reddit',
    icon: '/svgs/reddit.svg',
    color: 'bg-[#FF4500]/10',
    hoverColor: 'hover:bg-[#FF4500]/20',
    textColor: 'text-[#FF4500]',
    handler: (url: string) => `https://reddit.com/submit?url=${encodeURIComponent(url)}`
  },
  {
    name: 'Discord',
    icon: '/svgs/discord.svg',
    color: 'bg-[#5865F2]/10',
    hoverColor: 'hover:bg-[#5865F2]/20',
    textColor: 'text-[#5865F2]',
    handler: (url: string) => `https://discord.com/channels/@me`
  },
  {
    name: 'WhatsApp',
    icon: '/svgs/whatsapp.svg',
    color: 'bg-[#25D366]/10',
    hoverColor: 'hover:bg-[#25D366]/20',
    textColor: 'text-[#25D366]',
    handler: (url: string) => `https://wa.me/?text=${encodeURIComponent(url)}`
  },
  {
    name: 'Telegram',
    icon: '/svgs/telegram.svg',
    color: 'bg-[#0088cc]/10',
    hoverColor: 'hover:bg-[#0088cc]/20',
    textColor: 'text-[#0088cc]',
    handler: (url: string) => `https://t.me/share/url?url=${encodeURIComponent(url)}`
  }
];


