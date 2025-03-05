import api from './axios';

export interface HistoryItem {
  id: string;
  title: string;
  session: string;
  type: 'chat' | 'image' | 'audio' | 'video';
  created_at: string;
  updated_at: string;
}

export interface HistoryResponse {
  data: HistoryItem[];
  page: number;
  hasMore: boolean;
}

interface GetTitleResponse {
  status: boolean;
  title: string;
}

interface DeleteHistoryResponse {
  message: string;
  deleted_at: string | null;
  status: boolean;
}

export const historyApi = {
  getHistory: async (type: string, page: number = 1): Promise<HistoryResponse> => {
    try {
      const response = await api.get(`/conversations/${type}`, {
        params: { page }
      });
      return {
        data: response.data.map((item: any) => ({
          id: item.session,
          title: item.title,
          session: item.session,
          type: type as 'chat' | 'image' | 'audio' | 'video',
          timestamp: new Date(item.created_at || Date.now()),
          created_at: item.created_at,
          updated_at: item.updated_at
        })),
        page,
        hasMore: response.data.length > 0
      };
    } catch (error) {
      console.error(`Error fetching ${type} history:`, error);
      throw error;
    }
  },

  getConversationTitle: async (conversation: string, prompt: string, type: string): Promise<GetTitleResponse> => {
    try {
      const response = await api.post<GetTitleResponse>('/get-title', {
        conversation: conversation,
        prompt: prompt,
        type: type as 'chat' | 'image' | 'audio' | 'video',
      });
      return response.data;
    } catch (error) {
      console.error('Error getting conversation title:', error);
      throw error;
    }
  },

  renameConversation: async (conversation: string, new_name: string): Promise<GetTitleResponse> => {
    try {
      const response = await api.post<GetTitleResponse>(`/conversation/title/${conversation}`, {
        conversation,
        title: new_name,
      });
      return response.data;
    } catch (error) {
      console.error('Error getting conversation title:', error);
      throw error;
    }
  },

  deleteHistory: async (conversation: string): Promise<DeleteHistoryResponse> => {
    try {
      const response = await api.delete<DeleteHistoryResponse>(`/history/${conversation}`, {
        data: {
          id: parseInt(conversation)
        }
      });
      
      console.log('Delete history key response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting history key:', error);
      throw error;
    }
  },
};