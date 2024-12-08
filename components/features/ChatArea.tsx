"use client";

import { useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModelSelector } from "./ModelSelector";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ModelResponse } from "./ModelResponse";
import {
  CHAT_MODELS as MODELS,
  Message,
  initialMessages,
  useSidebarStore,
} from "@/lib/constants";

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
  const [activeModel, setActiveModel] = useState("gpt4");

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
      responses: [
        {
          model: "GPT-4o",
          content:
            `
            SQL injection: Occurs when a user can input malicious SQL code into a web application, allowing them to execute unauthorized commands on the database.
            Cross-site scripting (XSS): Allows attackers to inject malicious scripts into a web page, which can be used to steal user information, redirect traffic, or launch other attacks.
            Input forgery: Occurs when an attacker can manipulate the input validation process to bypass security checks, such as changing a numerical input field to a text field.`,
          icon: "/models/gpt-4o.png",
        },
        {
          model: "Claude 3.5 Sonnet",
          content:
            `
            Weak passwords: Users often create passwords that are easy to guess or crack, allowing attackers to gain unauthorized access to accounts.
            Unprotected login pages: Login pages may not be sufficiently protected against brute force attacks or password sniffing techniques.
            Insufficient authorization: Users may be granted access to resources or functionality that they should not have, allowing them to perform unauthorized actions.`,
          icon: "/models/claude-3.png",
        },
        {
          model: "Gemini 1.5 Pro",
          content:
            `
            Default configurations: Web applications may be installed with default settings that are insecure, such as weak passwords or unpatched software.
            Unpatched software: Web application software often requires regular updates to patch security vulnerabilities. Failure to apply these updates can leave the application vulnerable to attack.
            Insecure server configurations: Web servers may be misconfigured, exposing sensitive data or allowing attackers to gain unauthorized access.`,
          icon: "/models/gemini.png",
        },
        {
          model: "Llama 3 70B Instruct",
          content:
            `
            Cross-site request forgery (CSRF): Occurs when an attacker can trick a user into submitting a request that they do not intend to, such as transferring funds or changing account settings.
            Insecure direct object references (IDOR): Occurs when an attacker can guess or manipulate the URL of a web page to access sensitive information that they should not have access to.
            Broken object-level authorization: Similar to IDOR, this vulnerability occurs when an attacker can bypass authorization checks to access objects that they should not have access to.`,
          icon: "/models/meta.png",
        },
        {
          model: "ChatGPT",
          content: `
          Outdated software: Web applications that are not kept up to date with the latest security patches may be vulnerable to known exploits.
            Third-party libraries: Web applications often use third-party libraries, which can introduce vulnerabilities if not properly reviewed and updated.
            Exploit kits: Attackers may use exploit kits to automate the process of exploiting common vulnerabilities.`,
          icon: "/models/gpt-3-5.png",
        },
      ],
    };

    setMessages([...messages, newMessage]);
    setInput("");
  };

  return (
    <div
      className={`flex flex-col h-[calc(100vh-3.5rem)] transition-all duration-300 ${
        isOpen ? "pl-60" : ""
      }`}
    >
      <ScrollArea className="flex-1">
        <div className="max-w-xl sm:max-w-2xl md:max-w-5xl mt-4 mx-auto px-4">
          {messages.map((message) => (
            <div key={message.id} className="mb-8">
              <ChatMessage
                content={message.content}
                sender={message.sender}
                timestamp={message.timestamp}
              />
              {message.responses && message.responses.length > 0 && (
                <div className="mt-4">
                  <ModelSelector
                    models={MODELS.filter(model => 
                      message.responses?.some(
                        response => response.model === model.name && response.content
                      )
                    )}
                    activeModel={activeModel}
                    onSelect={setActiveModel}
                  />
                  <div className="mt-4">
                    {message.responses.find(
                      r => r.model === MODELS.find(m => m.id === activeModel)?.name
                    )?.content && (
                      <ModelResponse
                        model={MODELS.find(m => m.id === activeModel)?.name || ""}
                        content={message.responses.find(
                          r => r.model === MODELS.find(m => m.id === activeModel)?.name
                        )?.content || ""}
                        model_img={MODELS.find(m => m.id === activeModel)?.icon || ""}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        inputRef={inputRef}
      />
    </div>
  );
}
