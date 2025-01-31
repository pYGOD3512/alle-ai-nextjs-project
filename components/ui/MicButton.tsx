import { Button } from "@/components/ui/button";
import { AudioLines , MicOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MicButtonProps {
  isListening: boolean;
  onClick: () => void;
  className?: string;
}

export function MicButton({ isListening, onClick, className }: MicButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">
            <Button
              variant="default"
              size="icon"
              className={`flex-shrink-0 rounded-full border-none h-8 w-8 focus-visible:outline-none transition-all duration-300 ${
                isListening 
                  ? 'bg-green-500/10 text-green-500 dark:bg-green-900/20' 
                  : ''
              } ${className}`}
              onClick={onClick}
            >
              {isListening ? (
                <>
                  <span className="absolute inset-0 rounded-full bg-green-500/20 animate-ping"></span>
                  <AudioLines  className="h-4 w-4 animate-pulse" />
                  <span className="absolute inset-0 rounded-full border-2 border-green-500 animate-pulse"></span>
                </>
              ) : (
                <AudioLines  className="h-4 w-4" />
              )}
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{isListening ? "Stop speaking" : "Start speaking"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}