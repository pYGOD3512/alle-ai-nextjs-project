"use client";

import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModelSelector } from "./ModelSelector";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ModelResponse, useSourcesWindowStore } from "./ModelResponse";
import RenderPageContent from "../RenderPageContent";
import {
  CHAT_MODELS as MODELS,
  Message,
  initialMessages,
  MODEL_RESPONSES,
  EXAMPLE_SOURCES,
  EXAMPLE_SOURCES_SIMPLE,
  SUMMARY_RESPONSES,
  SUMMARY_DATA
} from "@/lib/constants";
import { useSidebarStore, useSelectedModelsStore, useContentStore, useWebSearchStore } from "@/stores";
import { Source } from "@/lib/types";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollToBottom } from "@/components/ScrollToBottom";
import { useToast } from "@/hooks/use-toast";
import { SourcesWindow } from "../SourcesWindow";
import { Summary } from "./Summary";
import { Card } from "@/components/ui/card";


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
  sources?: Source[];
}

export function ChatArea() {
  const { toast } = useToast();
  const { content } = useContentStore();
  const { selectedModels } = useSelectedModelsStore();
  const { isOpen, activeResponseId, sources, close } = useSourcesWindowStore();
  const { isWebSearch } = useWebSearchStore();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
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
            parentMessageId: messageId,
            sources: isWebSearch ? EXAMPLE_SOURCES : undefined
          }))
        }]
      }];
    }
    return [];
  });

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
  const [responseFeedback, setResponseFeedback] = useState<Record<string, 'like' | 'dislike' | null>>({});
  const [showSummary, setShowSummary] = useState<Record<string, boolean>>({});
  const [generatingSummary, setGeneratingSummary] = useState<Record<string, boolean>>({});
  const [activeContents, setActiveContents] = useState<Record<string, {
    type: 'model' | 'summary';
    id: string;
  }>>({});

  const handleInputChange = (value: string) => {
    setInput(value);
  };

  const createNewSession = (messageContent: string) => {
    const sessionId = `session-${Date.now()}`;
    const messageId = `msg-${Date.now()}`;
    
    setActiveContents(prev => ({
      ...prev,
      [sessionId]: { type: 'model', id: selectedModels.chat[2] }
    }));

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
          parentMessageId: messageId,
          sources: isWebSearch ? EXAMPLE_SOURCES_SIMPLE : undefined
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

  const handleWebSearchToggle = (enabled: boolean) => {
    useWebSearchStore.getState().setIsWebSearch(enabled);
  };

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleFeedbackChange = (responseId: string, feedback: 'like' | 'dislike' | null) => {
    setResponseFeedback(prev => ({
      ...prev,
      [responseId]: feedback
    }));
  };

  useEffect(() => {
    chatSessions.forEach(session => {
      const allResponsesComplete = session.messages[0]?.responses?.every(
        response => response.status === 'complete'
      );

      if (allResponsesComplete && !showSummary[session.id] && !generatingSummary[session.id]) {
        setGeneratingSummary(prev => ({ ...prev, [session.id]: true }));
        
        // Simulate summary generation
        setTimeout(() => {
          setGeneratingSummary(prev => ({ ...prev, [session.id]: false }));
          setShowSummary(prev => ({ ...prev, [session.id]: true }));
        }, 4000); 
      }
    });
  }, [chatSessions, showSummary, generatingSummary]);

  const handleModelSelect = (modelId: string, sessionId: string) => {
    setActiveContents(prev => ({
      ...prev,
      [sessionId]: { type: 'model', id: modelId }
    }));
    setChatSessions(prev => prev.map(s => ({
      ...s,
      activeModel: s.id === sessionId ? modelId : s.activeModel
    })));
  };

  const handleSummarySelect = (sessionId: string) => {
    setActiveContents(prev => ({
      ...prev,
      [sessionId]: { type: 'summary', id: 'default' }
    }));
    setChatSessions(prev => prev.map(s => ({
      ...s,
      activeModel: s.id === sessionId ? '' : s.activeModel
    })));
  };

  useEffect(() => {
    chatSessions.forEach(session => {
      // Check if responses exist and at least one is complete
      const hasCompleteResponse = session.messages[0]?.responses?.some(
        response => response.status === 'complete'
      );

      // If there's a complete response but no active content set for this session
      if (hasCompleteResponse && !activeContents[session.id]) {
        setActiveContents(prev => ({
          ...prev,
          [session.id]: { 
            type: 'model', 
            id: session.activeModel 
          }
        }));
      }
    });
  }, [chatSessions, activeContents]);

  return (
    <RenderPageContent>
      <ScrollArea 
        ref={scrollAreaRef} 
        className="flex-1"
      >
        <div className="max-w-xl sm:max-w-2xl md:max-w-4xl mt-4 mx-auto px-4">
          {chatSessions.map((session) => (
            <div key={session.id} className="mb-8">
              <ChatMessage
                content={session.messages[0].content}
                sender={session.messages[0].sender}
                timestamp={session.messages[0].timestamp}
              />
              <div className="mt-4">
                {(showSummary[session.id] || generatingSummary[session.id]) && (
                  <Summary 
                    isGenerating={generatingSummary[session.id]}
                    isActive={activeContents[session.id]?.type === 'summary'}
                    onClick={() => handleSummarySelect(session.id)}
                  />
                )}
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
                        activeModel={activeContents[session.id]?.type === 'model' ? session.activeModel : ''}
                        onSelect={(modelId) => handleModelSelect(modelId, session.id)}
                      />
                    );
                  })}
                </div>

                {session.messages[0].responses && session.messages[0].responses.length > 0 && (
                  <div className="mt-4">
                    {activeContents[session.id]?.type === 'model' && (
                      <>
                        {session.messages[0].responses.find(r => 
                          r.modelId === session.activeModel
                        )?.status === 'loading' ? (
                          // Loading skeleton
                          <Card className="bg-transparent border-none shadow-none p-4">
                            <div className="flex items-start gap-4">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                              </div>
                              <div className="flex-1 space-y-3">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[400px]" />
                                <Skeleton className="h-4 w-[300px]" />
                              </div>
                            </div>
                          </Card>
                        ) : (
                          <ModelResponse
                            key={`${session.id}-${session.activeModel}`}
                            model={MODELS.find(m => m.id === session.activeModel)?.name || ""}
                            content={session.messages[0].responses.find(r => 
                              r.modelId === session.activeModel
                            )?.content || ""}
                            model_img={MODELS.find(m => m.id === session.activeModel)?.icon || ""}
                            responseId={session.messages[0].responses.find(r => 
                              r.modelId === session.activeModel
                            )?.id || ""}
                            feedback={responseFeedback[session.messages[0].responses.find(r => 
                              r.modelId === session.activeModel
                            )?.id || ""]}
                            onFeedbackChange={handleFeedbackChange}
                            onRegenerate={(responseId) => {
                              toast({
                                title: "Regenerating response",
                                description: "Please wait while we generate a new response.",
                              });
                            }}
                            webSearchEnabled={isWebSearch}
                            sources={session.messages[0].responses.find(r => 
                              r.modelId === session.activeModel && r.status === 'complete'
                            )?.sources}
                          />
                        )}
                      </>
                    )}
                    {activeContents[session.id]?.type === 'summary' && (
                      <ModelResponse
                        model="AI Summary"
                        content={SUMMARY_DATA.summary}
                        model_img="/svgs/logo-desktop-mini.png"
                        responseId={`summary-${session.id}`}
                        feedback={responseFeedback[`summary-${session.id}`]}
                        onFeedbackChange={handleFeedbackChange}
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
        isWeb={true}
        onWebSearchToggle={handleWebSearchToggle}
      />
      <SourcesWindow
        sources={sources}
        isOpen={isOpen}
        onClose={close}
        responseId={activeResponseId || ''}
        userPrompt={chatSessions.find(session => 
          session.messages[0].responses.some(r => r.id === activeResponseId)
        )?.messages[0].content || ''}
      />
    </RenderPageContent>
  );
}
