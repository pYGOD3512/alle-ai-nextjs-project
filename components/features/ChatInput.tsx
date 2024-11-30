'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Send,
  Paperclip,
  Mic
} from 'lucide-react';
import { useSidebarStore } from '@/lib/constants';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export function ChatInput({ value, onChange, onSend }: ChatInputProps) {
  const { isOpen } = useSidebarStore();

  return (
    <div className={`border-t p-4 bg-background/95 backdrop-blur transition-all duration-300 ${
      isOpen ? 'pl-60' : 'pl-16'
    }`}>
      <div className="max-w-3xl mx-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="flex-shrink-0">
          <Paperclip className="h-4 w-4" />
        </Button>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Message multiple models..."
          className="flex-1"
          onKeyPress={(e) => e.key === 'Enter' && onSend()}
        />
        <Button variant="ghost" size="icon" className="flex-shrink-0">
          <Mic className="h-4 w-4" />
        </Button>
        <Button onClick={onSend} size="icon" className="flex-shrink-0">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}