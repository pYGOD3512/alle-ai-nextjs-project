import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useSidebarStore,
  CHAT_MODELS,
  IMAGE_MODELS,
  AUDIO_MODELS,
  VIDEO_MODELS,
} from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  User,
  BarChart2,
  Shield,
  Save,
  Gem,
  Copy,
  Container,
  Pencil,
  X,
  Search,
  Check,
  DatabaseBackup,
  Info,
} from "lucide-react";
import { FaWhatsapp, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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
      <DialogContent className="sm:max-w-[30rem]">
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

export function ModelSelectionModal({ isOpen, onClose }: ModalProps) {
  const [selectedModels, setSelectedModels] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterType, setFilterType] = React.useState("all");
  const currentPage = useSidebarStore((state) => state.currentPage);

  useEffect(() => {}, [selectedModels]);

  useEffect(() => {
    setSelectedModels([]);
    setSearchQuery("");
    setFilterType("all");
  }, [currentPage]);

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

  const toggleModelSelection = (modelId: string) => {
    setSelectedModels((prevSelected) => {
      const newSelected = prevSelected.includes(modelId)
        ? prevSelected.filter((id) => id !== modelId)
        : [...prevSelected, modelId];
      return newSelected;
    });
  };

  const removeModel = (modelId: string) => {
    setSelectedModels((prevSelected) => {
      const newSelected = prevSelected.filter((id) => id !== modelId);
      return newSelected;
    });
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[50%]">
        <DialogHeader className="space-y-4 relative">
          <DialogTitle className="">Model Selection</DialogTitle>

          {/* Selected Models */}
          <div className="space-y-2">
            {selectedModels.length < 1 ? (
              ""
            ) : (
              <label className="text-sm font-medium">Selected Models</label>
            )}
            <div className="flex flex-wrap gap-2">
              {selectedModels.map((modelId) => {
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
                      onClick={() => removeModel(modelId)}
                    />
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">{getModelTypeText()}</div>
            <div className="flex items-center gap-2">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 overflow-hidden">
            {filteredModels.map((model) => (
              <div
                key={model.id}
                onClick={() => toggleModelSelection(model.id)}
                className={cn(
                  "flex items-center gap-3 p-4 border border-borderColorPrimary rounded-lg cursor-pointer hover:bg-accent/50 transition-colors select-none",
                  selectedModels.includes(model.id) &&
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
                  <p className="text-sm text-muted-foreground">
                    {model.provider}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Save Button */}
        <div className="flex justify-end mt-4">
          {/* implement on save function  */}
          <Button onClick={onClose}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SettingsModal({ isOpen, onClose }: ModalProps) {
  const { theme, setTheme } = useTheme();
  const [textSize, setTextSize] = React.useState("16 px");
  const [disabled, setDisabled] = useState(true);
  const [exportModalOpen, setExportModalOpen] = React.useState(false);
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] =
    React.useState(false);
  const [logoutAllModalOpen, setLogoutAllModalOpen] = React.useState(false);

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
        title: "Alle-AI-Combination",
        description:
          "Highlight similarities and differences in AI responses. Identifies consistent and conflicting viewpoints, helping you see where models agree or differ",
        enabled: true,
      },
      summary: {
        title: "Alle-AI-Summary",
        description:
          "Merge responses for a cohesive answer. Combines insights from all models to minimize inaccuracies and enhance clarity.",
        enabled: false,
      },
      comparison: {
        title: "Alle-AI-Comparison",
        description:
          "Get a concise overview of all AI responses. Summarizes and distills the key points from each AI model for easy understanding",
        enabled: true,
      },
    },
    data_controls: {
      extpertMyData: {
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

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[40rem]">
          <DialogHeader className="flex flex-row items-center justify-between relative border-b border-borderColorPrimary">
            <DialogTitle className="mb-2">Settings</DialogTitle>
            <kbd className="absolute right-4 -top-4 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">esc</span>
            </kbd>
          </DialogHeader>

          <Tabs defaultValue="general" className="w-full">
            <div className="flex gap-4">
              {/* Sidebar */}
              <div className="w-48 space-y-1">
                <TabsList className="flex flex-col h-auto bg-transparent space-y-1">
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
                </TabsContent>

                <TabsContent value="data controls" className="space-y-2">
                  {Object.entries(settingsData.data_controls).map(
                    ([key, setting]) => (
                      <div
                        key={key}
                        className="border-b border-borderColorPrimary last:border-none"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-small">
                            {setting.title}
                          </h4>
                          <Button
                            variant={`${
                              setting.action === "Delete"
                                ? "destructive"
                                : "outline"
                            }`}
                            className={`h-8 rounded-full px-3 text-xs border-borderColorPrimary transition-all`}
                            size="sm"
                            onClick={() => {
                              if (setting.action === "Delete") {
                                setDeleteAccountModalOpen(true);
                              } else if (setting.action === "Export") {
                                setExportModalOpen(true);
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
                    )
                  )}
                </TabsContent>

                <TabsContent value="analytics">
                  <div className="flex items-center justify-between space-x-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">
                        {settingsData.analytics.myAnalytics.title}
                      </h4>
                      <p className="text-[0.75rem] text-muted-foreground">
                        {settingsData.analytics.myAnalytics.description}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                  <div className="">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-small">
                        {settingsData.security.logoutAll.title}
                      </h4>
                      <Button
                        variant="destructive"
                        className="h-8 rounded-full px-3 text-xs border-borderColorPrimary"
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
        <DialogContent className="sm:max-w-[35rem]">
          <DialogHeader className="flex flex-row items-center justify-between relative">
            <div className="flex flex-col items-center w-full gap-2">
              <div className="relative">
                <Image
                  src={profilePhoto}
                  alt="Profile"
                  className="w-20 h-20 rounded-full"
                  width={20}
                  height={20}
                />
                <div className="absolute -bottom-1 -right-2 text-white rounded-full">
                  <Badge variant="default">Free</Badge>
                </div>
              </div>
              <div className="text-center">
                <DialogTitle className="text-xl">
                  {firstName} {lastName}
                </DialogTitle>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
            </div>
            <div className="absolute right-4 top-4 flex gap-2">
              <Button
                variant="outline"
                className="border-2 border-borderColorPrimary focus:outline-none"
                size="sm"
                onClick={handleEditToggle}
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Profile
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
                  <label className="text-sm font-medium">Profile photo</label>
                  <div className="flex items-center gap-4">
                    <Image
                      src={profilePhoto}
                      alt="Profile"
                      width={16}
                      height={16}
                      className="w-16 h-16 rounded-full"
                    />
                    <Button variant="outline" size="sm">
                      change picture
                    </Button>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-between gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setPlansModalOpen(true);
                  onClose();
                }}
              >
                <Gem className="h-4 w-4 mr-2" />
                UPGRADE
              </Button>
              <div className="flex gap-4">
                <Button variant="outline" onClick={onClose}>
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
  const referralLink = "https://alle.ai/ref=XXX_XXX";
  const stats = {
    friendsReferred: 0,
    cashEarned: "£0.00",
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    //I'll implement a toast here
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-row items-center justify-between relative">
          <DialogTitle>
            Refer friends{" "}
            <span className="text-sm text-blue-500">(coming soon)</span>
          </DialogTitle>
          <kbd className="absolute right-4 -top-4 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">esc</span>
          </kbd>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Invite your friends and earn alle-ai tokens on each successful
              referral. These tokens can be used to subscribe to Alle-IA plans.{" "}
              <a href="#" className="text-blue-500 hover:underline">
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
                <p className="text-2xl font-bold">{stats.cashEarned}</p>
                <p className="text-sm text-muted-foreground">Earned cash</p>
              </div>
            </div>

            {/* Invitation Link */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                Invitation Link
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
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
            <li>
              Your account details and chats will be included in the export.
            </li>
            <li>
              The data will be sent to your registered email in a downloadable
              file.
            </li>
            <li>
              The download link will expire 24 hours after you receive it.
            </li>
            <li>
              {`Processing may take some time. You'll be notified when it's ready.`}
            </li>
          </ul>
          <p className="text-sm">{`To proceed, click "Confirm export" below.`}</p>
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
            <li>
              {`You'll need to log in again on other devices to regain access.`}
            </li>
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
