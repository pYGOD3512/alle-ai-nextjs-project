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
import { Image  } from "lucide-react"



// static options
const options = [
  {
    label: "Generate a futuristic cityscape",
    icon: <Image className="w-4 h-4" />,
    description: "Create a stunning digital artwork of a city of the future"
  },
  {
    label: "Design a surreal landscape",
    icon: <Image className="w-4 h-4" />,
    description: "Produce an abstract, dreamlike scene with vibrant colors"
  },
  {
    label: "Generate a futuristic cityscape",
    icon: <Image className="w-4 h-4" />,
    description: "Create a stunning digital artwork of a city of the future"
  },
  {
    label: "Design a surreal landscape",
    icon: <Image className="w-4 h-4" />,
    description: "Produce an abstract, dreamlike scene with vibrant colors"
  },
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
    </RenderPageContent>
    </>
  );
}
