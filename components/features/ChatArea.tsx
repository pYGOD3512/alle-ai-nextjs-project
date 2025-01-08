"use client";

import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModelSelector } from "./ModelSelector";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ModelResponse } from "./ModelResponse";
import RenderPageContent from "../RenderPageContent";
import {
  CHAT_MODELS as MODELS,
  Message,
  initialMessages,
  MODEL_RESPONSES,
} from "@/lib/constants";
import { useSidebarStore, useSelectedModelsStore, useContentStore } from "@/stores";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollToBottom } from "@/components/ScrollToBottom";

interface ChatSession {
  id: string;
  messages: ChatMessage[];
  activeModel: string;
  status: 'active' | 'complete';
}

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  responses: ModelResponse[];
}

interface ModelResponse {
  id: string;
  modelId: string;
  content: string;
  status: 'loading' | 'complete' | 'error';
  parentMessageId: string;
}

export function ChatArea() {
  const { content } = useContentStore();
  const { selectedModels } = useSelectedModelsStore();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    // Initialize with the content from store if it exists
    if (content.chat.input) {
      const sessionId = `session-${Date.now()}`;
      const messageId = `msg-${Date.now()}`;
      
      return [{
        id: sessionId,
        activeModel: selectedModels.chat[0],
        status: 'active',
        messages: [{
          id: messageId,
          content: content.chat.input,
          sender: 'user',
          timestamp: new Date(),
          responses: selectedModels.chat.map(modelId => ({
            id: `response-${modelId}-${Date.now()}`,
            modelId,
            content: '',
            status: 'loading',
            parentMessageId: messageId
          }))
        }]
      }];
    }
    return [];
  });

  // Trigger response generation on initial mount if we have content
  useEffect(() => {
    if (content.chat.input && chatSessions.length > 0) {
      const session = chatSessions[0];
      selectedModels.chat.forEach((modelId) => {
        const randomDelay = Math.random() * 3000 + 2000;
        
        setTimeout(() => {
          setChatSessions(prev => prev.map(s => {
            if (s.id !== session.id) return s;
            
            return {
              ...s,
              messages: s.messages.map(msg => ({
                ...msg,
                responses: msg.responses.map(response => {
                  if (response.modelId !== modelId) return response;
                  
                  return {
                    ...response,
                    content: MODEL_RESPONSES[modelId],
                    status: 'complete'
                  };
                })
              }))
            };
          }));
        }, randomDelay);
      });
    }
  }, []);

  const [activeSessionId, setActiveSessionId] = useState<string>();
  const [input, setInput] = useState("");

  const handleInputChange = (value: string) => {
    setInput(value);
  };

  const createNewSession = (messageContent: string) => {
    const sessionId = `session-${Date.now()}`;
    const messageId = `msg-${Date.now()}`;
    
    const newSession: ChatSession = {
      id: sessionId,
      activeModel: selectedModels.chat[0],
      status: 'active',
      messages: [{
        id: messageId,
        content: messageContent,
        sender: 'user',
        timestamp: new Date(),
        responses: selectedModels.chat.map(modelId => ({
          id: `response-${modelId}-${Date.now()}`,
          modelId,
          content: '',
          status: 'loading',
          parentMessageId: messageId
        }))
      }]
    };

    setChatSessions(prev => [...prev, newSession]);
    setActiveSessionId(sessionId);
    return { sessionId, messageId };
  };

  const handleSend = (input: string) => {
    const { sessionId, messageId } = createNewSession(input);

    // Simulate responses for each model
    selectedModels.chat.forEach((modelId) => {
      const randomDelay = Math.random() * 3000 + 2000;
      
      setTimeout(() => {
        setChatSessions(prev => prev.map(session => {
          if (session.id !== sessionId) return session;
          
          return {
            ...session,
            messages: session.messages.map(msg => {
              if (msg.id !== messageId) return msg;
              
              return {
                ...msg,
                responses: msg.responses.map(response => {
                  if (response.modelId !== modelId) return response;
                  
                  return {
                    ...response,
                    content: MODEL_RESPONSES[modelId],
                    status: 'complete'
                  };
                })
              };
            })
          };
        }));
      }, randomDelay);
    });
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    handleSend(input);
    setInput("");
  };

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  return (
    <RenderPageContent>
      <ScrollArea 
        ref={scrollAreaRef} 
        className="flex-1"
      >
        <div className="max-w-xl sm:max-w-2xl md:max-w-5xl mt-4 mx-auto px-4">
          {chatSessions.map((session) => (
            <div key={session.id} className="mb-8">
              <ChatMessage
                content={session.messages[0].content}
                sender={session.messages[0].sender}
                timestamp={session.messages[0].timestamp}
              />
              <div className="mt-4">
                <div className="grid grid-cols-auto-fit gap-4 max-w-[90%] mx-auto">
                  {selectedModels.chat.map((modelId, index) => {
                    const model = MODELS.find(m => m.id === modelId);
                    if (!model) return null;

                    const response = session.messages[0].responses?.[index];
                    const isLoading = response?.status === 'loading';

                    if (isLoading) {
                      return (
                        <div 
                          key={modelId}
                          className="flex flex-col items-start p-4 rounded-md border border-borderColorPrimary bg-background"
                        >
                          <div className="flex items-center justify-center w-full space-x-2">
                            <div className="relative">
                              <Image
                                src={model.icon}
                                alt={model.name}
                                width={24}
                                height={24}
                                className="rounded-full animate-pulse"
                              />
                              <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap overflow-auto scrollbar-none">
                              {model.name}
                            </span>
                          </div>
                          <div className="w-full mt-3 space-y-2">
                            <Skeleton className="h-2 w-full" />
                          </div>
                        </div>
                      );
                    }

                    return (
                      <ModelSelector
                        key={modelId}
                        models={[model]}
                        activeModel={session.activeModel}
                        onSelect={(modelId) => {
                          setChatSessions(prev => prev.map(s => {
                            if (s.id !== session.id) return s;
                            return {
                              ...s,
                              activeModel: modelId
                            };
                          }));
                        }}
                      />
                    );
                  })}
                </div>

                {session.messages[0].responses && session.messages[0].responses.length > 0 && (
                  <div className="mt-4">
                    {session.messages[0].responses.find(r => 
                      r.modelId === session.activeModel && r.status === 'complete'
                    ) && (
                      <ModelResponse
                        model={MODELS.find(m => m.id === session.activeModel)?.name || ""}
                        content={
                          session.messages[0].responses.find(r => 
                            r.modelId === session.activeModel
                          )?.content || ""
                        }
                        model_img={MODELS.find(m => m.id === session.activeModel)?.icon || ""}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <ScrollToBottom 
        scrollAreaRef={scrollAreaRef}
        className="z-50 w-8 h-8"
        content={chatSessions}
      />
      <ChatInput
        value={input}
        onChange={handleInputChange}
        onSend={handleSendMessage}
        inputRef={useRef<HTMLTextAreaElement>(null)}
        isLoading={false}
      />
    </RenderPageContent>
  );
}
