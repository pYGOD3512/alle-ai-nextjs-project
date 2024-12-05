"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip } from "lucide-react";
import AnimatedGenerateButton from "./GenerateButton";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  isLoading: boolean;
}
const ImageInput = ({ value, onChange, onSend, inputRef,isLoading }: ChatInputProps) => {
  const isInputEmpty = value.trim() === "";

  return (
    <div
      className={` p-2 bg-background/95 backdrop-blur transition-all duration-300`}
    >
      <div className="max-w-3xl mx-auto flex items-center gap-1 border-2 rounded-2xl p-2">
        <Button variant="ghost" size="icon" className="flex-shrink-0">
          <Paperclip className="h-4 w-4" />
        </Button>
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your prompt here..."
          className="flex-1 border-none focus-visible:outline-none "
          onKeyPress={(e) => e.key === "Enter" && !isInputEmpty && onSend()}
        />
        <AnimatedGenerateButton onClick={onSend} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ImageInput;
