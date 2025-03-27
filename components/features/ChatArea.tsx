"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModelSelector } from "./ModelSelector";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ModelResponse as ModelResponseComponent, useSourcesWindowStore } from "./ModelResponse";
import RenderPageContent from "../RenderPageContent";
import RetryResponse from "./RetryResponse"
import { useSelectedModelsStore, useContentStore, useWebSearchStore, useSettingsStore, useCombinedModeStore, useHistoryStore, Attachment } from "@/stores";
import { useModelsStore, useConversationStore } from "@/stores/models";
import { chatApi } from '@/lib/api/chat';
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollToBottom } from "@/components/ScrollToBottom";
import { useToast } from "@/hooks/use-toast";
import { SourcesWindow } from "../SourcesWindow";
import { Summary } from "./Summary";
import { Model } from "@/lib/api/models";
import { Source, LoadedConversation } from '@/lib/types';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, TriangleAlert, } from "lucide-react"
import { CombinedLoader } from "@/components/features/CombinedLoader";
import { cn } from "@/lib/utils";
import { useParams } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useAuthStore } from "@/stores";
import { PromptModal } from "@/components/ui/modals";
import { useRouter } from "next/navigation";


interface ChatSession {
  id: string; // conversation UUID
  title: string;
  messages: ChatMessage[];
  activeModel: string;
  status: 'active' | 'complete';
}
interface ModelResponse {
  id: string; // response ID
  modelId: string; // model_uid
  content: string;
  status: 'loading' | 'complete' | 'error';
  error?: string;
  sources?: Source[];
  model_names?: string[];
  model_images?: string[];
}


interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  responses: ModelResponse[];
  createdInCombinedMode: boolean;
  attachment?: {
    name: string;
    type: string;
    size: number;
    url: string;
  };
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  summaryEnabled?: boolean;
  position: [number, number];
  responses: ModelResponse[];
  createdInCombinedMode: boolean;
  attachment?: {
    name: string;
    type: string;
    size: number;
    url: string;
  };
}

interface Branch {
  messages: Message[];
  startPosition: [number, number];
  parentPosition?: [number, number];
}

interface LoadedResponse {
  id: number;
  body: string;
  model: {
    uid: string;
    name: string;
    image: string;
    model_plan: string;
  };
  liked: boolean | null;
}

export function ChatArea() {
  const { toast } = useToast();
  const { content, setContent } = useContentStore();
  const { selectedModels, inactiveModels, setTempSelectedModels, saveSelectedModels, setLoadingLatest } = useSelectedModelsStore();
  const { chatModels } = useModelsStore();
  const { conversationId, promptId, setConversationId, generationType, setGenerationType } = useConversationStore();
  const { personalization } = useSettingsStore();
  const { isOpen, activeResponseId, sources, close } = useSourcesWindowStore();
  const { isWebSearch } = useWebSearchStore();
  const { isCombinedMode } = useCombinedModeStore();
  const [combinedLoading, setCombinedLoading] = useState<{ [key: string]: boolean }>({});
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const pathname = usePathname();
  const { getHistoryItemById } = useHistoryStore();


  const router = useRouter();

  const { user } = useAuthStore();
  const isSummaryEnabled = user?.summary === 1;

  const params = useParams();
  const loadConversationId = params.chatId as string;

  const [activeSessionId, setActiveSessionId] = useState<string>();
  const [responseFeedback, setResponseFeedback] = useState<Record<string, 'liked' | 'disliked' | null>>({});
  const [showSummary, setShowSummary] = useState<Record<string, boolean>>({});
  // const [generatingSummary, setGeneratingSummary] = useState<Record<string, boolean>>({});
  const [generatingSummary, setGeneratingSummary] = useState<{ [key: string]: boolean }>({});
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [conversationModels, setConversationModels] = useState<string[]>([]);
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptConfig, setPromptConfig] = useState<any>(null);
  const [previousSelectedModels, setPreviousSelectedModels] = useState<string[]>([]);
  const [isOldConversation, setIsOldConversation] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [loadConversationError, setLoadConversationError] = useState(false);
  const [chatModelsLoaded, setChatModelsLoaded] = useState(false);

  const { token, setAuth, clearAuth } = useAuthStore();


  const webSearchSourcesRef = useRef<Source[]>([]);

  const createPosition = (x: number = 0, y: number = 0): [number, number] => {
  return [x, y];
};

const thinkingModels = ['deepseek-r1', 'o1', 'o3-mini'];

  

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
    if (!conversationId || !promptId) return [{ messages: [], startPosition: createPosition() }];
    const initialPrompt = content.chat.input;
    
    return [{
      messages: [{
        id: promptId,
        content: initialPrompt,
        sender: 'user',
        timestamp: new Date(),
        position: createPosition(),
        createdInCombinedMode: isCombinedMode,
        responses: selectedModels.chat.map(modelId => ({
          id: `temp-${modelId}`,
          modelId,
          content: '',
          status: 'loading'
        }))
      }],
      startPosition: createPosition()
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

  // Add state for summary content
  const [summaryContent, setSummaryContent] = useState<Record<string, string>>({});

  // Add a ref to track the latest message container
  const latestMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!branches[currentBranch]) return; // Ensure the current branch exists

    const newExpandedResponses = branches[currentBranch].messages.reduce((acc, message) => {
        if (!acc[message.id]) { // Only update if not already expanded
            acc[message.id] = true;
        }
        return acc;
    }, { ...expandedResponses });

    setExpandedResponses(newExpandedResponses);
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

  // Update the effect to handle initial responses
  useEffect(() => {
    const handleInitialResponse = async () => {
      if (!conversationId || !promptId) return;
      setIsSending(true);

      const summaryEnabledForMessage = user?.summary === 1;
      const activeModels = selectedModels.chat.filter(modelId => !inactiveModels.includes(modelId));

      setConversationModels(selectedModels.chat);
      setPreviousSelectedModels(selectedModels.chat);

      // Get attachment from content store if available
        const attachment = content.chat.attachment ? {
          name: content.chat.attachment.name,
          type: content.chat.attachment.type,
          size: content.chat.attachment.size,
          url: content.chat.attachment.url
        } : undefined;


      setBranches(prev => prev.map(branch => ({
        ...branch,
        messages: branch.messages.map(msg => 
          msg.id === promptId ? {
            ...msg,
            createdInCombinedMode: isCombinedMode,
            summaryEnabled: summaryEnabledForMessage,
            attachment: attachment,
            responses: activeModels.map(modelId => ({
              id: `temp-${modelId}`,
              modelId,
              content: '',
              status: 'loading'
            }))
          } : msg
        )
      })));

      // Clear the attachment from the content store after using it
      setContent("chat", "attachment", null);

      // Handle web search first if enabled
      if (isWebSearch) {
        // // console.log('Web search is enabled - making web search API call');
        setWebSearchLoading(prev => ({ ...prev, [promptId]: true }));

        try {
          // Wait for web search to complete before proceeding
          const webSearchResponse = await chatApi.webSearch({
            prompt_id: promptId,
            conversation_id: conversationId,
            messages: null
          });
          
          webSearchSourcesRef.current = webSearchResponse.results;
          
          // Update branches with web search results
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
        } catch (error) {
          // console.error('Error in web search:', error);
          toast({
            title: "Web Search Error",
            description: "Failed to complete web search, falling back to model responses.",
            variant: "destructive"
          });
        } finally {
          setWebSearchLoading(prev => ({ ...prev, [promptId]: false }));
        }
      }

      // Handle model responses
      const modelResponsePairs: number[] = [];
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
            modelResponsePairs.push(response.data.id);
            setBranches(prev => prev.map(branch => ({
              ...branch,
              messages: branch.messages.map(msg => 
                msg.id === promptId ? {
                  ...msg,
                  createdInCombinedMode: isCombinedMode,
                  summaryEnabled: summaryEnabledForMessage,
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
          // console.error('Error in model response:', error);
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
        } finally {
          setIsSending(false);
        }
      }));

      // Handle summary response
      if (summaryEnabledForMessage && !isCombinedMode) {
        try {
          setGeneratingSummary(prev => {
            const newState = { ...prev, [promptId]: true };
            // console.log(newState, 'the updated generatingSummary state');
            return newState;
          });
  
          // Make API call to generate summary
          const summaryResponse = await chatApi.getSummary({
            messageId: promptId,
            modelResponsePairs
          });
  
          setShowSummary(prev => ({ ...prev, [promptId]: true }));
          // console.log(showSummary, 'The set show summary');
          setSummaryContent(prev => ({
            ...prev,
            [promptId]: summaryResponse.summary
          }));
        } catch (error) {
          // console.error('Error generating summary:', error);
          toast({
            title: "Error",
            description: "Failed to generate summary",
            variant: "destructive"
          });
        } finally {
          setGeneratingSummary(prev => {
            const newState = { ...prev, [promptId]: false };
            // console.log(newState, 'the final generatingSummary state');
            return newState;
          });
        }
      }

      // Handle combined mode response
      if (isCombinedMode) {
        try {
          const combinationResponse = await chatApi.getCombination({
            promptId,
            modelResponsePairs
          });

          const modelImages = selectedModels.chat
            .filter(modelId => !inactiveModels.includes(modelId)) // Filter for active models
            .map(modelId => {
                const model = chatModels.find(m => m.model_uid === modelId);
                return model?.model_image || null;
            })
            .filter((img): img is string => Boolean(img) && img !== '');

          const modelNames = selectedModels.chat
            .filter(modelId => !inactiveModels.includes(modelId)) // Filter for active models
            .map(modelId => {
                const model = chatModels.find(m => m.model_uid === modelId);
                return model?.model_name || null; // Collect model names
            })
            .filter((name): name is string => Boolean(name) && name !== ''); // Filter out nulls

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
                      id: String(combinationResponse.id),
                      modelId: 'alle-ai-comb',
                      content: combinationResponse.combination,
                      status: 'complete',
                      model_images: modelImages,
                      model_names: modelNames,
                      sources: webSearchSourcesRef.current
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
                id: 'alle-ai-comb'
              }
            }));
          }
        } catch (error) {
          // console.error('Error in combination response:', error);
        } finally {
          setCombinedLoading(prev => ({ ...prev, [promptId]: false }));
          webSearchSourcesRef.current = [];
        }
      }
    };

    const loadConversation = async () => {
      if (!loadConversationId) {
        return;
      }

      setConversationId(loadConversationId);     
      setIsLoadingConversation(true);
      setLoadingLatest(true);


      // Check if this is an old conversation
      const historyItem = getHistoryItemById(loadConversationId);
      if (historyItem && historyItem.created_at) {
        const timestamp = new Date(historyItem.created_at);
        const cutoffDate = new Date('2025-03-12');

        
        if (timestamp < cutoffDate) {
          setIsOldConversation(true);
        } else {
          setIsOldConversation(false);
        }
      }

      // if (conversationId) {
      //   getConversationModels(conversationId);
      // }
      
      try {
        // // console.log('Loading conversation content');
        const response = await chatApi.getConversationContent('chat', loadConversationId);
        // console.log('Loaded conversation content:', response);
        
        handleLoadConversation(response);
      } catch (error) {
        // console.error('Error loading conversation:', error);
        setLoadConversationError(true);
        toast({
          title: "Error",
          description: "Failed to load conversation",
          variant: "destructive",
        });
      } finally {
        setIsLoadingConversation(false);
        // setGenerationType('new');
      }
    };

    if (generationType === 'new') {
      handleInitialResponse();
    } else if(generationType === 'load'){
      loadConversation();
    }
    // // console.log(generationType);

    // handleInitialResponse();
  }, []);

  // Update the useEffect to check if chat models are loaded
  useEffect(() => {
    // Check if chat models are loaded
    if (chatModels && chatModels.length > 0) {
      setChatModelsLoaded(true);
    }
  }, [chatModels]);

  useEffect(()=>{
    if (conversationId && generationType === 'load' && chatModelsLoaded) {
      getConversationModels(conversationId);
    }
  },[conversationId, generationType, chatModelsLoaded])

  // Add an effect to scroll to the latest message when it changes
useEffect(() => {
  if (latestMessageRef.current && branches[currentBranch]?.messages.length > 0) {
    // Scroll the latest message into view with a smooth animation
    latestMessageRef.current.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start' // Align to the top of the viewport
    });
  }
}, [branches, currentBranch]);

  useEffect(() => {

    if(selectedModels.chat.length > 0 && conversationModels.length > 0){
      setPreviousSelectedModels(selectedModels.chat);
        if (JSON.stringify(conversationModels) !== JSON.stringify(selectedModels.chat)) {
          setPromptConfig({
            title: "Change Models",
            message: "Selecting new models will start a new conversation. Do you want to continue?",
            type: "warning",
            actions: [
              {
                label: "Cancel",
                onClick: () => {
                  setTempSelectedModels(previousSelectedModels);
                  saveSelectedModels('chat');
                  setShowPrompt(false);
                },
                variant: "default"
              },
              {
                label: "Proceed",
                onClick: () => {
                  setShowPrompt(false);
                  router.replace(`/chat`);
                },
                variant: "default"
              }
            ]
          });
          setShowPrompt(true);
        }
    }
  }, [selectedModels]);

  // When loading the conversation
  const handleLoadConversation = (loadedConversation: any[]) => {
    const messagesByYPosition: Record<number, any[]> = {};
    
    loadedConversation.forEach(message => {

      if (message.position) {
        message.position = message.position.map((coord: any) => 
          typeof coord === 'string' ? parseInt(coord, 10) : coord
        );
      }

      const yPos = message.position[1];
      if (!messagesByYPosition[yPos]) {
        messagesByYPosition[yPos] = [];
      }
      messagesByYPosition[yPos].push(message);

      // const yPos = message.position ? message.position[1] : 0;
      // if (!messagesByYPosition[yPos]) {
      //   messagesByYPosition[yPos] = [];
      // }
      // messagesByYPosition[yPos].push(message);
    });
    
    const newBranches: Branch[] = [];
    
    Object.keys(messagesByYPosition)
      .map(Number)
      .sort((a, b) => a - b)
      .forEach(yPos => {
        const messagesAtLevel = messagesByYPosition[yPos];
        
        // For each message at this level
        messagesAtLevel.forEach(message => {
          const [xPos, yPos] = message.position;
          
          // Find if this message belongs to an existing branch
          let targetBranch = newBranches.find(branch => {
            // If this is the first message (y=0), it starts a new branch
            if (yPos === 0) return false;
            
            // Otherwise, check if there's a branch that has a message at the previous y-level
            // with the same x-coordinate (meaning this message continues that branch)
            const previousMessage = branch.messages.find(msg => 
              msg.position[1] === yPos - 1 && msg.position[0] === xPos
            );
            
            return !!previousMessage;
          });
          
          // If no existing branch found, create a new one
          if (!targetBranch) {
            targetBranch = {
              messages: [],
              startPosition: [xPos, yPos],
              // If not at y=0, this is a branch from a parent
              parentPosition: yPos > 0 ? [xPos, yPos - 1] : undefined
            };
            newBranches.push(targetBranch);
          }

          const webSearchSources = message.input_content?.web_search_results?.results || [];

          // Extract file attachment if present
        let attachment;
        if (message.input_content?.uploaded_files?.length > 0) {
          const file = message.input_content.uploaded_files[0];
          
          const isImage = file.file_type === 'image';
          
          attachment = {
            name: file.file_name,
            type: file.file_type,
            size: parseInt(file.file_size) || 0,
            url: isImage ? file.file_content : ''
          };
        }

          // Get latest responses for each unique model
          const latestResponses = message.responses.reduce((acc: any[], response: any) => {
            const modelUid = response.model.uid;
            
            // Always keep alle-ai-summ and alle-ai-comb responses
            if (modelUid === 'alle-ai-summ' || modelUid === 'alle-ai-comb') {
              return [...acc, response];
            }

            // Find existing response for this model
            const existingIndex = acc.findIndex(r => 
              r.model.uid === modelUid && 
              r.model.uid !== 'alle-ai-summ' && 
              r.model.uid !== 'alle-ai-comb'
            );
            
            if (existingIndex === -1) {
              // If no existing response for this model, add it
              return [...acc, response];
            } else {
              // If existing response, replace if current one has higher ID
              if (response.id > acc[existingIndex].id) {
                acc[existingIndex] = response;
              }
              return acc;
            }
          }, []);

          // Check for combined response
          const combinedResponse = latestResponses.find(
            (response: LoadedResponse) => response.model.uid === 'alle-ai-comb'
          );
          
          // Extract model names and images for combined response
          const modelNames = message.responses
            .filter((r: LoadedResponse) => 
              r.model.uid !== 'alle-ai-comb' && 
              r.model.uid !== 'alle-ai-summ'
            )
            .map((response: LoadedResponse) => {
              if (response.model.name) {
                return response.model.name;
              }
              const model = chatModels.find(m => m.model_uid === response.model.uid);
              return model ? model.model_name : null;
            })
            .filter(Boolean);

          const modelImages = message.responses
            .filter((r: LoadedResponse) => 
              r.model.uid !== 'alle-ai-comb' && 
              r.model.uid !== 'alle-ai-summ'
            )
            .map((r: LoadedResponse) => r.model.image)
            .filter(Boolean);

          // Create the message object
          const messageObj = {
            id: String(message.prompt_id),
            content: message.prompt,
            sender: 'user',
            timestamp: new Date(),
            position: message.position,
            createdInCombinedMode: !!combinedResponse,
            attachment: attachment,
            responses: combinedResponse 
              ? [{
                  id: String(combinedResponse.id),
                  modelId: 'alle-ai-comb',
                  content: combinedResponse.body,
                  status: 'complete',
                  model_images: modelImages,
                  model_names: modelNames,
                  sources: webSearchSources
                }]
              : latestResponses
                  .filter((response: LoadedResponse) => response.model.uid !== 'alle-ai-summ' && response.model.uid !== 'alle-ai-comb')
                  .map((response: LoadedResponse) => ({
                    id: String(response.id),
                    modelId: response.model.uid,
                    content: response.body,
                    status: 'complete',
                    model_images: [response.model.image],
                    model_names: [response.model.name || chatModels.find(m => m.model_uid === response.model.uid)?.model_name].filter(Boolean),
                    sources: webSearchSources,
                  }))
          };
          
          // Add the message to the branch
          targetBranch.messages.push(messageObj as Message);
        });
      });

    // Sort messages within each branch by y-position
    newBranches.forEach(branch => {
      branch.messages.sort((a, b) => a.position[1] - b.position[1]);
    });
    
    setBranches(newBranches);
    setCurrentBranch(0);
    
    // Process summaries and set active contents
    loadedConversation.forEach(message => {
      const summaryResponse = message.responses.find(
        (response: LoadedResponse) => response.model.uid === 'alle-ai-summ'
      );
      
      const combinedResponse = message.responses.find(
        (response: LoadedResponse) => response.model.uid === 'alle-ai-comb'
      );
      
      if (summaryResponse) {
        setSummaryContent(prev => ({
          ...prev,
          [String(message.prompt_id)]: summaryResponse.body
        }));
        setShowSummary(prev => ({
          ...prev,
          [String(message.prompt_id)]: true
        }));
        setGeneratingSummary(prev => ({
          ...prev,
          [String(message.prompt_id)]: false
        }));
      }
      
      // Set active content based on response type
      setActiveContents(prev => ({
        ...prev,
        [String(message.prompt_id)]: combinedResponse 
          ? {
              type: 'model',
              id: 'alle-ai-comb'
            }
          : summaryResponse
          ? {
              type: 'summary',
              id: 'alle-ai-summ'
            }
          : {
              type: 'model',
              id: message.responses[0].model.uid
            }
      }));
    });
  };

  // Get the models used in the conversation
  const getConversationModels = (conversationId: string) => {
    chatApi.getModelsForConversation(conversationId)
      .then(response => {
        console.log('Models used in conversation:', response);
        const modelUids = response.map((model: Model) => model.model_uid);

        setConversationModels(modelUids);
        setTempSelectedModels(modelUids);
        saveSelectedModels('chat');

        // Toggle inactive models using toggleModelActive
        response.forEach((model: { model_uid: string, active: number }) => {
          if (model.active === 0) {
            useSelectedModelsStore.getState().toggleModelActive(model.model_uid);
          }
        });
      })
      .catch(error => {
        // console.error('Error fetching models for conversation:', error);
      })
      .finally(() => {
        setLoadingLatest(false);
      });
  };

  const handleInputChange = (value: string) => {
    setInput(value);
  };

  const handleEditMessage = async (newContent: string, position: [number, number]) => {
    if (!conversationId) return;

    // // console.log('Editing message at position', position);

    try {
      const summaryEnabledForMessage = user?.summary === 1;
      
      // Increment the x position for the new branch
      const newXPosition = branches.reduce((maxX, branch) => {
        const messageAtSameY = branch.messages.find(msg => msg.position[1] === position[1]);
        return messageAtSameY ? Math.max(maxX, messageAtSameY.position[0] + 1) : maxX;
      }, 0);

      const newPosition: [number, number] = createPosition(newXPosition, position[1]);

      // Create prompt
      const promptResponse = await chatApi.createPrompt(
        conversationId,
        newContent,
        newPosition
      );

      // // console.log('old position', position);
      // // console.log('new position', newPosition);

      const newMessage = {
        id: promptResponse.id,
        content: newContent,
        sender: 'user' as const,
        timestamp: new Date(),
        position: newPosition,
        createdInCombinedMode: isCombinedMode,
        summaryEnabled: summaryEnabledForMessage,
        responses: selectedModels.chat
          .filter(modelId => !inactiveModels.includes(modelId))
          .map(modelId => ({
            id: `temp-${modelId}`,
            modelId,
            content: '',
            status: 'loading' as const
          }))
      };

      // Create new branch
      const newBranch: Branch = {
        messages: [newMessage],
        startPosition: newPosition,
        parentPosition: position
      };

      // Add new branch and switch to it
      const newBranches = [...branches];
      newBranches.push(newBranch);
      // // console.log('newBranches', (newBranches));
      setBranches(newBranches);
      setTimeout(() => {
        setCurrentBranch(newBranches.length - 1);
      }, 0);
    

      // Generate responses for the new branch
      const activeModels = selectedModels.chat.filter(
        modelId => !inactiveModels.includes(modelId)
      );

      const modelResponsePairs: number[] = [];
      let isFirstResponse = true;

      await Promise.all(activeModels.map(async (modelId) => {
        try {
          if (isCombinedMode) {
            setCombinedLoading(prev => ({ ...prev, [promptResponse.id]: true }));
          }

          const response = await chatApi.generateResponse({
            conversation: conversationId,
            model: modelId,
            is_new: false,
            prompt: promptResponse.id
          });

          if (response.status && response.data) {
            modelResponsePairs.push(response.data.id);
            
            // Update the branch with the response
            setBranches(prev => prev.map((branch, idx) => 
              idx === newBranches.length - 1 ? {
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
          }
        } catch (error) {
          // console.error('Error in model response:', error);
          // Update error state in the branch
          setBranches(prev => prev.map((branch, idx) => 
            idx === newBranches.length - 1 ? {
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


      //Handle summary mode if enabled
      if (summaryEnabledForMessage && !isCombinedMode) {
      try {
        setGeneratingSummary(prev => ({ ...prev, [promptResponse.id]: true }));
    
        // Make API call to generate summary
        const summaryResponse = await chatApi.getSummary({
          messageId: promptResponse.id,
          modelResponsePairs
        });
    
        setShowSummary(prev => ({ ...prev, [promptResponse.id]: true }));
        setSummaryContent(prev => ({
          ...prev,
          [promptResponse.id]: summaryResponse.summary
        }));
      } catch (error) {
        // console.error('Error generating summary:', error);
        toast({
          title: "Error",
          description: "Failed to generate summary",
          variant: "destructive"
        });
      } finally {
        setGeneratingSummary(prev => ({ ...prev, [promptResponse.id]: false }));
      }
    }

      // Handle combined mode if enabled
      if (isCombinedMode && modelResponsePairs.length > 0) {
        try {
          const combinationResponse = await chatApi.getCombination({
            promptId: promptResponse.id,
            modelResponsePairs
          });

          const modelImages = selectedModels.chat
          .filter(modelId => !inactiveModels.includes(modelId)) // Filter for active models
          .map(modelId => {
              const model = chatModels.find(m => m.model_uid === modelId);
              return model?.model_image || null;
          })
          .filter((img): img is string => Boolean(img) && img !== '');

          const modelNames = selectedModels.chat
          .filter(modelId => !inactiveModels.includes(modelId)) // Filter for active models
          .map(modelId => {
              const model = chatModels.find(m => m.model_uid === modelId);
              return model?.model_name || null; // Collect model names
          })
          .filter((name): name is string => Boolean(name) && name !== ''); // Filter out nulls

          const sources = branches[currentBranch].messages
            .find(msg => msg.id === promptResponse.id)
            ?.responses[0]?.sources || [];

            // // console.log(sources,'this is the source am passing to the combined response')

          // Only proceed if we have valid images
          if (modelImages.length > 0) {
            // Update the branch with the combined response
            setBranches(prev => prev.map((branch, idx) => 
              idx === newBranches.length - 1 ? {
                ...branch,
                messages: branch.messages.map(msg => 
                  msg.id === promptResponse.id ? {
                    ...msg,
                    responses: [{
                      id: String(combinationResponse.id),
                      modelId: 'alle-ai-comb',
                      content: combinationResponse.combination,
                      status: 'complete',
                      model_images: modelImages,
                      model_names: modelNames,
                      sources: sources
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
                id: 'alle-ai-comb'
              }
            }));
          }
        } catch (error) {
          // console.error('Error in combination response:', error);
        } finally {
          setCombinedLoading(prev => ({ ...prev, [promptResponse.id]: false }));
        }
      }

    } catch (error) {
      // console.error('Error editing message:', error);
      toast({
        title: "Error",
        description: "Failed to edit message",
        variant: "destructive"
      });
    }
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

    console.log(token, 'call with this token')
    
    setIsSending(true);
    try {
      const summaryEnabledForMessage = user?.summary === 1;

      const currentBranchMessages = branches[currentBranch].messages;
      const lastMessage = currentBranchMessages[currentBranchMessages.length - 1];
      
      // For follow-ups, keep the same x coordinate but increment y
      const nextPosition = lastMessage 
      ? createPosition(lastMessage.position[0], lastMessage.position[1] + 1)
      : createPosition(0, 0);

      // Restructure the fileContent to match the expected format
    const options = fileContent ? {
      input_content: {
        uploaded_files: fileContent.uploaded_files.map(file => ({
          file_name: file.file_name,
          file_size: file.file_size,
          file_type: file.file_type,
          file_content: file.file_content
        }))
      }
    } : undefined;

      const promptResponse = await chatApi.createPrompt(
        conversationId,
        input,
        nextPosition,
        options
      );
      setInput("");

      // console.log(promptResponse,'This is prompt created in the handleSendMessage in the ChatArea')

      // Store the current combined mode state with the message
      // Create attachment object if file content exists
      let attachment: Attachment | undefined;
      if (promptResponse.input_content?.uploaded_files?.[0]) {
        const file = promptResponse.input_content.uploaded_files[0];
        const isImage = file.file_type === 'image';
        
        attachment = {
          name: file.file_name,
          type: file.file_type,
          size: parseInt(file.file_size),
          url: isImage ? file.file_content : '' // For images, use file_content as URL
        };
      }

      setBranches(prev => prev.map((branch, idx) => 
        idx === currentBranch ? {
          ...branch,
          messages: [...branch.messages, {
            id: promptResponse.id,
            content: input,
            sender: 'user',
            timestamp: new Date(),
            position: nextPosition,
            createdInCombinedMode: isCombinedMode,
            summaryEnabled: summaryEnabledForMessage,
            attachment: attachment,
            responses: selectedModels.chat
              .filter(modelId => !inactiveModels.includes(modelId))
              .map(modelId => ({
                id: `temp-${modelId}`,
                modelId,
                content: '',
                status: 'loading'
            }))
          } as Message]
        } : branch
      ));

      // Handle web search first if enabled
      if (isWebSearch) {
        // // console.log('Web search is enabled - making web search API call');
        setWebSearchLoading(prev => ({ ...prev, [promptResponse.id]: true }));

        try {

          // Use the dedicated function for web search context
          const webSearchPairs = getWebSearchContext(
            branches[currentBranch], 
            nextPosition[1]  // Current Y position
          );

          const webSearchResponse = await chatApi.webSearch({
            prompt_id: promptResponse.id,
            conversation_id: conversationId,
            // follow_up: true,
            messages:  webSearchPairs.length > 0 ? webSearchPairs : null
          });

          webSearchSourcesRef.current = webSearchResponse.results;
          // console.log(webSearchSourcesRef.current, 'Web search results stored in ref');

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
          // console.error('Error in web search:', error);
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

      const modelResponsePairs: number[] = [];
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
            modelResponsePairs.push(response.data.id);
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
          // console.error('Error in model response:', error);
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

        // Handle summary response
        if (summaryEnabledForMessage && !isCombinedMode) {
          try {
            setGeneratingSummary(prev => ({ ...prev, [promptResponse.id]: true }));
    
            // Make API call to generate summary
            const summaryResponse = await chatApi.getSummary({
              messageId: promptResponse.id,
              modelResponsePairs
            });
    
            setShowSummary(prev => ({ ...prev, [promptResponse.id]: true }));
            setSummaryContent(prev => ({
              ...prev,
              [promptResponse.id]: summaryResponse.summary
            }));
          } catch (error) {
            // console.error('Error generating summary:', error);
            toast({
              title: "Error",
              description: "Failed to generate summary",
              variant: "destructive"
            });
          } finally {
            setGeneratingSummary(prev => ({ ...prev, [promptResponse.id]: false }));
          }
        }
      

      
      if (isCombinedMode) {
        try {
          const combinationResponse = await chatApi.getCombination({
            promptId: promptResponse.id,
            modelResponsePairs: modelResponsePairs
          });

          // Add null check and filter out any undefined or empty strings
          const modelImages = selectedModels.chat
          .filter(modelId => !inactiveModels.includes(modelId)) // Filter for active models
          .map(modelId => {
              const model = chatModels.find(m => m.model_uid === modelId);
              return model?.model_image || null;
          })
          .filter((img): img is string => Boolean(img) && img !== '');

          const modelNames = selectedModels.chat
          .filter(modelId => !inactiveModels.includes(modelId)) // Filter for active models
          .map(modelId => {
              const model = chatModels.find(m => m.model_uid === modelId);
              return model?.model_name || null; // Collect model names
          })
          .filter((name): name is string => Boolean(name) && name !== ''); // Filter out nulls

          const sources = branches[currentBranch].messages
          .find(msg => msg.id === promptResponse.id)
          ?.responses[0]?.sources || [];
          
          // console.log(webSearchSourcesRef.current, 'Web search sources from ref for combined response');

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
                      id: String(combinationResponse.id),
                      modelId: 'alle-ai-comb',
                      content: combinationResponse.combination,
                      status: 'complete',
                      model_images: modelImages,
                      model_names: modelNames,
                      sources: webSearchSourcesRef.current
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
                id: 'alle-ai-comb'
              }
            }));
          }
        } catch (error) {
          // console.error('Error in combination response:', error);
        } finally {
          setCombinedLoading(prev => ({ ...prev, [promptResponse.id]: false }));
          webSearchSourcesRef.current = [];
        }
      }

      // setInput("");
    } catch (error) {
      // console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setCompleted(true);
      setIsSending(false);
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
        id: 'alle-ai-summ'
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
      // console.error('Error retrying response:', error);
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

  const getPreviousPromptResponsePairs = (branch: Branch, currentY: number, modelId: string): [string, string][] => {
    const pairs: [string, string][] = [];
    
    // Get all messages up to the current Y position
    const previousMessages = branch.messages
      .filter(msg => msg.position[1] < currentY)
      .sort((a, b) => a.position[1] - b.position[1]);

    // For each message, get its prompt ID and the response ID
    previousMessages.forEach(msg => {
      // If message has a combined response, use that regardless of modelId
      if (msg.createdInCombinedMode) {
        const combinedResponse = msg.responses.find(r => 
          r.modelId === 'alle-ai-comb' && 
          r.status === 'complete'
        );
        if (combinedResponse) {
          pairs.push([msg.id, combinedResponse.id]);
        }
      } else {
        // Only for non-combined messages, look for specific model response
        const modelResponse = msg.responses.find(r => 
          r.modelId === modelId && 
          r.status === 'complete'
        );
        if (modelResponse) {
          pairs.push([msg.id, modelResponse.id]);
        }
      }
    });

    return pairs;
};

// Function specifically for web search context
const getWebSearchContext = (branch: Branch, currentY: number): [string, string][] => {
  const pairs: [string, string][] = [];
  
  // Get all messages up to the current Y position
  const previousMessages = branch.messages
    .filter(msg => msg.position[1] < currentY)
    .sort((a, b) => a.position[1] - b.position[1]);

  // For each message, get its prompt ID and the appropriate response ID
  previousMessages.forEach(msg => {
    // Skip messages without responses
    if (!msg.responses || msg.responses.length === 0) return;
    
    let responseId: string | undefined;
    
    // First priority: If message was created in combined mode, use the combined response
    if (msg.createdInCombinedMode) {
      const combinedResponse = msg.responses.find(r => 
        r.modelId === 'alle-ai-comb' && 
        r.status === 'complete'
      );
      
      if (combinedResponse) {
        responseId = combinedResponse.id;
      }
    } 
    
    // Second priority: Use the active response from activeContents
    if (!responseId && activeContents[msg.id]) {
      const activeContentId = activeContents[msg.id].id;
      const activeResponse = msg.responses.find(r => 
        r.modelId === activeContentId && 
        r.status === 'complete'
      );
      
      if (activeResponse) {
        responseId = activeResponse.id;
      }
    }
    
    // Third priority: Just use the first complete response
    if (!responseId) {
      const firstCompleteResponse = msg.responses.find(r => r.status === 'complete');
      if (firstCompleteResponse) {
        responseId = firstCompleteResponse.id;
      }
    }
    
    // If we found a valid response, add the pair
    if (responseId) {
      pairs.push([msg.id, responseId]);
      // console.log(`Added context for web search: [${msg.id}, ${responseId}]`);
    }
  });

  // console.log('Web search context pairs:', pairs);
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

  // Simplified BranchTabs component
  const BranchTabs = ({ level, branches, currentBranch, onBranchSelect }: {
    level: number;
    branches: Branch[];
    currentBranch: number;
    onBranchSelect: (index: number) => void;
  }) => {
    // Memoize the filtered and sorted branches to prevent recalculation
    const sortedBranches = useMemo(() => {
      // Filter branches that have messages at the current y level
      const versionsAtLevel = branches.filter(branch => 
          branch.messages.some(msg => msg.position[1] === level)
      );

      // Sort branches by x position for consistent tab order
      return versionsAtLevel.sort((a, b) => {
          const aX = a.messages.find(msg => msg.position[1] === level)?.position[0] || 0;
          const bX = b.messages.find(msg => msg.position[1] === level)?.position[0] || 0;
          return aX - bX;
      });
    }, [branches, level]); // Only recalculate when branches or level changes

    if (sortedBranches.length <= 1) return null;

    // Find the current branch index in the sorted list - use a more efficient lookup
    const currentBranchObj = branches[currentBranch];
    const currentSortedIndex = sortedBranches.findIndex(branch => branch === currentBranchObj);
    const totalTabs = sortedBranches.length;

    const handlePrevious = () => {
        const newIndex = (currentSortedIndex - 1 + totalTabs) % totalTabs;
        onBranchSelect(branches.indexOf(sortedBranches[newIndex]));
    };

    const handleNext = () => {
        const newIndex = (currentSortedIndex + 1) % totalTabs;
        onBranchSelect(branches.indexOf(sortedBranches[newIndex]));
    };

    return (
        <div className="flex justify-end items-center gap-2 mb-2 text-xs mr-2 mt-1">
            <button onClick={handlePrevious} className="rounded-md bg-transparent">
                {"<"}
            </button>
            <span className="">
                {`${currentSortedIndex + 1}/${totalTabs}`}
            </span>
            <button onClick={handleNext} className="rounded-md bg-transparent">
                {">"}
            </button>
        </div>
    );
  };

  return (
    <RenderPageContent>
      <ScrollArea ref={scrollAreaRef} className="h-[calc(100vh-10rem)] sm:h-full">
      {isLoadingConversation && (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">Loading content...</p>
            </div>
          </div>
        )}
        {!isLoadingConversation && (
          <div className="max-w-xl sm:max-w-2xl md:max-w-4xl mt-4 mx-auto px-2 sm:p-4">
            {branches[currentBranch]?.messages?.map((message, index) => {
              const level = message.position[1];
              const isLatestMessage = index === branches[currentBranch].messages.length - 1;
              
              return (
                <div 
                  key={`${message.position[0]}-${message.position[1]}`} 
                  className="mb-8"
                  ref={isLatestMessage ? latestMessageRef : null}
                  id={`message-${message.id}`}
                >
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
                    attachment={message.attachment}
                  />
                  <BranchTabs
                    level={level}
                    branches={branches}
                    currentBranch={currentBranch}
                    onBranchSelect={setCurrentBranch}
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
                          .filter(modelId => !inactiveModels.includes(modelId)) // Filter to get only active models
                          .map(modelId => chatModels.find(m => m.model_uid === modelId)?.model_name)
                          .filter(Boolean) as string[] // Ensure no undefined values are included
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
                            {/* Only show Summary when all responses are complete AND not in combined mode */}
                            {message.responses.every(r => r.status === 'complete') && 
                             !message.createdInCombinedMode && 
                             (showSummary[message.id] || summaryContent[message.id] || generatingSummary[message.id]) && (
                                <Summary 
                                  isGenerating={generatingSummary[message.id]}
                                  isActive={activeContents[message.id]?.type === 'summary'}
                                  onClick={() => handleSummarySelect(conversationId!, message.id)}
                                />
                            )}
                            <div className="grid grid-cols-auto-fit gap-4 max-w-[90%] mx-auto mt-2">
                              {message.responses.map((response, responseIndex) => {
                                const model = chatModels.find(m => m.model_uid === response.modelId);
                                if (!model) return null;

                                const isLoading = response.status === 'loading';
                                const hasError = response.status === 'error';

                                // Skip rendering if in combined mode and still loading
                                if (message.createdInCombinedMode && isLoading) {
                                  return null;
                                }

                                // We should only show loaders for 'new' generation type
                                if (isLoading && !message.createdInCombinedMode) {
                                  // if (generationType === 'new') {
                                    return (
                                      <div 
                                        key={response.modelId}
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
                                        <div className="w-full text-center space-y-2">
                                          {thinkingModels.includes(model.model_uid) ? (
                                          <div className="thinking-animation">
                                             <span className="text-muted-foreground text-xs">Thinking</span>
                                             <span className="dot-1">.</span>
                                             <span className="dot-2">.</span>
                                             <span className="dot-3">.</span>
                                           </div>
                                          ) : (
                                            <Skeleton className="h-2 w-full" />
                                          )}
                                        </div>
                                      </div>
                                    );
                                  // }
                                  
                                }

                                if (hasError) {
                                  return (
                                    <RetryResponse
                                      key={response.modelId}
                                      model={model}
                                      onRetry={() => handleRetry(response.modelId, message.id)}
                                    />
                                  );
                                }

                                if (message.createdInCombinedMode) {
                                  return null;
                                }

                                return (
                                  <ModelSelector
                                    key={response.modelId}
                                    models={[{
                                      ...model,
                                      response: response.content
                                    } as Model]}
                                    activeModel={activeContents[message.id]?.id === response.modelId ? response.modelId : ''}
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
                        <ModelResponseComponent
                          key={`${conversationId}-${activeContents[message.id].id}`}
                          model={activeContents[message.id].id === 'alle-ai-comb' 
                            ? message.responses.flatMap(r => r.model_names).filter(Boolean).join(' + ')
                            : chatModels.find(m => m.model_uid === activeContents[message.id].id)?.model_name || ""}
                          content={
                            message.createdInCombinedMode 
                              ? message.responses.find(r => r.modelId === 'alle-ai-comb')?.content
                              : message.responses.find(r => r.modelId === activeContents[message.id].id)?.content || ""
                          }
                          model_img={activeContents[message.id].id === 'alle-ai-comb'
                            ? message.responses.flatMap(r => r.model_images).filter(Boolean) as string[]
                            :  chatModels.find(m => m.model_uid === activeContents[message.id].id)?.model_image || ""}
                          responseId={
                            message.createdInCombinedMode
                              ? message.responses.find(r => r.modelId === 'alle-ai-comb')?.id
                              : message.responses.find(r => r.modelId === activeContents[message.id].id)?.id || ""
                          }
                          sessionId={conversationId!}
                          feedback={responseFeedback[message.responses.find(r => 
                            r.modelId === activeContents[message.id].id
                          )?.id || ""]}
                          onFeedbackChange={handleFeedbackChange}
                          webSearchEnabled={isWebSearch}
                          sources={message.responses.find(r => r.modelId === activeContents[message.id].id)?.sources || []}
                          onSourcesClick={(responseId, sources) => handleSourcesClick(responseId, sources, message.content)}
                          onRegenerate={() => handleRetry(activeContents[message.id].id, message.id)}
                        />
                      )}
                      {activeContents[message.id]?.type === 'summary' && (
                      <ModelResponseComponent
                        key={`${conversationId}-alle-ai-summ`}
                        model="Alle-AI Summary & Comparison"
                        content={summaryContent[message.id] || ""}
                        model_img="/svgs/logo-desktop-mini.png"
                        responseId={`alle-ai-summ-${message.id}`}
                        sessionId={conversationId!}
                        onFeedbackChange={handleFeedbackChange}
                        // You might want to disable certain features for summary display
                        webSearchEnabled={false}
                        sources={[]}
                        onSourcesClick={() => {}}
                        onRegenerate={() => {}}
                      />
                    )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
      <ScrollToBottom 
        scrollAreaRef={scrollAreaRef}
        className="z-50 w-8 h-8"
        content={branches[currentBranch]?.messages || []}
      />
      {isOldConversation ? (
        <div className="w-full sm:w-2/3 md:w-1/2 mb-2 mx-auto bg-blue-100/50 dark:bg-blue-900/30 border-blue-500 text-blue-800 dark:text-blue-300 p-3 rounded-md flex items-start">
        <TriangleAlert className="w-4 h-4" />
        <div className="flex-1">
          <p className="text-sm text-center">
            This conversation happened in a previous version of Alle-AI. Start a{' '}
            <span 
              className="cursor-pointer underline font-bold"
              onClick={() => router.push('/chat')}
            >
              New chat
            </span> to begin a new conversation.
          </p>
        </div>
      </div>
      ):(
        <div className="w-full bg-background fixed bottom-0 sm:relative sm:px-4">
          {!isLoadingConversation && !loadConversationError && (
            <ChatInput
              value={input}
              onChange={handleInputChange}
              onSend={handleSendMessage}
              inputRef={inputRef}
              isLoading={isLoading}
              isSending={isSending}
              isWeb={true}
              isCombined={true}
              onWebSearchToggle={() => {}}
              onCombinedToggle={() => {}}
            />
          )}
          </div>
      )}
        
      
      <SourcesWindow
        sources={sourcesWindowState.sources}
        isOpen={sourcesWindowState.isOpen}
        onClose={() => setSourcesWindowState(prev => ({ ...prev, isOpen: false }))}
        responseId={sourcesWindowState.activeResponseId || ''}
        userPrompt={sourcesWindowState.userPrompt}
      />
      <PromptModal 
        isOpen={showPrompt} 
        onClose={() => setShowPrompt(false)} 
        {...promptConfig}
      />
    </RenderPageContent>
  );
}
