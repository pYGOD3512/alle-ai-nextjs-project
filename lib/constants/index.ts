import { ALargeSmall, Settings, Sun, HelpCircle, User, MessageSquare, MessagesSquare, Video, Music, ImageIcon, Trash2, Pencil, Bell, BellDot } from 'lucide-react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
  isOpen: boolean;
  currentPage: string;
  toggle: () => void;
  setCurrentPage: (page: string) => void;
}

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
        type: Sun,
        label: 'Theme',
        onClick: () => {
          console.log('Theme');
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
        className: 'text-destructive',
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
