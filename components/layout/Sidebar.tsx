"use client";
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
import { LayoutGrid, Plus, EllipsisVertical, Gem } from "lucide-react";
import Image from "next/image";
import {
  useSidebarStore,
  sidebarMenuItems,
  chatHistory,
  dropdownMenuItems,
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
import { useState } from "react";

export function Sidebar() {
  const { isOpen, setCurrentPage } = useSidebarStore();
  const pathname = usePathname();
  const router = useRouter();

  const [modelSelectionModalOpen, setModelSelectionModalOpen] = useState(false);
  const [plansModalOpen, setPlansModalOpen] = useState(false);

  const handleNewChat = () => {
    // other logics later

    router.push("/");
  };
  return (
    <>
      <div
        className={`fixed left-0 top-0 z-40 mt-14 h-screen transition-all duration-300 ${
          isOpen ? "w-60" : "w-16"
        } border-r bg-sideBarBackground`}
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
              {sidebarMenuItems.map((item, i) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`w-full flex items-center justify-start h-8 text-sm rounded-md px-2 hover:bg-secondary/80 ${
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
                CHAT HISTORY
              </div>
              <ScrollArea className="h-[16rem]">
                <div className="space-y-0.5">
                  {chatHistory.map((chat, i) => (
                    <ContextMenu key={i}>
                      <ContextMenuTrigger>
                        <div className="group relative flex items-center px-2 py-1.5 hover:bg-secondary/80 rounded-md">
                          <div className="relative flex-1 min-w-0">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="relative text-sm text-left cursor-pointer">
                                    <div className="whitespace-nowrap overflow-hidden">
                                      {chat.length > 26
                                        ? `${chat.substring(0, 26)}`
                                        : chat}
                                      <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-r from-transparent to-sideBarBackground group-hover:to-secondary/80" />
                                    </div>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="top"
                                  className="max-w-[300px] break-words"
                                >
                                  {chat}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>

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
                              <DropdownMenuContent
                                align="end"
                                className="w-[160px]"
                              >
                                {dropdownMenuItems.historyDropdownMenuItems.map(
                                  (item, i) => (
                                    <DropdownMenuItem
                                      key={i}
                                      className={item.className}
                                    >
                                      <item.icon className="mr-2 h-4 w-4" />
                                      <span>{item.label}</span>
                                    </DropdownMenuItem>
                                  )
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        {dropdownMenuItems.historyDropdownMenuItems.map(
                          (item, i) => (
                            <ContextMenuItem key={i} className={item.className}>
                              <item.icon className="mr-2 h-4 w-4" />
                              <span>{item.label}</span>
                            </ContextMenuItem>
                          )
                        )}
                      </ContextMenuContent>
                    </ContextMenu>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="absolute bottom-12 left-0 right-0 p-4 rounded-md m-2 cursor-pointer hover:bg-background transition-all duration-200">
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
          <div className="absolute bottom-16 left-0 right-0 rounded-md m-2 cursor-pointer hover:bg-background transition-all duration-200">
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
