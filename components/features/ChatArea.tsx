//@ts-nocheck
"use client";

import { useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModelSelector } from './ModelSelector';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ModelResponse } from './ModelResponse';
import { CHAT_MODELS as MODELS, Message, initialMessages, useSidebarStore } from '@/lib/constants';
        
import GreetingMessage from "./GreetingMessage";

// static options
const options = [
  {
    label: "Write a Python function to sort an array",
  },
  {
    label: "How do I stay motivated to work out?",
  },
];


export function ChatArea() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isOpen } = useSidebarStore();
  const [messages, setMessages] = useState<Message[]>(
    initialMessages.map((message) => ({
      ...message,
      sender: message.sender as "user" | "ai",
    }))
  );
  const [input, setInput] = useState("");
  const [chatStarted, setChatStarted] = useState(false);
  const [activeModel, setActiveModel] = useState("gpt4");

  const handleSend = () => {
    if (!input.trim()) return;

    // const newMessage: Message = {
    //   id: Date.now().toString(),
    //   content: input,
    //   sender: "user",
    //   timestamp: new Date(),
    //   responses: [
    //     {
    //       model: "GPT-4o",
    //       content: "Sample response from GPT-4o...",
    //       icon: "/models/gpt-4o.png",
    //     },
    //   ],
    // };

    setChatStarted(true);

    setMessages([...messages]);
    setInput("");
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
      <ScrollArea className="flex-1">
        <div className="max-w-5xl mt-4 mx-auto px-4">
          {chatStarted ? (
            messages.map((message) => (
              <div key={message.id} className="mb-8">
                <ChatMessage
                  content={message.content}
                  sender={message.sender}
                  timestamp={message.timestamp}
                />
                {message.responses && (
                  <div className="mt-4">
                    <ModelSelector
                      models={MODELS}
                      activeModel={activeModel}
                      onSelect={setActiveModel}
                    />
                    <div className="mt-4">
                      <ModelResponse
                        model={
                          MODELS.find((m) => m.id === activeModel)?.name || ""
                        }
                        content={
                          message.responses.find(
                            (r) =>
                              r.model ===
                              MODELS.find((m) => m.id === activeModel)?.name
                          )?.content || ""
                        }
                        model_img={
                          MODELS.find((m) => m.id === activeModel)?.icon || ""
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex-1 mt-20 py-4">
              <GreetingMessage
                username={"Clinton"}
                options={options}
                handlePressed={handleClicked}
              />
            </div>
          )}
        </div>
      </ScrollArea>

      <ChatInput value={input} onChange={setInput} onSend={handleSend} inputRef={inputRef} />
    </div>
  );
}
