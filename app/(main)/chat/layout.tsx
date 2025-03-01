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
import { useToast } from "@/hooks/use-toast";
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
  const { addHistory, updateHistoryTitle } = useHistoryStore();
  const { toast } = useToast();
  const [showAlertDialog, setShowAlertDialog] = useState(false);

  // Calculate number of active models
  const activeModelsCount = selectedModels.chat.filter(
    modelId => !inactiveModels.includes(modelId)
  ).length;

  // Show alert dialog if fewer than 2 models are active
  useEffect(() => {
    if (activeModelsCount < 2) {
      setShowAlertDialog(true);
    } else {
      setShowAlertDialog(false);
    }
  }, [activeModelsCount]);

  const handleSend = async (fileContent?: {
    uploaded_files: Array<{
      file_name: string;
      file_size: string;
      file_type: string;
      file_content: string;
    }>;
  }) => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    try {
      const allSelectedModels = selectedModels.chat;
      
      const conversationResponse = await chatApi.createConversation(allSelectedModels, 'chat');
      const conversationId = conversationResponse.session;
      
      
      // Add all required properties when adding to history
      addHistory({
        // id: conversationId,
        session: conversationId,
        title: conversationResponse.title,
        type: 'chat',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      
      const promptResponse = await chatApi.createPrompt(
        conversationId, 
        input,
        [0, 0],
        fileContent ? {
          input_content: fileContent
        } : undefined
      );
      
      setContent("chat", "input", input);
      setGenerationType('new');
      router.push(`/chat/res/${conversationId}`);
      setInput("");

      // Get actual title based on prompt
      historyApi.getConversationTitle(conversationId, input, 'chat')
        .then(response => {
          updateHistoryTitle(conversationId, response.title);
        })
        .catch(error => {
          console.error('Error getting conversation title:', error);
        });

      setConversationId(conversationId);
      setPromptId(promptResponse.id);
      // setContent("chat", "input", input);
      // router.push(`/chat/res/${conversationId}`);
      // setInput("");

    } catch (error) {
      console.error('Error in chat flow:', error);
    } finally {
      setIsLoading(false);
    }
  };

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


  return (
    <div className={`flex flex-col min-h-[calc(100vh-3.5rem)] transition-all duration-300 ${isOpen ? "pl-40" : "pl-0"}`}>
      <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>NOTICE</AlertDialogTitle>
            <AlertDialogDescription>
              At least 2 active models are required to generate summary and combined responses on Alle-AI.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Ok</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {pathname === "/chat" && (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col justify-center items-center gap-8">
            <GreetingMessage
              options={options}
              handlePressed={handleClicked}
            />
            <div className="w-full max-w-3xl px-4">
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
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
}