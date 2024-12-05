"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Edit, Check, X } from "lucide-react";

interface ChatMessageProps {
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  onEditMessage?: (newContent: string) => void;
}

export function ChatMessage({
  content,
  sender,
  timestamp,
  onEditMessage,
}: ChatMessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (onEditMessage) {
      onEditMessage(editedContent);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedContent(content);
    setIsEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="flex-1 relative">
        <Card className="flex items-center gap-3 p-3 rounded-2xl bg-backgroundSecondary">
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={
                sender === "user"
                  ? "/user.jpg"
                  : "https://avatars.githubusercontent.com/u/2?v=4"
              }
              alt={sender}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>

          {isEditing ? (
            <div className="flex-1 flex items-center gap-2">
              <input
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="flex-1 p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Edit message..."
              />
              <div className="flex items-center gap-1">
                <button
                  onClick={handleSaveEdit}
                  className="text-green-500 hover:bg-green-100 p-1 rounded-full transition-colors"
                >
                  <Check size={20} />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="text-red-500 hover:bg-red-100 p-1 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center">
              <p className="text-sm flex-1 pr-2">{content}</p>
              <button
                onClick={handleEditClick}
                className="text-gray-500 hover:bg-gray-100 p-1 rounded-full transition-colors"
                aria-label="Edit message"
              >
                <Edit size={16} />
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
