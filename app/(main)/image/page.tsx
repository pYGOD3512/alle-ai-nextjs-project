"use client";

import { useSelectedModelsStore, useSidebarStore } from "@/stores";
import { useEffect } from "react";
import RenderPageContent from "@/components/RenderPageContent";

import { useHistoryStore } from "@/stores";
import { useModelsStore } from "@/stores/models";
import { historyApi } from "@/lib/api/history";
import { Model, modelsApi } from "@/lib/api/models";
import { toast } from "sonner"


export default function ImageGenerationPage() {
  const { isOpen } = useSidebarStore();
  const setCurrentPage = useSidebarStore((state) => state.setCurrentPage);
  ;
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

  const preferredOrder = [''];

    // Load image models on mount if not already loaded
    useEffect(() => {
      const loadImageModels = async () => {
        // Skip if models are already loaded
        if (imageModels && imageModels.length > 0){
          loadLatestSelectedModels();
          return;
        }
        setLoadingLatest(true);
        setModelsLoading(true);
        try {
          const models = await modelsApi.getModels('image');
          const sortedImageModels = models.sort((a, b) => {
            const indexA = preferredOrder.indexOf(a.model_uid);
            const indexB = preferredOrder.indexOf(b.model_uid);
          
            // If both models are in the preferred order, sort by their index
            if (indexA !== -1 && indexB !== -1) {
              return indexA - indexB;
            }
            
            // If only a is in the preferred order, it should come first
            if (indexA !== -1) return -1;
            
            // If only b is in the preferred order, it should come first
            if (indexB !== -1) return 1;
          
            // If neither are in the preferred order, maintain their original order
            return 0;
          });
          setImageModels(sortedImageModels);
          // console.log('Image models loaded', models);
          await loadLatestSelectedModels();
        } catch (err) {
          setModelsError(err instanceof Error ? err.message : 'Failed to load chat models');
        } finally {
          setModelsLoading(false);
        }
      };
  
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
          toast.error('Error loading last used models');
        }
      } finally {
        setLoadingLatest(false);
      }
    };

    loadImageModels();
  }, [setImageModels, setModelsLoading, setModelsError, selectedModels.image]);
  
  return ;
}
