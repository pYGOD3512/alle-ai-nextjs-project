"use client";

import { useState, useEffect, forwardRef } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuItem,
  ContextMenuContent,
} from "@/components/ui/context-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutGrid, Plus, EllipsisVertical, Gem, ChevronDown, BookOpen, Pencil, Trash2, History, Search, ChartLine, MessageSquare, ImageIcon, Music, Video  } from "lucide-react";
import Image from "next/image";
import {
  sidebarMenuItems,
} from "@/lib/constants";
import { useSidebarStore, useHistoryStore } from "@/stores";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModelSelectionModal, PlansModal, SearchHistoryModal } from "../ui/modals";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Input } from "@/components/ui/input";


export function Sidebar() {
  const { isOpen, setCurrentPage, toggle, setCurrentConversationLink, setSectionId } = useSidebarStore();
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const { history, removeHistory: removeItem, renameHistory: renameItem, getHistoryByType } = useHistoryStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const [modelSelectionModalOpen, setModelSelectionModalOpen] = useState(false);
  const [plansModalOpen, setPlansModalOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(true);
  const [historySearchModalOpen, setHistorySearchModalOpen] = useState(false);


  useEffect(() => {
    if (isMobile && isOpen) {
      toggle();
    }
  }, [isMobile]);

  const handleNewChat = () => {
    // Clear the conversation link when starting a new chat
    setCurrentConversationLink(null);
    
    // other logics later
    switch (true) {
      case pathname.startsWith("/chat"):
        router.push("/");
        break;
      case pathname.startsWith("/image"):
        router.push("/image");
        break;
      case pathname.startsWith("/audio"):
        router.push("/audio");
        break;
      case pathname.startsWith("/video"):
        router.push("/video");
        break;
      default:
        router.push("/");
    }
  };
  // active helper 
 const isActiveRoute = (itemHref: string, pathname: string): boolean => {
   // Exact match for specific routes
   if (itemHref === "/")
     return pathname === "/" || pathname.startsWith("/chat/res");
   if (itemHref === "/image")
     return pathname === "/image" || pathname.startsWith("/image/res");
   if (itemHref === "/audio")
     return pathname === "/audio" || pathname.startsWith("/audio/res");
   if (itemHref === "/video")
     return pathname === "/video" || pathname.startsWith("/video/res");
   if (itemHref === "/changelog")
     return pathname === "/changelog" || pathname.startsWith("/changelog");

   return false;
 };
 
  const handleRename = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditingTitle(currentTitle);
  };

  const handleRenameSubmit = (id: string) => {
    if (editingTitle.trim()) {
      renameItem(id, editingTitle.trim());
    }
    setEditingId(null);
    setEditingTitle("");
  };

  // Determine current content type based on pathname
  const getCurrentType = (): 'chat' | 'image' | 'audio' | 'video' => {
    if (pathname.startsWith('/image')) return 'image';
    if (pathname.startsWith('/audio')) return 'audio';
    if (pathname.startsWith('/video')) return 'video';
    return 'chat';
  };

  // Here we get the history of the various pages
  const currentType = getCurrentType();
  const currentHistory = getHistoryByType(currentType);

  // Add this helper function to get section-specific styles
  const getSectionStyles = (type: 'chat' | 'image' | 'audio' | 'video') => {
    switch (type) {
      case 'image':
        return {
          bgColor: 'bg-purple-500/10',
          hoverBg: 'hover:bg-purple-500/20',
          iconColor: 'text-purple-500'
        };
      case 'audio':
        return {
          bgColor: 'bg-blue-500/10',
          hoverBg: 'hover:bg-blue-500/20',
          iconColor: 'text-blue-500'
        };
      case 'video':
        return {
          bgColor: 'bg-red-500/10',
          hoverBg: 'hover:bg-red-500/20',
          iconColor: 'text-red-500'
        };
      default:
        return {
          bgColor: 'bg-green-500/10',
          hoverBg: 'hover:bg-green-500/20',
          iconColor: 'text-green-500'
        };
    }
  };

  // Helper function to get current section icon
  const getCurrentSectionIcon = () => {
    switch (true) {
      case pathname.startsWith("/image"):
        return ImageIcon;
      case pathname.startsWith("/audio"):
        return Music;
      case pathname.startsWith("/video"):
        return Video;
      default:
        return MessageSquare;
    }
  };

  const CurrentIcon = getCurrentSectionIcon();

  // Add this function to handle history item clicks
  const handleHistoryItemClick = (itemId: string) => {
    // Clear the conversation link when switching to a different conversation
    setCurrentConversationLink(null);
    
    // Set the current section ID based on the type
    setSectionId(`${currentType}Id`, itemId);
  };

  return (
    <>
      {/* Backdrop overlay for mobile when sidebar is open */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
          onClick={toggle}
        />
      )}
      
      <aside
        className={`fixed left-0 top-0 z-40 mt-14 h-[calc(100vh-3.5rem)] overflow-hidden transition-all duration-300 
          ${isOpen ? "w-60" : "w-16"} 
          ${isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}
          border-r bg-sideBarBackground flex flex-col`}
      >
        <div className="p-2">
          {isOpen ? (
            <>
              <div className="flex gap-2 px-2">
                <Button
                  onClick={handleNewChat}
                  variant="outline"
                  className={`flex-1 ${getSectionStyles(currentType).bgColor} ${getSectionStyles(currentType).iconColor}`}
                >
                  <Plus className={`mr-2 h-4 w-4 ${getSectionStyles(currentType).iconColor} ${getSectionStyles(currentType).iconColor}`} />
                  NEW {currentType.toUpperCase()}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={`${getSectionStyles(currentType).bgColor} ${getSectionStyles(currentType).iconColor}`}
                  onClick={() => setModelSelectionModalOpen(true)}
                  aria-label="Model Selection"
                  id="tooltip-select-selector"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-4 px-2 space-y-1" id="tooltip-select-ais">
                {sidebarMenuItems.map((item, i) => {
                  const isActive = isActiveRoute(item.href, pathname);
                  const type = item.href === "/" ? "chat" 
                    : item.href === "/image" ? "image"
                    : item.href === "/audio" ? "audio"
                    : "video";
                  const styles = getSectionStyles(type);
                  
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`w-full flex items-center justify-start h-8 text-sm rounded-md px-2 
                        ${isActive ? `${styles.bgColor} ${styles.iconColor}` : ""}
                        ${styles.hoverBg}`}
                    >
                      <item.icon className={`mr-2 h-4 w-4 ${isActive ? styles.iconColor : ""}`} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <div className="space-y-2 mb-8">
                <Button
                  onClick={handleNewChat}
                  variant="outline"
                  className={`flex-1 ${getSectionStyles(currentType).bgColor} ${getSectionStyles(currentType).hoverBg}`}
                >
                  <CurrentIcon className={`h-4 w-4 ${getSectionStyles(currentType).iconColor}`} />
                </Button>
                <Button
                  variant="outline"
                  className={`flex-1 ${getSectionStyles(currentType).bgColor} ${getSectionStyles(currentType).iconColor}`}
                  onClick={() => setModelSelectionModalOpen(true)}
                  id="tooltip-select-selector"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
              {sidebarMenuItems.map((item, i) => {
                const isActive = isActiveRoute(item.href, pathname);
                const type = item.href === "/" ? "chat" 
                  : item.href === "/image" ? "image"
                  : item.href === "/audio" ? "audio"
                  : "video";
                const styles = getSectionStyles(type);
                
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`w-full flex items-center justify-center h-8 text-sm rounded-md px-2
                      ${isActive ? `${styles.bgColor} ${styles.iconColor}` : ""}
                      ${styles.hoverBg}`}
                    id="tooltip-select-ais"
                  >
                    <item.icon className={`h-4 w-4 ${isActive ? styles.iconColor : ""}`} />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {isOpen ? (
          <>
            <div className="px-4 mt-5">
              <div className="flex justify-between items-center mx-2 text-xs font-medium text-muted-foreground mb-2">
                {currentType.toUpperCase()} HISTORY
                <Button
                variant={`ghost`}
                size={`icon`}
                className="p-0 h-8 w-8"
                onClick={() => setHistorySearchModalOpen(true)}
                aria-label="Search History"
                >
                  <Search   className="w-4 h-4"/>
                </Button>
              </div>
              <ScrollArea className="flex-1 h-[calc(100vh-40rem)]">
                <div className="space-y-0.5">
                  {currentHistory.map((item) => (
                    <ContextMenu key={item.id}>
                      <ContextMenuTrigger>
                        <div 
                          className="group relative flex items-center px-2 py-1.5 hover:bg-secondary/80 rounded-md"
                          onClick={() => handleHistoryItemClick(item.id)}
                        >
                          {editingId === item.id ? (
                            <Input
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              onBlur={() => handleRenameSubmit(item.id)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleRenameSubmit(item.id);
                                if (e.key === 'Escape') setEditingId(null);
                              }}
                              autoFocus
                              className="h-6 text-xs"
                            />
                          ) : (
                            <div className="relative flex-1 min-w-0">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="relative text-xs text-left cursor-pointer">
                                      <div className="whitespace-nowrap overflow-hidden">
                                        {item.title.length > 30
                                          ? `${item.title.substring(0, 30)}`
                                          : item.title}
                                        <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-r from-transparent to-sideBarBackground group-hover:to-secondary/80" />
                                      </div>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="top"
                                    className="max-w-[200px] text-xs break-words"
                                  >
                                    {item.title}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          )}

                          <div className="absolute right-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5 p-0 border-none opacity-0 group-hover:opacity-100 outline-none"
                                  aria-label="More Actions"
                                >
                                  <EllipsisVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-[160px]">
                                <DropdownMenuItem onClick={() => handleRename(item.id, item.title)}>
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
                        </div>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem onClick={() => handleRename(item.id, item.title)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Rename</span>
                        </ContextMenuItem>
                        <ContextMenuItem 
                          onClick={() => removeItem(item.id)}
                          className="text-red-500"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="px-4 mt-8">
              <Collapsible open={isMoreOpen} onOpenChange={setIsMoreOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-md bg-backgroundSecondary text-xs font-medium text-muted-foreground hover:text-primary">
                  MORE
                  <ChevronDown className={`h-4 w-4 transition-transform ${isMoreOpen ? 'transform rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 mt-1">
                  <Link href={`/model-glossary`} legacyBehavior>
                    <a target="_blank" rel="noopener noreferrer" className=" flex gap-2 items-center px-2 py-1.5 text-xs hover:bg-secondary/80 rounded-md cursor-pointer">
                      <BookOpen className="w-4 h-4 ml-4"/> Model Glossary
                    </a>
                  </Link>
                  <Link href={`https://all-ai-model-usage-tracker.vercel.app/`} legacyBehavior>
                    <a target="_blank" rel="noopener noreferrer" className=" flex gap-2 items-center px-2 py-1.5 text-xs hover:bg-secondary/80 rounded-md cursor-pointer">
                      <ChartLine  className="w-4 h-4 ml-4"/> Model Analytics
                    </a>
                  </Link>
                  <Link href={`/changelog`} className={`flex gap-2 items-center px-2 py-1.5 text-xs hover:bg-secondary/80 rounded-md cursor-pointer ${isActiveRoute('/changelog', pathname) ? "bg-secondary font-medium" : ""}`}>
                      <History  className="w-4 h-4 ml-4"/> Changelog
                  </Link>
                </CollapsibleContent>
              </Collapsible>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 rounded-md m-2 cursor-pointer hover:bg-background transition-all duration-200">
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/user.jpg"
                  alt="User"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-sm">Pascal</div>
                    <Badge variant="default" className="text-[0.6rem] h-3">Free</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    pascal@alle-ai.com
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs"
                onClick={() => setPlansModalOpen(true)}
              >
                UPGRADE
              </Button>
            </div>
          </>
        ) : (
          <div className="absolute bottom-0 left-0 right-0 rounded-md m-2 cursor-pointer hover:bg-background transition-all duration-200">
            <Button size="sm" variant="outline" className="w-full text-xs">
              <Gem className="h-4 w-4" />
            </Button>
          </div>
        )}
      </aside>
      <ModelSelectionModal
        isOpen={modelSelectionModalOpen}
        onClose={() => setModelSelectionModalOpen(false)}
      />
      <PlansModal
        isOpen={plansModalOpen}
        onClose={() => setPlansModalOpen(false)}
      />
      <SearchHistoryModal
        isOpen={historySearchModalOpen} 
        onClose={() => setHistorySearchModalOpen(false)} 
        currentType={currentType}
      />
    </>
  );
}
