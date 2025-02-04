"use client";
import { useState, useRef, useEffect } from "react";
import GreetingMessage from "@/components/features/GreetingMessage";
import { ChatInput } from "@/components/features/ChatInput";
import { useSidebarStore, useContentStore, useWebSearchStore } from "@/stores";
import { useRouter, usePathname } from "next/navigation";
import RenderPageContent from "@/components/RenderPageContent";
import { SquareTerminal, Lightbulb } from "lucide-react";

const options = [
  {
    label: "Help me debug my React code",
    icon: <SquareTerminal className="w-4 h-4 text-violet-600" />,
    description: "Get programming assistance"
  },
  {
    label: "Explain quantum computing simply",
    icon: <Lightbulb className="w-4 h-4 text-amber-400"/>,
    description: "Break down complex concepts"
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { setContent } = useContentStore();
  const router = useRouter();
  const pathname = usePathname();
  const { setIsWebSearch } = useWebSearchStore();
    const { isOpen } = useSidebarStore();

  const handleSend = () => {
    if (!input.trim()) return;
    const chatId = crypto.randomUUID();
    setContent("chat", "input", input);
    router.push(`/chat/res/${chatId}`);
  };

  const handleClicked = (opt: { label: string }) => {
    setInput(opt.label);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleWebSearchToggle = (enabled: boolean) => {
    setIsWebSearch(enabled);
  };

  return (
    <div
    className={`transition-all duration-300 ${
      isOpen ? "pl-60" : "pl-0"
    }`}
    >
      {pathname === "/chat" && (
        <>
          <div className="mt-20">
            <GreetingMessage
              username="Pascal"
              options={options}
              handlePressed={handleClicked}
            />
          </div>
          <div className="flex justify-center items-center p-4">
            <div className="w-full max-w-3xl">
              <ChatInput
                value={input}
                onChange={setInput}
                onSend={handleSend}
                inputRef={inputRef}
                isLoading={false}
                isWeb={true}
                onWebSearchToggle={handleWebSearchToggle}
              />
            </div>
          </div>
        </>
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
}