'use client';

import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { 
  Settings, 
  Sun, 
  HelpCircle, 
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useSidebarStore } from '@/lib/stores/sidebar-store';

const models = [
  'GPT-4o',
  'Llama 3 70B Instruct',
  'Gemini 1.5 Pro',
  'Claude 3.5 Sonnet',
  'ChatGPT'
];

export function Header() {
  const { isOpen, toggle } = useSidebarStore();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center gap-4">
          <span className="font-semibold">alle-ai</span>
          <Button variant="ghost" size="icon" className="ml-2" onClick={toggle}>
            {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex items-center gap-2 ml-8">
          {models.map((model, index) => (
            <span key={index} className="text-xs border border-muted-foreground rounded-md px-2 py-1 text-muted-foreground">
              {model}
            </span>
          ))}
        </div>
        
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Sun className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}