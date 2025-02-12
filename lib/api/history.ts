import api from './axios';

export interface HistoryItem {
  id: string;
  title: string;
  session: string;
  type: 'chat' | 'image' | 'audio' | 'video';
  timestamp: Date;
}

export interface HistoryResponse {
  data: HistoryItem[];
  page: number;
  hasMore: boolean;
}

export const historyApi = {
  getHistory: async (type: string, page: number = 1): Promise<HistoryResponse> => {
    try {
      const response = await api.get(`/conversations/${type}`, {
        params: { page }
      });
      console.log('history call running', page , response)
      return {
        data: response.data.map((item: any) => ({
          id: item.session,
          title: item.title,
          session: item.session,
          type: type as 'chat' | 'image' | 'audio' | 'video',
          timestamp: new Date(item.created_at || Date.now())
        })),
        page,
        hasMore: response.data.length > 0
      };
    } catch (error) {
      console.error(`Error fetching ${type} history:`, error);
      throw error;
    }
  }
};