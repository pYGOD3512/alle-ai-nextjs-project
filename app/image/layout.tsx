//@ts-nocheck
"use client";
import ImageInput from "@/components/features/image/ImageInput";
import GreetingMessage from "@/components/features/GreetingMessage";
import { useState, useRef, useEffect } from "react";
import { useSidebarStore } from "@/lib/constants";
// static options
const options = [
  {
    label: "How about a futuristic robot companion assisting a person?",
  },
  {
    label: "How about a futuristic space station orbiting Earth?",
  },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { isOpen } = useSidebarStore();
  const [isLoading, setIsLoading] = useState(false);
 const handleClicked = (opt: { label: String }) => {
   setInput(opt.label as String);
   setTimeout(() => inputRef.current?.focus(), 0);
 };
  const handleGenerate = () => {
    //

  };
  return (
    <div
      className={`flex flex-col justify-between h-[calc(100vh-3.5rem)] transition-all duration-300 ${
        isOpen ? "pl-60" : ""
      }`}
    >
      <div className="flex justify-center items-center  p-4">
        <div className="w-full max-w-3xl">
          <ImageInput
            value={input}
            onChange={setInput}
            onSend={handleGenerate}
            inputRef={inputRef}
            isLoading={isLoading}
          />
        </div>
      </div>
      <div className="flex-1 mt-5">
        <GreetingMessage options={options} username="Christmas" handlePressed={handleClicked} />
      </div>
      <div className="flex-1"> {children} </div>
    </div>
  );
}