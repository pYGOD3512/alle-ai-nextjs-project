"use client";

import { useSelectedModelsStore, useSidebarStore } from "@/stores";
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
    history,
    setHistory, 
    setLoading: setHistoryLoading,
    setError: setHistoryError,
    getHistoryByType
  } = useHistoryStore();
  const { 
    selectedModels,
    setTempSelectedModels, 
    saveSelectedModels, 
    setLoadingLatest 
  } = useSelectedModelsStore();

  useEffect(() => {
    setCurrentPage("image");
    // clearHistory();

  }, []);

    // Load image models on mount if not already loaded
    useEffect(() => {
      const loadImageModels = async () => {
        // Skip if models are already loaded
        if (imageModels && imageModels.length > 0) return;
  
        setModelsLoading(true);
        try {
          const models = await modelsApi.getModels('image');
          setImageModels(models);
        } catch (err) {
          setModelsError(err instanceof Error ? err.message : 'Failed to load chat models');
        } finally {
          setModelsLoading(false);
        }
      };
  
      loadImageModels();
    }, []);

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

  // Load previously selected models
  useEffect(() => {
    const loadLatestSelectedModels = async () => {
      if (selectedModels.image && selectedModels.image.length > 0) return;

      setLoadingLatest(true);
      try {
        const latestModels = await modelsApi.getLatestSelectedModels('image');
        const modelUids = latestModels.map(model => model.model_uid);
        setTempSelectedModels(modelUids);
        saveSelectedModels('image');
      } catch (err) {
        console.log('Error: ', err);
      } finally {
        setLoadingLatest(false);
      }
    };

    loadLatestSelectedModels();
  }, []);
  
  return ;
}
