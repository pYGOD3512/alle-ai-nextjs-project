'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowUp ,
  Paperclip,
  Mic
} from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export function ChatInput({ value, onChange, onSend, inputRef }: ChatInputProps) {

  const isInputEmpty = value.trim() === '';

  return (
    <div className={` p-2 bg-background/95 backdrop-blur transition-all duration-300`}>
      <div className="max-w-3xl mx-auto flex items-center gap-1 border-2 rounded-2xl p-2">
        <Button variant="ghost" size="icon" className="flex-shrink-0">
          <Paperclip className="h-4 w-4" />
        </Button>
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Message multiple models..."
          className="flex-1 border-none focus-visible:outline-none"
          onKeyPress={(e) => e.key === 'Enter' && !isInputEmpty && onSend()}
        />
        <Button variant="ghost" size="icon" className="flex-shrink-0 rounded-full h-9 w-9">
          <Mic className="h-4 w-4" />
        </Button>
        <Button
          onClick={onSend}
          size="icon"
          className={`flex-shrink-0 rounded-full h-8 w-8 ${
            isInputEmpty ? 'bg-gray-300 text-gray-500 hover:bg-gray-300' : 'bg-bodyColor hover:bg-opacity-70 transition-all duration-200'
          }`}
          disabled={isInputEmpty}
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-center text-xs mt-2">Your all-in-one AI Platform</p>
    </div>
  );
}