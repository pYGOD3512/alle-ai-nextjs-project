"use client";

import { useSidebarStore } from "@/stores";
import { useEffect } from "react";
import RenderPageContent from "@/components/RenderPageContent";

import { useModelsStore } from "@/stores/models";
import { modelsApi } from "@/lib/api/models";



export default function ImageGenerationPage() {
  const { isOpen } = useSidebarStore();
  const setCurrentPage = useSidebarStore((state) => state.setCurrentPage);
  const { imageModels, setImageModels, setLoading, setError } = useModelsStore();

  useEffect(() => {
    setCurrentPage("image");
  }, [setCurrentPage]);

    // Load image models on mount if not already loaded
    useEffect(() => {
      const loadImageModels = async () => {
        // Skip if models are already loaded
        if (imageModels && imageModels.length > 0) return;
  
        setLoading(true);
        try {
          const models = await modelsApi.getImageModels();
          setImageModels(models);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load image models');
        } finally {
          setLoading(false);
        }
      };
  
      loadImageModels();
    }, [setImageModels, setLoading, setError]);
  
  return ;
}
