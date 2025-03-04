"use client";

import { useEffect } from "react";
import { useSidebarStore } from "@/stores";
import { useModelsStore } from "@/stores/models";
import { useHistoryStore } from "@/stores";
import { useSelectedModelsStore } from "@/stores";
import { historyApi } from "@/lib/api/history";
import { modelsApi } from "@/lib/api/models";

export default function ChatPage() {
  const setCurrentPage = useSidebarStore((state) => state.setCurrentPage);
  const { chatModels, setChatModels, setLoading: setModelsLoading, setError: setModelsError } = useModelsStore();
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
    setCurrentPage("chat");
    // Clear history when component mounts
    // clearHistory();
  }, [setCurrentPage]);

  // Load chat models on mount if not already loaded
  useEffect(() => {
    
    const loadChatModels = async () => {
      if (chatModels && chatModels.length > 0) return;

      setModelsLoading(true);
      try {
        const models = await modelsApi.getModels('chat');
        setChatModels(models);
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

  // Load previously selected models
  useEffect(() => {
    const loadLatestSelectedModels = async () => {
      // If we already have selected models for chat, skip loading
      if (selectedModels.chat && selectedModels.chat.length > 0) return;

      setLoadingLatest(true);
      try {
        const latestModels = await modelsApi.getLatestSelectedModels('chat');
        const modelUids = latestModels.map(model => model.model_uid);
        setTempSelectedModels(modelUids);
        saveSelectedModels('chat');
      } catch (err) {
        console.error('Error loading latest selected models:', err);
      } finally {
        setLoadingLatest(false);
      }
    };

    loadLatestSelectedModels();
  }, []);

  return null;
}