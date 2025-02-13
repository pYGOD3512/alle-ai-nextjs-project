import api from './axios';

interface CreateConversationResponse {
  session: string;
}

interface CreatePromptResponse {
  id: string;
}

interface ToggleModelResponse {
  status: boolean;
  message: string;
}

interface GenerateResponseParams {
  conversation: string;  // conversation uuid
  model: string;        // model uid
  is_new: boolean;      // true for new generation
  prompt: string;       // prompt id
  prompt_response?: [string, string][]; // Optional [prompt_id, response_id] pairs for continuations
}

interface GenerateResponseResult {
  success: boolean;
  response_id?: string;
  content?: string;
  error?: string;
}

export const chatApi = {
  createConversation: async (models: string[], type: 'chat' | 'image' | 'audio' | 'video'): Promise<CreateConversationResponse> => {
    try {
      const response = await api.post<CreateConversationResponse>('/create/conversation', {
        models,
        type
      });
      return response.data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  },

  createPrompt: async (conversation: string, prompt: string): Promise<CreatePromptResponse> => {
    try {
      const response = await api.post<CreatePromptResponse>('/create/prompt', {
        conversation,
        prompt,
        position: [0,0]
      });
      return response.data;
    } catch (error) {
      console.error('Error creating prompt:', error);
      throw error;
    }
  },

  toggleModelInstance: async (conversationId: string, model_uid: string, active: boolean): Promise<ToggleModelResponse> => {
    try {
      const response = await api.post<ToggleModelResponse>('/conversation-model-instance/update-active-status', {
        conversation_id: conversationId,
        model_instance: model_uid,
        active: active
      });

      // Return the response data directly since we just need to know if it was successful
      return {
        status: response.data.status,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error toggling model instance:', error);
      throw error;
    }
  },

  generateResponse: async (params: GenerateResponseParams): Promise<GenerateResponseResult> => {
    try {
      const response = await api.post('/ai-response', {
        conversation: params.conversation,
        model: params.model,
        is_new: params.is_new,
        prompt: params.prompt,
        prompt_response: params.prompt_response
      });
      
      return response.data;
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  }
};