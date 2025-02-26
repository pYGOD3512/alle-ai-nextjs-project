import api from './axios';

export interface Model {
    model_uid: string;
    model_provider: string;
    model_name: string;
    model_image: string;
    model_plan: 'free' | 'standard' | 'plus' | 'custom';
    preview?: string;
    favorite: boolean;
    response?: string;
}

export interface ModelsResponse extends Array<Model> {}

export type ModelType = 'chat' | 'image' | 'audio' | 'video';

export const modelsApi = {
  getModels: async (type: ModelType): Promise<Model[]> => {
    try {
      const response = await api.get<ModelsResponse>(`/models/${type}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${type} models:`, error);
      throw error;
    }
  },

  toggleFavorite: async (modelUid: string, state: boolean): Promise<{ success: boolean }> => {
    try {
      const response = await api.post('/models/favorite', {
        model: modelUid,
        state: state
      });
      return response.data;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  },

  getLatestSelectedModels: async (type: ModelType): Promise<Model[]> => {
    try {
      const response = await api.get(`/models/${type}/latest`);
      console.log('Latest selected models response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching latest selected models:', error);
      throw error;
    }
  },
};