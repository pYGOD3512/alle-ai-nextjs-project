//@ts-nocheck
"use client";
import { useState, useRef, useEffect } from "react";
import GreetingMessage from "@/components/features/GreetingMessage";
import { ChatInput } from "@/components/features/ChatInput";
import { useSidebarStore, useContentStore, useWebSearchStore } from "@/stores";
import { useRouter } from "next/navigation";
import RenderPageContent from "@/components/RenderPageContent";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MessageSquarePlus, Sparkles, SquareTerminal, Lightbulb } from "lucide-react";
// static options
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
export default function Home() {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { isOpen, setSectionId } = useSidebarStore();
  const { setContent } = useContentStore();
  const router = useRouter();
  const setCurrentPage = useSidebarStore((state) => state.setCurrentPage);
  const { setIsWebSearch } = useWebSearchStore();

  

  useEffect(() => {
    setCurrentPage("chat");
  }, [setCurrentPage]);


  const handleSend = () => {
    if (!input.trim()) return;

    //  to chatpage with id
    // static id for test

    /*
    get a chatId 
    
    user a global state  to set content(message) of user input 
    
    access this inside chatpage and make a request 

    keep this first message as initial message state inside 
    chatpage 

    all new messages will now be appended to this to sync conversation
    with models
    
    */
    
    // Save the user's input to the content store
    setContent("chat", "input", input);
    
    router.push(`/chat/`);
  };

  const handleClicked = (opt: { label: String }) => {
    setInput(opt.label as String);
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
      <div className="flex-1 mt-20 py-4">
        <GreetingMessage
          username={"Pascal"}
          options={options}
          handlePressed={handleClicked}
        />
      </div>
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        inputRef={inputRef}
        isWeb={true}
        onWebSearchToggle={handleWebSearchToggle}
      />
    </div>
  );
}
