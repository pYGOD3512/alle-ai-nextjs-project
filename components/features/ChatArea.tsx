"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModelSelector } from "./ModelSelector";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ModelResponse, useSourcesWindowStore } from "./ModelResponse";
import RenderPageContent from "../RenderPageContent";
import RetryResponse from "./RetryResponse"
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

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  position: [number, number];
  responses: ModelResponse[];
}

interface Branch {
  messages: Message[];
  startPosition: [number, number];
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

  const [activeSessionId, setActiveSessionId] = useState<string>();
  const [responseFeedback, setResponseFeedback] = useState<Record<string, 'liked' | 'disliked' | null>>({});
  const [showSummary, setShowSummary] = useState<Record<string, boolean>>({});
  const [generatingSummary, setGeneratingSummary] = useState<Record<string, boolean>>({});
  const [activeContents, setActiveContents] = useState<Record<string, {
    type: 'model' | 'summary';
    id: string;
  }>>({});
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
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

  const [branches, setBranches] = useState<Branch[]>(() => {
    if (!conversationId || !promptId) return [{ messages: [], startPosition: [0, 0] }];
    const initialPrompt = content.chat.input;
    
    return [{
      messages: [{
        id: promptId,
        content: initialPrompt,
        sender: 'user',
        timestamp: new Date(),
        position: [0, 0],
        responses: selectedModels.chat.map(modelId => ({
          id: `temp-${modelId}`,
          modelId,
          content: '',
          status: 'loading'
        }))
      }],
      startPosition: [0, 0]
    }];
  });

  const [currentBranch, setCurrentBranch] = useState(0);

  // Memoize the auto-activation logic
  const handleAutoActivation = useCallback((message: ChatMessage) => {
    if (activeContents[message.id]) return;

    const firstCompleteResponse = message.responses?.find(
      response => response.status === 'complete'
    );

    if (firstCompleteResponse) {
      setActiveContents(prev => ({
        ...prev,
        [message.id]: {
          type: 'model',
          id: firstCompleteResponse.modelId
        }
      }));
    }
  }, [activeContents]);

  // Update the effect to use stable dependencies
  useEffect(() => {
    chatSessions.forEach(session => {
      session.messages.forEach(message => {
        handleAutoActivation(message);
      });
    });
  }, [chatSessions, handleAutoActivation]);

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

  // Update the effect to handle initial responses
  useEffect(() => {
    if (!conversationId || !promptId) return;

    const activeModels = selectedModels.chat.filter(
      modelId => !inactiveModels.includes(modelId)
    );

    activeModels.forEach(async (modelId) => {
      try {
        if (isWebSearch) {
          console.log('Web search is enabled - making web search API call');
          const webSearchResponse = await chatApi.webSearch({
            prompt_id: promptId,
            conversation_id: conversationId,
            follow_up: false,
            messages: null
          });
          
          console.log('Web search response received:', webSearchResponse);
          return; 
        }

        const response = await chatApi.generateResponse({
          conversation: conversationId,
          model: modelId,
          is_new: true,
          prompt: promptId
        });

        if (response.status && response.data) {
          setBranches(prev => prev.map(branch => ({
            ...branch,
            messages: branch.messages.map(msg => 
              msg.id === promptId ? {
                ...msg,
                responses: msg.responses.map(resp => 
                  resp.modelId === modelId ? {
                    ...resp,
                    id: String(response.data.id),
                    content: response.data.response,
                    status: 'complete'
                  } : resp
                )
              } : msg
            )
          })));
        } else {
          // Handle error state
          setBranches(prev => prev.map(branch => ({
            ...branch,
            messages: branch.messages.map(msg => 
              msg.id === promptId ? {
                ...msg,
                responses: msg.responses.map(resp => 
                  resp.modelId === modelId ? {
                    ...resp,
                    status: 'error',
                    error: response.message || 'Failed to generate response'
                  } : resp
                )
              } : msg
            )
          })));
        }
      } catch (error) {
        console.error(`Error in ${isWebSearch ? 'web search' : 'regular'} response:`, error);
        // Update error state in UI
        setBranches(prev => prev.map(branch => ({
          ...branch,
          messages: branch.messages.map(msg => 
            msg.id === promptId ? {
              ...msg,
              responses: msg.responses.map(resp => 
                resp.modelId === modelId ? {
                  ...resp,
                  status: 'error',
                  error: 'Failed to generate response'
                } : resp
              )
            } : msg
          )
        })));
      }
    });
  }, [conversationId, promptId, selectedModels.chat, inactiveModels, isWebSearch]);

  const handleInputChange = (value: string) => {
    setInput(value);
  };

  const handleEditMessage = async (newContent: string, position: [number, number]) => {
    setIsLoading(true);
    try {
      const [_, y] = position;
      
      // Find all messages at EXACTLY this Y level in the current branch
      const messagesAtThisLevel = branches[currentBranch].messages.filter(
        m => m.position[1] === y
      );
      
      // Get the next X coordinate for this specific Y level only
      const newX = Math.max(...messagesAtThisLevel.map(m => m.position[0])) + 1;
      const newPosition: [number, number] = [newX, y];

      const promptResponse = await chatApi.createPrompt(
        conversationId!,
        newContent,
        newPosition,
        undefined
      );

      // Create new branch that preserves ALL messages from previous levels exactly as they are
      const newBranch: Branch = {
        messages: [
          // Keep ALL messages from previous levels unchanged
          ...branches[currentBranch].messages.filter(m => m.position[1] < y),
          // Add the edited message at this level
          {
            id: promptResponse.id,
            content: newContent,
            sender: 'user',
            timestamp: new Date(),
            position: newPosition,
            responses: selectedModels.chat.map(modelId => ({
              id: `temp-${modelId}`,
              modelId,
              content: '',
              status: 'loading'
            }))
          }
        ],
        startPosition: [newX, y]
      };

      // Add the new branch without affecting existing ones
      setBranches(prev => [...prev, newBranch]);
      setCurrentBranch(branches.length);

      // Handle model responses...
      const activeModels = selectedModels.chat.filter(
        modelId => !inactiveModels.includes(modelId)
      );

      activeModels.forEach(async (modelId) => {
        try {
          const response = await chatApi.generateResponse({
            conversation: conversationId!,
            model: modelId,
            is_new: false,
            prompt: promptResponse.id
          });

          if (response.status && response.data) {
            setBranches(prev => prev.map((branch, idx) => 
              idx === branches.length ? {
                ...branch,
                messages: branch.messages.map(msg => 
                  msg.id === promptResponse.id ? {
                    ...msg,
                    responses: msg.responses.map(resp => 
                      resp.modelId === modelId ? {
                        ...resp,
                        id: String(response.data.id),
                        content: response.data.response,
                        status: 'complete'
                      } : resp
                    )
                  } : msg
                )
              } : branch
            ));
          }
        } catch (error) {
          console.error('Error generating response:', error);
          // Handle error state...
        }
      });

    } catch (error) {
      console.error('Error creating new branch:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (fileContent?: any) => {
    if (!input.trim() || !conversationId) return;
    
    setIsLoading(true);
    try {
      const currentBranchMessages = branches[currentBranch].messages;
      const lastMessage = currentBranchMessages[currentBranchMessages.length - 1];
      
      // For follow-ups, keep the same x coordinate but increment y
      const nextPosition: [number, number] = lastMessage 
        ? [lastMessage.position[0], lastMessage.position[1] + 1]
        : [0, 0];

      const promptResponse = await chatApi.createPrompt(
        conversationId,
        input,
        nextPosition,
        fileContent
      );

      // Update current branch with new message
      setBranches(prev => prev.map((branch, index) => 
        index === currentBranch
          ? {
              ...branch,
              messages: [...branch.messages, {
                id: promptResponse.id,
                content: input,
                sender: 'user',
                timestamp: new Date(),
                position: nextPosition,
                responses: selectedModels.chat.map(modelId => ({
                  id: `temp-${modelId}`,
                  modelId,
                  content: '',
                  status: 'loading'
                }))
              }]
            }
          : branch
      ));

      // Generate responses for each active model
      const activeModels = selectedModels.chat.filter(
        modelId => !inactiveModels.includes(modelId)
      );

      activeModels.forEach(async (modelId) => {
        try {
          if (isWebSearch) {
            console.log('Web search is enabled - making web search API call');
            const webSearchResponse = await chatApi.webSearch({
              prompt_id: promptResponse.id,
              conversation_id: conversationId,
              follow_up: true,
              messages: null
            });
            
            console.log('Web search response received:', webSearchResponse);
            return; 
          }

          const response = await chatApi.generateResponse({
            conversation: conversationId,
            model: modelId,
            is_new: false,
            prompt: promptResponse.id,
            prev: getPreviousPromptResponsePairs(branches[currentBranch], nextPosition[1], modelId)
          });

          if (response.status && response.data) {
            setBranches(prev => prev.map((branch, idx) => 
              idx === currentBranch ? {
                ...branch,
                messages: branch.messages.map(msg => 
                  msg.id === promptResponse.id ? {
                    ...msg,
                    responses: msg.responses.map(resp => 
                      resp.modelId === modelId ? {
                        ...resp,
                        id: String(response.data.id),
                        content: response.data.response,
                        status: 'complete'
                      } : resp
                    )
                  } : msg
                )
              } : branch
            ));
          } else {
            // Handle error state
            setBranches(prev => prev.map((branch, idx) => 
              idx === currentBranch ? {
                ...branch,
                messages: branch.messages.map(msg => 
                  msg.id === promptResponse.id ? {
                    ...msg,
                    responses: msg.responses.map(resp => 
                      resp.modelId === modelId ? {
                        ...resp,
                        status: 'error',
                        error: response.message || 'Failed to generate response'
                      } : resp
                    )
                  } : msg
                )
              } : branch
            ));
          }
        } catch (error) {
          console.error('Error in follow-up response:', error);
          // Update error state in UI
          setBranches(prev => prev.map((branch, idx) => 
            idx === currentBranch ? {
              ...branch,
              messages: branch.messages.map(msg => 
                msg.id === promptResponse.id ? {
                  ...msg,
                  responses: msg.responses.map(resp => 
                    resp.modelId === modelId ? {
                      ...resp,
                      status: 'error',
                      error: 'Failed to generate response'
                    } : resp
                  )
                } : msg
              )
            } : branch
          ));
        }
      });

      setInput(""); // Clear input after sending
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

  const handleFeedbackChange = (responseId: string, feedback: 'liked' | 'disliked' | null) => {
    setResponseFeedback(prev => ({
      ...prev,
      [responseId]: feedback
    }));
  };

  const handleModelSelect = useCallback((modelId: string, sessionId: string, messageId: string) => {
    setActiveContents(prev => ({
      ...prev,
      [messageId]: { 
        type: 'model',
        id: modelId 
      }
    }));
  }, []);

  const handleSummarySelect = useCallback((sessionId: string, messageId: string) => {
    setActiveContents(prev => ({
      ...prev,
      [messageId]: {
        type: 'summary',
        id: 'default'
      }
    }));
  }, []);

  const handleRetry = async (sessionId: string, modelId: string, promptId: string) => {
    // Update the response status to loading
    setChatSessions(prev => prev.map(session => ({
      ...session,
      messages: session.messages.map(msg => ({
        ...msg,
        responses: msg.responses.map(resp => 
          resp.modelId === modelId ? {
            ...resp,
            status: 'loading'
          } : resp
        )
      }))
    })));

    try {
      // Make the API call to regenerate response
      const response = await chatApi.generateResponse({
        conversation: sessionId,
        model: modelId,
        is_new: false, // This is a retry, not a new response
        prompt: promptId
      });

      if (response.status && response.data) {
        // Update the response with the new content
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
      console.error('Error retrying response:', error);
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
  };

  // When generating a follow-up response, get previous prompt-response pairs for specific model
  const getPreviousPromptResponsePairs = (branch: Branch, currentY: number, modelId: string): [string, string][] => {
    const pairs: [string, string][] = [];
    
    // Get all messages up to the current Y position
    const previousMessages = branch.messages
      .filter(msg => msg.position[1] < currentY)
      .sort((a, b) => a.position[1] - b.position[1]);

    // For each message, get its prompt ID and the response ID for the specific model
    previousMessages.forEach(msg => {
      const modelResponse = msg.responses.find(r => 
        r.modelId === modelId && 
        r.status === 'complete'
      );
      
      if (modelResponse) {
        pairs.push([msg.id, modelResponse.id]);
        console.log(`Found pair for model ${modelId}:`, [msg.id, modelResponse.id]);
      }
    });

    console.log(`Previous prompt-response pairs for model ${modelId}:`, pairs);
    return pairs;
  };

  return (
    <RenderPageContent>
      <ScrollArea ref={scrollAreaRef} className="flex-1">
        <div className="max-w-xl sm:max-w-2xl md:max-w-4xl mt-4 mx-auto px-4">
          {branches[currentBranch]?.messages?.map((message, index) => (
            <div key={`${message.position[0]}-${message.position[1]}`} className="mb-8">
              <ChatMessage
                content={message.content}
                sender={message.sender}
                timestamp={message.timestamp}
                position={message.position}
                onEditMessage={handleEditMessage}
                totalBranches={branches.length}
                currentBranch={currentBranch}
                onBranchChange={setCurrentBranch}
                branches={branches}
              />
              <div className="mt-4">
                <div className="grid grid-cols-auto-fit gap-4 max-w-[90%] mx-auto">
                  {selectedModels.chat.map((modelId, index) => {
                    const model = chatModels.find(m => m.model_uid === modelId);
                    if (!model) return null;

                    const response = message.responses?.[index];
                    const isLoading = response?.status === 'loading';
                    const hasError = response?.status === 'error';

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

                    if (hasError) {
                      return (
                        <RetryResponse
                          key={modelId}
                          model={model}
                          onRetry={() => handleRetry(conversationId!, modelId, message.id)}
                        />
                      );
                    }

                    return (
                      <ModelSelector
                        key={modelId}
                        models={[{
                          ...model,
                          response: response?.content
                        } as Model]}
                        activeModel={activeContents[message.id]?.id === modelId ? modelId : ''}
                        onSelect={(modelId) => handleModelSelect(modelId, conversationId!, message.id)}
                      />
                    );
                  })}
                </div>

                {message.responses && message.responses.length > 0 && (
                  <div className="mt-4">
                    {activeContents[message.id]?.type === 'model' && (
                      <ModelResponse
                        key={`${conversationId}-${activeContents[message.id].id}`}
                        model={chatModels.find(m => m.model_uid === activeContents[message.id].id)?.model_name || ""}
                        content={message.responses.find(r => 
                          r.modelId === activeContents[message.id].id
                        )?.content || ""}
                        model_img={chatModels.find(m => m.model_uid === activeContents[message.id].id)?.model_image || ""}
                        responseId={message.responses.find(r => 
                          r.modelId === activeContents[message.id].id
                        )?.id || ""}
                        sessionId={conversationId!}
                        feedback={responseFeedback[message.responses.find(r => 
                          r.modelId === activeContents[message.id].id
                        )?.id || ""]}
                        onFeedbackChange={handleFeedbackChange}
                        webSearchEnabled={isWebSearch}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          )) || null}
        </div>
      </ScrollArea>
      <ScrollToBottom 
        scrollAreaRef={scrollAreaRef}
        className="z-50 w-8 h-8"
        content={branches[currentBranch]?.messages || []}
      />
      <ChatInput
        value={input}
        onChange={handleInputChange}
        onSend={handleSendMessage}
        inputRef={useRef<HTMLTextAreaElement>(null)}
        isLoading={isLoading}
        isWeb={true}
        isCombined={true}
        onWebSearchToggle={() => {}}
        onCombinedToggle={() => {}}
      />
      {/* <SourcesWindow
        sources={sources}
        isOpen={isOpen}
        onClose={close}
        responseId={activeResponseId || ''}
        userPrompt={branches[currentBranch].messages[0].content || ''}
      /> */}
    </RenderPageContent>
  );
}
