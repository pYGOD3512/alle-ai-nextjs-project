"use client";

import { useState, useEffect, forwardRef } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  LayoutGrid,
  Plus,
  Gem,
  ChevronDown,
  BookOpen,
  History,
  ChartLine,
} from "lucide-react";
import Image from "next/image";
import { useSidebarStore, sidebarMenuItems } from "@/lib/constants";

import {
  ModelSelectionModal,
  PlansModal,
  SearchHistoryModal,
} from "../ui/modals";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useHistoryStore } from "@/lib/constants";
import ChatHistory from "../features/ChatHistory";

export function Sidebar() {
  const { isOpen, setCurrentPage, toggle } = useSidebarStore();
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const {
    history,
    removeHistory: removeItem,
    renameHistory: renameItem,
    getHistoryByType,
  } = useHistoryStore();
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
  const getCurrentType = (): "chat" | "image" | "audio" | "video" => {
    if (pathname.startsWith("/image")) return "image";
    if (pathname.startsWith("/audio")) return "audio";
    if (pathname.startsWith("/video")) return "video";
    return "chat";
  };

  // Here we get the history of the various pages
  const currentType = getCurrentType();
  const currentHistory = getHistoryByType(currentType);

  const getPageStyle = (itemHref?: string, path?: string) => {
    if (!itemHref) {
      if (pathname === "/" || pathname.startsWith("/chat/res")) {
        return "bg-blue-50 text-blue-500 hover:bg-blue-50 hover:text-blue-500";
      }
      if (pathname === "/image" || pathname.startsWith("/image/res")) {
        return "bg-green-50 text-green-500 hover:bg-green-50 hover:text-green-500";
      }
      if (pathname === "/audio" || pathname.startsWith("/audio/res")) {
        return "bg-yellow-50 text-yellow-500 hover:bg-yellow-50 hover:text-yellow-500";
      }
      if (pathname === "/video" || pathname.startsWith("/video/res")) {
        return "bg-pink-50 text-pink-500 hover:bg-pink-50 hover:text-orange-500";
      }
      return "";
    }

    if (itemHref && path) {
      if (itemHref === "/") {
        if (path === "/" || path.startsWith("/chat/res")) {
          return "bg-blue-50 text-blue-500";
        }
      }
      if (itemHref === "/image") {
        if (path === "/image" || path.startsWith("/image/res")) {
          return "bg-green-50 text-green-500";
        }
      }
      if (itemHref === "/audio") {
        if (path === "/audio" || path.startsWith("/audio/res")) {
          return "bg-yellow-50 text-yellow-500";
        }
      }
      if (itemHref === "/video") {
        if (path === "/video" || path.startsWith("/video/res")) {
          return "bg-pink-50 text-pink-500";
        }
      }
      if (itemHref === "/changelog") {
        if (path.startsWith("/changelog")) return "bg-secondary font-medium";
      }
    }
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
          ${
            isMobile
              ? isOpen
                ? "translate-x-0"
                : "-translate-x-full"
              : "translate-x-0"
          }
          border-r bg-sideBarBackground flex flex-col`}
      >
        <div className="p-2">
          {isOpen ? (
            <>
              <div className="flex gap-2 px-2 ">
                <Button
                  onClick={handleNewChat}
                  variant="outline"
                  className={`flex-1 ${getPageStyle()}`}
                >
                  <Plus className="mr-2 h-4 w-4  " />
                  NEW {currentType.toUpperCase()}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={`${getPageStyle()}`}
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
                    className={`w-full flex items-center  justify-start h-8 text-sm rounded-md px-2  ${getPageStyle(
                      item.href,
                      pathname
                    )}`}
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
                  className={`flex-1 ${getPageStyle()}`}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className={`${getPageStyle()}`}
                  onClick={() => setModelSelectionModalOpen(true)}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
              {/* test color for opened */}
              {sidebarMenuItems.map((item, i) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`w-full flex items-center justify-center h-8 text-sm rounded-md px-2 hover:bg-secondary/80 ${getPageStyle(
                    item.href,
                    pathname
                  )}`}
                >
                  <item.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {isOpen ? (
          <>
            <ChatHistory
              currentHistory={currentHistory}
              currentType={currentType}
              historyModalOpen={() => setHistorySearchModalOpen(true)}
            />

            <div className="px-4 mt-8">
              <Collapsible open={isMoreOpen} onOpenChange={setIsMoreOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-md bg-backgroundSecondary text-xs font-medium text-muted-foreground hover:text-primary">
                  MORE
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isMoreOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 mt-1">
                  <Link href={`/model-glossary`} legacyBehavior>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className=" flex gap-2 items-center px-2 py-1.5 text-xs hover:bg-secondary/80 rounded-md cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4 ml-4" /> Model Glossary
                    </a>
                  </Link>
                  <Link
                    href={`https://all-ai-model-usage-tracker.vercel.app/`}
                    legacyBehavior
                  >
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className=" flex gap-2 items-center px-2 py-1.5 text-xs hover:bg-secondary/80 rounded-md cursor-pointer"
                    >
                      <ChartLine className="w-4 h-4 ml-4" /> Model Analytics
                    </a>
                  </Link>
                  <Link
                    href={`/changelog`}
                    className={`flex gap-2 items-center px-2 py-1.5 text-xs hover:bg-secondary/80 rounded-md cursor-pointer ${getPageStyle(
                      "/changelog",
                      pathname
                    )}`}
                  >
                    <History className="w-4 h-4 ml-4" /> Changelog
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
                    <Badge variant="default" className="text-[0.6rem] h-3">
                      Free
                    </Badge>
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
