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
  SUMMARY_DATA
} from "@/lib/constants";
import { useSelectedModelsStore, useContentStore, useWebSearchStore, useSettingsStore, useCombinedModeStore } from "@/stores";
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
import { Source } from '@/lib/types';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp } from "lucide-react"
import { CombinedLoader } from "@/components/features/CombinedLoader";

interface ChatSession {
  id: string; // conversation UUID
  title: string;
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
  createdInCombinedMode: boolean;
}

interface ModelResponse {
  id: string; // response ID
  modelId: string; // model_uid
  content: string;
  status: 'loading' | 'complete' | 'error';
  error?: string;
  sources?: Source[];
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  position: [number, number];
  responses: ModelResponse[];
  createdInCombinedMode: boolean;
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
  const { isCombinedMode } = useCombinedModeStore();
  const [combinedLoading, setCombinedLoading] = useState<{ [key: string]: boolean }>({});
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

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
        content: initialPrompt,
        sender: 'user',
        timestamp: new Date(),
        createdInCombinedMode: isCombinedMode,
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
        createdInCombinedMode: isCombinedMode,
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

  // Add new state for web search loading
  const [webSearchLoading, setWebSearchLoading] = useState<Record<string, boolean>>({});

  const [sourcesWindowState, setSourcesWindowState] = useState<{
    isOpen: boolean;
    activeResponseId: string | null;
    sources: Source[];
    userPrompt: string;
  }>({
    isOpen: false,
    activeResponseId: null,
    sources: [],
    userPrompt: ''
  });

  // Initialize expandedResponses with true for all messages by default
  const [expandedResponses, setExpandedResponses] = useState<Record<string, boolean>>({});

  useEffect(() => {
    branches[currentBranch]?.messages.forEach(message => {
      setExpandedResponses(prev => ({
        ...prev,
        [message.id]: true
      }));
    });
  }, [branches, currentBranch]);

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
    const handleInitialResponse = async () => {
      if (!conversationId || !promptId) return;

      const activeModels = selectedModels.chat.filter(
        modelId => !inactiveModels.includes(modelId)
      );

      // Handle web search first if enabled
      if (isWebSearch) {
        console.log('Web search is enabled - making web search API call');
        setWebSearchLoading(prev => ({ ...prev, [promptId]: true }));

        chatApi.webSearch({
          prompt_id: promptId,
          conversation_id: conversationId,
          follow_up: false,
          prev: null
        })
        .then(webSearchResponse => {
          console.log('Web search response received:', webSearchResponse);
          setBranches(prev => prev.map(branch => ({
            ...branch,
            messages: branch.messages.map(msg => 
              msg.id === promptId ? {
                ...msg,
                responses: msg.responses.map(resp => ({
                  ...resp,
                  sources: webSearchResponse.results
                }))
              } : msg
            )
          })));
        })
        .catch(error => {
          console.error('Error in web search:', error);
          toast({
            title: "Web Search Error",
            description: "Failed to complete web search, falling back to model responses.",
            variant: "destructive"
          });
        })
        .finally(() => {
          setWebSearchLoading(prev => ({ ...prev, [promptId]: false }));
        });
      }

      // Handle model responses
      const modelResponsePairs: [string, number][] = [];
      let isFirstResponse = true; // Flag to track first response

      await Promise.all(activeModels.map(async (modelId) => {
        try {
          if (isCombinedMode) { 
            setCombinedLoading(prev => ({ ...prev, [promptId]: true }));
          }
          const response = await chatApi.generateResponse({
            conversation: conversationId,
            model: modelId,
            is_new: true,
            prompt: promptId
          });

          if (response.status && response.data) {
            modelResponsePairs.push([modelId, response.data.id]);
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

            // Set as active content if it's the first response
              if (isFirstResponse && !isCombinedMode) {
                setActiveContents(prev => ({
                  ...prev,
                  [promptId]: {
                    type: 'model',
                    id: modelId
                  }
                }));
                isFirstResponse = false;
              }
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
          console.error('Error in model response:', error);
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
      }));

      // Handle combined mode response
      if (isCombinedMode) {
        try {
          const combinationResponse = await chatApi.getCombination({
            promptId,
            modelResponsePairs
          });
          console.log('Combination response received:', combinationResponse);

          const modelImages = selectedModels.chat
            .map(modelId => {
              const model = chatModels.find(m => m.model_uid === modelId);
              return model?.model_image || null;
            })
            .filter((img): img is string => Boolean(img) && img !== '');

          console.log(modelImages,'this is a model image')
          // Only proceed if we have valid images
          if (modelImages.length > 0) {
            // Update the branch with the combined response
            setBranches(prev => prev.map((branch, idx) => 
              idx === currentBranch ? {
                ...branch,
                messages: branch.messages.map(msg => 
                  msg.id === promptId ? {
                    ...msg,
                    responses: [{
                      id: 'combined',
                      modelId: 'combined',
                      content: combinationResponse.combination,
                      status: 'complete',
                      model_images: modelImages
                    }]
                  } : msg
                )
              } : branch
            ));

            // Automatically set as active content
            setActiveContents(prev => ({
              ...prev,
              [promptId]: {
                type: 'model',
                id: 'combined'
              }
            }));
          }
        } catch (error) {
          console.error('Error in combination response:', error);
        } finally {
          setCombinedLoading(prev => ({ ...prev, [promptId]: false }));
        }
      }
    };

    handleInitialResponse();
  }, [conversationId, promptId, isCombinedMode]);

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
            createdInCombinedMode: isCombinedMode,
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
      setCompleted(true);
    }
  };

  const handleSendMessage = async (fileContent?: any) => {
    if (!input.trim() || !conversationId) return;

    
    
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
      setInput("");

      // Store the current combined mode state with the message
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
                createdInCombinedMode: isCombinedMode,
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

      // Handle web search first if enabled
      if (isWebSearch) {
        console.log('Web search is enabled - making web search API call');
        setWebSearchLoading(prev => ({ ...prev, [promptResponse.id]: true }));

        try {
          const webSearchResponse = await chatApi.webSearch({
            prompt_id: promptResponse.id,
            conversation_id: conversationId,
            follow_up: true,
            prev: getPreviousPromptResponsePairs(branches[currentBranch], nextPosition[1], 'websearch')
          });
          
          console.log('Web search response received:', webSearchResponse);
          
          // Store the web search results in the state
          setBranches(prev => prev.map((branch, index) => 
            index === currentBranch
              ? {
                  ...branch,
                  messages: branch.messages.map(msg => 
                    msg.id === promptResponse.id ? {
                      ...msg,
                      responses: msg.responses.map(resp => ({
                        ...resp,
                        sources: webSearchResponse.results // Store the web search results
                      }))
                    } : msg
                  )
                }
              : branch
          ));
        } catch (error) {
          console.error('Error in web search:', error);
          toast({
            title: "Web Search Error",
            description: "Failed to complete web search, falling back to model responses.",
            variant: "destructive"
          });
        } finally {
          setWebSearchLoading(prev => ({ ...prev, [promptResponse.id]: false }));
        }
      }

      // Generate responses for each active model
      const activeModels = selectedModels.chat.filter(
        modelId => !inactiveModels.includes(modelId)
      );

      const modelResponsePairs: [string, number][] = [];
      let isFirstResponse = true; // Flag to track first response

      await Promise.all(activeModels.map(async (modelId) => {
        try {
          if (isCombinedMode) { 
            setCombinedLoading(prev => ({ ...prev, [promptResponse.id]: true }));
          }
          setIsLoading(true);
          const response = await chatApi.generateResponse({
            conversation: conversationId,
            model: modelId,
            is_new: false,
            prompt: promptResponse.id,
            prev: getPreviousPromptResponsePairs(branches[currentBranch], nextPosition[1], modelId)
          });

          if (response.status && response.data) {
            // Collect model_uid and response_id
            modelResponsePairs.push([response.data.model_uid, response.data.id]);
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

            // Set as active content if it's the first response
            if (isFirstResponse && !isCombinedMode) {
              setActiveContents(prev => ({
                ...prev,
                [promptResponse.id]: {
                  type: 'model',
                  id: modelId
                }
              }));
              isFirstResponse = false;
            }
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
          console.error('Error in model response:', error);
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
      }));

      
      if (isCombinedMode) {
        try {
          const combinationResponse = await chatApi.getCombination({
            promptId: promptResponse.id,
            modelResponsePairs: modelResponsePairs
          });
          console.log('Combination response received:', combinationResponse);

          // Add null check and filter out any undefined or empty strings
          const modelImages = selectedModels.chat
            .map(modelId => {
              const model = chatModels.find(m => m.model_uid === modelId);
              return model?.model_image || null;
            })
            .filter((img): img is string => Boolean(img) && img !== '');

            console.log(modelImages,'this is a model image')
          // Only proceed if we have valid images
          if (modelImages.length > 0) {
            // Update the branch with the combined response
            setBranches(prev => prev.map((branch, idx) => 
              idx === currentBranch ? {
                ...branch,
                messages: branch.messages.map(msg => 
                  msg.id === promptResponse.id ? {
                    ...msg,
                    responses: [{
                      id: 'combined',
                      modelId: 'combined',
                      content: combinationResponse.combination,
                      status: 'complete',
                      model_images: modelImages
                    }]
                  } : msg
                )
              } : branch
            ));

            // Automatically set as active content
            setActiveContents(prev => ({
              ...prev,
              [promptResponse.id]: {
                type: 'model',
                id: 'combined'
              }
            }));
          }
        } catch (error) {
          console.error('Error in combination response:', error);
        } finally {
          setCombinedLoading(prev => ({ ...prev, [promptResponse.id]: false }));
        }
      }

      // setInput("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setCompleted(true);
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

  const handleRetry = async (modelId: string, promptId: string) => {
    // Find the message to get its position
    const message = branches[currentBranch].messages.find(msg => msg.id === promptId);
    if (!message) return;

    // Update the specific model's response status to loading
    setBranches(prev => prev.map(branch => ({
      ...branch,
      messages: branch.messages.map(msg => 
        msg.id === promptId ? {
          ...msg,
          responses: msg.responses.map(resp => 
            resp.modelId === modelId ? {
              ...resp,
              status: 'loading',
              content: '', // Clear the error content
              error: undefined // Clear any error message
            } : resp
          )
        } : msg
      )
    })));

    try {
      // Make the API call to regenerate response with previous context
      const response = await chatApi.generateResponse({
        conversation: conversationId!,
        model: modelId,
        is_new: false,
        prompt: promptId,
        prev: getPreviousPromptResponsePairs(branches[currentBranch], message.position[1], modelId)
      });

      if (response.status && response.data) {
        // Update the response with the new content
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
      console.error('Error retrying response:', error);
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
                error: 'Failed to generate response',
              } : resp
            )
          } : msg
        )
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
        console.log(`Found pair for model ${modelId}:`, msg.id);
        console.log(`Found pair for model ${modelId}:`, modelResponse.id);
      }
    });

    console.log(`Previous prompt-response pairs for model ${modelId}:`, pairs);
    return pairs;
  };

  const handleSourcesClick = (responseId: string, sources: Source[], userPrompt: string) => {
    setSourcesWindowState({
      isOpen: true,
      activeResponseId: responseId,
      sources: sources,
      userPrompt: userPrompt
    });
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
              <div className="">
                {webSearchLoading[message.id] && (
                  <div className="p-4 grid grid-cols-auto-fit gap-4 max-w-[90%] mx-auto">
                    <p className="text-sm animate-pulse bg-gradient-to-r from-primary via-primary/50 to-primary/20 bg-clip-text text-transparent">
                      Searching the web...
                    </p>
                  </div>
                )}
                {combinedLoading[message.id] && (
                  <CombinedLoader 
                    modelNames={selectedModels.chat
                      .map(modelId => chatModels.find(m => m.model_uid === modelId)?.model_name)
                      .filter(Boolean) as string[]
                    }
                  />
                )}
                <div>
                {!message.createdInCombinedMode && !combinedLoading[message.id] && (
                    <Collapsible
                      open={expandedResponses[message.id]}
                      onOpenChange={(isOpen) => 
                        setExpandedResponses(prev => ({ ...prev, [message.id]: isOpen }))
                      }
                    >
                      
                        <CollapsibleTrigger className="ml-10">
                        {(!webSearchLoading[message.id] && 
                          !message.responses.some(r => r.status === 'loading')) && (
                          <div className="flex items-center justify-start w-full space-x-2">
                            <span></span>
                            {expandedResponses[message.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="grid grid-cols-auto-fit gap-4 max-w-[90%] mx-auto mt-2">
                          {selectedModels.chat.map((modelId, index) => {
                            const model = chatModels.find(m => m.model_uid === modelId);
                            if (!model) return null;

                            const response = message.responses?.[index];
                            const isLoading = response?.status === 'loading';
                            const hasError = response?.status === 'error';

                            // Skip rendering if in combined mode and still loading
                            if (message.createdInCombinedMode && isLoading) {
                              return null;
                            }

                            if (isLoading && !message.createdInCombinedMode) {
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
                                  onRetry={() => handleRetry(modelId, message.id)}
                                />
                              );
                            }

                            
                            if (message.createdInCombinedMode) {
                              return null;
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
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </div>
                <div className="mt-4">
                  {activeContents[message.id]?.type === 'model' && (
                    <ModelResponse
                      key={`${conversationId}-${activeContents[message.id].id}`}
                      model={activeContents[message.id].id === 'combined' 
                        ? selectedModels.chat
                            .map(modelId => chatModels.find(m => m.model_uid === modelId)?.model_name)
                            .filter(Boolean)
                            .join(' + ')
                        : chatModels.find(m => m.model_uid === activeContents[message.id].id)?.model_name || ""}
                      content={message.responses.find(r => 
                        r.modelId === activeContents[message.id].id
                      )?.content || ""}
                      model_img={activeContents[message.id].id === 'combined'
                        ? selectedModels.chat
                            .map(modelId => chatModels.find(m => m.model_uid === modelId)?.model_image)
                            .filter((img): img is string => Boolean(img) && img !== '')
                        : chatModels.find(m => m.model_uid === activeContents[message.id].id)?.model_image || ""}
                      responseId={message.responses.find(r => 
                        r.modelId === activeContents[message.id].id
                      )?.id || ""}
                      sessionId={conversationId!}
                      feedback={responseFeedback[message.responses.find(r => 
                        r.modelId === activeContents[message.id].id
                      )?.id || ""]}
                      onFeedbackChange={handleFeedbackChange}
                      webSearchEnabled={isWebSearch}
                      sources={message.responses.find(r => 
                        r.modelId === activeContents[message.id].id
                      )?.sources || []}
                      onSourcesClick={(responseId, sources) => handleSourcesClick(responseId, sources, message.content)}
                      onRegenerate={() => handleRetry(activeContents[message.id].id, message.id)} // Reuse handleRetry
                    />
                  )}
                </div>
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
      <SourcesWindow
        sources={sourcesWindowState.sources}
        isOpen={sourcesWindowState.isOpen}
        onClose={() => setSourcesWindowState(prev => ({ ...prev, isOpen: false }))}
        responseId={sourcesWindowState.activeResponseId || ''}
        userPrompt={sourcesWindowState.userPrompt}
      />
    </RenderPageContent>
  );
}
