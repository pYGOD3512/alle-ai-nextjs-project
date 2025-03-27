"use client";

import { useSelectedModelsStore, useSidebarStore } from "@/stores";
import { useEffect } from "react";
import RenderPageContent from "@/components/RenderPageContent";

import { useHistoryStore } from "@/stores";
import { useModelsStore } from "@/stores/models";
import { historyApi } from "@/lib/api/history";
import { Model, modelsApi } from "@/lib/api/models";
import { useToast } from "@/hooks/use-toast";



export default function ImageGenerationPage() {
  const { isOpen } = useSidebarStore();
  const setCurrentPage = useSidebarStore((state) => state.setCurrentPage);
  const { toast } = useToast();
  const { imageModels, setImageModels, setLoading: setModelsLoading, setError: setModelsError } = useModelsStore();
  const { 
    selectedModels,
    setTempSelectedModels, 
    saveSelectedModels, 
    setLoadingLatest 
  } = useSelectedModelsStore();

  useEffect(() => {
    setCurrentPage("image");
  }, [setCurrentPage]);

    // Load image models on mount if not already loaded
    useEffect(() => {
      const loadImageModels = async () => {
        // Skip if models are already loaded
        if (imageModels && imageModels.length > 0) return;
        setLoadingLatest(true);
        setModelsLoading(true);
        try {
          const models = await modelsApi.getModels('image');
          setImageModels(models);
          // // console.log('Image models loaded', models);
          await loadLatestSelectedModels();
        } catch (err) {
          setModelsError(err instanceof Error ? err.message : 'Failed to load chat models');
        } finally {
          setModelsLoading(false);
        }
      };
  
    //   loadImageModels();
    // }, [setImageModels, setModelsLoading, setModelsError]);

  // Load previously selected models
  // useEffect(() => {
    const loadLatestSelectedModels = async () => {
      if (selectedModels.image && selectedModels.image.length > 0) return;

      setLoadingLatest(true);
      try {
        const latestModels = await modelsApi.getLatestSelectedModels('image');
        const modelUids = latestModels.map(model => model.model_uid);
        setTempSelectedModels(modelUids);
        saveSelectedModels('image');

        // Toggle inactive models using toggleModelActive
        latestModels.forEach((model: Model) => {
          if (model.active === 0) {
            useSelectedModelsStore.getState().toggleModelActive(model.model_uid);
          }
        });
      } catch (err: any) {
        if(err.response?.status === 404) {
          return;
        } else {
          toast({
            title: 'Failed',
            description: 'Error loading latest selected models',
            variant: 'destructive',
          });
        }
      } finally {
        setLoadingLatest(false);
      }
    };

    loadImageModels();
  }, [setImageModels, setModelsLoading, setModelsError, selectedModels.image]);
  
  return ;
}
