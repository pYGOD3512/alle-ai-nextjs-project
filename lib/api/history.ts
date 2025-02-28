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
  title: string;
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
  }
};