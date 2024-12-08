"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import AnimatedGenerateButton from "./image/GenerateButton";
import { ArrowUp, Paperclip, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
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
    <div
      className={` p-2 bg-background/95 backdrop-blur transition-all duration-300`}
    >
      <div className="max-w-3xl mx-auto flex justify-center items-end gap-1 border-2 rounded-2xl p-2">
        <Button variant="ghost" size="icon" className="flex-shrink-0">
          <Paperclip className="h-4 w-4" />
        </Button>
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Message multiple models..."
          className="flex-1 border-none focus-visible:outline-none"
          onKeyPress={(e) => e.key === "Enter" && !isInputEmpty && onSend()}
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
          <AnimatedGenerateButton isLoading={isLoading} onClick={onSend} />
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
              className="text-center text-xs mt-2 absolute w-full"
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
