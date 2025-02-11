import { create } from 'zustand';
import { Model } from '@/lib/api/models';

interface ModelsState {
    chatModels: Model[];
    imageModels: Model[];
    audioModels: Model[];
    videoModels: Model[];
    isLoading: boolean;
    error: string | null;
    setChatModels: (models: Model[]) => void;
    setImageModels: (models: Model[]) => void;
    setAudioModels: (models: Model[]) => void;
    setVideoModels: (models: Model[]) => void;
    setLoading: (status: boolean) => void;
    setError: (error: string | null) => void;
  }
  
  export const useModelsStore = create<ModelsState>((set) => ({
    chatModels: [],
    imageModels: [],
    audioModels: [],
    videoModels: [],
    isLoading: false,
    error: null,
    setChatModels: (models) => set({ chatModels: models }),
    setImageModels: (models) => set({ imageModels: models }),
    setAudioModels: (models) => set({ audioModels: models }),
    setVideoModels: (models) => set({ videoModels: models }),
    setLoading: (status) => set({ isLoading: status }),
    setError: (error) => set({ error }),
  }));