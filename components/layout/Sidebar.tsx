"use client";

import { useState, useEffect, forwardRef, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
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
import { LayoutGrid, Plus, EllipsisVertical, Gem, ChevronDown, BookOpen, Pencil, Trash2, History, Search, ChartLine, MessageSquare, ImageIcon, Music, Video, Folder, Loader2 } from "lucide-react";
import Image from "next/image";
import {
  sidebarMenuItems,
} from "@/lib/constants";
import { useSidebarStore, useHistoryStore, useProjectStore, Project, useAuthStore, useWebSearchStore, useCombinedModeStore } from "@/stores";
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
import { ModelSelectionModal, PlansModal, ProjectModal, SearchHistoryModal } from "../ui/modals";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useConversationStore } from "@/stores/models";
import { historyApi } from "@/lib/api/history";
import { toast } from "sonner"




export function Sidebar() {
  const { isOpen, setCurrentPage, toggle, setCurrentConversationLink, setSectionId } = useSidebarStore();
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const { history, removeHistory: removeItem, renameHistory: renameItem, getHistoryByType, isLoading } = useHistoryStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const { projects, currentProject, setCurrentProject, removeProject } = useProjectStore();

  const [modelSelectionModalOpen, setModelSelectionModalOpen] = useState(false);
  const [plansModalOpen, setPlansModalOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [historySearchModalOpen, setHistorySearchModalOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const { user, plan } = useAuthStore();
  const { setGenerationType, conversationId, clearConversation } = useConversationStore();
  ;

  // Add confirmation dialog state
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [historyToDelete, setHistoryToDelete] = useState<string | null>(null);

  const [historyPage, setHistoryPage] = useState(1);
  const [hasMoreHistory, setHasMoreHistory] = useState(false);
  const historyScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMobile && isOpen) {
      toggle();
    }
  }, [isMobile]);

  const handleNewChat = () => {
    // Clear the conversation link when starting a new chat
    setCurrentConversationLink(null);
    clearConversation();

      // Reset web search and combined mode
      useWebSearchStore.getState().setIsWebSearch(false);
      useCombinedModeStore.getState().setIsCombinedMode(false);
    
    // other logics later
    switch (true) {
      case pathname.startsWith("/chat"):
        router.push("/chat");
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
        router.push("/chat");
    }
  };
  // active helper 
 const isActiveRoute = (itemHref: string, pathname: string): boolean => {
   // Exact match for specific routes
   if (itemHref === "/chat")
     return pathname === "/chat" || pathname.startsWith("/chat/res");
   if (itemHref === "/image")
     return pathname === "/image" || pathname.startsWith("/image/res");
   if (itemHref === "/changelog")
     return pathname === "/changelog" || pathname.startsWith("/changelog");

   return false;
 };

 const isHistoryItemActive = (itemSession: string): boolean => {
  return pathname.includes(`/res/${itemSession}`);
};
 
  const handleRename = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditingTitle(currentTitle);
  };

  const handleRenameSubmit = async (id: string) => {
    if (editingTitle.trim()) {
      try {
        const response = await historyApi.renameConversation(id, editingTitle.trim());
        // // console.log('Rename response:', response);
        if (response.status && response.title) {
          setEditingTitle(response.title);
          renameItem(id, editingTitle.trim());
        }
      } catch (error) {
        // console.error('Error renaming conversation:', error);
      }
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
          darkBgColor: 'bg-purple-500/10',
          hoverBg: 'hover:bg-purple-500/20',
          iconColor: 'text-purple-500'
        };
      case 'audio':
        return {
          bgColor: 'bg-blue-500/10',
          darkBgColor: 'bg-blue-500/10',
          hoverBg: 'hover:bg-blue-500/20',
          iconColor: 'text-blue-500'
        };
      case 'video':
        return {
          bgColor: 'bg-yellow-500/10',
          darkBgColor: 'bg-yellow-500/10',
          hoverBg: 'hover:bg-yellow-500/20',
          iconColor: 'text-yellow-500'
        };
      default:
        return {
          bgColor: 'bg-green-500/20',
          darkBgColor: 'bg-green-500/10',
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
        return Plus;
    }
  };

  const CurrentIcon = getCurrentSectionIcon();

  // Modify the handleHistoryItemClick function
  const handleHistoryItemClick = (item: string) => {
    // Clear the conversation link when switching to a different conversation
    setCurrentConversationLink(null);
    
    // Set the current section ID based on the type
    setSectionId(`${currentType}Id`, item);
  };

  // Add this helper function for projects
  const handleProjectClick = (project: Project) => {
    setCurrentProject(project);
    router.replace(`/project/${project.slug}`);
  };

  // Handle project deletion
  const handleDeleteProject = (projectId: string) => {
    removeProject(projectId);
    setProjectToDelete(null);
    
    // If we're deleting the current project, redirect to home
    if (currentProject?.id === projectId) {
      router.push('/');
    }
  };

  const handleDeleteHistory = async (sessionId: string) => {
    // // console.log('Deleting history for conversationjj:', sessionId);
    try {
      const response = await historyApi.deleteHistory(sessionId);
      // // console.log('Delete history response:', response);
      if (response.status) {
        if(sessionId === conversationId){
          router.replace(`/${currentType}`);
        }
        removeItem(sessionId);
      }
    } catch (error) {
      // console.error('Error deleting history item:', error);
    }
    setHistoryToDelete(null);
  };

  // Add this function to handle scroll events
  const handleHistoryScroll = useCallback(() => {
    if (!historyScrollRef.current || !hasMoreHistory || isLoading) return;
    
    const { scrollTop, scrollHeight, clientHeight } = historyScrollRef.current;
    
    // Check if scrolled to bottom (with a small threshold)
    if (scrollHeight - scrollTop - clientHeight < 20) {
      // Load more history
      const nextPage = historyPage + 1;
      setHistoryPage(nextPage);
      
      // Fetch more history items
      historyApi.getHistory(currentType, nextPage)
        .then((response) => {
          if (response.data.length > 0) {
            // Add new items to history
            const { addHistoryItems } = useHistoryStore.getState();
            addHistoryItems(response.data);
          }
          // Update if there are more items to load
          setHasMoreHistory(response.data.length > 0);
        })
        .catch((error) => {
          // console.error('Error loading more history:', error);
        });
    }
  }, [historyPage, hasMoreHistory, isLoading, currentType]);

  // Add effect to attach scroll listener
  useEffect(() => {
    const scrollContainer = historyScrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleHistoryScroll);
      return () => {
        scrollContainer.removeEventListener('scroll', handleHistoryScroll);
      };
    }
  }, [handleHistoryScroll]);

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
        {isOpen ? (
          <>
            {/* Top section with fixed content */}
            <div className="p-2 flex-shrink-0">
              <div className="flex gap-2 px-2">
                <Button
                  onClick={()=>{
                    handleNewChat();
                    (isMobile && isOpen) ? toggle() : '';
                  }}
                  variant="outline"
                  className={`flex-1 ${getSectionStyles(currentType).bgColor} ${getSectionStyles(currentType).iconColor} dark:${getSectionStyles(currentType).darkBgColor}`}
                >
                  <Plus className={`mr-2 h-4 w-4 ${getSectionStyles(currentType).iconColor} ${getSectionStyles(currentType).iconColor}`} />
                  NEW {currentType.toUpperCase()}
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className={`${getSectionStyles(currentType).bgColor} ${getSectionStyles(currentType).iconColor} dark:${getSectionStyles(currentType).darkBgColor}`}
                        onClick={() => {
                          (isMobile && isOpen) ? toggle() : '';
                          setModelSelectionModalOpen(true)
                        }}
                        aria-label="Model Selection"
                        id="tooltip-select-selector"
                      >
                        <LayoutGrid className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Select models</p>
                    </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              </div>

              <div className="mt-4 px-2 space-y-1" id="tooltip-select-ais">
                {sidebarMenuItems.map((item, i) => {
                  const isActive = isActiveRoute(item.href, pathname);
                  const type = item.href === "/chat" ? "chat" 
                    : item.href === "/image" ? "image"
                    : item.href === "/audio" ? "audio"
                    : "video";
                  const styles = getSectionStyles(type);
                  
                  // Wrap the Link in a conditional
                  const content = (
                    <div
                      className={`w-full flex items-center justify-start h-8 text-sm rounded-md px-2 
                        ${isActive ? `${styles.bgColor} ${styles.iconColor}` : ""}
                        ${item.href === "/audio" || item.href === "/video" ? "text-muted-foreground" : ""}
                        ${styles.hoverBg} cursor-pointer`}
                      onClick={() => {
                        (isMobile && isOpen) ? toggle() : '';
                        if (item.href === "/audio" || item.href === "/video") {
                          toast.info('This feature will be available soon');
                        }
                      }}
                    >
                      <item.icon className={`mr-2 h-4 w-4 ${isActive ? styles.iconColor : ""}`} />
                      {item.label}
                    </div>
                  );

                  return item.href === "/audio" || item.href === "/video" ? (
                    <div key={item.label}>{content}</div>
                  ) : (
                    <Link key={item.label} href={item.href}>
                      {content}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Scrollable content area */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* <NEW BUILD> */}
              
              {/* Projects Section */}
              {(pathname.includes('chat') || pathname.includes('project')) && (
                
                <>
                  <div className="flex-shrink-0 px-2">
                    <div className="flex justify-between items-center mx-2 text-xs font-medium text-muted-foreground mb-2">
                      <Button
                        variant="ghost"
                        className="w-full p-0 gap-2 border-none justify-start px-2"
                        onClick={() => {
                          // setProjectModalOpen(true);
                          (isMobile && isOpen) ? toggle() : '';
                          toast.info('This feature will be available soon');
                        }}
                        aria-label="New Project"
                      >
                        <Folder  className="w-4 h-4"/>
                        New project
                      </Button>
                    </div>
                  </div>


                  {/* Scrollable projects list */}
                  <ScrollArea className="flex-shrink-0 max-h-[30vh]">
                    <div className="px-4 space-y-0.5">
                      {projects.length > 0 ? (
                        projects.map((project) => (
                          <ContextMenu key={project.id}>
                            <ContextMenuTrigger>
                              <div 
                                className={`group relative flex items-center px-2 py-1.5 hover:bg-secondary/80 rounded-md cursor-pointer ${
                                  currentProject?.id === project.id && pathname.startsWith('/project/') ? 'bg-secondary' : ''
                                }`}
                                onClick={() => handleProjectClick(project)}
                              >
                                <Folder className="mr-2 h-4 w-4 text-muted-foreground" />
                                <span className="text-sm truncate">{project.name}</span>
                              </div>
                            </ContextMenuTrigger>
                            <ContextMenuContent>
                              <ContextMenuItem onClick={() => {
                                // TODO: Implement rename project
                              }}>
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>Rename</span>
                              </ContextMenuItem>
                              <ContextMenuItem 
                                onClick={() => {
                                  setProjectToDelete(project.id);
                                }}
                                className="text-red-500 focus:text-red-500"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                              </ContextMenuItem>
                            </ContextMenuContent>
                          </ContextMenu>
                        ))
                      ) : (
                        // <div className="flex flex-col items-center justify-center py-2 text-muted-foreground">
                        //   <span className="text-xs">No projects</span>
                        // </div>
                        ''
                      )}
                    </div>
                  </ScrollArea>
                </>
              )}

              {/* </ NEW BUILD> */}


              {/* History Section */}
              <div className="flex-shrink-0 px-4 mt-4">
                <div className="flex justify-between items-center mx-2 text-xs font-medium text-muted-foreground mb-2">
                  {currentType.toUpperCase()} HISTORY
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-0 h-8 w-8"
                    onClick={() => {
                      setHistorySearchModalOpen(true);
                      (isMobile && isOpen) ? toggle() : '';
                    }}
                    aria-label="Search History"
                  >
                    <Search className="w-4 h-4"/>
                  </Button>
                </div>
              </div>

              {/* Scrollable history list */}
              <ScrollArea 
                className="flex-1" 
                scrollHideDelay={0}
                ref={historyScrollRef}
              >
                <div className="px-4 space-y-0.5">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-4 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : currentHistory.length > 0 ? (
                    currentHistory.map((item) => (
                      <ContextMenu key={item.session}>
                        <ContextMenuTrigger>
                          <div
                            className={`group flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer ${
                              editingId === item.session ? "bg-secondary" 
                              : isHistoryItemActive(item.session)
                              ? "bg-backgroundSecondary"
                              : "hover:bg-secondary/80"
                            }`}
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {editingId === item.session ? (
                                <Input
                                  value={editingTitle}
                                  onChange={(e) => setEditingTitle(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      handleRenameSubmit(item.session);
                                    }
                                  }}
                                  onBlur={() => handleRenameSubmit(item.session)}
                                  autoFocus
                                  className="h-6 text-xs"
                                />
                              ) : (
                                <div 
                                onClick={() => {
                                  setGenerationType('load');
                                  router.replace(`/${currentType}/res/${item.session}`);
                                  handleHistoryItemClick(item.session);
                                  (isMobile && isOpen) ? toggle() : '';
                                }}
                                
                                className="relative flex-1 min-w-0">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="relative text-xs text-left cursor-pointer">
                                        <div className="whitespace-nowrap overflow-hidden">
                                          {item.title.length > 30
                                            ? `${item.title.substring(0, 30)}`
                                            : item.title}
                                          <div className={`absolute right-0 top-0 h-full w-12 bg-gradient-to-r from-transparent ${isHistoryItemActive(item.session) ? 'to-backgroundSecondary group-hover:to-backgroundSecondary/10' : 'to-sideBarBackground group-hover:to-secondary/80'}`} />
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
                            </div>
                            <div className="absolute right-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 p-0 border-none opacity-0 group-hover:opacity-100 outline-none bg-transparent hover:bg-transparent"
                                    aria-label="More Actions"
                                  >
                                    <EllipsisVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[160px]">
                                  <DropdownMenuItem onClick={() => handleRename(item.session, item.title)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    <span>Rename</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      setHistoryToDelete(item.session);
                                    }}
                                    className="text-red-500 focus:text-red-500"
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
                          <ContextMenuItem onClick={() => handleRename(item.session, item.title)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Rename</span>
                          </ContextMenuItem>
                          <ContextMenuItem 
                            onClick={() => {
                              setHistoryToDelete(item.session);
                            }}
                            className="text-red-500 focus:text-red-500"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4 text-muted-foreground">
                      <span className="text-xs">No history available</span>
                    </div>
                  )}
                  
                  {/* Add loading indicator at the bottom when loading more */}
                  {hasMoreHistory && !isLoading && currentHistory.length > 0 && (
                    <div className="flex justify-center py-2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* More section */}
              <div className="flex-shrink-0 px-4 my-8">
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
                    {/* <Link href={`/changelog`} className={`flex gap-2 items-center px-2 py-1.5 text-xs hover:bg-secondary/80 rounded-md cursor-pointer ${isActiveRoute('/changelog', pathname) ? "bg-secondary font-medium" : ""}`}>
                        <History  className="w-4 h-4 ml-4"/> Changelog
                    </Link> */}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>

            {/* User section at bottom */}
            <div className="flex-shrink-0 p-4 mt-auto">
              <div className="flex items-center gap-3 mb-4 rounded-full">
                <Image
                  src={user?.photo_url || "/user.jpg"}
                  alt="User"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-sm">{user?.first_name}</div>
                    <Badge variant="default" className="text-[0.6rem] h-3">{plan?.split('-')[0] || "Plan"}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user?.email}
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="gap-1 w-full text-xs relative overflow-hidden group border-none dark:bg-white dark:text-black bg-black text-white"
                onClick={() => setPlansModalOpen(true)}
              >
                <Gem className="h-4 w-4" />
                UPGRADE
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-2 px-2">
            <div className="flex flex-col space-y-2 mb-8">
              <Button
                onClick={handleNewChat}
                variant="outline"
                className={`flex-1 ${getSectionStyles(currentType).bgColor} ${getSectionStyles(currentType).hoverBg} dark:${getSectionStyles(currentType).darkBgColor}`}
              >
                <CurrentIcon className={`h-4 w-4 ${getSectionStyles(currentType).iconColor}`} />
              </Button>
              <Button
                variant="outline"
                className={`flex-1 ${getSectionStyles(currentType).bgColor} ${getSectionStyles(currentType).iconColor} dark:${getSectionStyles(currentType).darkBgColor}`}
                onClick={() => setModelSelectionModalOpen(true)}
                id="tooltip-select-selector"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
            {sidebarMenuItems.map((item, i) => {
              const isActive = isActiveRoute(item.href, pathname);
              const type = item.href === "/chat" ? "chat" 
                : item.href === "/image" ? "image"
                : item.href === "/audio" ? "audio"
                : "video";
              const styles = getSectionStyles(type);
              
              // Wrap the Link in a conditional
              const content = (
                <div
                  className={`w-full flex items-center justify-center h-8 text-sm rounded-md px-2
                    ${isActive ? `${styles.bgColor} ${styles.iconColor}` : ""}
                    ${item.href === "/audio" || item.href === "/video" ? "text-muted-foreground" : ""}
                    ${styles.hoverBg} cursor-pointer`}
                  onClick={() => {
                    if (item.href === "/audio" || item.href === "/video") {
                      toast.info('This feature will be available soon');
                    }
                  }}
                >
                  <item.icon className={`h-4 w-4 ${isActive ? styles.iconColor : ""}`} />
                </div>
              );

              return item.href === "/audio" || item.href === "/video" ? (
                <div key={item.label}>{content}</div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                >
                  {content}
                </Link>
              );
            })}

            <Button
              variant="ghost"
              size="icon"
              className="w-full"
              onClick={() => {
                toast.info('This feature will be available soon');
                // setProjectModalOpen(true)}
              }}
            >
              <Folder className="h-4 w-4 text-muted-foreground" />
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
      <ProjectModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
      />

      {/* Add confirmation dialog */}
      <AlertDialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => projectToDelete && handleDeleteProject(projectToDelete)}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert dialog for deleting history */}
      <AlertDialog open={!!historyToDelete} onOpenChange={() => setHistoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete History Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this history item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => historyToDelete && handleDeleteHistory(historyToDelete)}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
