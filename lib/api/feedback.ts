import api from './axios';

interface FeedbackResponse {
  status: boolean;
  message: string;
}

interface FeedbackParams {
  message: string;
  rating: number;
  anonymous: boolean;
}

export const feedbackApi = {
  submitFeedback: async (params: FeedbackParams): Promise<FeedbackResponse> => {
    try {
      const response = await api.post<FeedbackResponse>('/feedback', {
        message: params.message,
        rating: params.rating,
        anonymous: params.anonymous
      });
      // // console.log('Response from submitFeedback:', response.data);
      return response.data;
    } catch (error) {
      // console.error('Error submitting feedback:', error);
      throw error;
    }
  }
};