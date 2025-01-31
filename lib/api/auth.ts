import api from './axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface RegisterResponse {
  data: {
    to: string;
    token: string;
    user: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      is_verified: boolean;
      created_at: string;
      updated_at: string;
      ip_address: string;
      user_agent: string;
      registration_type: string;
    };
  };
}

export interface LoginResponse {
  status: boolean;
  data: {
    to: string;
    token: string;
    user: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      is_verified: boolean;
      created_at: string;
      updated_at: string;
      ip_address: string;
      user_agent: string;
      registration_type: string;
    };
  }
}

interface ForgotPasswordResponse {
  status: boolean;
  message: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post('/login', credentials);
    console.log('login response data', response.data);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
    const response = await api.post('/register', credentials);
    console.log('register data', response.data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },

  getUser: async () => {
    const response = await api.get('/auth');
    console.log('user data', response);
    console.log('user data status', response.status);
    return response.data;
  },

  verifyEmail: async (data: { code: string }) => {
    try {
      const response = await api.post('/email/verify', data);
      console.log('verification data', response);
      return response.data;
    } catch (error: any) {
      console.error('Verification API error:', {
        status: error.response?.status,
        data: error.response?.data,
        code: data.code
      });
      throw error;
    }
  },

  resendVerification: async () => {
    const response = await api.post('/resend/code');
    return response.data;
  },

  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    const response = await api.post('/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (data: { 
    token: string; 
    email: string; 
    password: string; 
    password_confirmation: string 
  }) => {
    const response = await api.post('/reset-password', data);
    return response.data;
  },
};