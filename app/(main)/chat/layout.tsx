"use client";
import { useState, useRef, useEffect } from "react";
import GreetingMessage from "@/components/features/GreetingMessage";
import { ChatInput } from "@/components/features/ChatInput";
import { useSidebarStore, useContentStore, useWebSearchStore } from "@/stores";
import { useRouter, usePathname } from "next/navigation";
import RenderPageContent from "@/components/RenderPageContent";
import { SquareTerminal, Lightbulb, Code, Bug, Wrench, Sparkles, NotebookPen, Brain  } from "lucide-react";

const options = [
  {
    label: "Debug",
    icon: <Bug className="w-4 h-4 text-red-500" />,
    description: "Help me find the bug in my code"
  },
  {
    label: "Summarize",
    icon: <NotebookPen className="w-4 h-4 text-green-500" />,
    description: "Help me summarize the article"
  },
  {
    label: "Brainstorm",
    icon: <Brain className="w-4 h-4 text-blue-500" />,
    description: "Help me brainstorm ideas"
  },
  {
    label: "Analyze",
    icon: <Sparkles className="w-4 h-4 text-yellow-500" />,
    description: "Help me analyze the data"
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
    setInput("");
  };

  const handleClicked = (opt: { label: string }) => {
    setInput(opt.label);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleWebSearchToggle = (enabled: boolean) => {
    setIsWebSearch(enabled);
  };

  return (
    <div className={`flex flex-col min-h-[calc(100vh-3.5rem)] transition-all duration-300 ${isOpen ? "pl-40" : "pl-0"}`}>
      {pathname === "/chat" && (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col justify-center items-center gap-8">
            <GreetingMessage
              username="Pascal"
              options={options}
              handlePressed={handleClicked}
            />
            <div className="w-full max-w-3xl px-4">
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
        </div>
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
}