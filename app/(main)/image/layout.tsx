// @ts-nocheck
"use client";
import { useState, useRef, useEffect } from "react";
import { ChatInput } from "@/components/features/ChatInput";
import GreetingMessage from "@/components/features/GreetingMessage";
import { useContentStore, useSidebarStore, useHistoryStore } from "@/stores";
import { usePathname, useRouter } from "next/navigation";
import RenderPageContent from "@/components/RenderPageContent";
import Link from "next/link";
import { Lightbulb, Image, Anchor, TreePalm } from 'lucide-react';
import { chatApi } from '@/lib/api/chat';
import { historyApi } from '@/lib/api/history';
import { useSelectedModelsStore } from '@/stores';
import { useConversationStore } from '@/stores/models';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useModelsStore } from "@/stores/models";
import { modelsApi } from "@/lib/api/models";
// static options
const options = [
  {
    label: "Futuristic cityscape",
    icon: <Lightbulb className="w-4 h-4 text-amber-400"/>,
    description: "Create a stunning digital artwork of a city of the future"
  },
  {
    label: "Surreal landscape",
    icon: <Image className="w-4 h-4 text-purple-500" />,
    description: "Produce an abstract, dreamlike scene with vibrant colors"
  },
  {
    label: "Underwater kingdom",
    icon: <Anchor className="w-4 h-4 text-teal-500" />,
    description: "Imagine a deep-sea civilization full of mysterious sea creatures, glowing coral reefs, and submerged castles."
  },
  {
    label: "Magical forest",
    icon: <TreePalm className="w-4 h-4 text-green-500" />,
    description: "Create a mystical forest with glowing trees, enchanted animals, and an ethereal atmosphere."
  }
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { content, setContent } = useContentStore();
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen } = useSidebarStore();
  const { selectedModels } = useSelectedModelsStore();
  const { setConversationId, setPromptId, setGenerationType } = useConversationStore();
  const { addHistory, updateHistoryTitle, getHistoryByType, setHistory, setLoading: setHistoryLoading, setError: setHistoryError } = useHistoryStore();
  const [showNegativePrompt, setShowNegativePrompt] = useState(false);
  const [negativePrompt, setNegativePrompt] = useState("");
  const { imageModels, setImageModels, setLoading: setModelsLoading, setError: setModelsError } = useModelsStore();

  const handleSend = async () => {
    if (!input.trim()) return;
    
    console.log('This is the negative prompt: ', negativePrompt);
    setIsLoading(true);
    try {
      const allSelectedModels = selectedModels.image;
      
      const conversationResponse = await chatApi.createConversation(allSelectedModels, 'image');
      const conversationId = conversationResponse.session;

      addHistory({
        session: conversationId,
        title: input,
        type: 'image',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      const promptResponse = await chatApi.createPrompt(
        conversationId, 
        input,
        [0, 0]
      );
      
      setContent("image", "input", input);
      setGenerationType('new');
      router.push(`/image/res/${conversationId}`);
      setInput("");

      // Get actual title based on prompt
      historyApi.getConversationTitle(conversationId, input, 'image')
        .then(response => {
          updateHistoryTitle(conversationId, response.title);
        })
        .catch(error => {
          console.error('Error getting conversation title:', error);
        });

      // Get actual title based on prompt
      setConversationId(conversationId);
      setPromptId(promptResponse.id);

    } catch (error) {
      console.error('Error in image generation flow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load image models on mount if not already loaded
  useEffect(() => {
    const loadImageModels = async () => {
      // Skip if models are already loaded
      if (imageModels && imageModels.length > 0) return;
      
      console.log('Loading image models this code is running');
      setModelsLoading(true);
      try {
        const models = await modelsApi.getModels('image');
        setImageModels(models);
        console.log('Image models loaded', models);
      } catch (err) {
        setModelsError(err instanceof Error ? err.message : 'Failed to load chat models');
      } finally {
        setModelsLoading(false);
      }
    };

    loadImageModels();
  }, [setImageModels, setModelsLoading, setModelsError]);

        // Load image history
  useEffect(() => {
    const loadHistory = async () => {
      const imageHistory = getHistoryByType('image');
      if (imageHistory && imageHistory.length > 0) {
        return;
      }
      
      setHistoryLoading(true);
      try {
        const response = await historyApi.getHistory('image');
        console.log("Fetched image history:", response.data);
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

  return (
    <div className={`flex flex-col min-h-[calc(100vh-3.5rem)] transition-all duration-300 ${isOpen ? "pl-40" : "pl-0"}`}>
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col justify-center items-center gap-8">
            {pathname === "/image" && (
            <GreetingMessage
              options={options}
              handlePressed={handleClicked}
              questionText="Ready to create something amazing today?"
            />
            )}
            <div className="w-full max-w-3xl px-4">
              <ChatInput
                value={input}
                onChange={setInput}
                onSend={handleSend}
                inputRef={inputRef}
                isLoading={isLoading}
              />
              <div className="flex items-center space-x-2 p-2">
                <Switch
                  variant="sm"
                  id="negative-prompt"
                  checked={showNegativePrompt}
                  onCheckedChange={setShowNegativePrompt}
                />
                <Label htmlFor="negative-prompt">Negative Prompt</Label>
              </div>
              {showNegativePrompt && (
                <Textarea
                  placeholder="Enter negative prompt here..."
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  className="min-h-[100px] border-borderColorPrimary focus-visible:outline-none"
                />
              )}
            </div>
          </div>
        </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
