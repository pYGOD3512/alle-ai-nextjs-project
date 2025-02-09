// @ts-nocheck
"use client";
import { ChatInput } from "@/components/features/ChatInput";
import GreetingMessage from "@/components/features/GreetingMessage";
import { useState, useRef, useEffect } from "react";
import { useContentStore, useSidebarStore } from "@/stores";
import { usePathname } from "next/navigation";
import RenderPageContent from "@/components/RenderPageContent";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lightbulb , Image, Anchor, TreePalm } from 'lucide-react';



// static options
const options = [
  {
    label: "Futuristic cityscape",
    icon: <Lightbulb className="w-4 h-4 text-amber-400"/>,
    description: "Create a stunning digital artwork of a city of the future"
  },
  {
    label: "Surreal landscape",
    icon: <Image className="w-4 h-4 text-purple-500" />,
    description: "Produce an abstract, dreamlike scene with vibrant colors"
  },
  {
    label: "Underwater kingdom",
    icon: <Anchor className="w-4 h-4 text-teal-500" />,
    description: "Imagine a deep-sea civilization full of mysterious sea creatures, glowing coral reefs, and submerged castles."
  },
  {
    label: "Magical forest",
    icon: <TreePalm className="w-4 h-4 text-green-500" />,
    description: "Create a mystical forest with glowing trees, enchanted animals, and an ethereal atmosphere."
  }
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setContent, resetContent } = useContentStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleClicked = (opt: { label: String }) => {
    setInput(opt.label as String);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleGenerate = () => {
    if (!input) return;
    const chatId = crypto.randomUUID();
    setContent("image", "input", input);
    setInput("");

    //
    router.push(`/image/res/${chatId}`);
  };
  return (
    <>
    <RenderPageContent>
      <div className="flex-1 flex flex-col justify-center min-h-[calc(100vh-3.5rem)]">
      {pathname === "/image" && (
        <div className="mt-20">
          <GreetingMessage
            options={options}
            username="Pascal"
            handlePressed={handleClicked}
            questionText="ready to create something amazing today?"
          />
        </div>
      )}
      <div className="flex justify-center items-center  p-4">
        <div className="w-full max-w-3xl">
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={handleGenerate}
            inputRef={inputRef}
            isLoading={isLoading}
          />
        </div>
      </div>

      <div className="flex-1"> {children} </div>
      </div>
    </RenderPageContent>
    </>
  );
}
