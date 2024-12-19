// @ts-nocheck
"use client";
import { ChatInput } from "@/components/features/ChatInput";
import GreetingMessage from "@/components/features/GreetingMessage";
import { useState, useRef, useEffect } from "react";
import { useSidebarStore } from "@/lib/constants";
import { useContentStore } from "@/stores";
import { usePathname } from "next/navigation";
import RenderPageContent from "@/components/RenderPageContent";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useHistoryStore } from "@/lib/constants";

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
  const [isLoading, setIsLoading] = useState(false);
  const { setContent, resetContent } = useContentStore();
  const router = useRouter();
  const pathname = usePathname();
  const { addHistory } = useHistoryStore();
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
    addHistory({ title: input, type: "image", generateId: chatId });
  };
  return (
    <RenderPageContent>
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
      {pathname === "/image" ? (
        <div className="flex-1 mt-5">
          <GreetingMessage
            options={options}
            username="Pascal"
            handlePressed={handleClicked}
            questionText="ready to create something amazing today?"
          />
        </div>
      ) : (
        ""
      )}

      <div className="flex-1"> {children} </div>
    </RenderPageContent>
  );
}
