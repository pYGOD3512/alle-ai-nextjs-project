"use client";

import { useSidebarStore } from "@/stores";
import { useModelsStore } from "@/stores/models";
import { useEffect } from "react";
import { modelsApi } from "@/lib/api/models";

export default function ChatPage() {
  const setCurrentPage = useSidebarStore((state) => state.setCurrentPage);
  const { chatModels, setChatModels, setLoading, setError } = useModelsStore();

  useEffect(() => {
    setCurrentPage("chat");
  }, [setCurrentPage]);

  // Load chat models on mount if not already loaded
  useEffect(() => {
    const loadChatModels = async () => {
      // Skip if models are already loaded
      if (chatModels && chatModels.length > 0) return;

      setLoading(true);
      try {
        const models = await modelsApi.getChatModels();
        setChatModels(models);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load chat models');
      } finally {
        setLoading(false);
      }
    };

    loadChatModels();
  }, [setChatModels, setLoading, setError]);

  return null;
}