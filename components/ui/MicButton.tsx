import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

interface MicButtonProps {
    isListening: boolean;
    onClick: () => void;
    className?: string;
  }
  
  export function MicButton({ isListening, onClick, className }: MicButtonProps) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={`flex-shrink-0 rounded-full h-9 w-9 focus-visible:outline-none ${
          isListening ? 'bg-red-100 text-red-500 dark:bg-red-900/20' : ''
        } ${className}`}
        onClick={onClick}
      >
        {isListening ? (
          <MicOff className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>
    );
  }