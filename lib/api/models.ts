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

export const modelsApi = {
  getChatModels: async (): Promise<Model[]> => {
    try {
      const response = await api.get<ModelsResponse>('/models/chat');
      console.log('chat models', response)
      return response.data;
    } catch (error) {
      console.error('Error fetching chat models:', error);
      throw error;
    }
  },

  getImageModels: async (): Promise<Model[]> => {
    try {
      const response = await api.get<ModelsResponse>('/models/image');
      return response.data;
    } catch (error) {
      console.error('Error fetching image models:', error);
      throw error;
    }
  },

  getAudioModels: async (): Promise<Model[]> => {
    try {
      const response = await api.get<ModelsResponse>('/models/audio');
      return response.data;
    } catch (error) {
      console.error('Error fetching audio models:', error);
      throw error;
    }
  },

  getVideoModels: async (): Promise<Model[]> => {
    try {
      const response = await api.get<ModelsResponse>('/models/video');
      return response.data;
    } catch (error) {
      console.error('Error fetching video models:', error);
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

  getLatestSelectedModels: async (): Promise<Model[]> => {
    try {
      const response = await api.get('/models/chat/latest');
      console.log('Latest selected models response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching latest selected models:', error);
      throw error;
    }
  },
};