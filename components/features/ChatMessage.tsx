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
    <div className="max-w-5xl mx-auto w-full">
      <div className="flex-1">
        <Card className="flex items-center gap-3 p-3 rounded-2xl bg-backgroundSecondary">
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
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
          <p className="text-sm">{content}</p>
        </Card>
      </div>
    </div>
  );
}