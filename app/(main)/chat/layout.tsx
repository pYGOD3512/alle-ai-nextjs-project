"use client";
import { useState, useRef, useEffect } from "react";
import GreetingMessage from "@/components/features/GreetingMessage";
import { ChatInput } from "@/components/features/ChatInput";
import { useSidebarStore, useContentStore, useWebSearchStore, useHistoryStore, useCombinedModeStore } from "@/stores";
import { useRouter, usePathname } from "next/navigation";
import RenderPageContent from "@/components/RenderPageContent";
import { SquareTerminal, Lightbulb, Code, Bug, Wrench, Sparkles, NotebookPen, Brain  } from "lucide-react";
import { chatApi } from '@/lib/api/chat';
import { historyApi } from '@/lib/api/history';
import { useSelectedModelsStore } from '@/stores';
import { useConversationStore } from '@/stores/models';
import { toast } from "sonner"
import { modelsApi } from '@/lib/api/models';
import { useModelsStore } from "@/stores/models";


import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AutoFeedbackModal } from "@/components/ui/modals";

const options = [
  {
    label: "Debug",
    icon: <Bug className="w-4 h-4 text-red-500" />,
    description: "Help me find the bug in my code"
  },
  {
    label: "Summarize",
    icon: <NotebookPen className="w-4 h-4 text-green-500" />,
    description: "Help me summarize the article"
  },
  {
    label: "Brainstorm",
    icon: <Brain className="w-4 h-4 text-blue-500" />,
    description: "Help me brainstorm ideas"
  },
  {
    label: "Analyze",
    icon: <Sparkles className="w-4 h-4 text-yellow-500" />,
    description: "Help me analyze the data"
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { setContent } = useContentStore();
  const router = useRouter();
  const pathname = usePathname();
  const { setIsWebSearch } = useWebSearchStore();
  const { setIsCombinedMode } = useCombinedModeStore();
  const { isOpen } = useSidebarStore();
  const { selectedModels, inactiveModels } = useSelectedModelsStore();
  const { setConversationId, setPromptId, setGenerationType } = useConversationStore();
  const { addHistory, updateHistoryTitle, getHistoryByType, setHistory, setLoading: setHistoryLoading, setError: setHistoryError } = useHistoryStore();
  const { chatModels, setChatModels, setLoading: setModelsLoading, setError: setModelsError } = useModelsStore();

  const [autoFeedbackModal, setAutoFeedbackModal] = useState(false);

  // Calculate number of active models
  const activeModelsCount = selectedModels.chat.filter(
    modelId => !inactiveModels.includes(modelId)
  ).length;

  const handleSend = async (fileContent?: {
    uploaded_files: Array<{
      file_name: string;
      file_size: string;
      file_type: string;
      file_content: string;
    }>;
  }) => {
    if (!input.trim()) return;
    
    try {
      setIsLoading(true);
      const allSelectedModels = selectedModels.chat;
      
      const conversationResponse = await chatApi.createConversation(allSelectedModels, 'chat');
      const conversationId = conversationResponse.session;
      
      
      // Restructure the fileContent to match the expected format
      const options = fileContent && fileContent.uploaded_files && fileContent.uploaded_files.length > 0 ? {
        input_content: {
          uploaded_files: fileContent.uploaded_files.map(file => ({
            file_name: file.file_name,
            file_size: file.file_size,
            file_type: file.file_type,
            file_content: file.file_content,
          }))
        }
      } : undefined;
      
      const promptResponse = await chatApi.createPrompt(
        conversationId, 
        input,
        [0, 0],
        options
      );
      setContent("chat", "input", input);
      setGenerationType('new');
      router.push(`/chat/res/${conversationId}`);
      setInput("");

      
      // Add all required properties when adding to history
      addHistory({
        // id: conversationId,
        session: conversationId,
        title: conversationResponse.title,
        type: 'chat',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      // console.log(promptResponse,'This is prompt created in the handleSend in the Layout')


    // Store file information in content store so ChatArea can access it
    if (promptResponse.input_content?.uploaded_files && promptResponse.input_content.uploaded_files.length > 0) {
      const file = promptResponse.input_content.uploaded_files[0];
      const isImage = file.file_type === 'image';
      
      setContent("chat", "attachment", {
        name: file.file_name,
        type: file.file_type,
        size: parseInt(file.file_size),
        url: isImage ? file.file_content : ''
      });
    }

      // router.push(`/chat/res/${conversationId}`);
      // setContent("chat", "input", input);
      

      // Get actual title based on prompt
      historyApi.getConversationTitle(conversationId, input, 'chat')
        .then(response => {
          updateHistoryTitle(conversationId, response.title);
        })
        .catch(error => {
          // // console.error('Error getting conversation title:', error);
          toast.error('Error getting conversation title');
        });

      setConversationId(conversationId);
      setPromptId(promptResponse.id);

    } catch (error) {
      // // console.error('Error in chat flow:', error);
      toast('Failed to create conversation', {
        action: {
          label: 'New Chat',
          onClick: () => router.replace('/chat')
        },
      })

    } finally {
      setIsLoading(false);
    }
  };

  const preferredOrder = ['gpt-4-5', 'o3-mini', 'deepseek-r1', 'grok-2-vision', 'o1', 'claude-3-5-sonnet', 'llama-3-1-70b-instruct', 'gpt-4o', 'claude-3-sonnet', 'grok-2', 'gemini-1-5-pro', 'llama-3-70b-instruct', 'deepseek-v3', 'mixtral-8x7b-instruct', 'gpt-4', 'o1-mini', 'phi-4'];


    // Load chat models on mount if not already loaded
    useEffect(() => {
    
      const loadChatModels = async () => {
        if (chatModels && chatModels.length > 0) return;
  
        setModelsLoading(true);
        try {
          const models = await modelsApi.getModels('chat');
          const sortedChatModels = models.sort((a, b) => {
            const indexA = preferredOrder.indexOf(a.model_uid);
            const indexB = preferredOrder.indexOf(b.model_uid);
          
            // If both models are in the preferred order, sort by their index
            if (indexA !== -1 && indexB !== -1) {
              return indexA - indexB;
            }
            
            // If only a is in the preferred order, it should come first
            if (indexA !== -1) return -1;
            
            // If only b is in the preferred order, it should come first
            if (indexB !== -1) return 1;
          
            // If neither are in the preferred order, maintain their original order
            return 0;
          });
          // console.log('Chat models loaded', sortedChatModels);
          setChatModels(sortedChatModels);
        } catch (err) {
          setModelsError(err instanceof Error ? err.message : 'Failed to load chat models');
        } finally {
          setModelsLoading(false);
        }
      };
  
      loadChatModels();
    }, [setChatModels, setModelsLoading, setModelsError]);

    // Load chat history
    useEffect(() => {
      const loadHistory = async () => {
        const chatHistory = getHistoryByType('chat');
        if (chatHistory && chatHistory.length > 0) {
          return;
        }
  
        setHistoryLoading(true);
        try {
          const response = await historyApi.getHistory('chat');
          setHistory(response.data);
        } catch (err) {
          setHistoryError(err instanceof Error ? err.message : 'Failed to load chat history');
        } finally {
          setHistoryLoading(false);
        }
      };
  
      loadHistory();
    }, []);

  const handleClicked = (opt: { label: string }) => {
    setInput(opt.label);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

    const handleWebSearchToggle = (enabled: boolean) => {
      setIsWebSearch(enabled);
    };

    const handleCombinedToggle = (enabled: boolean) => {
      setIsCombinedMode(enabled);
    };

    const handleAutoFeedbackSubmit = () => {
      console.log('Auto feedback submitted');
    };


  return (
    <div className={`flex flex-col min-h-[calc(100vh-3.5rem)] transition-all duration-300 ${isOpen ? "pl-40" : "pl-0"}`}>
      {pathname === "/chat" && (<>        <div className={`flex-1 flex flex-col sm:mb-32`}>
          <div className="flex-1 flex flex-col justify-center items-center gap-8">
            <GreetingMessage
              // options={options}
              handlePressed={handleClicked}
            />
            {/* <Button onClick={() => setAutoFeedbackModal(true)}>Open Auto Feedback Modal</Button> */}
            
            <div className="w-full fixed bottom-6 sm:relative max-w-3xl sm:px-4">
              <ChatInput
                value={input}
                onChange={setInput}
                onSend={handleSend}
                inputRef={inputRef}
                isLoading={isLoading}
                isWeb={true}
                isCombined={true}
                onWebSearchToggle={handleWebSearchToggle}
                onCombinedToggle={handleCombinedToggle}
              />
            </div>
          </div>
        </div>
        <AutoFeedbackModal
          isOpen={autoFeedbackModal}
          onClose={() => setAutoFeedbackModal(false)}
          onSubmit={handleAutoFeedbackSubmit}
          onAskLater={() => setAutoFeedbackModal(false)}
        />
        </>

      )}
      <div className="flex-1 sm:flex-none">{children}</div>
    </div>
  );
}

function getHistoryByType(arg0: string) {
  throw new Error("Function not implemented.");
}
