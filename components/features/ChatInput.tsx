"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import { ArrowUp, Paperclip, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "../ui/textarea";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
  isLoading: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  inputRef,
  isLoading,
}: ChatInputProps) {
  const [textIndex, setTextIndex] = useState(0);
  const texts = [
    "Your all-in-one AI Platform",
    "Alle-AI: Combine and compare AI models",
    "Alle-AI: Explore innovative AI solutions",
  ];
  const pathname = usePathname();
  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((current) => (current + 1) % texts.length);
    }, 5000); // Change text every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const isInputEmpty = value.trim() === "";

  return (
    <div className={` p-2 bg-background/95 backdrop-blur transition-all duration-300`}>
      <div className="max-w-xl md:max-w-3xl mx-auto flex items-end gap-1 border-2 rounded-2xl p-2">
        <Button variant="ghost" size="icon" className="flex-shrink-0">
          <Paperclip className="h-4 w-4" />
        </Button>
        <Textarea 
          ref={inputRef}
          placeholder="Message multiple models..."
          className="flex-1 bg-transparent border-0 outline-none text-base resize-none overflow-auto min-h-[2rem] max-h-[10rem] p-0 focus:border-0 focus:ring-0"
          value={value}
          onChange={(e) => {
            e.target.style.height = 'inherit';
            e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
            onChange(e.target.value);
          }}
          onKeyDown={(e) => e.key === "Enter" && !isInputEmpty && onSend()}
          rows={1}
          style={{
            overflow: value.split('\n').length > 4 ? 'auto' : 'hidden',
            scrollbarWidth: 'none',
          }}
        />
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 rounded-full h-9 w-9"
        >
          <Mic className="h-4 w-4" />
        </Button>
        {/* conditional rendering */}
        {pathname === "/" || pathname.startsWith("/chat") ? (
          <Button
            onClick={onSend}
            size="icon"
            className={`flex-shrink-0 rounded-full h-8 w-8 ${
              isInputEmpty
                ? "bg-gray-300 text-gray-500 hover:bg-gray-300"
                : "bg-bodyColor hover:bg-opacity-70 transition-all duration-200"
            }`}
            disabled={isInputEmpty}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={onSend}
            className={`flex-shrink-0 rounded-md select-none ${
              isInputEmpty
                ? "bg-gray-300 text-gray-500 hover:bg-gray-300"
                : "bg-bodyColor hover:bg-opacity-70 transition-all duration-200"
            }`}
            disabled={isInputEmpty || isLoading }
          >
            Generate
          </Button>
        )}
      </div>
      {/* conditional rendering */}
      {pathname === "/" || pathname.startsWith("/chat") ? (
        <div className="h-6 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={textIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-center text-[0.6rem] sm:text-xs mt-2 absolute w-full"
            >
              {texts[textIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
