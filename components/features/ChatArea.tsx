"use client";

import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModelSelector } from "./ModelSelector";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ModelResponse, useSourcesWindowStore } from "./ModelResponse";
import RenderPageContent from "../RenderPageContent";
import {
  MODEL_RESPONSES,
  EXAMPLE_SOURCES,
  EXAMPLE_SOURCES_SIMPLE,
  SUMMARY_DATA
} from "@/lib/constants";
import { useSelectedModelsStore, useContentStore, useWebSearchStore, useSettingsStore } from "@/stores";
import { useModelsStore, useConversationStore } from "@/stores/models";
import { chatApi } from '@/lib/api/chat';
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollToBottom } from "@/components/ScrollToBottom";
import { useToast } from "@/hooks/use-toast";
import { SourcesWindow } from "../SourcesWindow";
import { Summary } from "./Summary";
import { Card } from "@/components/ui/card";
import { Model } from "@/lib/api/models";

interface ChatSession {
  id: string; // conversation UUID
  title: string;
  messages: ChatMessage[];
  activeModel: string;
  status: 'active' | 'complete';
}

interface ChatMessage {
  id: string; // prompt ID
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  responses: ModelResponse[];
}

interface ModelResponse {
  id: string; // response ID
  modelId: string; // model_uid
  content: string;
  status: 'loading' | 'complete' | 'error';
  error?: string;
}

export function ChatArea() {
  const { toast } = useToast();
  const { content } = useContentStore();
  const { selectedModels, inactiveModels } = useSelectedModelsStore();
  const { chatModels } = useModelsStore();
  const { conversationId, promptId } = useConversationStore();
  const { personalization } = useSettingsStore();
  const { isOpen, activeResponseId, sources, close } = useSourcesWindowStore();
  const { isWebSearch } = useWebSearchStore();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    if (!conversationId || !promptId) return [];
    const initialPrompt = content.chat.input;
    
    return [{
      id: conversationId,
      title: "New Chat",
      activeModel: selectedModels.chat[0],
      status: 'active',
      messages: [{
        id: promptId,
        content: initialPrompt, // Use the stored input content
        sender: 'user',
        timestamp: new Date(),
        responses: selectedModels.chat.map(modelId => ({
          id: `temp-${modelId}`,
          modelId,
          content: '',
          status: 'loading'
        }))
      }]
    }];
  });

  // Handle real-time response updates
  useEffect(() => {
    if (!conversationId || !promptId) return;

    const activeModels = selectedModels.chat.filter(
      modelId => !inactiveModels.includes(modelId)
    );

    activeModels.forEach(async (modelId) => {
      try {
        const response = await chatApi.generateResponse({
          conversation: conversationId,
          model: modelId,
          is_new: true,
          prompt: promptId
        });

        if (response.status && response.data) {
          setChatSessions(prev => prev.map(session => ({
            ...session,
            messages: session.messages.map(msg => ({
              ...msg,
              responses: msg.responses.map(resp => 
                resp.modelId === modelId ? {
                  ...resp,
                  id: String(response.data.id),
                  content: response.data.response,
                  status: 'complete'
                } : resp
              )
            }))
          })));
        } else {
          // Handle error state
          setChatSessions(prev => prev.map(session => ({
            ...session,
            messages: session.messages.map(msg => ({
              ...msg,
              responses: msg.responses.map(resp => 
                resp.modelId === modelId ? {
                  ...resp,
                  status: 'error',
                  error: response.message || 'Failed to generate response'
                } : resp
              )
            }))
          })));
        }
      } catch (error) {
        console.error(`Error generating response for model ${modelId}:`, error);
        // Update error state in UI
        setChatSessions(prev => prev.map(session => ({
          ...session,
          messages: session.messages.map(msg => ({
            ...msg,
            responses: msg.responses.map(resp => 
              resp.modelId === modelId ? {
                ...resp,
                status: 'error',
                error: 'Failed to generate response'
              } : resp
            )
          }))
        })));
      }
    });
  }, [conversationId, promptId, selectedModels.chat, inactiveModels]);

  const handleInputChange = (value: string) => {
    setInput(value);
  };

  const handleSendMessage = async (fileContent?: {
    uploaded_files: Array<{
      file_name: string;
      file_size: string;
      file_type: string;
      file_content: string;
    }>;
  }) => {
    if (!input.trim() || !conversationId) return;
    
    setIsLoading(true);
    try {
      // Create new prompt with file content if available
      const promptResponse = await chatApi.createPrompt(
        conversationId, 
        input,
        fileContent ? {
          input_content: fileContent
        } : undefined
      );
      const promptContent = input; // Store input before clearing
      
      // Update UI with new message
      setChatSessions(prev => prev.map(session => ({
        ...session,
        messages: [...session.messages, {
          id: String(promptResponse.id),
          content: promptContent, // Use stored input content
          sender: 'user',
          timestamp: new Date(),
          responses: selectedModels.chat.map(modelId => ({
            id: `temp-${modelId}`,
            modelId,
            content: '',
            status: 'loading'
          }))
        }]
      })));

      setInput(""); // Clear input after updating UI
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [activeSessionId, setActiveSessionId] = useState<string>();
  const [responseFeedback, setResponseFeedback] = useState<Record<string, 'liked' | 'disliked' | null>>({});
  const [showSummary, setShowSummary] = useState<Record<string, boolean>>({});
  const [generatingSummary, setGeneratingSummary] = useState<Record<string, boolean>>({});
  const [activeContents, setActiveContents] = useState<Record<string, {
    type: 'model' | 'summary';
    id: string;
  }>>({});

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleFeedbackChange = (responseId: string, feedback: 'liked' | 'disliked' | null) => {
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
                    const model = chatModels.find(m => m.model_uid === modelId);
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
                                src={model.model_image}
                                alt={model.model_name}
                                width={24}
                                height={24}
                                className="rounded-full animate-pulse"
                              />
                              <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap overflow-auto scrollbar-none">
                              {model.model_name}
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
                        models={[{
                          ...model,
                          response: response?.content
                        } as Model]}
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
                                <Skeleton className="h-4 w-full" />
                              </div>
                            </div>
                          </Card>
                        ) : (
                          <ModelResponse
                            key={`${session.id}-${session.activeModel}`}
                            model={chatModels.find(m => m.model_uid === session.activeModel)?.model_name || ""}
                            content={session.messages[0].responses.find(r => 
                              r.modelId === session.activeModel
                            )?.content || ""}
                            model_img={chatModels.find(m => m.model_uid === session.activeModel)?.model_image || ""}
                            responseId={session.messages[0].responses.find(r => 
                              r.modelId === session.activeModel
                            )?.id || ""}
                            sessionId={session.id}
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
                            // sources={session.messages[0].responses.find(r => 
                            //   r.modelId === session.activeModel && r.status === 'complete'
                            // )?.sources}
                            // settings={session.messages[0].responses.find(r => 
                            //   r.modelId === session.activeModel
                            // )?.settings || { personalizedAds: true }}
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
                        sessionId={session.id}
                        feedback={responseFeedback[`summary-${session.id}`]}
                        onFeedbackChange={handleFeedbackChange}
                        settings={{ personalizedAds: false }}
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
        isLoading={isLoading}
        isWeb={true}
        onWebSearchToggle={() => {}}
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
