import api from './axios';

export interface Model {
    model_uid: string;
    model_provider: string;
    model_name: string;
    model_image: string;
    model_plan: 'free' | 'standard' | 'plus' | 'custom';
    preview?: string;
  }
  
  export interface ModelsResponse extends Array<Model> {}
  
  export const modelsApi = {
    getChatModels: async (): Promise<Model[]> => {
      try {
        const response = await api.get<ModelsResponse>('/models/chat');
        console.log('Chat models', response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching chat models:', error);
        throw error;
      }
    },
  
    getImageModels: async (): Promise<Model[]> => {
      try {
        const response = await api.get<ModelsResponse>('/models/image');
        console.log('Image models', response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching image models:', error);
        throw error;
      }
    },
  
    getAudioModels: async (): Promise<Model[]> => {
      try {
        const response = await api.get<ModelsResponse>('/models/audio');
        console.log('Audio models', response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching audio models:', error);
        throw error;
      }
    },
  
    getVideoModels: async (): Promise<Model[]> => {
      try {
        const response = await api.get<ModelsResponse>('/models/video');
        console.log('Video models', response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching video models:', error);
        throw error;
      }
    },
  };