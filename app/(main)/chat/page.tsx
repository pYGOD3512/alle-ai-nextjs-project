"use client";

import { useEffect } from "react";
import { useSidebarStore } from "@/stores";
import { useSelectedModelsStore } from "@/stores";
import { modelsApi } from "@/lib/api/models";
import { useModelsStore } from "@/stores/models";

export default function ChatPage() {
  const setCurrentPage = useSidebarStore((state) => state.setCurrentPage);
  const { 
    selectedModels,
    setTempSelectedModels, 
    saveSelectedModels, 
    setLoadingLatest 
  } = useSelectedModelsStore();
  const { chatModels, setChatModels, setLoading: setModelsLoading, setError: setModelsError } = useModelsStore();


  useEffect(() => {
    setCurrentPage("chat");
  }, [setCurrentPage]);
  

  // Load chat models on mount if not already loaded
  useEffect(() => {

    const loadChatModels = async () => {
      if (chatModels && chatModels.length > 0) return;

      setModelsLoading(true);
      try {
        const models = await modelsApi.getModels('chat');
        console.log('Chat models loaded', models);
        setChatModels(models);
      } catch (err) {
        setModelsError(err instanceof Error ? err.message : 'Failed to load chat models');
      } finally {
        setModelsLoading(false);
      }
    };

    loadChatModels();
  }, [setChatModels, setModelsLoading, setModelsError]);

  // Load previously selected models
  useEffect(() => {
    const loadLatestSelectedModels = async () => {
      // If we already have selected models for chat, skip loading
      if (selectedModels.chat && selectedModels.chat.length > 0) return;

      setLoadingLatest(true);
      try {
        const latestModels = await modelsApi.getLatestSelectedModels('chat');
        const modelUids = latestModels.map(model => model.model_uid);
        console.log('modelUids for setting and saving latest models', modelUids);
        setTempSelectedModels(modelUids);
        saveSelectedModels('chat');
      } catch (err) {
        console.log('Error loading latest selected models:', err);
      } finally {
        setLoadingLatest(false);
      }
    };

    loadLatestSelectedModels();
  }, []);

  return null;
}