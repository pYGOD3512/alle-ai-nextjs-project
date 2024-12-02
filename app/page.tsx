//@ts-nocheck
"use client";
import { useState, useRef } from "react";
import GreetingMessage from "@/components/features/GreetingMessage";
import { ChatInput } from "@/components/features/ChatInput";
import { useSidebarStore } from "@/lib/constants";
import { useRouter } from "next/navigation";

// static options
const options = [
  {
    label: "Write a Python function to sort an array",
  },
  {
    label: "How do I stay motivated to work out?",
  },
];
export default function Home() {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { isOpen } = useSidebarStore();
  const router = useRouter();
  const handleSend = () => {
    if (!input.trim()) return;
    // implement test navigation to chatpage with id
    // static id for test

    /*
    get a chatId 
    
    user a global FirstChart to get user input 
    at /chatPage 

    logic to use the this content and selected models to make request

    render the response and append it to the messages 
    and we use 
    
    
    
    */
    const chatId = crypto.randomUUID();
    setInput("");
    router.push(`/chat/res/${chatId}`);
  };

  const handleClicked = (opt: { label: String }) => {
    setInput(opt.label as String);
    setTimeout(() => inputRef.current?.focus(), 0);
  };
  return (
    <div
      className={`flex flex-col h-[calc(100vh-3.5rem)] transition-all duration-300 ${
        isOpen ? "pl-60" : "pl-16"
      }`}
    >
      <div className="flex-1 mt-20 py-4">
        <GreetingMessage
          username={"Clinton"}
          options={options}
          handlePressed={handleClicked}
        />
      </div>
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        inputRef={inputRef}
      />
    </div>
  );
}
