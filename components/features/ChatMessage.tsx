'use client';

import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import Image from 'next/image';
import { Pencil, Check, X } from "lucide-react";
import { useAuthStore } from "@/stores";

interface ChatMessageProps {
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  position: [number, number];
  onEditMessage?: (newContent: string, position: [number, number]) => void;
  totalBranches?: number;
  currentBranch?: number;
  onBranchChange?: (branchIndex: number) => void;
  branches?: any[]; // Add this prop
}

interface MessageTree {
  messageId: string;  // Unique ID for this message version
  parentId: string | null;  // ID of the parent message version (null for root)
  position: [number, number];
  branchId: string;  // Unique ID for this branch
}

export function ChatMessage({ 
  content, 
  sender, 
  timestamp, 
  position,
  onEditMessage,
  totalBranches = 1,
  currentBranch = 0,
  onBranchChange,
  branches = []
}: ChatMessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuthStore();

  const [x, y] = position;
  
  // Generate a unique ID for this message if it doesn't exist
  const messageId = `msg-${y}-${x}`;
  const branchId = `branch-${y}-${x}`;

  // Find all versions in this message's branch chain
  const versionsOfThisMessage = branches
    .flatMap(branch => branch.messages)
    .filter(msg => {
      // For all messages at this Y level
      if (msg.position[1] !== y || msg.sender !== sender) return false;
      
      // Include the original message
      if (msg.position[0] === 0) return true;
      
      // Find the branch path from root to current message
      const branchPath = findBranchPath(branches, position);
      
      // Include messages only if they're in the same branch path
      return branchPath.some(pathBranch => 
        pathBranch.messages.some((m: any) => 
          m.position[0] === msg.position[0] && 
          m.position[1] === msg.position[1]
        )
      );
    })
    .sort((a, b) => a.position[0] - b.position[0]);

  // Helper function to find the branch path from root to current message
  const findBranchPath = (branches: any[], pos: [number, number]): any[] => {
    const [x, y] = pos;
    const path: any[] = [];
    
    let currentPos: [number, number] = [x, y];
    while (currentPos[0] >= 0) {
      const branch = branches.find(b => 
        b.messages.some((m: any) => 
          m.position[0] === currentPos[0] && 
          m.position[1] === currentPos[1]
        )
      );
      
      if (branch) {
        path.unshift(branch);
        // Move to parent branch
        currentPos = branch.startPosition;
      } else {
        break;
      }
    }
    
    return path;
  };

  // Only show versioning if there are actual edits
  const shouldShowVersioning = versionsOfThisMessage.length > 1;

  // Current version is based on x position + 1
  const currentVersion = x + 1;
  
  // Total versions is the highest x value across ALL branches for this message + 1
  const totalVersions = shouldShowVersioning ? 
    Math.max(...branches
      .flatMap(b => b.messages)
      .filter(m => m.position[1] === y && m.sender === sender)
      .map(m => m.position[0])) + 1 : 
    1;

  const handleEditClick = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
  }, [isEditing]);

  const handleSaveEdit = () => {
    if (onEditMessage) {
      onEditMessage(editedContent, position);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedContent(content);
    setIsEditing(false);
  };

  const handleVersionChange = (direction: 'prev' | 'next') => {
    if (!shouldShowVersioning) return;

    const currentIndex = currentVersion - 1;
    const targetIndex = direction === 'next' 
      ? currentIndex + 1 
      : currentIndex - 1;

    if (targetIndex >= 0 && targetIndex < totalVersions) {
      // Find the branch path for the target version
      const targetMessage = versionsOfThisMessage[targetIndex];
      const branchPath = findBranchPath(branches, [targetIndex, y]);
      
      // Find the branch that contains this version and its sub-branches
      const targetBranch = branches.findIndex(branch => 
        branchPath.includes(branch)
      );

      if (targetBranch !== -1) {
        onBranchChange?.(targetBranch);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="flex-1 relative">
        <Card className="flex items-start gap-3 p-3 rounded-2xl bg-backgroundSecondary">
          <div className="hidden sm:flex w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={user?.photo_url || '/user.jpg'}
              alt={sender}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
          {isEditing ? (
            <div className="flex-1 flex flex-col gap-2">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full p-1 bg-backgroundSecondary rounded-lg text-sm focus:outline-none bg-[#2C2C2C] resize-none min-h-[40px]"
                  placeholder="Edit message..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1 text-sm rounded-full bg-black text-white dark:bg-white dark:text-black hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 text-sm rounded-full bg-white text-black dark:bg-black dark:text-white hover:bg-gray-700 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-start">
              <div className="flex-1 pr-2">
                <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
              </div>
              <button
                onClick={handleEditClick}
                className="text-muted-foreground hover:bg-gray-100 p-1 rounded-full transition-colors flex-shrink-0"
                aria-label="Edit message"
              >
                <Pencil size={16} />
              </button>
            </div>
          )}
        </Card>

        {shouldShowVersioning && (
          <div className="mt-2 flex justify-end items-center gap-1 text-xs text-muted-foreground">
            <button
              onClick={() => handleVersionChange('prev')}
              disabled={currentVersion <= 1}
              className="px-2 py-1 rounded-md hover:bg-backgroundSecondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {"<"}
            </button>
            <span className="px-1">
              {`${currentVersion}/${totalVersions}`}
            </span>
            <button
              onClick={() => handleVersionChange('next')}
              disabled={currentVersion >= totalVersions}
              className="px-2 py-1 rounded-md hover:bg-backgroundSecondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {">"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}