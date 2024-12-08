//@ts-nocheck
"use client";
import { useState, useRef, useEffect } from "react";
import GreetingMessage from "@/components/features/GreetingMessage";
import { ChatInput } from "@/components/features/ChatInput";
import { useSidebarStore } from "@/lib/constants";
import { useRouter } from "next/navigation";
import RenderPageContent from "@/components/RenderPageContent";
// static options
const options = [
  {
    label: "What does Santa do on his day off?",
  },
  {
    label: "Why is christmas gift wrapping harder than math?",
  },
];
export default function Home() {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { isOpen, setSectionId } = useSidebarStore();
  const router = useRouter();
  const setCurrentPage = useSidebarStore((state) => state.setCurrentPage);

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
    const chatId = crypto.randomUUID();
    setSectionId("chatId", chatId);
    router.push(`/chat/res/${chatId}`);
  };

  const handleClicked = (opt: { label: String }) => {
    setInput(opt.label as String);
    setTimeout(() => inputRef.current?.focus(), 0);
  };
  return (
    <RenderPageContent
    >
      <div className="flex-1 mt-20 py-4">
        <GreetingMessage
          username={"Christmas"}
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
    </RenderPageContent>
  );
}
