'use client';

import { Card } from "@/components/ui/card";
import Image from 'next/image';

interface ChatMessageProps {
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export function ChatMessage({ content, sender, timestamp }: ChatMessageProps) {
  return (
    <div className="flex items-center gap-3 max-w-5xl mx-auto w-full">
      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
        <Image
          src={sender === 'user' 
            ? "https://avatars.githubusercontent.com/u/1?v=4"
            : "https://avatars.githubusercontent.com/u/2?v=4"}
          alt={sender}
          width={32}
          height={32}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        <Card className="p-4 bg-card">
          <p className="text-sm">{content}</p>
        </Card>
      </div>
    </div>
  );
}