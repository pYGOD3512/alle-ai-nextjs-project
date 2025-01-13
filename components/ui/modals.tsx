import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  CHAT_MODELS,
  IMAGE_MODELS,
  AUDIO_MODELS,
  VIDEO_MODELS,
  socialMediaOptions,
  transactions,
  modelUsageData,
  categoryUsageData,
  timeSeriesData
} from "@/lib/constants";
import { useSidebarStore, useSelectedModelsStore, useHistoryStore, useLikedMediaStore, LikedMediaItem, useDriveAuthStore, useSharedLinksStore, useVoiceStore } from "@/stores";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  User,
  BarChart2,
  Shield,
  Save,
  Gem,
  Copy,
  Loader,
  Pencil,
  X,
  Search,
  Check,
  DatabaseBackup,
  Info,
  History,
  MoreHorizontal,
  Trash2,
  Heart,
  Maximize2,
  Music,
  Pause,
  Play,
  Folder,
  File,
  ArrowLeft,
  LogIn,
  RefreshCw,
  RefreshCcw,
  Link,
  Clock9,
  MessageSquare,
  Share2,
  Boxes,
  Type,
  Code,
  PanelLeftClose,
  Command as KeyboardCommand,
  AlertTriangle,
  Receipt,
  Users,
  CircleDot,
  Wallet,
  CreditCard,
  ArrowUpDown,
  Globe,
  Minus,
  Plus,
  Volume2,
  Gauge,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Crown,
  Coins,
  Clock,
  ChevronsUpDown,
  Monitor,
  Smartphone,
  Tablet,
  LogOut,
  Chrome,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { FaWhatsapp, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { format, formatDistanceToNow } from "date-fns";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

import { driveService } from '@/lib/services/driveServices';
import { useRouter } from "next/router";
import { Share } from "next/dist/compiled/@next/font/dist/google";
import { DataTable } from "./txn/data-table";
import { columns } from "./txn/columns";
import { StatCard } from "./stat-card";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTabValue?: string;
}

interface SearchHistoryModalProps extends ModalProps {
  currentType: 'chat' | 'image' | 'audio' | 'video';
}

interface AlbumItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  modelName: string;
  timestamp: Date;
  prompt?: string;
}

interface SubscriptionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  planPrice: number;
  currentBalance: number;
  onConfirm: () => void;
}

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  modelName: string;
}

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (file: DriveFile) => void;
}

interface DriveFile {
  id: string;
  name: string;
  type: 'folder' | 'file';
  mimeType: string;
  thumbnailUrl?: string;
  size?: string;
}

interface ShortcutItem {
  action: string;
  shortcut: {
    keys: string[];
  }[];
}

interface LogoutModalProps extends ModalProps {
  mode?: 'current' | 'device';
  deviceInfo?: {
    id: string | number;
    name: string;
    browser: string;
    location: string;
  };
}

const shortcuts: ShortcutItem[] = [
  {
    action: "Open new chat",
    shortcut: [{ keys: ["Ctrl", "Shift", "O"] }]
  },
  {
    action: "Focus chat input",
    shortcut: [{ keys: ["Shift", "Esc"] }]
  },
  {
    action: "Copy last code block",
    shortcut: [{ keys: ["Ctrl", "Shift", ";"] }]
  },
  {
    action: "Copy last response",
    shortcut: [{ keys: ["Ctrl", "Shift", "C"] }]
  },
  {
    action: "Set custom instructions",
    shortcut: [{ keys: ["Ctrl", "Shift", "I"] }]
  },
  {
    action: "Toggle sidebar",
    shortcut: [{ keys: ["Ctrl", "Shift", "S"] }]
  },
  {
    action: "Delete chat",
    shortcut: [{ keys: ["Ctrl", "Shift", "⌫"] }]
  },
  {
    action: "Show shortcuts",
    shortcut: [{ keys: ["Ctrl", "/"] }]
  }
];

interface ReportModalProps extends ModalProps {
  contentId: string;
  contentType: 'image' | 'text' | 'audio' | 'video';
  contentPreview?: string;
}

type TimeRange = '24h' | '7d' | '30d' | '90d';
type ChartType = 'bar' | 'pie' | 'line';

const reportCategories = [
  {
    id: 'illegal',
    label: 'Illegal content',
    description: 'Content that violates laws or regulations'
  },
  {
    id: 'explicit',
    label: 'Explicit or inappropriate',
    description: 'NSFW, violence, or disturbing content'
  },
  {
    id: 'harmful',
    label: 'Harmful or dangerous',
    description: 'Content promoting harm or dangerous activities'
  },
  {
    id: 'misuse',
    label: 'AI misuse',
    description: 'Malicious use of AI technology'
  },
  {
    id: 'other',
    label: 'Other',
    description: 'Other violations not listed above'
  }
];

export function FeedbackModal({ isOpen, onClose }: ModalProps) {
  const [selectedRating, setSelectedRating] = React.useState<number | null>(
    null
  );
  const [feedback, setFeedback] = React.useState("");
  const [wantsFutureContact, setWantsFutureContact] = React.useState(false);

  const emojis = [
    { rating: 1, emoji: "😟" },
    { rating: 2, emoji: "🙂" },
    { rating: 3, emoji: "😐" },
    { rating: 4, emoji: "😊" },
    { rating: 5, emoji: "😄" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-lg rounded-md">
        <DialogHeader className="flex flex-row items-center justify-between relative">
          <DialogTitle>We value your feedback</DialogTitle>
          <kbd className="absolute right-4 -top-4 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">esc</span>
          </kbd>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            {/* <p className="text-sm">We would love to hear how was your experience with our agent</p> */}

            <div className="flex justify-between">
              {emojis.map(({ rating, emoji }) => (
                <motion.button
                  key={rating}
                  onClick={() => setSelectedRating(rating)}
                  className={cn(
                    "p-4 text-2xl rounded-lg border border-borderColorPrimary hover:bg-[#ad933470] transition-colors",
                    selectedRating === rating
                      ? "border-2 border-borderColorPrimary bg-[#524310]"
                      : "border-input"
                  )}
                  whileTap={{ scale: 1.2, rotate: 10 }}
                  animate={
                    selectedRating === rating ? { scale: 1.1 } : { scale: 1 }
                  }
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm">
              Your thoughts help us improve our platform and provide you with
              the best possible experience.{" "}
              <span className="text-muted-foreground">(Optional)</span>
            </label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your experience..."
              className="min-h-[100px] focus:outline-none focus:border-borderColorPrimary"
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground text-right">
              {feedback.length}/500 characters left
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="future-contact"
              checked={wantsFutureContact}
              onCheckedChange={(checked) =>
                setWantsFutureContact(checked as boolean)
              }
            />
            <label htmlFor="future-contact" className="text-sm leading-none">
              I would like to remain anonymous.
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Handle submission logic here
                onClose();
              }}
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function TextSizeModal({ isOpen, onClose }: ModalProps) {
  const fontSizes = [10, 12, 14, 16, 18, 20, 22, 24, 26];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[20rem]">
        <DialogHeader className="flex flex-row items-center justify-between relative">
          <DialogTitle className="text-sm">
            Font Options
            <kbd className="absolute right-4 -top-[0.6rem] pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">esc</span>
            </kbd>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs">Font Size</label>
            <Select defaultValue="16">
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent className="bg-backgroundSecondary">
                {fontSizes.map((size) => (
                  <SelectItem
                    key={size}
                    value={size.toString()}
                    className="cursor-pointer"
                  >
                    {size} px
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <button
            className="w-full p-2 text-sm text-center rounded-md bg-primary/10 hover:bg-primary/20 text-primary"
            onClick={onClose}
          >
            APPLY
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function LogoutModal({ isOpen, onClose, mode = 'current', deviceInfo }: LogoutModalProps) {
  const title = mode === 'current' ? 'Logout' : `Logout Device`;
  const description = mode === 'current' 
    ? "You will be logged out of your current session. You'll need to log in again to access your account."
    : `This will end the session on your ${deviceInfo?.name}. Any ongoing operations on that device will be interrupted.`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between relative">
          <DialogTitle>{title}</DialogTitle>
          <kbd className="absolute right-4 -top-4 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">esc</span>
          </kbd>
        </DialogHeader>

        <div className="space-y-4">
          {mode === 'device' && deviceInfo && (
            <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
              <div className="p-2 rounded-full bg-secondary/10">
                <Monitor className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{deviceInfo.name}</p>
                <div className="flex items-center text-xs text-muted-foreground gap-2">
                  <Globe className="h-3 w-3" />
                  <span>{deviceInfo.location}</span>
                  <span>•</span>
                  <Chrome className="h-3 w-3" />
                  <span>{deviceInfo.browser}</span>
                </div>
              </div>
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            {description}
          </p>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (mode === 'current') {
                  console.log("Logging out current session...");
                } else if (deviceInfo) {
                  console.log(`Logging out device: ${deviceInfo.id}`);
                }
                onClose();
              }}
            >
              {mode === 'current' ? 'Logout' : 'Logout Device'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ModelSelectionModal({ isOpen, onClose }: ModalProps) {
  const currentPage = useSidebarStore((state) => state.currentPage);
  const { selectedModels, tempSelectedModels, setTempSelectedModels, saveSelectedModels, getSelectedModelNames } = useSelectedModelsStore();
  const [filterType, setFilterType] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  
  useEffect(() => {
    // See selected models when I open the models menu (this is the current models I've selected and interacting with)
    setTempSelectedModels(selectedModels[currentPage as keyof typeof selectedModels] || []);
  }, [isOpen, currentPage]);

  useEffect(() => {
    setSearchQuery("");
    setFilterType("all");
  }, [currentPage]);

  const handleSave = () => {
    saveSelectedModels(currentPage as 'chat' | 'image' | 'audio' | 'video');
    onClose();
  };

  const toggleModelSelection = (modelId: string) => {
    setTempSelectedModels(
      tempSelectedModels.includes(modelId)
        ? tempSelectedModels.filter(id => id !== modelId)
        : [...tempSelectedModels, modelId]
    );
  };

  const getModelsForPage = () => {
    switch (currentPage) {
      case "chat":
        return CHAT_MODELS;
      case "image":
        return IMAGE_MODELS;
      case "audio":
        return AUDIO_MODELS;
      case "video":
        return VIDEO_MODELS;
      default:
        return CHAT_MODELS;
    }
  };

  const filterOptions = [
    {
      value: "all",
      label: "All models",
    },
    {
      value: "free",
      label: "Free models",
    },
    {
      value: "standard",
      label: "Standard models",
    },
    {
      value: "plus",
      label: "Plus models",
    },
    {
      value: "favorite",
      label: "Favorite models",
    },
  ];

  const models = getModelsForPage();

  // Filter and search models
  const filteredModels = models.filter((model) => {
    const matchesSearch =
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.provider?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || model.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getModelTypeText = () => {
    switch (currentPage) {
      case "chat":
        return "Select Chat Models";
      case "image":
        return "Select Image Models";
      case "audio":
        return "Select Audio Models";
      case "video":
        return "Select Video Models";
      default:
        return "Select Models";
    }
  };

  const handleRemoveAll = () => {
    setTempSelectedModels([]); // Clear all temporary selections
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg sm:max-w-2xl md:max-w-3xl rounded-md" id="tooltip-select-menu">
        <DialogHeader className="space-y-4 relative">
          <DialogTitle className="">Model Selection</DialogTitle>

          {/* Selected Models */}
          <div className="space-y-2">
            {tempSelectedModels.length < 1 ? (
              ""
            ) : (
              <label className="text-sm font-medium">Selected Models</label>
            )}
            <div className="flex flex-wrap gap-2">
              {tempSelectedModels.map((modelId) => {
                const model = models.find((m) => m.id === modelId);
                return (
                  <Badge
                    variant="outline"
                    key={modelId}
                    className="px-2 py-1 flex items-center gap-1 border-borderColorPrimary rounded-md cursor-pointer hover:bg-hoverColorPrimary text-accent-foreground"
                  >
                    {model?.name}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-red-700"
                      onClick={() => toggleModelSelection(modelId)}
                    />
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-0 justify-between">
            <div className="text-sm font-medium">{getModelTypeText()}</div>
            <div className="flex flex-row-reverse sm:flex-row items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search models"
                  className="pl-8 w-[200px] focus-visible:outline-none focus:border-borderColorPrimary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select defaultValue="all" onValueChange={setFilterType}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All models" />
                </SelectTrigger>
                <SelectContent className="bg-backgroundSecondary">
                  {filterOptions.map((option) => (
                    <SelectItem
                      className="cursor-pointer"
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <kbd className="absolute right-4 -top-[1.6rem] pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">esc</span>
          </kbd>
        </DialogHeader>

        {/* Model Grid */}
        <ScrollArea className="h-[20rem] pr-4 overflow-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4 overflow-hidden">
            {filteredModels.map((model) => (
              <div
                key={model.id}
                onClick={() => toggleModelSelection(model.id)}
                className={cn(
                  "flex items-center gap-3 p-4 border border-borderColorPrimary rounded-lg cursor-pointer hover:bg-accent/50 transition-colors select-none",
                  tempSelectedModels.includes(model.id) &&
                    "border-primary bg-accent"
                )}
              >
                <Image
                  src={model.icon}
                  height={8}
                  width={8}
                  alt={model.name}
                  className="w-8 h-8 rounded-md"
                />
                <div className="overflow-auto scrollbar-thin scrollbar-none">
                  <h3 className="font-small text-xs whitespace-nowrap">
                    {model.name}
                  </h3>
                  <p className="text-sm text-muted-foreground whitespace-nowrap">
                    {model.provider}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Update the buttons section */}
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={handleRemoveAll}
            className="hover:text-red-600"
          >
            Remove all
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SettingsModal({ isOpen, onClose, defaultTabValue }: ModalProps) {
  const { theme, setTheme } = useTheme();
  const [textSize, setTextSize] = React.useState("16 px");
  const [disabled, setDisabled] = useState(true);
  const [exportModalOpen, setExportModalOpen] = React.useState(false);
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = React.useState(false);
  const [logoutAllModalOpen, setLogoutAllModalOpen] = React.useState(false);
  const [manageSharedLinksOpen, setManageSharedLinksOpen] = React.useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useDriveAuthStore();
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [isTransactionHistoryOpen, setIsTransactionHistoryOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const voiceSettings = useVoiceStore((state) => state.settings);
  const availableVoices = useVoiceStore((state) => state.availableVoices);
  const { setVoice, setPitch, setRate, setVolume } = useVoiceStore();
  const [activeChart, setActiveChart] = useState<ChartType>('bar');
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [isLoading, setIsLoading] = useState(false);
  const [logoutDeviceId, setLogoutDeviceId] = useState<string | number | null>(null);
  const [isDevicesOpen, setIsDevicesOpen] = useState(true);

  // Group voices by language/category with safety checks
  const voiceCategories = useMemo(() => {
    return availableVoices.reduce((acc, voice) => {
      if (!voice?.lang) return acc;
      
      const category = voice.lang.split('-')[0];
      if (!acc[category]) acc[category] = [];
      acc[category].push(voice);
      return acc;
    }, {} as Record<string, SpeechSynthesisVoice[]>);
  }, [availableVoices]);

  // Add useEffect to initialize voices
  useEffect(() => {
    const initVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        useVoiceStore.getState().initVoices();
      }
    };

    // Try to get voices immediately
    initVoices();

    // Also listen for the voiceschanged event
    window.speechSynthesis.addEventListener('voiceschanged', initVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', initVoices);
    };
  }, []);

  const settingsData = {
    general: {
      theme: {
        title: "Theme",
        value: theme,
      },
      textSize: {
        title: "Text size",
        value: textSize,
      },
    },
    personalization: {
      combination: {
        title: "Alle-AI Combination",
        description:
        "Merge responses for a cohesive answer. Combines insights from all models to minimize inaccuracies and enhance clarity.",
        enabled: true,
      },
      summary: {
        title: "Alle-AI Summary",
        description:
        "Get a concise overview of all AI responses. Summarizes and distills the key points from each AI model for easy understanding",
        enabled: false,
      },
      comparison: {
        title: "Alle-AI Comparison",
        description:
        "Highlight similarities and differences in AI responses. Identifies consistent and conflicting viewpoints, helping you see where models agree or differ",
        enabled: true,
      },
    },
    data_controls: {
      sharedLinks: {
        title: "Shared links",
        description: "",
        action: "Manage",
      },
      transactionHistory: {
        title: "Transactions",
        description: "",
        action: "View",
      },
      extportMyData: {
        title: "Export data",
        description: "",
        action: "Export",
      },
      deleteMyAccount: {
        title: "Delete account",
        description: "",
        action: "Delete",
      },
    },
    linked_apps: {
      google_drive: {
        title: "Google Drive",
        icon: <Image src={'/icons/google-drive.png'} alt="google_drive_logo" width={16} height={16} /> ,
        description: "Upload Google Docs, Sheets, Slides and other files.",
        action: isAuthenticated ? "Unlink" : "Link"
      },
      one_drive: {
        title: "One Drive",
        icon: <Image src={'/icons/onedrive.png'} alt="google_drive_logo" width={16} height={16} /> ,
        description: "Upload Microsoft Word, Excel, PowerPoint and other files.",
        action: "Link"
      },
      dropbox: {
        title: "Dropbox",
        icon: <Image src={'/icons/dropbox.png'} alt="google_drive_logo" width={16} height={16} /> ,
        description: "Upload Docs and other files.",
        action: "Link"
      },
    },
    analytics: {
      myAnalytics: {
        title: "Coming soon...",
        description:
          "Gain insights and track your usage with personalized analytics.",
      },
    },
    security: {
      logoutAll: {
        title: "Log out of all devices",
        description:
          "Log out from all active sessions on every device, including your current one. Other devices may take up to 30 minutes to be logged out.",
        action: "Log out",
      },
      devices: {
        title: "Connected Devices",
        description: "Manage individual device access to your account",
        activeDevices: [
          {
            id: 1,
            name: "MacBook Pro",
            browser: "Chrome",
            location: "San Francisco, US",
            lastActive: "Active now",
            device: "desktop",
            current: true,
          },
          {
            id: 2,
            name: "iPhone 13",
            browser: "Safari",
            location: "New York, US",
            lastActive: "2 hours ago",
            device: "mobile",
            current: false,
          },
          {
            id: 3,
            name: "iPad Air",
            browser: "Safari",
            location: "London, UK",
            lastActive: "1 day ago",
            device: "tablet",
            current: false,
          }
        ],
      },
    },
  };

  const tabs = [
    {
      value: "general",
      label: "General",
      icon: <Settings className="h-4 w-4" />,
    },
    {
      value: "personalization",
      label: "Personalization",
      icon: <User className="h-4 w-4" />,
    },
    {
      value: "data controls",
      label: "Data controls",
      icon: <DatabaseBackup className="h-4 w-4" />,
    },
    {
      value: "linked apps",
      label: "Linked apps",
      icon: <Boxes className="h-4 w-4" />,
    },
    {
      value: "analytics",
      label: "My Analytics",
      icon: <BarChart2 className="h-4 w-4" />,
    },
    {
      value: "security",
      label: "Security",
      icon: <Shield className="h-4 w-4" />,
    },
  ];

  const handleGoogleDriveAction = async () => {
    if (isAuthenticated) {
      // Handle unlinking
      try {
        await driveService.signOut();
        useDriveAuthStore.getState().clearAuth();
        
        toast({
          title: "Success",
          description: "Google Drive has been unlinked successfully",
        });
      } catch (error) {
        console.error('Failed to unlink Google Drive:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to unlink Google Drive"
        });
      }
    } else {
      setShowDriveModal(true);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-xl lg:max-w-3xl rounded-md">
          <DialogHeader className="flex flex-row items-center justify-between relative border-b border-borderColorPrimary">
            <DialogTitle className="mb-2">Settings</DialogTitle>
            <kbd className="absolute right-4 -top-4 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">esc</span>
            </kbd>
          </DialogHeader>

          <Tabs defaultValue={`${defaultTabValue ? defaultTabValue : 'general'}`} className="w-full">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Sidebar */}
              <div className="w-48 space-y-1">
                <TabsList className="w-full flex flex-col h-auto bg-transparent space-y-1">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="w-full justify-start gap-2 focus-visible:outline-none data-[state=active]:bg-backgroundSecondary"
                    >
                      {tab.icon}
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* Content */}
              <div className="flex-1">
                <TabsContent value="general" className="space-y-2">
                  <div className="flex items-center justify-between border-b border-borderColorPrimary">
                    <span className="text-sm">Theme</span>
                    <Select
                      defaultValue={theme}
                      onValueChange={(value) => setTheme(value)}
                    >
                      <SelectTrigger className="w-24 p-2 border-none focus:outline-none focus:border-b">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent className="bg-backgroundSecondary">
                        <SelectItem
                          className="text-sm cursor-pointer focus:outline-none"
                          value="system"
                        >
                          System
                        </SelectItem>
                        <SelectItem
                          className="text-sm cursor-pointer focus:outline-none"
                          value="light"
                        >
                          Light
                        </SelectItem>
                        <SelectItem
                          className="text-sm cursor-pointer focus:outline-none"
                          value="dark"
                        >
                          Dark
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between border-b border-borderColorPrimary">
                    <span className="text-sm">Text size</span>
                    <Select defaultValue="16">
                      <SelectTrigger className="w-24 p-2 border-none focus:outline-none">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent className="bg-backgroundSecondary">
                        {[12, 14, 16, 18, 20].map((size) => (
                          <SelectItem
                            key={size}
                            value={size.toString()}
                            className="cursor-pointer focus:outline-none"
                          >
                            {size} px
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="personalization" className="space-y-6">
                  {Object.entries(settingsData.personalization).map(
                    ([key, setting]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between space-x-4 pb-2 border-b border-borderColorPrimary last:border-none"
                      >
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium">
                            {setting.title}
                          </h4>
                          <p className="text-[0.75rem] text-muted-foreground">
                            {setting.description}
                          </p>
                        </div>
                        <Switch
                          className="data-[state=unchecked]:bg-borderColorPrimary"
                          defaultChecked={setting.enabled}
                        />
                      </div>
                    )
                  )}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-borderColorPrimary">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          <Music className="h-4 w-4 text-primary" />
                          Text-to-Speech Settings
                        </h4>
                        <p className="text-[0.75rem] text-muted-foreground">
                          Customize how the AI speaks to you
                        </p>
                      </div>
                    </div>

                    {/* Main Voice Selection */}
                    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Type className="h-4 w-4 text-primary" />
                          Voice
                        </label>
                        <Select
                          value={voiceSettings.voice}
                          onValueChange={setVoice}
                        >
                          <SelectTrigger className="w-full border border-borderColorPrimary">
                            <SelectValue placeholder="Select a voice" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(voiceCategories).length > 0 ? (
                              Object.entries(voiceCategories).map(([category, voices]) => (
                                <SelectGroup key={category}>
                                  <SelectLabel className="flex items-center gap-2">
                                    <Globe className="h-3 w-3" />
                                    {new Intl.DisplayNames([category], { type: 'language' }).of(category)}
                                  </SelectLabel>
                                  {voices.map((voice) => (
                                    <SelectItem 
                                      key={voice.voiceURI} 
                                      value={voice.voiceURI}
                                    >
                                      <div className="flex items-center justify-between w-full">
                                        <span>{voice.name}</span>
                                        <Badge variant="outline" className="text-xs">
                                          {voice.lang}
                                        </Badge>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              ))
                            ) : (
                              <SelectItem value="default" disabled>
                                <span className="flex items-center gap-2">
                                  <Loader className="h-3 w-3 animate-spin" />
                                  Loading voices...
                                </span>
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Quick Test Button */}
                      <Button 
                        variant="outline"
                        onClick={() => {
                          const utterance = new SpeechSynthesisUtterance("Hello! This is a test of your selected voice.");
                          const selectedVoice = availableVoices.find(v => v.voiceURI === voiceSettings.voice);
                          if (selectedVoice) utterance.voice = selectedVoice;
                          window.speechSynthesis.speak(utterance);
                        }}
                        className="w-full gap-2"
                      >
                        <Play className="h-4 w-4" />
                        Test Voice
                      </Button>

                      {/* Advanced Settings Drawer Trigger */}
                      <Drawer>
                        <DrawerTrigger asChild>
                          <Button variant="ghost" className="w-full gap-2">
                            <Settings className="h-4 w-4" />
                            Advanced Voice Settings
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent className="px-4">
                          <DrawerHeader>
                            <DrawerTitle>Advanced Voice Settings</DrawerTitle>
                            <DrawerDescription>
                              Fine-tune your voice settings for the perfect experience
                            </DrawerDescription>
                          </DrawerHeader>

                          <div className="grid gap-6 p-4">
                            {/* Pitch Control */}
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <label className="text-sm font-medium flex items-center gap-2">
                                  <ArrowUpDown className="h-4 w-4 text-primary" />
                                  Pitch
                                </label>
                                <span className="text-xs text-muted-foreground">
                                  {voiceSettings.pitch.toFixed(1)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => setPitch(Math.max(0, voiceSettings.pitch - 0.1))}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <Slider
                                  value={[voiceSettings.pitch]}
                                  min={0}
                                  max={2}
                                  step={0.1}
                                  onValueChange={([value]) => setPitch(value)}
                                  className="flex-1"
                                />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => setPitch(Math.min(2, voiceSettings.pitch + 0.1))}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            {/* Speed Control */}
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <label className="text-sm font-medium flex items-center gap-2">
                                  <Gauge className="h-4 w-4 text-primary" />
                                  Speed
                                </label>
                                <span className="text-xs text-muted-foreground">
                                  {voiceSettings.rate.toFixed(1)}x
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => setRate(Math.max(0.1, voiceSettings.rate - 0.1))}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <Slider
                                  value={[voiceSettings.rate]}
                                  min={0.1}
                                  max={10}
                                  step={0.1}
                                  onValueChange={([value]) => setRate(value)}
                                  className="flex-1"
                                />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => setRate(Math.min(10, voiceSettings.rate + 0.1))}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            {/* Volume Control */}
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <label className="text-sm font-medium flex items-center gap-2">
                                  <Volume2 className="h-4 w-4 text-primary" />
                                  Volume
                                </label>
                                <span className="text-xs text-muted-foreground">
                                  {Math.round(voiceSettings.volume * 100)}%
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => setVolume(Math.max(0, voiceSettings.volume - 0.1))}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <Slider
                                  value={[voiceSettings.volume]}
                                  min={0}
                                  max={1}
                                  step={0.1}
                                  onValueChange={([value]) => setVolume(value)}
                                  className="flex-1"
                                />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => setVolume(Math.min(1, voiceSettings.volume + 0.1))}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            {/* Advanced Test Button */}
                            <Button 
                              onClick={() => {
                                const utterance = new SpeechSynthesisUtterance("Hello! This is a test of your selected voice settings.");
                                const selectedVoice = availableVoices.find(v => v.voiceURI === voiceSettings.voice);
                                if (selectedVoice) utterance.voice = selectedVoice;
                                utterance.pitch = voiceSettings.pitch;
                                utterance.rate = voiceSettings.rate;
                                utterance.volume = voiceSettings.volume;
                                window.speechSynthesis.speak(utterance);
                              }}
                              className="w-full gap-2"
                            >
                              <Play className="h-4 w-4" />
                              Test Advanced Settings
                            </Button>
                          </div>

                          <DrawerFooter>
                            <DrawerClose asChild>
                              <Button variant="outline">Close Advanced Settings</Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </DrawerContent>
                      </Drawer>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="data controls" className="space-y-2">
                  {Object.entries(settingsData.data_controls).map(([key, setting]) => (
                    <div
                      key={key}
                      className="border-b border-borderColorPrimary last:border-none"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-small">{setting.title}</h4>
                        <Button
                          variant={key === "google_drive" ? "outline" : setting.action === "Delete" ? "destructive" : "outline"}
                          className={`h-8 rounded-md p-2 text-xs border-borderColorPrimary transition-all`}
                          size="sm"
                          onClick={() => {
                            if (setting.action === "Delete") {
                              setDeleteAccountModalOpen(true);
                            } else if (setting.action === "Export") {
                              setExportModalOpen(true);
                            } else if (setting.action === "Manage") {
                              setManageSharedLinksOpen(true);
                            } else if (setting.action === "View") {
                              setIsTransactionHistoryOpen(true);
                            }
                          }}
                        >
                          {setting.action}
                        </Button>
                      </div>
                      <p className="text-[0.75rem] text-muted-foreground">
                        {setting.description}
                      </p>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="linked apps" className="space-y-2">
                  {Object.entries(settingsData.linked_apps).map(([key, setting]) => (
                    <div
                      key={key}
                      className="border-b border-borderColorPrimary last:border-none"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-small flex items-center gap-2">{setting.icon}{setting.title}</h4>
                        <Button
                          variant={setting.action === 'Unlink' ? 'destructive' : 'outline'}
                          className={`h-8 rounded-md p-2 text-xs border-borderColorPrimary transition-all`}
                          size="sm"
                          onClick={() => {
                            if (key === "google_drive") {
                              handleGoogleDriveAction();
                            } else if (key === "one_drive"){
                              console.log('One Drive')
                            } else if (key === "dropbox"){
                              console.log('Dropbox')
                            }
                          }}
                        >
                          {setting.action}
                        </Button>
                      </div>
                      <p className="text-[0.75rem] text-muted-foreground mb-2">
                        {setting.description}
                      </p>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="analytics">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-2 border-b border-borderColorPrimary">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          <BarChart2 className="h-4 w-4 text-primary" />
                          Model Usage Analytics
                        </h4>
                        <p className="text-[0.75rem] text-muted-foreground">
                          Track your model usage and interactions
                        </p>
                      </div>
                    </div>

                    <ScrollArea className="h-[500px] pr-4">
                      <div className="space-y-6">
                        {/* Chart Controls */}
                        <div className="flex items-center justify-between">
                          <Select
                            defaultValue="bar"
                            onValueChange={(value: ChartType) => setActiveChart(value)}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select chart type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bar" className="flex items-center gap-2">
                                <BarChart2 className="h-4 w-4" />
                                Bar Chart
                              </SelectItem>
                              <SelectItem value="pie" className="flex items-center gap-2">
                                <PieChartIcon className="h-4 w-4" />
                                Pie Chart
                              </SelectItem>
                              <SelectItem value="line" className="flex items-center gap-2">
                                <LineChartIcon className="h-4 w-4" />
                                Line Chart
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <Select
                            defaultValue="7d"
                            onValueChange={(value: TimeRange) => setTimeRange(value)}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Time range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="24h">Last 24 hours</SelectItem>
                              <SelectItem value="7d">Last 7 days</SelectItem>
                              <SelectItem value="30d">Last 30 days</SelectItem>
                              <SelectItem value="90d">Last 90 days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Charts Container */}
                        <div className="relative h-[300px] w-full bg-muted/50 rounded-lg p-4">
                          {activeChart === "bar" && (
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={modelUsageData} margin={{ top: 10, right: 10, bottom: 40, left: 40 }}>
                                <CartesianGrid 
                                  strokeDasharray="3 3" 
                                  stroke="var(--border)"
                                  opacity={0.3}
                                />
                                <XAxis 
                                  dataKey="model" 
                                  angle={-35} 
                                  textAnchor="end"
                                  height={40} 
                                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                                  tickMargin={8}
                                  axisLine={{ stroke: 'var(--border)' }}
                                />
                                <YAxis
                                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                                  width={40}
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                  tickLine={{ stroke: 'hsl(var(--border))' }}
                                />
                                <ChartTooltip 
                                  content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                      return (
                                        <div className="rounded-lg border bg-backgroundSecondary p-2 shadow-sm">
                                          <div className="grid grid-cols-2 gap-2">
                                            <div className="flex flex-col">
                                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                Model
                                              </span>
                                              <span className="font-semibold text-xs">{label}</span>
                                            </div>
                                            <div className="flex flex-col">
                                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                Usage
                                              </span>
                                              <span className="font-semibold text-xs">
                                                                {payload[0].value}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    }
                                    return null
                                  }}
                                />
                                <Bar 
                                  dataKey="usage" 
                                  fill="var(--primary)"
                                  radius={[4, 4, 0, 0]}
                                  maxBarSize={50}
                                >
                                  {/* Add different colors for each bar */}
                                  {modelUsageData.map((entry, index) => (
                                    <Cell 
                                      key={`cell-${index}`} 
                                      fill={`hsl(${index * 45}, 70%, 50%)`}
                                      opacity={0.8}
                                      style={{
                                        filter: 'brightness(1.1)',
                                        cursor: 'pointer',
                                      }}
                                    />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          )}

                          {activeChart === "pie" && (
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                                <Pie
                                  data={categoryUsageData}
                                  dataKey="value"
                                  nameKey="label"
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={45}
                                  outerRadius={65}
                                  paddingAngle={2}
                                  label={({
                                    cx,
                                    cy,
                                    midAngle,
                                    innerRadius,
                                    outerRadius,
                                    percent,
                                    index
                                  }) => {
                                    const RADIAN = Math.PI / 180;
                                    const radius = outerRadius + 25;
                                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                    return (
                                      <text
                                        x={x}
                                        y={y}
                                        fill="hsl(var(--muted-foreground))"
                                        textAnchor={x > cx ? 'start' : 'end'}
                                        dominantBaseline="central"
                                        className="text-xs"
                                      >
                                        {`${categoryUsageData[index].label} (${(percent * 100).toFixed(0)}%)`}
                                      </text>
                                    );
                                  }}
                                >
                                  {categoryUsageData.map((entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={`hsl(${index * 90}, 70%, 50%)`}
                                      opacity={0.8}
                                      style={{
                                        filter: 'brightness(1.1)',
                                        cursor: 'pointer',
                                        stroke: 'hsl(var(--background))',
                                        strokeWidth: 2,
                                      }}
                                    />
                                  ))}
                                </Pie>
                                <ChartTooltip 
                                  content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                      return (
                                        <div className="rounded-lg border bg-backgroundSecondary p-2 shadow-sm">
                                          <div className="grid grid-cols-2 gap-2">
                                            <div className="flex flex-col">
                                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                Category
                                              </span>
                                              <span className="font-bold text-sm">
                                                {payload[0].name}
                                              </span>
                                            </div>
                                            <div className="flex flex-col">
                                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                Usage
                                              </span>
                                              <span className="font-bold text-sm">
                                                {payload[0].value}%
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    }
                                    return null
                                  }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          )}

                          {activeChart === "line" && (
                            <ResponsiveContainer width="100%" height="100%">
                            <LineChart 
                              data={timeSeriesData}
                              margin={{ top: 10, right: 10, bottom: 40, left: 10 }} 
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                              <XAxis 
                                dataKey="date" 
                                angle={-35} 
                                textAnchor="end"
                                height={40} 
                                tick={{ fontSize: 11 }}
                                tickMargin={8}
                              />
                              <YAxis
                                tick={{ fontSize: 11 }}
                                width={40}
                              />
                              <ChartTooltip
                                content={({ active, payload, label }) => {
                                  if (active && payload && payload.length) {
                                    return (
                                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                                        <div className="grid gap-2">
                                          <div className="flex flex-col">
                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                              Date
                                            </span>
                                            <span className="font-bold text-sm">{label}</span>
                                          </div>
                                          {payload.map((series) => (
                                            <div key={series.name} className="flex flex-col">
                                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                {series.name}
                                              </span>
                                              <span className="font-bold text-sm">
                                                {series.value}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )
                                  }
                                  return null
                                }}
                              />
                              <Legend 
                                verticalAlign="top"
                                height={36}
                                iconSize={8}
                                iconType="circle"
                                wrapperStyle={{ fontSize: '11px' }}
                              />
                              {Object.keys(timeSeriesData[0])
                                .filter(key => key !== 'date')
                                .map((key, index) => (
                                  <Line
                                    key={key}
                                    type="monotone"
                                    dataKey={key}
                                    stroke={`hsl(${index * 60}, 70%, 50%)`}
                                    strokeWidth={1.5} 
                                    dot={{ r: 2 }}
                                  />
                                ))}
                            </LineChart>
                          </ResponsiveContainer>
                          )}

                          {/* Loading State */}
                          {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg">
                              <div className="flex flex-col items-center gap-2">
                                <Loader className="h-8 w-8 animate-spin text-primary" />
                                <span className="text-sm text-muted-foreground">Loading analytics...</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Stats Summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <StatCard
                            title="Total Interactions"
                            value="12,453"
                            change="+12.5%"
                            trend="up"
                            icon={<MessageSquare className="h-4 w-4" />}
                          />
                          <StatCard
                            title="Most Used Model"
                            value="GPT-4"
                            subtitle="32% of total usage"
                            icon={<Crown className="h-4 w-4" />}
                          />
                          <StatCard
                            title="Active Time"
                            value="126h"
                            change="+5.2%"
                            trend="up"
                            icon={<Clock className="h-4 w-4" />}
                          />
                          <StatCard
                            title="Tokens Used"
                            value="1.2M"
                            change="-3.1%"
                            trend="down"
                            icon={<Coins className="h-4 w-4" />}
                          />
                        </div>
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                  <div className="space-y-6">
                    {/* Existing logout all devices section */}
                    <div className="">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-small">
                          {settingsData.security.logoutAll.title}
                        </h4>
                        <Button
                          variant="destructive"
                          className="h-8 rounded-md p-2 text-xs border-borderColorPrimary"
                          size="sm"
                          onClick={() => setLogoutAllModalOpen(true)}
                        >
                          {settingsData.security.logoutAll.action}
                        </Button>
                      </div>
                      <p className="text-[0.75rem] text-muted-foreground">
                        {settingsData.security.logoutAll.description}
                      </p>
                    </div>

                    {/* Advanced Section */}
                    <Collapsible 
                      open={isDevicesOpen}
                      onOpenChange={setIsDevicesOpen}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium">Manage Devices</h4>
                          <Badge variant="secondary" className="text-xs">
                            {settingsData.security.devices.activeDevices.length}
                          </Badge>
                        </div>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="w-9 p-0 hover:bg-secondary/20">
                            {isDevicesOpen ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="sr-only">
                              {isDevicesOpen ? 'Close devices' : 'Show devices'}
                            </span>
                          </Button>
                        </CollapsibleTrigger>
                      </div>

                      <CollapsibleContent className="space-y-4">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="rounded-md border border-borderColorPrimary"
                        >
                          {settingsData.security.devices.activeDevices.map((device, index) => (
                            <div
                              key={device.id}
                              className={cn(
                                "flex items-center justify-between p-4",
                                index !== settingsData.security.devices.activeDevices.length - 1 && 
                                "border-b border-borderColorPrimary"
                              )}
                            >
                              <div className="flex items-center space-x-4">
                                <div className="p-2 rounded-full bg-secondary/10">
                                  {device.device === 'desktop' && <Monitor className="h-4 w-4" />}
                                  {device.device === 'mobile' && <Smartphone className="h-4 w-4" />}
                                  {device.device === 'tablet' && <Tablet className="h-4 w-4" />}
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm font-medium flex items-center gap-2">
                                    {device.name}
                                    {device.current && (
                                      <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">
                                        Current
                                      </span>
                                    )}
                                  </p>
                                  <div className="flex items-center text-xs text-muted-foreground gap-2">
                                    <Globe className="h-3 w-3" />
                                    <span>{device.location}</span>
                                    <span>•</span>
                                    <Chrome className="h-3 w-3" />
                                    <span>{device.browser}</span>
                                    <span>•</span>
                                    <Clock className="h-3 w-3" />
                                    <span>{device.lastActive}</span>
                                  </div>
                                </div>
                              </div>
                              {!device.current && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => setLogoutDeviceId(device.id)}
                                >
                                  <LogOut className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </motion.div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>

      <DataExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
      />
      <DeleteAccountModal
        isOpen={deleteAccountModalOpen}
        onClose={() => setDeleteAccountModalOpen(false)}
      />
      <LogoutAllDevicesModal
        isOpen={logoutAllModalOpen}
        onClose={() => setLogoutAllModalOpen(false)}
      />
      {/* Add the Google Drive Modal */}
      <GoogleDriveModal
        isOpen={showDriveModal}
        onClose={() => setShowDriveModal(false)}
        onFileSelect={() => {}} // Empty function since we're just using it for authentication
      />
      <SharedLinksModal
        isOpen={manageSharedLinksOpen}
        onClose={() => setManageSharedLinksOpen(false)}
      />
      <TransactionHistoryModal 
        isOpen={isTransactionHistoryOpen} 
        onClose={() => setIsTransactionHistoryOpen(false)} 
      />
      {/* Single device logout modal */}
      {logoutDeviceId && (
        <LogoutModal 
          isOpen={true}
          onClose={() => setLogoutDeviceId(null)}
          mode="device"
          deviceInfo={settingsData.security.devices.activeDevices.find(d => d.id === logoutDeviceId)}
        />
      )}
    </>
  );
}

export function UserProfileModal({ isOpen, onClose }: ModalProps) {
  const [firstName, setFirstName] = React.useState("Pascal");
  const [lastName, setLastName] = React.useState("Osei-Wusu");
  const [email, setEmail] = React.useState("pascal@alle-ai.com");
  const [profilePhoto, setProfilePhoto] = React.useState("/user.jpg");
  const [isEditing, setIsEditing] = React.useState(false);
  const [plansModalOpen, setPlansModalOpen] = useState(false);

  const handleEditToggle = () => {
    if (isEditing) {
      // Handle save changes here
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-sm sm:max-w-lg rounded-md">
          <DialogHeader className="flex flex-row items-center justify-between relative">
            <div className="flex flex-col items-center w-full gap-2">
              <div className="relative">
                <Image
                  src={profilePhoto}
                  alt="Profile"
                  className="h-16 w-16 sm:w-20 sm:h-20 rounded-full"
                  width={20}
                  height={20}
                />
                <div className="absolute -bottom-1 -right-2 text-white rounded-full">
                  <Badge variant="default">Free</Badge>
                </div>
              </div>
              <div className="text-center">
                <DialogTitle className="text-md sm:text-xl">{firstName} {lastName}</DialogTitle>
                <p className="text-xs sm:text-sm text-muted-foreground">{email}</p>
              </div>
            </div>
            <div className="absolute right-4 top-4 flex gap-2">
              <Button 
                variant="outline" 
                className='px-2 sm:px-3 border-2 border-borderColorPrimary focus:outline-none' 
                size="sm"
                onClick={handleEditToggle}
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-0 sm:mr-2" /> 
                    <span className='hidden sm:flex'>Save</span>
                  </>
                ) : (
                  <>
                    <Pencil className="h-4 w-4 mr-0 sm:mr-2" /> 
                    <span className='hidden sm:flex'>Edit Profile</span>
                  </>
                )}
              </Button>
            </div>
            <kbd className="absolute right-4 -top-4 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">esc</span>
            </kbd>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            {isEditing && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First name</label>
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last name</label>
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium">Profile photo</label>
                  <div className="flex items-center gap-4">
                    <Image
                      src={profilePhoto}
                      alt="Profile"
                      width={16}
                      height={16}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full"
                    />
                    <Button variant="outline" size="sm" className='text-xs sm:text-sm p-2 sm:p-3'>
                      change picture
                    </Button>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-between gap-2 pt-4 border-t">
              <Button className='p-2 sm:p-3 text-xs sm:text-sm' variant="outline" onClick={() => {
                setPlansModalOpen(true);
                onClose();
                }}>
                <Gem className='w-4 h-4 mr-2'/>
                <span>UPGRADE</span>
              </Button>
              <div className='flex gap-4'>
                <Button className='p-2 sm:p-3 text-xs sm:text-sm' variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <PlansModal
        isOpen={plansModalOpen}
        onClose={() => setPlansModalOpen(false)}
      />
    </>
  );
}

export function ReferModal({ isOpen, onClose }: ModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { toast } = useToast();


  useEffect(() => {
    if (!isOpen) {
      setSelectedPlan("");
    }
  }, [isOpen]);

  const referralLink = "https://alle.ai/ref=XXX_XXX";
  const stats = {
    friendsReferred: 125,
    cashEarned: 50.00, 
  };

  // Available plans based on earned amount
  const getEligiblePlans = (amount: number) => {
    const plans = [];
    if (amount >= 20) {
      plans.push({ name: 'Standard Monthly', price: 20 });
    }
    if (amount >= 30) {
      plans.push({ name: 'Plus Monthly', price: 30 });
    }
    if (amount >= 200) {
      plans.push({ name: 'Standard Yearly', price: 200 });
    }
    if (amount >= 300) {
      plans.push({ name: 'Plus Yearly', price: 300 });
    }
    return plans;
  };

  const eligiblePlans = getEligiblePlans(stats.cashEarned);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Copied",
      description: `Referral link copied to clipboard`,
      duration: 3000,
    });
  };

  const platforms = [
    {
      name: "whatsapp",
      url: "https://wa.me/?text=",
      Icon: FaWhatsapp,
    },
    {
      name: "twitter",
      url: "https://twitter.com/intent/tweet?text=",
      Icon: FaXTwitter,
    },
    {
      name: "facebook",
      url: "https://www.facebook.com/sharer/sharer.php?u=",
      Icon: FaFacebook,
    },
  ];

  const handleSubscribe = (planName: string, planPrice: number) => {
    setShowConfirmModal(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-sm sm:max-w-lg rounded-md">
          <DialogHeader className="flex flex-row items-center justify-between relative">
            <DialogTitle>
              Refer & Earn{" "}
              <span className="text-sm text-infoColorPrimary">(coming soon)</span>
              </DialogTitle>
            <kbd className="absolute right-4 -top-4 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">esc</span>
            </kbd>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Invite your friends and earn cash rewards on each successful referral. 
                Use your earnings to subscribe to Alle-AI plans.{' '}
                <a href="#" className="text-infoColorPrimary hover:underline">
                  learn more
                </a>
              </p>

              {/* Stats Display */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats.friendsReferred}</p>
                  <p className="text-sm text-muted-foreground">
                    Friends referred
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-infoColorPrimary">£{stats.cashEarned.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Earned cash</p>
                </div>
              </div>

              {/* Subscription Options */}
              {eligiblePlans.length > 0 && (
                <div className="mt-4 p-4 rounded-lg border border-primary/20 bg-inherit">
                  <h3 className="text-sm font-medium mb-2">Available Plans</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    You have enough credit to subscribe to the following plans:
                  </p>
                  <div className="space-y-2">
                    {stats.cashEarned === 20 ? (
                      <Button 
                        className="w-full"
                        onClick={() => handleSubscribe('Standard Monthly', 20)}
                      >
                        Subscribe to Standard Monthly (£20)
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <Select 
                          value={selectedPlan}
                          onValueChange={setSelectedPlan}
                        >
                          <SelectTrigger className="bg-transparent border-borderColorPrimary focus-visible:outline-none">
                            <SelectValue placeholder="Select a plan"/>
                          </SelectTrigger>
                          <SelectContent className="bg-backgroundSecondary">
                            {eligiblePlans.map((plan) => (
                              <SelectItem 
                                key={plan.name} 
                                value={plan.name}
                                className="cursor-pointer hover:bg-[#f7fee7]/50 focus-visible:outline-none"
                              >
                                {plan.name} (£{plan.price})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Button 
                          className="w-full"
                          disabled={!selectedPlan}
                          onClick={() => {
                            const plan = eligiblePlans.find(p => p.name === selectedPlan);
                            if (plan) {
                              handleSubscribe(plan.name, plan.price);
                            }
                          }}
                        >
                          {selectedPlan ? 'Confirm Subscription' : 'Select a plan to continue'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Show message if earned amount is less than £20 */}
              {stats.cashEarned < 20 && (
                <div className="mt-4 p-4 rounded-lg border border-primary/20 bg-[#f0fdf4] dark:bg-inherit">
                  <p className="text-sm text-muted-foreground">
                    Earn £{(20 - stats.cashEarned).toFixed(2)} more to unlock Standard Monthly subscription!
                  </p>
                </div>
              )}

              {/* Invitation Link */}
              <div className="space-y-2 mt-4">
                <label className="text-sm text-muted-foreground">
                  Share your referral link
                </label>
                <div className="flex gap-2">
                  <Input
                    value={referralLink}
                    readOnly
                    className="bg-muted focus:outline-none focus:border-borderColorPrimary"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                    className="shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Social Sharing */}
              <div className="flex justify-center gap-2 pt-4">
                {platforms.map(({ name, url, Icon }) => (
                  <Button
                    key={name}
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() =>
                      window.open(url + encodeURIComponent(referralLink))
                    }
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Add the confirmation modal */}
      {selectedPlan && (
        <SubscriptionConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          planName={selectedPlan}
          planPrice={eligiblePlans.find(p => p.name === selectedPlan)?.price || 0}
          currentBalance={stats.cashEarned}
          onConfirm={() => {
            console.log(`Subscription confirmed for ${selectedPlan}`);
            toast({
              title: "Success",
              description: `You've subscribed to Alle-AI ${selectedPlan}`,
              duration: 3000,
            });
            onClose();
          }}
        />
      )}
    </>
  );
}

export function SubscriptionConfirmModal({
  isOpen,
  onClose,
  planName,
  planPrice,
  currentBalance,
  onConfirm,
}: SubscriptionConfirmModalProps) {
  const remainingBalance = currentBalance - planPrice;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-lg">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-center">Confirm Subscription</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2 text-center">
            <p className="text-sm text-muted-foreground">
              You&apos;re about to subscribe to
            </p>
            <p className="text-lg font-semibold">Alle-AI {planName}</p>
          </div>

          <div className="space-y-4 p-4 rounded-lg bg-muted/50">
            <div className="flex justify-between items-center">
              <span className="text-sm">Current Balance</span>
              <span className="font-medium">£{currentBalance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-infoColorPrimary">
              <span className="text-sm">Subscription Cost</span>
              <span className="font-medium">-£{planPrice.toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between items-center">
              <span className="text-sm">Remaining Balance</span>
              <span className="font-medium">£{remainingBalance.toFixed(2)}</span>
            </div>
          </div>

          <div className="rounded-lg border border-infoColorPrimary/50 bg-infoColorPrimary/5 p-4">
            <p className="text-xs text-center text-infoColorPrimary">
              <Info className="h-3 w-3 text-infoColorPrimary inline-flex" />
              This action cannot be undone. Your subscription will start immediately.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            className="flex-1 bg-primary hover:bg-primary/90"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Proceed
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PlansModal({ isOpen, onClose }: ModalProps) {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Free",
      price: 0,
      description:
        "For small teams or individuals optimizing basic web queries.",
      about:
        "Interact with up to 2 AI models in a single conversation to gain diverse insights and perspectives.",
      features: [
        "Text",
        "Image",
        "2 AI Models/conversation",
        "Limited model Usage",
      ],
      buttonText: "Upgrade to Free",
      highlighted: false,
    },
    {
      name: "Standard",
      price: isYearly ? 200 : 20,
      description: "Enhanced AI capabilities and additional features.",
      about:
        "Interact with up to 3 AI models per conversation for even more diverse insights, plus access to Fact-checking, Audio, and Video generation models.",
      features: [
        "Everything in Free",
        "Up to 3 AI models",
        "Fact-checking",
        "Audio",
        "Video",
      ],
      buttonText: "Upgrade to Standard",
      highlighted: false,
    },
    {
      name: "Plus",
      price: isYearly ? 300 : 30,
      description: "Advanced AI interactions, and comprehensive flexibility.",
      about:
        "Access up to 5 AI models per conversation, with unlimited tokens and the ability to use all available AI models for maximum flexibility.",
      features: [
        "Everything in Standard",
        "Up to 5 AI models",
        "Access all AI models",
        "Early access to new features",
      ],
      buttonText: "Upgrade to Plus",
      highlighted: true,
    },
    {
      name: "Custom",
      price: "X",
      description:
        "Fully customizable features tailored for your unique needs.",
      about:
        "Get a plan tailored to your business needs with custom AI models, features, and usage limits.",
      features: [
        "Customize Features",
        "Flexible Billing Options",
        "Custom Integrations & Development",
      ],
      buttonText: "Coming Soon",
      highlighted: false,
    },
  ];

  return (
    <div className="overflow-auto">
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[70rem]">
          <DialogHeader className="text-center space-y-4 relative">
            <DialogTitle className="text-xl">Upgrade your plan</DialogTitle>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={cn("text-sm", !isYearly && "text-primary")}>
                Monthly
              </span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-borderColorPrimary"
              />
              <div className="flex items-center gap-2">
                <span className={cn("text-sm", isYearly && "text-primary")}>
                  Yearly
                </span>
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  17% discount
                </Badge>
              </div>
            </div>
            <kbd className="absolute right-5 -top-[1.6rem] pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">esc</span>
            </kbd>
          </DialogHeader>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-4">
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                layout
                className={cn(
                  "relative p-6 rounded-lg border",
                  plan.highlighted
                    ? "bg-[#130f0f] text-white"
                    : "border-borderColorPrimary"
                )}
              >
                <div className="relative space-y-4 min-h-[25rem]">
                  <div>
                    <h3 className="font-medium text-md">{plan.name}</h3>
                    <motion.div
                      key={`${plan.name}-${isYearly ? "yearly" : "monthly"}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-end gap-1"
                    >
                      <span className="text-3xl font-bold">
                        £
                        {typeof plan.price === "number" ? plan.price : plan.price}
                      </span>
                      {plan.price !== "X" && (
                        <span className="text-muted-foreground mb-1">
                          /{isYearly ? "year" : "month"}
                        </span>
                      )}
                    </motion.div>
                  </div>

                  <div
                    className={`text-sm text-muted-foreground pb-4 flex flex-col`}
                  >
                    {plan.description}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info
                            className={`h-3 w-3 cursor-pointer right-0 ${
                              plan.highlighted
                                ? "text-[#fafafa]"
                                : "text-bodyColor"
                            }`}
                          />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-sm bg-backgroundSecondary">
                          {plan.about}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-[0.8rem]"
                      >
                        <Check
                          className={`h-4 w-4 text-primary ${
                            plan.highlighted ? "text-[#fafafa]" : ""
                          }`}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full absolute bottom-0 ${
                      plan.highlighted
                        ? "bg-[#fafafa] text-[#171717] hover:bg-[#F8F8F8]"
                        : ""
                    }`}
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    {plan.buttonText}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-6 text-sm text-muted-foreground">
            Need more Capabilities?{" "}
            <a href="#" className="text-primary hover:underline">
              See Alle-AI Team & Enterprise plans
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function DataExportModal({ isOpen, onClose }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request data export - are you sure?</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <ul className="list-disc pl-5 text-sm text-muted-foreground">
            <li>Your account details and chats will be included in the export.</li>
            <li>The data will be sent to your registered email in a downloadable file.</li>
            <li>The download link will expire 24 hours after you receive it.</li>
            <li>Processing may take some time. You&apos;ll be notified when it&apos;s ready.</li>
          </ul>
          <p className="text-sm">
            To proceed, click &quot;Confirm export&quot; below.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Handle export logic here
                onClose();
              }}
            >
              Confirm export
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteAccountModal({ isOpen, onClose }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between relative">
          <DialogTitle>Delete account - are you sure?</DialogTitle>
          <kbd className="absolute right-4 -top-4 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">esc</span>
          </kbd>
        </DialogHeader>

        <div className="space-y-4">
          <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
            <li>Deleting your account is permanent and cannot be undone.</li>
            <li>
              You cannot create a new account using the same email address.
            </li>
            <li>
              Your data will be deleted within 30 days, except we may retain a
              limited set of data for longer where required or permitted by law.
            </li>
            <li>
              Read our{" "}
              <a href="#" className="text-primary hover:underline">
                help center article
              </a>{" "}
              for more information.
            </li>
          </ul>

          <div className="p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
            You may only delete your account if you have logged in within the
            last 10 minutes. Please log in again, then return here to continue.
          </div>

          <div className="flex justify-center pt-2">
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => {
                // Handle refresh login logic
                console.log("Refreshing login...");
              }}
            >
              Login & Delete Forever
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function LogoutAllDevicesModal({ isOpen, onClose }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between relative">
          <DialogTitle>Log out of all devices - are you sure?</DialogTitle>
          <kbd className="absolute right-4 -top-4 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">esc</span>
          </kbd>
        </DialogHeader>

        <div className="space-y-4">
          <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
            <li>You will be logged out of all devices.</li>
            <li>All active sessions will be terminated immediately.</li>
            <li>You&apos;ll need to log in again on other devices to regain access.</li>
            <li>This action cannot be undone.</li>
          </ul>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                // Handle logout all devices logic here
                console.log("Logging out all devices...");
                onClose();
              }}
            >
              Confirm logout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SearchHistoryModal({ isOpen, onClose, currentType }: SearchHistoryModalProps) {
  const { getHistoryByType, removeHistory: removeItem, renameHistory: renameItem } = useHistoryStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "az" | "za">("recent");

  // Get history for current type and filter based on search
  const filteredHistory = getHistoryByType(currentType)
    .filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      switch (sortBy) {
        case "oldest":
          return dateA.getTime() - dateB.getTime();
        case "az":
          return a.title.localeCompare(b.title);
        case "za":
          return b.title.localeCompare(a.title);
        default: // "recent"
          return dateB.getTime() - dateA.getTime();
      }
    });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg sm:max-w-2xl overflow-hidden p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Search History</DialogTitle>
        </DialogHeader>
        <Command className="rounded-lg border-none">
          <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
            <CommandInput
              placeholder={`Search ${currentType} history...`}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
          </div>
          <div className="flex items-center justify-between border-b px-4 py-2 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">Tip:</span> Search by title or date
            </div>
            <div className="flex items-center gap-2">
              <span>Sort by:</span>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="h-8 w-[120px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="az">A to Z</SelectItem>
                  <SelectItem value="za">Z to A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <CommandList className="max-h-[400px] overflow-y-auto p-2">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Recent History">
              {filteredHistory.map((item) => (
                <CommandItem 
                  key={item.id}
                  className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-accent rounded-md"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-2 rounded-md">
                      <History className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-small sm:text-sm sm:font-medium">{item.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(item.createdAt))} ago
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="hidden sm:flex text-xs capitalize">
                      {item.type}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => renameItem(item.id, item.title)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Rename</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => removeItem(item.id)}
                          className="text-red-500"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

export function ShareDialog({ isOpen, onClose, imageUrl, modelName }: ShareDialogProps) {
  const handleShare = (platform: typeof socialMediaOptions[0]) => {
    window.open(platform.handler(imageUrl), '_blank');
    onClose();
  };

  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Image</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 py-4">
          {socialMediaOptions.map((platform) => (
            <button
              key={platform.name}
              onClick={() => handleShare(platform)}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg ${platform.color} ${platform.hoverColor} transition-colors duration-200`}
            >
              <Image
                src={platform.name === "X" ? (dark ? "/svgs/x_white.png" : "/svgs/x_black.png") : platform.icon}
                alt={platform.name}
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <span className={`text-sm font-medium ${platform.textColor}`}>
                {platform.name}
              </span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function VideoSettingsInfoModal({ isOpen, onClose, settingType }: { isOpen: boolean; onClose: () => void; settingType: 'aspectRatio' | 'quality' | 'duration' | 'display' }) {
  const settingsInfo = {
    aspectRatio: {
      title: "Aspect Ratio",
      description: "The aspect ratio determines the shape and dimensions of your video.",
      details: [
        { label: "16:9", description: "Landscape format, ideal for YouTube, presentations" },
        { label: "1:1", description: "Square format, perfect for Instagram posts" },
        { label: "9:16", description: "Portrait format, best for TikTok, Instagram Stories" }
      ]
    },
    quality: {
      title: "Video Quality",
      description: "Higher quality means better visual detail but larger file sizes.",
      details: [
        { label: "480p", description: "SD quality, faster generation, smaller file size" },
        { label: "720p", description: "HD quality, balanced performance" },
        { label: "1080p", description: "Full HD quality, best visual detail" }
      ]
    },
    duration: {
      title: "Video Duration",
      description: "Choose how long your generated video will be.",
      details: [
        { label: "Short (5-15s)", description: "Perfect for social media clips" },
        { label: "Medium (30s)", description: "Ideal for detailed concepts" },
        { label: "Long (60s+)", description: "Best for comprehensive content" }
      ]
    },
    display: {
      title: "Display Layout",
      description: "Choose how your generated videos are displayed.",
      details: [
        { label: "Column", description: "Vertical scrolling, one video at a time" },
        { label: "Grid", description: "2x2 layout, view multiple videos at once" },
        { label: "Carousel", description: "Horizontal sliding, focused viewing" }
      ]
    }
  };

  const currentSetting = settingsInfo[settingType];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            {currentSetting.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {currentSetting.description}
          </p>
          <div className="space-y-4">
            {currentSetting.details.map((detail, index) => (
              <div key={index} className="flex flex-col gap-1">
                <h4 className="text-sm font-medium">{detail.label}</h4>
                <p className="text-sm text-muted-foreground">{detail.description}</p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function AlbumModal({ isOpen, onClose }: ModalProps) {
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'audio'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<LikedMediaItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { likedMedia, getLikedMediaByType, removeLikedMedia } = useLikedMediaStore();

  // Audio state management
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Audio control handlers
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSliderChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Reset audio state when closing preview
  useEffect(() => {
    if (!isPreviewOpen) {
      setIsPlaying(false);
      setCurrentTime(0);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [isPreviewOpen]);

  const filteredMedia = useMemo(() => {
    const mediaByType = getLikedMediaByType(filter as 'image' | 'video' | 'audio' | 'all');
    if (!searchQuery) return mediaByType;
    return mediaByType.filter(item => 
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.modelName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [likedMedia, filter, searchQuery, getLikedMediaByType]);

  const handleRemoveLikedMedia = (id: string) => {
    removeLikedMedia(id);
    // Optionally, update the filteredMedia state if needed
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95%] md:max-w-5xl h-[80vh]">
        <DialogHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-0 items-center justify-between">
            <DialogTitle className="flex gap-2 text-lg">
              Album
            </DialogTitle>
            <div className="flex flex-col-reverse gap-2 xs:flex-row xs:gap-4 items-center">
              <Tabs defaultValue={filter} onValueChange={(value: string) => setFilter(value as 'all' | 'image' | 'video' | 'audio')}>
                <TabsList>
                  <TabsTrigger value="all" className="text-xs md:text-sm">All</TabsTrigger>
                  <TabsTrigger value="image" className="text-xs md:text-sm">Images</TabsTrigger>
                  <TabsTrigger value="video" className="text-xs md:text-sm">Videos</TabsTrigger>
                  <TabsTrigger value="audio" className="text-xs md:text-sm">Audio</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="relative max-w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search"
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className={`h-[calc(80vh-12rem)] sm:h-[calc(80vh-6rem)]`}
        >
          {filteredMedia.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Heart className="h-12 w-12 mb-4" />
              <p>No {filter === 'all' ? 'media' : filter + 's'} found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {filteredMedia.map((item) => (
                <div key={item.id} className="relative group rounded-lg overflow-hidden">
                  {item.type === 'video' ? (
                    <video
                      src={item.url}
                      className="w-full aspect-video object-cover"
                      muted
                      loop
                      onMouseOver={e => (e.target as HTMLVideoElement).play()}
                      onMouseOut={e => (e.target as HTMLVideoElement).pause()}
                    />
                  ) : item.type === 'image' ? (
                    <Image
                      src={item.url}
                      alt={item.prompt}
                      width={400}
                      height={400}
                      className="w-full aspect-square object-cover"
                    />
                  ) : (
                    // Audio preview card
                    <div className="w-full aspect-square bg-accent/10 flex flex-col items-center justify-center p-4">
                      <Music className="h-12 w-12 mb-4 text-muted-foreground" />
                      <p className="text-sm text-center line-clamp-2">{item.prompt.length > 15 ? item.prompt.substring(0, 15) + '...' : item.prompt}</p>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white text-sm mb-2 line-clamp-2">{item.prompt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Image
                            src={item.modelIcon}
                            alt={item.modelName || ''}
                            width={16}
                            height={16}
                            className="w-4 h-4 rounded-full"
                          />
                          <span className="text-white/80 text-xs">{item.modelName}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30"
                            onClick={() => handleRemoveLikedMedia(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-white" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30"
                            onClick={() => {
                              setSelectedItem(item);
                              setIsPreviewOpen(true);
                            }}
                          >
                            <Maximize2 className="h-4 w-4 text-white" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>

      {/* Preview Modal */}
      {selectedItem && (
        <Dialog open={isPreviewOpen} onOpenChange={() => setIsPreviewOpen(false)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Preview</DialogTitle>
            </DialogHeader>
            <div className="aspect-video relative rounded-lg overflow-hidden">
              {selectedItem.type === 'video' ? (
                <video
                  src={selectedItem.url}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  loop
                />
              ) : selectedItem.type === 'image' ? (
                <Image
                  src={selectedItem.url}
                  alt={selectedItem.prompt}
                  fill
                  className="object-contain rounded-lg"
                />
              ) : (
                // Enhanced audio player preview
                <div className="w-full h-full flex flex-col items-center justify-center bg-accent/10 p-8">
                  <Music className="h-24 w-24 mb-8 text-muted-foreground" />
                  <div className="w-full max-w-md space-y-4">
                    {/* Audio Controls */}
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-10 w-10"
                        onClick={handlePlayPause}
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {/* Time and Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                      <Slider
                        value={[currentTime]}
                        max={duration}
                        step={0.1}
                        onValueChange={(value) => handleSliderChange(value)}
                        className="w-full"
                      />
                    </div>

                    <audio
                      ref={audioRef}
                      src={selectedItem.url}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onEnded={() => setIsPlaying(false)}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{selectedItem.prompt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image
                    src={selectedItem.modelIcon}
                    alt={selectedItem.modelName || ''}
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm">{selectedItem.modelName}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(selectedItem.timestamp, { addSuffix: true })}
                </span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
}

export function GoogleDriveModal({ isOpen, onClose, onFileSelect }: GoogleDriveModalProps) {
  const { isAuthenticated, checkAndRefreshAuth } = useDriveAuthStore();
  const [pathHistory, setPathHistory] = useState<Array<{ name: string; id: string }>>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredFiles(files);
      return;
    }

    const filtered = files.filter((file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFiles(filtered);
  }, [searchQuery, files]);

  const loadFolderContents = async (folderId: string) => {
    setLoading(true);
    try {
      const gapi = driveService.getGapi();
      if (!gapi) {
        throw new Error('Google Drive API not initialized');
      }

      const response = await gapi.client.drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        fields: 'files(id, name, mimeType, size, thumbnailLink)',
        orderBy: 'folder,name'
      });

      const driveFiles: DriveFile[] = response.result.files.map((file: any) => ({
        id: file.id,
        name: file.name,
        type: file.mimeType === 'application/vnd.google-apps.folder' ? 'folder' : 'file',
        mimeType: file.mimeType,
        size: file.size,
        thumbnailUrl: file.thumbnailLink
      }));

      setFiles(driveFiles);
      setFilteredFiles(driveFiles);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to load folder contents:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load folder contents"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFolderClick = async (folderId: string, folderName: string) => {
    setPathHistory(prev => [...prev, { name: folderName, id: folderId }]);
    loadFolderContents(folderId);
  };

  const handleBackClick = () => {
    setPathHistory(prev => {
      const newPath = prev.slice(0, -1);
      const parentFolderId = newPath.length > 0 
        ? newPath[newPath.length - 1].id 
        : 'root';
      
      // Load the parent folder contents
      loadFolderContents(parentFolderId);
      
      return newPath;
    });
  };

  useEffect(() => {
    const initGoogleDrive = async () => {
      try {
        await driveService.init();
        const isAuthed = await checkAndRefreshAuth();
        if (isAuthed) {
          loadFolderContents('root');
        }
      } catch (error) {
        console.error('Failed to initialize Google Drive:', error);
      }
    };

    if (isOpen) {
      initGoogleDrive();
    }
  }, [isOpen]);

  const handleAuthenticate = async () => {
    setIsLoading(true);
    try {
      const success = await driveService.signIn();
      if (success) {
        const gapi = driveService.getGapi();
        if (!gapi) {
          throw new Error('Google Drive API not initialized');
        }

        const authInstance = gapi.auth2.getAuthInstance();
        const currentUser = authInstance.currentUser.get();
        const authResponse = currentUser.getAuthResponse();
        
        useDriveAuthStore.getState().setAuth(
          authResponse.access_token,
          authResponse.expires_in
        );
        
        await loadFolderContents('root');
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      setPathHistory([]);
      setFiles([]);
      setSearchQuery('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (file: DriveFile) => {
    if (file.type === 'folder') {
      handleFolderClick(file.id, file.name);
      return;
    }
    
    onFileSelect(file);
    onClose();
  };

  const refreshFiles = () => {
    const currentFolderId = pathHistory.length > 0 
      ? pathHistory[pathHistory.length - 1].id 
      : 'root';
    loadFolderContents(currentFolderId);
  };

  const currentPath = pathHistory.map(p => p.name);

  if (!isAuthenticated) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Google Drive</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Image
              src="/icons/google-drive.png"
              alt="Google Drive"
              width={64}
              height={64}
            />
            <p className="text-center text-sm text-muted-foreground">
              Connect your Google Drive to access and upload files directly from your drive.
            </p>
            <Button 
              onClick={handleAuthenticate} 
              className="gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              {isLoading ? 'Connecting...' : 'Connect Google Drive'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl h-[80vh]">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              {currentPath.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBackClick}
                  className="mr-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              {currentPath.length === 0 ? (
                <div className="flex items-center gap-2">
                  <Image
                    src="/icons/google-drive.png"
                    alt="Google Drive"
                    width={100}
                    height={100}
                    className="w-4 h-4"
                  />
                  Google Drive
                </div>
              ) : currentPath[currentPath.length - 1]}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={refreshFiles}
                disabled={loading}
                className="relative focus-visible:outline-none"
                title="Refresh files"
              >
                <RefreshCw className={cn(
                  "h-4 w-4",
                  loading && "animate-spin"
                )} />
              </Button>
              {lastRefresh && (
                <span className="text-xs text-muted-foreground">
                  Last updated: {formatDistanceToNow(lastRefresh, { addSuffix: true })}
                </span>
              )}
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              className="pl-8 border-borderColorPrimary focus-visible:outline-none focus:border-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </DialogHeader>

        <ScrollArea className="h-[calc(80vh-10rem)]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader className="h-6 w-6 animate-spin" />
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <File className="h-12 w-12 mb-4" />
              <p>{searchQuery ? 'No matching files found' : 'No files in this folder'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={() => handleFileSelect(file)}
                  className="flex flex-col items-center p-4 rounded-lg border border-border hover:bg-accent cursor-pointer"
                >
                  {file.type === 'folder' ? (
                    <Folder className="h-8 w-8 text-blue-500" />
                  ) : (
                    <File className="h-8 w-8 text-gray-500" />
                  )}
                  <span className="mt-2 text-sm text-center truncate w-full">
                    {file.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export function ShareLinkModal({ isOpen, onClose }: ModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDiscoverable, setIsDiscoverable] = useState(false);
  const [isNewlyCreated, setIsNewlyCreated] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const { toast } = useToast();
  const { currentConversationLink, setCurrentConversationLink } = useSidebarStore();
  const { sectionIds } = useSidebarStore();
  const { addSharedLink, updateSharedLink, getSharedLink } = useSharedLinksStore();
  const { getHistoryByType } = useHistoryStore();

  const { theme } = useTheme();
  const dark = theme === "dark";

  const generateLink = async () => {
    setIsLoading(true);


    
    // Get current history type and ID
    const currentTypeEntry = Object.entries(sectionIds).find(([_, id]) => id !== null);
    
    if (!currentTypeEntry || !currentTypeEntry[1]) {
      toast({
        variant: "destructive",
        description: "Please select a conversation to share",
      });
      setIsLoading(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    const [currentType, historyId] = currentTypeEntry;
    const historyType = currentType.replace('Id', '') as 'chat' | 'image' | 'audio' | 'video';
    
    // Get the history item details
    const history = getHistoryByType(historyType).find(item => item.id === historyId);

    if (!history) {
      toast({
        variant: "destructive",
        description: "Conversation not found",
      });
      setIsLoading(false);
      return;
    }

    // Check if a link already exists for this history
    const existingLink = getSharedLink(historyId);
    
    // Generate the share link
    const baseUrl = window.location.origin;
    const newLink = `${baseUrl}/share/${historyId}`;

    if (existingLink) {
      // Update existing link
      updateSharedLink(existingLink.id, newLink);
      toast({
        description: "Share link has been updated",
      });
    } else {
      // Create new link
      addSharedLink(historyId, history.title, newLink);
      toast({
        description: "Share link has been created",
      });
    }

    setCurrentConversationLink(newLink);
    setIsNewlyCreated(true);
    setIsLoading(false);
  };

  const copyToClipboard = async () => {
    if (!currentConversationLink) return;
    
    try {
      await navigator.clipboard.writeText(currentConversationLink);
      toast({
        title: "Copied",
        description: "Link copied to clipboard",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Failed to copy link",
      });
    }
  };

  // Reset newly created state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsNewlyCreated(false);
    }
  }, [isOpen]);

  // Reset state when section IDs change
  useEffect(() => {
    setCurrentConversationLink(null);
    setIsNewlyCreated(false);
  }, [sectionIds]);

  const handleShare = (platform: typeof socialMediaOptions[0]) => {
    if (!currentConversationLink) return;
    window.open(platform.handler(currentConversationLink), '_blank');
  };
  
  const getButtonConfig = () => {
    if (isLoading) {
      return {
        text: "",
        icon: <Loader className="h-4 w-4 animate-spin" />,
        action: undefined
      };
    }

    // Get current history ID
    const currentTypeEntry = Object.entries(sectionIds).find(([_, id]) => id !== null);
    const historyId = currentTypeEntry?.[1];
    const existingLink = historyId ? getSharedLink(historyId) : null;

    if (!currentConversationLink) {
      return {
        text: existingLink ? "Update link" : "Create link",
        icon: <Link className="w-4 h-4" />,
        action: generateLink
      };
    }

    if (isNewlyCreated) {
      return {
        text: "Copy",
        icon: <Copy className="w-4 h-4" />,
        action: copyToClipboard
      };
    }

    return {
      text: "Update link",
      icon: <Link className="w-4 h-4" />,
      action: generateLink
    };
  };

  const buttonConfig = getButtonConfig();

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="flex flex-row items-center justify-between relative">
            <DialogTitle className="text-sm">
              {currentConversationLink 
                ? 'Update sharing link' 
                : getSharedLink(Object.entries(sectionIds).find(([_, id]) => id !== null)?.[1] || '')
                  ? 'Regenerate sharing link'
                  : 'Create sharing link'
              }
              <kbd className="absolute right-4 -top-[0.6rem] pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">esc</span>
              </kbd>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {isNewlyCreated 
                ? (
                  <>
                    The public link to your chat has been updated. Manage previously shared chats via {" "}
                    <span 
                  onClick={() => {
                    onClose();
                    setSettingsModalOpen(true);
                  }}
                  className="underline font-semibold cursor-pointer">Settings</span>.
                  </>
                ) : "Your name and any messages you add after sharing stay private."}
            </p>

            <div className="flex gap-2 bg-muted p-1 border border-borderColorPrimary rounded-full">
              <Input
                value={currentConversationLink || "https://alle-ai.com/share/..."}
                readOnly
                placeholder=""
                className="bg-muted rounded-full focus-visible:outline-none border-none"
              />
              <Button
                variant="outline"
                onClick={buttonConfig.action}
                disabled={isLoading}
                className={cn(
                  "bg-bodyColor text-xs text-bodyColorAlt shrink-0 gap-2 p-3 rounded-full border-none hover:bg-bodyColor hover:text-bodyColorAlt hover:opacity-90",
                  isLoading && "cursor-not-allowed opacity-50"
                )}
              >
                {isLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    {buttonConfig.icon}
                    {buttonConfig.text}
                  </>
                )}
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              {buttonConfig.text === "Update link" && (
                <>
                  A past version of this chat has already been shared. Manage previously shared chats via{" "}
                  <span 
                  onClick={() => {
                    onClose();
                    setSettingsModalOpen(true);
                  }}
                  className="underline font-semibold cursor-pointer">Settings</span>.
                </>
              )}
            </div>

            {isNewlyCreated && currentConversationLink && (
              <div className="grid grid-cols-4 gap-4">
                {socialMediaOptions.map((platform) => (
                  <Button
                    key={platform.name}
                    variant="outline"
                    className="flex flex-col items-center gap-2 h-auto rounded-xl"
                    onClick={() => handleShare(platform)}
                  >
                    <Image
                      src={platform.name === "X" ? (dark ? "/svgs/x_white.png" : "/svgs/x_black.png") : platform.icon}
                      alt={platform.name}
                      width={20}
                      height={20}
                      className="w-4 h-4"
                    />
                  </Button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <SettingsModal 
        isOpen={settingsModalOpen} 
        onClose={() => setSettingsModalOpen(false)}
        defaultTabValue = {'data controls'} 
      />
    </>
  );
}

export function SharedLinksModal({ isOpen, onClose }: ModalProps) {
  const { sharedLinks, removeSharedLink } = useSharedLinksStore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLinks = useMemo(() => {
    return sharedLinks.filter(link => 
      link.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sharedLinks, searchQuery]);

  const copyToClipboard = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      toast({ description: "Link copied to clipboard" });
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Failed to copy link"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="flex flex-row items-center justify-between relative border-b pb-4">
          <DialogTitle>Shared Links</DialogTitle>
          <kbd className="absolute right-4 -top-4 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">esc</span>
          </kbd>
        </DialogHeader>

        <div className="space-y-4">
          {/* Header with Search */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search shared links..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background focus-visible:outline-none focus:border-borderColorPrimary"
              />
            </div>
          </div>

          {/* Links Table */}
          <div className="rounded-md border">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr,auto] md:grid-cols-[1fr,200px,auto] gap-4 p-2 border-b bg-muted/50">
              <div className="text-sm font-medium">Name</div>
              <div className="hidden md:block text-sm font-medium">Date shared</div>
              <div className="text-sm font-medium text-right">Actions</div>
            </div>

            {/* Table Body */}
            <ScrollArea className="h-[400px]">
              {filteredLinks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                  <Link className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">No shared links found</p>
                </div>
              ) : (
                filteredLinks.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[1fr,auto] md:grid-cols-[1fr,200px,auto] gap-4 p-2 border-b last:border-0 items-center hover:bg-muted/50 group"
                  >
                    {/* Link Title */}
                    <div className="flex items-center gap-2 min-w-0 cursor-pointer hover:opacity-90 hover:underline transition-all">
                      <Link className="h-3 w-3 flex-shrink-0 text-blue-500" />
                      <span className="truncate text-xs">{item.title}</span>
                    </div>

                    {/* Date */}
                    <div className="hidden md:flex items-center gap-2 text-muted-foreground">
                      <Clock9 className="h-3 w-3" />
                      <span className="text-xs">
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2">
                      <TooltipProvider>
                        {/* Share Button */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-[200px] bg-backgroundSecondary">
                                {socialMediaOptions.map((platform) => (
                                  <DropdownMenuItem
                                    key={platform.name}
                                    onClick={() => window.open(platform.handler(item.link), '_blank')}
                                    className="flex items-center gap-2"
                                  >
                                    <Image
                                      src={platform.icon}
                                      alt={platform.name}
                                      width={16}
                                      height={16}
                                    />
                                    <span>Share on {platform.name}</span>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TooltipTrigger>
                          <TooltipContent>Share</TooltipContent>
                        </Tooltip>

                        {/* Copy Link Button */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => copyToClipboard(item.link)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy link</TooltipContent>
                        </Tooltip>

                        {/* Delete Button */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => removeSharedLink(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ShortcutsModal({ isOpen, onClose }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0">
        {/* Header */}
        <div className="border-b p-6 bg-background">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <div className="p-2 rounded-md bg-primary/10">
                <KeyboardCommand className="h-5 w-5 text-primary" />
              </div>
              Keyboard shortcuts
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Content */}
        <ScrollArea className="max-h-[calc(80vh-8rem)]">
          <div className="p-6 space-y-8">
            {/* Essential Shortcuts */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Essential Commands</h3>
              <div className="grid gap-3">
                {shortcuts.slice(0, 4).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between group px-3 py-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                        {getIconForAction(item.action)}
                      </div>
                      <span className="text-sm font-medium group-hover:text-foreground transition-colors">
                        {item.action}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.shortcut.map((combo, comboIndex) => (
                        <div key={comboIndex} className="flex items-center gap-1">
                          {combo.keys.map((key, keyIndex) => (
                            <kbd
                              key={keyIndex}
                              className="px-2 py-1.5 text-[10px] font-medium bg-muted rounded-md border shadow-sm min-w-[28px] flex items-center justify-center uppercase"
                            >
                              {key}
                            </kbd>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Shortcuts */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Additional Shortcuts</h3>
              <div className="grid gap-3">
                {shortcuts.slice(4).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between group px-3 py-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                        {getIconForAction(item.action)}
                      </div>
                      <span className="text-sm font-medium group-hover:text-foreground transition-colors">
                        {item.action}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.shortcut.map((combo, comboIndex) => (
                        <div key={comboIndex} className="flex items-center gap-1">
                          {combo.keys.map((key, keyIndex) => (
                            <kbd
                              key={keyIndex}
                              className="px-2 py-1.5 text-[10px] font-medium bg-muted rounded-md border shadow-sm min-w-[28px] flex items-center justify-center uppercase"
                            >
                              {key}
                            </kbd>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t p-4 bg-background">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <Info className="h-3 w-3" />
              Press <kbd className="px-2 py-1 text-[10px] font-medium bg-muted rounded-md border shadow-sm">Ctrl</kbd> + <kbd className="px-2 py-1 text-[10px] font-medium bg-muted rounded-md border shadow-sm">/</kbd> anytime to view shortcuts
            </p>
            <Button variant="outline" size="sm" className="text-xs focus-visible:outline-none" onClick={onClose}>
              Got it
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


function getIconForAction(action: string) {
  switch (action) {
    case "Open new chat":
      return <MessageSquare className="h-4 w-4" />;
    case "Focus chat input":
      return <Type className="h-4 w-4" />;
    case "Copy last code block":
      return <Code className="h-4 w-4" />;
    case "Copy last response":
      return <Copy className="h-4 w-4" />;
    case "Set custom instructions":
      return <Settings className="h-4 w-4" />;
    case "Toggle sidebar":
      return <PanelLeftClose className="h-4 w-4" />;
    case "Delete chat":
      return <Trash2 className="h-4 w-4" />;
    case "Show shortcuts":
      return <KeyboardCommand className="h-4 w-4" />;
    default:
      return <KeyboardCommand className="h-4 w-4" />;
  }
}

export function ReportContentModal({ 
  isOpen, 
  onClose, 
  contentId,
  contentType,
  contentPreview 
}: ReportModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [includeContent, setIncludeContent] = useState(true);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!selectedCategory) {
      toast({
        title: "Please select a category",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Report submitted",
        description: "Thank you for helping keep our platform safe.",
      });
      onClose();
      setSelectedCategory('');
    } catch (error) {
      toast({
        title: "Error submitting report",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      setSelectedCategory('');
      onClose();
      }}>
      <DialogContent className="sm:max-w-[500px] p-0 h-[calc(100vh-40px)] flex flex-col gap-0">
        {/* Fixed Header */}
        <div className="shrink-0 p-6 border-b bg-background">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Report Content
            </DialogTitle>
            <DialogDescription>
              Help us maintain a safe environment by reporting inappropriate or illegal content.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-6 pr-4">
            {/* Content Preview */}
            {contentPreview && (
              <div className="p-3 rounded-lg bg-yellow-500/20 border border-borderColorPrimary">
                <div className="text-xs text-muted-foreground mb-2">Content being reported:</div>
                <div className="text-sm line-clamp-3">{contentPreview}</div>
              </div>
            )}

            {/* Category Selection */}
            <div className="space-y-4">
              <label className="text-sm font-medium">
                What type of violation are you reporting?
              </label>
              <RadioGroup
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                className="grid gap-3"
              >
                {reportCategories.map((category) => (
                  <div
                    key={category.id}
                    className={cn(
                      "flex items-start space-x-3 rounded-lg border p-3 cursor-pointer transition-colors",
                      selectedCategory === category.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                    )}
                  >
                    <RadioGroupItem
                      value={category.id}
                      id={category.id}
                      className="mt-1"
                    />
                    <label
                      htmlFor={category.id}
                      className="flex-1 cursor-pointer space-y-1"
                    >
                      <div className="text-sm font-medium leading-none">
                        {category.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {category.description}
                      </div>
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Additional Details */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Additional details <span className="text-muted-foreground">(Optional)</span>
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide any additional context..."
                className="min-h-[100px] resize-none border border-borderColorPrimary focus-visible:outline-none focus:border-2"
                maxLength={500}
              />
              <div className="text-xs text-muted-foreground text-right">
                {description.length}/500 characters
              </div>
            </div>

            {/* Include Content Option */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-content"
                checked={includeContent}
                onCheckedChange={(checked) => setIncludeContent(checked as boolean)}
              />
              <label htmlFor="include-content" className="text-sm text-muted-foreground leading-none">
                Include content in report for review
              </label>
            </div>
          </div>
        </ScrollArea>

        {/* Fixed Footer */}
        <div className="shrink-0 p-4 border-t bg-background">
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => {
              setSelectedCategory('');
              onClose();
              }}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!selectedCategory || isSubmitting}
              className="gap-2"
              variant="destructive"
            >
              {isSubmitting ? (
                <>
                <Loader className="h-4 w-4 animate-spin" />
                Submitting
                </>
                ) : "Submit Report"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function TransactionHistoryModal({ isOpen, onClose }: ModalProps) {


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Transaction History</DialogTitle>
          </div>
        </DialogHeader>

        <div className="mt-4">
          <DataTable columns={columns} data={transactions} />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div>
              Showing {transactions.length} transactions
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1">
              <Wallet className="h-4 w-4" />
              Total balance: £{transactions
                .filter(t => t.mode === 'platform')
                .reduce((acc, curr) => acc + curr.amount, 0)
                .toFixed(2)}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
