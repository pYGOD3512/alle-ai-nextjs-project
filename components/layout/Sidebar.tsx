"use client";

import { useState, useEffect } from "react";
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
import { LayoutGrid, Plus, EllipsisVertical, Gem, ChevronDown, BookOpen, Pencil, Trash2, FileClock  } from "lucide-react";
import Image from "next/image";
import {
  useSidebarStore,
  sidebarMenuItems,
} from "@/lib/constants";
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
import { ModelSelectionModal, PlansModal } from "../ui/modals";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useHistoryStore } from "@/lib/constants";
import { Input } from "@/components/ui/input";


export function Sidebar() {
  const { isOpen, setCurrentPage, toggle } = useSidebarStore();
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const { history, removeHistory: removeItem, renameHistory: renameItem, getHistoryByType } = useHistoryStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const [modelSelectionModalOpen, setModelSelectionModalOpen] = useState(false);
  const [plansModalOpen, setPlansModalOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(true);

  useEffect(() => {
    if (isMobile && isOpen) {
      toggle();
    }
  }, [isMobile]);

  const handleNewChat = () => {
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

  // Get filtered history based on current page
  const currentType = getCurrentType();
  const currentHistory = getHistoryByType(currentType);

  return (
    <>
      {/* Backdrop overlay for mobile when sidebar is open */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
          onClick={toggle}
        />
      )}
      
      <div
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
                  className="flex-1"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  NEW CHAT
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setModelSelectionModalOpen(true)}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-4 px-2 space-y-1">
                {sidebarMenuItems.map((item, i) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`w-full flex items-center justify-start h-8 text-sm rounded-md px-2 hover:bg-secondary/80 ${
                      isActiveRoute(item.href, pathname) ? "bg-secondary" : ""
                    }`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                    {/* {item.beta && (
                      <span className="ml-2 text-[0.6rem] bg-primary/10 px-0.5 py-0.2 rounded">
                        Soon
                      </span>
                    )} */}
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <div className="space-y-2 mb-8">
                <Button
                    onClick={handleNewChat}
                    variant="outline"
                    className="flex-1"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setModelSelectionModalOpen(true)}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
              {sidebarMenuItems.map((item, i) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`w-full flex items-center justify-center h-8 text-sm rounded-md px-2 hover:bg-secondary/80 ${
                    isActiveRoute(item.href, pathname) ? "bg-secondary" : ""
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {isOpen ? (
          <>
            <div className="px-4 mt-5">
              <div className="text-xs font-medium text-muted-foreground mb-2">
                {currentType.toUpperCase()} HISTORY
              </div>
              <ScrollArea className="flex-1 h-[calc(100vh-40rem)]">
                <div className="space-y-0.5">
                  {currentHistory.map((item) => (
                    <ContextMenu key={item.id}>
                      <ContextMenuTrigger>
                        <div className="group relative flex items-center px-2 py-1.5 hover:bg-secondary/80 rounded-md">
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
                                        {item.title.length > 29
                                          ? `${item.title.substring(0, 29)}`
                                          : item.title}
                                        <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-r from-transparent to-sideBarBackground group-hover:to-secondary/80" />
                                      </div>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="top"
                                    className="max-w-[300px] break-words"
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
                <CollapsibleContent className="space-y-2 mt-2">
                  <Link href={`/model-glossary`} legacyBehavior>
                    <a target="_blank" rel="noopener noreferrer" className=" flex gap-2 items-center px-2 py-1.5 text-sm hover:bg-secondary/80 rounded-md cursor-pointer">
                      <BookOpen className="w-4 h-4 ml-4"/> Model Glossary
                    </a>
                  </Link>
                  <Link href={`/changelog`} className={`flex gap-2 items-center px-2 py-1.5 text-sm hover:bg-secondary/80 rounded-md cursor-pointer ${isActiveRoute('/changelog', pathname) ? "bg-secondary font-medium" : ""}`}>
                      <FileClock  className="w-4 h-4 ml-4"/> Changelog
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
                    <div className="font-medium">Pascal</div>
                    <Badge variant="default">Free</Badge>
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
      </div>
      <ModelSelectionModal
        isOpen={modelSelectionModalOpen}
        onClose={() => setModelSelectionModalOpen(false)}
      />
      <PlansModal
        isOpen={plansModalOpen}
        onClose={() => setPlansModalOpen(false)}
      />
    </>
  );
}
