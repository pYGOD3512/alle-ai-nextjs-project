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
    const chatId = crypto.randomUUID();
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
