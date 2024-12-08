'use client';

import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import Image from 'next/image';
import { Edit, Check, X } from "lucide-react";

interface ChatMessageProps {
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  onEditMessage?: (newContent: string) => void;
}

export function ChatMessage({ content, sender, timestamp, onEditMessage }: ChatMessageProps) {

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
          <div className="hidden sm:flex w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={sender === 'user' 
            ? "/user.jpg"
            : "https://avatars.githubusercontent.com/u/2?v=4"}
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
                  className="w-full p-3 rounded-lg text-sm focus:outline-none bg-[#2C2C2C] resize-none min-h-[40px]"
                  placeholder="Edit message..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1 text-sm rounded-full hover:bg-gray-700 text-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 text-sm rounded-full bg-white text-black hover:bg-gray-200 transition-colors"
                >
                  Save
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