"use client";

import { useEffect } from "react";
import { useSidebarStore } from "@/stores";
import { useModelsStore } from "@/stores/models";
import { useHistoryStore } from "@/stores";
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
    clearHistory
  } = useHistoryStore();

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
        const models = await modelsApi.getChatModels();
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
      if(history && history.length > 0) return;

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
  }, [setHistory, setHistoryLoading, setHistoryError]);

  return null;
}