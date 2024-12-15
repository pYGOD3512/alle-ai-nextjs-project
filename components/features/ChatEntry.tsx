import React, { useState, useEffect } from "react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuItem,
  ContextMenuContent,
} from "@/components/ui/context-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, EllipsisVertical } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useHistoryStore } from "@/lib/constants";
interface Chat {
  id: string;
  title: string;
  animate?: boolean;
  createdAt?: string;
  type?: string;
}

interface EntryProps {
  chat: Chat;
}

export default function ChatEntry({ chat }: EntryProps) {
  const [displayText, setDisplayText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(chat.title);
  const MAX_LENGTH = 30;
  const pathname = usePathname();
  const router = useRouter();
  const {removeAnimate} = useHistoryStore()
  // typing animation effect
  useEffect(() => {
    if (chat.animate) {
      let currentIndex = 0;
      const timer = setInterval(() => {
        if (currentIndex <= Math.min(chat.title.length, MAX_LENGTH)) {
          setDisplayText(
            chat.title.slice(0, currentIndex) +
              (currentIndex >= MAX_LENGTH ? "..." : "")
          );
          currentIndex++;
        } else {
          clearInterval(timer);
          removeAnimate()
        }
      }, 50);

      return () => clearInterval(timer);
    } else {
      // Trunc
      setDisplayText(
        chat.title.length > MAX_LENGTH
          ? `${chat.title.substring(0, MAX_LENGTH)}...`
          : chat.title
      );
    }
  }, [chat.title, chat.animate]);


  // Rename handler
  const handleRename = async () => {
    if (!editingTitle.trim()) {
      // toast.error("Chat name cannot be empty");
      return;
    }

    try {
      // actual backend implementations here

      // Simulated
      const updatedChat = {
        ...chat,
        title: editingTitle.trim(),
      };

      setDisplayText(updatedChat.title);
      setIsEditing(false);

      // toast.success("Chat renamed successfully");
    } catch (error) {
      //
      return;
    }
  };

  // Delete
  const handleDelete = async () => {
    try {
      // sync with backend later
    } catch (error) {
      return;
    }
  };
  const handleChatItemClicked = async () => {
    // a function to fetch the chat section using id
    // use id to trigger dynamic route
    // pass the entire chat section
    // render at appropriate route
  };
  return (
    <ContextMenu>
      <ContextMenuTrigger onClick={handleChatItemClicked}>
        <div className="group relative flex items-center px-2 py-1.5 hover:bg-secondary/80 rounded-md">
          {isEditing ? (
            <Input
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
                if (e.key === "Escape") setIsEditing(false);
              }}
              autoFocus
              className="h-6 text-xs"
            />
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative text-xs text-left cursor-pointer">
                    <div className="whitespace-nowrap overflow-hidden">
                      {displayText}
                      <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-r from-transparent to-sideBarBackground group-hover:to-secondary/80" />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="max-w-[200px] text-xs break-words"
                >
                  {chat.title}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Rename</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
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
        <ContextMenuItem onClick={() => setIsEditing(true)}>
          <Pencil className="mr-2 h-4 w-4" />
          <span>Rename</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={handleDelete} className="text-red-500">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
