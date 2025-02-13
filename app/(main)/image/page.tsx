"use client";

import { useSidebarStore } from "@/stores";
import { useEffect } from "react";
import RenderPageContent from "@/components/RenderPageContent";

import { useHistoryStore } from "@/stores";
import { useModelsStore } from "@/stores/models";
import { historyApi } from "@/lib/api/history";
import { modelsApi } from "@/lib/api/models";



export default function ImageGenerationPage() {
  const { isOpen } = useSidebarStore();
  const setCurrentPage = useSidebarStore((state) => state.setCurrentPage);
  const { imageModels, setImageModels, setLoading: setModelsLoading, setError: setModelsError } = useModelsStore();
  const { 
    setHistory, 
    setLoading: setHistoryLoading,
    setError: setHistoryError,
    clearHistory
  } = useHistoryStore();

  useEffect(() => {
    setCurrentPage("image");
    clearHistory();

  }, [setCurrentPage, clearHistory]);

    // Load image models on mount if not already loaded
    useEffect(() => {
      const loadImageModels = async () => {
        // Skip if models are already loaded
        if (imageModels && imageModels.length > 0) return;
  
        setModelsLoading(true);
        try {
          const models = await modelsApi.getImageModels();
          setImageModels(models);
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
      
      if(history && history.length > 0) return;
      setHistoryLoading(true);
      try {
        const response = await historyApi.getHistory('image');
        setHistory(response.data);
      } catch (err) {
        setHistoryError(err instanceof Error ? err.message : 'Failed to load chat history');
      } finally {
        setHistoryLoading(false);
      }
    };

    loadHistory();
  }, [setHistory, setHistoryLoading, setHistoryError]);
  
  return ;
}
