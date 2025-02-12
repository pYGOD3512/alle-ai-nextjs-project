"use client";

import { useState, useEffect } from 'react';
import { useSelectedModelsStore } from '@/stores';
import { useConversationStore } from '@/stores/models';
import { chatApi } from '@/lib/api/chat';
import { ModelResponse } from '@/components/features/ModelResponse';
import RenderPageContent from "@/components/RenderPageContent";
import { Card } from "@/components/ui/card";
import { CHAT_MODELS as MODELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ResponseState {
  [modelId: string]: {
    status: 'loading' | 'complete' | 'error';
    data?: {
      id: number;
      model_uid: string;
      model_plan: string;
      response: string;
    }
  }
}

export default function ChatResponsePage() {
  const { selectedModels } = useSelectedModelsStore();
  const { conversationId, promptId } = useConversationStore();
  const [responses, setResponses] = useState<ResponseState>({});
  const [responseFeedback, setResponseFeedback] = useState<Record<string, 'like' | 'dislike' | null>>({});
  const [activeModel, setActiveModel] = useState<string | null>(null);

  useEffect(() => {
    // Set the first model as active by default
    if (selectedModels.chat.length > 0 && !activeModel) {
      setActiveModel(selectedModels.chat[0]);
    }

    if (!conversationId || !promptId) return;

    const initialResponses = selectedModels.chat.reduce((acc, modelId) => ({
      ...acc,
      [modelId]: { status: 'loading' }
    }), {});
    
    setResponses(initialResponses);

    selectedModels.chat.forEach(async (modelId) => {
      try {
        const response = await chatApi.generateResponse({
          conversation: conversationId,
          model: modelId,
          is_new: true,
          prompt: promptId
        });

        setResponses(prev => ({
          ...prev,
          [modelId]: {
            status: 'complete',
            data: response.data
          }
        }));
      } catch (error) {
        console.error(`Error with model ${modelId}:`, error);
        setResponses(prev => ({
          ...prev,
          [modelId]: { status: 'error' }
        }));
      }
    });
  }, [conversationId, promptId, selectedModels.chat]);

  const handleFeedbackChange = (responseId: string, feedback: 'like' | 'dislike' | null) => {
    setResponseFeedback(prev => ({
      ...prev,
      [responseId]: feedback
    }));
  };

  return (
    <RenderPageContent>
      <div className="max-w-xl sm:max-w-2xl md:max-w-4xl mt-4 mx-auto px-4">
        {/* Model Tabs */}
        <div className="flex space-x-2 mb-4 border-b">
          {selectedModels.chat.map((modelId) => {
            const model = MODELS.find(m => m.id === modelId);
            if (!model) return null;

            return (
              <button
                key={modelId}
                onClick={() => setActiveModel(modelId)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors",
                  activeModel === modelId 
                    ? "bg-background border-b-2 border-primary text-primary" 
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <img 
                  src={model.icon} 
                  alt={model.name} 
                  className="w-5 h-5 rounded-full"
                />
                <span>{model.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Model Response */}
        {activeModel && (
          <div className="grid grid-cols-1 gap-4">
            {responses[activeModel]?.status === 'loading' ? (
              <Card className="bg-transparent border-none shadow-none p-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    <div className="relative w-8 h-8">
                      <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-full bg-muted animate-pulse rounded" />
                    <div className="h-4 w-full bg-muted animate-pulse rounded" />
                    <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              </Card>
            ) : responses[activeModel]?.status === 'complete' && responses[activeModel]?.data ? (
              <ModelResponse
                model={MODELS.find(m => m.id === activeModel)?.name || ""}
                content={responses[activeModel].data!.response}
                model_img={MODELS.find(m => m.id === activeModel)?.icon || ""}
                responseId={`${responses[activeModel].data!.id}`}
                sessionId={conversationId}
                feedback={responseFeedback[`${responses[activeModel].data!.id}`]}
                onFeedbackChange={handleFeedbackChange}
                settings={{ personalizedAds: false }}
              />
            ) : null}
          </div>
        )}
      </div>
    </RenderPageContent>
  );
}