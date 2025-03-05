import api from './axios';

interface CreateConversationResponse {
  session: string;
  title: string;
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
  prev?: [string, string][] | null; // Optional [prompt_id, response_id] pairs for continuations
}

interface GenerateResponseResult {
  status: boolean;
  message: string;
  data: {
    id: number;
    model_uid: string;
    response: string;
    model_plan: string;
    input_cost: string;
    // ... any other fields from the response
  };
}

interface CreatePromptParams {
  // conversation: string;
  // prompt: string;
  // position?: [number, number];
  input_content?: {
    uploaded_files: Array<{
      file_name: string;
      file_size: string;
      file_type: string;
      file_content: string;
    }>;
  };
}

export type LikeState = 'liked' | 'disliked' | 'none';

interface LikeStateResponse {
  status: boolean;
  message: string;
}

// Add this interface for the web search parameters
interface WebSearchParams {
  prompt_id: string;
  conversation_id: string;
  follow_up: boolean;
  prev?: null | [string, string][]; // Array of [prompt_id, response_id] pairs
}

export interface Message {
  id: string;
  content: string;
  position: [number, number];
  sender: 'user' | 'ai';
  timestamp: Date;
  parentId?: string;
  summaryEnabled?: boolean;
  responses?: Array<{
    id: string;
    modelId: string;
    content: string;
    status: 'loading' | 'complete' | 'error';
    error?: string;
  }>;
}

export interface ModelResponse {
  id: string; // response ID
  modelId: string; // model_uid
  content: string;
  status: 'loading' | 'complete' | 'error';
  error?: string;
}

export interface Branch {
  id: string;
  messages: Message[];
  startPosition: [number, number];
  parentBranchId?: string;
}

export interface ChatMessageProps {
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  position: [number, number];
  onEditMessage: (content: string, position: [number, number]) => void;
  totalBranches: number;
  currentBranch: number;
  onBranchChange: (index: number) => void;
  branches: Branch[];
}

interface CombinationResponse {
  status: boolean;
  message: string;
  combination: string;
  id: number;
}

interface GetCombinationParams {
  promptId: string;
  modelResponsePairs: number[];
}
interface SummaryResponse {
  status: boolean;
  message: string;
  summary: string;
  id: number;
}

interface GetSummaryParams {
  messageId: string;
  modelResponsePairs: number[];
}

interface ConversationContent {
  prompt: string;
  responses: ModelResponse[];
}

// Define the response structure for image conversations
interface LoadedImageResponse {
  prompt: string;
  prompt_id: number;
  responses: Array<{
    id: number | string;
    model: {
      uid: string;
      name: string;
      image: string;
      model_plan: string;
    };
    body: string;
    liked: boolean | null;
  }>;
}

interface UpdateSummaryResponse {
  status: boolean;
  message: string;
  value: boolean;
}

export const chatApi = {
  createConversation: async (models: string[], type: 'chat' | 'image' | 'audio' | 'video'): Promise<CreateConversationResponse> => {
    try {
      const response = await api.post<CreateConversationResponse>('/create/conversation', {
        models,
        type
      });
      console.log('Response from createConversation:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  },

  createPrompt: async (
    conversation: string, 
    prompt: string,
    position?: [number, number],
    options?: { input_content?: CreatePromptParams['input_content'] }
  ): Promise<CreatePromptResponse> => {
    try {
      const response = await api.post<CreatePromptResponse>('/create/prompt', {
        conversation,
        prompt,
        position,
        ...(options?.input_content && { input_content: options.input_content })
      });
      console.log('Response from createPrompt:', response.data);
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
      console.log('Response from toggleModelInstance:', response.data);
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
    console.log('Generating response with params:', params);
    try {
      const response = await api.post('/ai-response', {
        conversation: params.conversation,
        model: params.model,
        is_new: params.is_new,
        prompt: params.prompt,
        prev: params.prev
      });
      console.log('Response from generateResponse:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  },

  updateLikeState: async (responseId: string, state: LikeState): Promise<LikeStateResponse> => {
    console.log('Updating like state for response:', responseId, 'to state:', state);
    try {
      const response = await api.post<LikeStateResponse>('/like-state', {
        response: responseId,
        state: state
      });
      console.log('Response from updateLikeState:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating like state:', error);
      throw error;
    }
  },

  webSearch: async (params: WebSearchParams): Promise<any> => {
    try {
      const response = await api.post('/web-search', {
        prompt_id: params.prompt_id,
        conversation_id: params.conversation_id,
        follow_up: params.follow_up,
        prev: params.prev
      });
      console.log('Web search response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in web search:', error);
      throw error;
    }
  },

  getCombination: async ({ promptId, modelResponsePairs }: GetCombinationParams): Promise<CombinationResponse> => {
    console.log('Getting combination with params:', promptId, modelResponsePairs);
    try {
      const response = await api.post('/combine', {
        prompt: promptId,
        responses: modelResponsePairs
      });
      console.log('Combination response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in combination response:', error);
      throw error;
    }
  },

  getSummary: async ({ messageId, modelResponsePairs }: GetSummaryParams): Promise<SummaryResponse> => {
    console.log('Getting summary with params:', messageId, modelResponsePairs);
    try {
      const response = await api.post('/get-summary', {
        prompt: messageId,
        responses: modelResponsePairs
      });
      console.log('Combination response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in combination response:', error);
      throw error;
    }
  },

  getConversationContent: async (conversationType: 'chat' | 'image', conversationId: string): Promise<LoadedImageResponse[]> => {
    try {
      const response = await api.get(`/conversations/${conversationType}/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error(`Error loading ${conversationType} conversation:`, error);
      throw error;
    }
  },

  updateSummaryPreference: async (enabled: boolean): Promise<UpdateSummaryResponse> => {
    console.log(enabled, 'this is the switch toggle from the call')
    try {
      const response = await api.post<UpdateSummaryResponse>('/summary/toggle', {
        summary_toggle_value: enabled
      });
      console.log('Response from updateSummaryPreference:', response.data);
      return response.data;
    } catch (error) {
      console.log('Error updating summary preference:', error);
      throw error;
    }
  },
};