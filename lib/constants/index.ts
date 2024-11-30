import { ALargeSmall, Settings, Sun, HelpCircle, User, MessageSquare, MessagesSquare, Video, Music, ImageIcon, Trash2, Pencil, Bell, BellDot } from 'lucide-react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
  isOpen: boolean;
  currentPage: string;
  toggle: () => void;
  setCurrentPage: (page: string) => void;
}

// SIDEBAR & HEADER CONSTANTS

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isOpen: true,
      currentPage: 'Chat',
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      setCurrentPage: (page) => set({ currentPage: page }),
    }),
    {
      name: 'sidebar-storage',
    }
  )
);

export const models = [
    'GPT-4o',
    'Llama 3 70B Instruct',
    'Gemini 1.5 Pro',
    'Claude 3.5 Sonnet',
    'ChatGPT'
  ];

export const navItems = [
    {
      type: ALargeSmall,
      label: 'AI Tools',
      onClick: () => {
        console.log('AI Tools');
      }
    },
    {
        type: HelpCircle,
        label: 'Help',
        onClick: () => {
          console.log('Help');
        }
    },
    {
      type: MessagesSquare,
      label: 'Feedback',
      onClick: () => {
        console.log('Feedback');
      }
    },
    {
      type: BellDot,
      label: 'Notifications',
      onClick: () => {
        console.log('Notifications');
      }
    },
  ]

export const sidebarMenuItems = [
    { icon: MessageSquare, label: 'Chat' },
    { icon: ImageIcon, label: 'Image Generation' },
    { icon: Music, label: 'Audio Generation', beta: true },
    { icon: Video, label: 'Video Generation', beta: true },
]

export const chatHistory = [
    'Time to Build a Wall with Four',
    'Making $1 Million in 5 Days',
    'Future of Generative AI in',
    'Strategies to Improve Empl',
    'Making $1 Million in 5 Days',
    'Future of Generative AI in',
    'Strategies to Improve Emplo',
    'Making $1 Million in 5 Days',
    'Future of Generative AI in',
    'Strategies to Improve Emplo',
]

export const dropdownMenuItems = {
    historyDropdownMenuItems: [
      {
        label: 'Rename',
        icon: Pencil,
      },
      {
        label: 'Delete',
        className: 'text-red-500',
        icon: Trash2,
      }
    ],
    chatDropdownMenuItems: [
      {
        label: 'name',
        icon: 'iocn',
      },
    ]
};


// CHAT AREA CONSTANTS

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  responses?: {
    model: string;
    content: string;
    icon: string;
  }[];
}

export const MODELS = [
  {
    id: 'gpt4',
    name: 'GPT-4o',
    icon: '/models/gpt-4o.png',
    preview: 'Making one million dollars in just five...'
  },
  {
    id: 'claude',
    name: 'Claude 3.5 Sonnet',
    icon: '/models/claude-3.png',
    preview: 'Making $1 million in just 5 days is...'
  },
  {
    id: 'gemini',
    name: 'Gemini 1.5 Pro',
    icon: '/models/gemini.png',
    preview: 'Making a million dollars in 5 days is...'
  },
  {
    id: 'llama',
    name: 'Llama 3 70B Instruct',
    icon: '/models/meta.png',
    preview: 'The elusive goal of making $1 million in...'
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: '/models/gpt-3-5.png',
    preview: 'Making $1 million in just 5 days is an...'
  }
];

export const initialMessages = [
  {
    id: '1',
    content: 'How do I make 1 million dollars in 5 days?',
    sender: 'user',
    timestamp: new Date(),
    responses: [
      {
        model: 'GPT-4o',
        content: 'Making one million dollars in just five days is an extremely ambitious goal...',
        icon: '/models/gpt-4o.png',
      },
      {
        model: 'Claude 3.5 Sonnet',
        content: 'Making $1 million in just 5 days requires careful consideration...',
        icon: '/models/claude-3.png',
      },
      {
        model: 'Gemini 1.5 Pro',
        content: 'While achieving this goal is challenging, here are some potential approaches...',
        icon: '/models/gemini.png',
      },
      {
        model: 'Llama 3 70B Instruct',
        content: 'This is a complex goal that requires analyzing multiple factors...',
        icon: '/models/meta.png',
      },
      {
        model: 'ChatGPT',
        content: `Generative AI, powered by advanced machine learning algorithms, has emerged as a transformative technology with immense potential to shape various industries and applications. Here's an overview of its potential future`,
        icon: '/models/gpt-3-5.png',
      },
    ],
  }
]